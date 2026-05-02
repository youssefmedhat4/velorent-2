import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/validations/booking.schema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const carId = searchParams.get("carId");

    const reviews = await prisma.review.findMany({
      where: carId ? { carId } : {},
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("[REVIEWS_GET]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { carId, bookingId, rating, comment } = parsed.data;
    const userId = session.user.id as string;

    // Verify booking belongs to user and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Booking not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { success: false, error: "Can only review completed bookings", code: "BOOKING_NOT_COMPLETED" },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existing = await prisma.review.findUnique({ where: { bookingId } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Review already submitted", code: "REVIEW_EXISTS" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: { userId, carId, bookingId, rating, comment },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error("[REVIEWS_POST]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
