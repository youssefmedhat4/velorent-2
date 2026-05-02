import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/validations/auth.schema";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        _count: { select: { bookings: true, reviews: true } },
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Handle password change
    if (body.currentPassword) {
      const changePasswordSchema = z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8),
      });

      const parsed = changePasswordSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id as string },
      });

      if (!user?.password) {
        return NextResponse.json(
          { success: false, error: "No password set", code: "NO_PASSWORD" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect", code: "INVALID_PASSWORD" },
          { status: 400 }
        );
      }

      const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
      await prisma.user.update({
        where: { id: session.user.id as string },
        data: { password: hashed },
      });

      return NextResponse.json({ success: true, data: { message: "Password updated" } });
    }

    // Handle profile update
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id as string },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("[PROFILE_PATCH]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
