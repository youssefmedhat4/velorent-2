import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendApplicationConfirmation } from "@/lib/resend";

const createApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  linkedIn: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
  jobTitle: z.string().min(1, "Job title is required"),
  jobTeam: z.string().min(1, "Job team is required"),
  coverLetter: z.string().max(3000).optional(),
  cvUrl: z.string().url("CV upload failed — please try again"),
  cvFileName: z.string().min(1),
});

// POST — submit application (public, no auth required)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    // Check for duplicate application for same role
    const existing = await prisma.jobApplication.findFirst({
      where: {
        email: parsed.data.email,
        jobTitle: parsed.data.jobTitle,
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "You have already applied for this role.", code: "DUPLICATE_APPLICATION" },
        { status: 409 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        ...parsed.data,
        linkedIn: parsed.data.linkedIn || null,
        portfolio: parsed.data.portfolio || null,
        userId: session?.user?.id as string | undefined ?? null,
      },
    });

    // Send confirmation email — fire and forget, don't fail the request if email fails
    sendApplicationConfirmation({
      to: parsed.data.email,
      applicantName: parsed.data.fullName,
      jobTitle: parsed.data.jobTitle,
      jobTeam: parsed.data.jobTeam,
      applicationId: application.id,
    }).catch((err) => console.error("[APPLICATION_EMAIL]", err));

    return NextResponse.json({ success: true, data: { id: application.id } }, { status: 201 });
  } catch (error) {
    console.error("[CAREERS_POST]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// GET — admin only: list all applications
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const team = searchParams.get("team");
    const search = searchParams.get("search") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const where = {
      ...(status ? { status: status as never } : {}),
      ...(team ? { jobTeam: team } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { jobTitle: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [total, applications] = await Promise.all([
      prisma.jobApplication.count({ where }),
      prisma.jobApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[CAREERS_GET]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
