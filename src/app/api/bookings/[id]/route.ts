import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateBookingSchema } from "@/validations/booking.schema";
import { sendBookingCancellation } from "@/lib/resend";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const isAdmin = session.user.role === "ADMIN";

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        car: {
          include: { location: true, reviews: { select: { rating: true } } },
        },
        user: { select: { id: true, name: true, email: true, avatar: true, phone: true } },
        pickupLocation: true,
        dropoffLocation: true,
        payment: true,
        review: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    // Users can only see their own bookings
    if (!isAdmin && booking.userId !== (session.user.id as string)) {
      return NextResponse.json(
        { success: false, error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("[BOOKING_GET]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = updateBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const isAdmin = session.user.role === "ADMIN";
    const existing = await prisma.booking.findUnique({
      where: { id },
      include: { user: true, car: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Booking not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    if (!isAdmin && existing.userId !== (session.user.id as string)) {
      return NextResponse.json(
        { success: false, error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    // Users can only cancel their own bookings
    if (!isAdmin && parsed.data.status && parsed.data.status !== "CANCELLED") {
      return NextResponse.json(
        { success: false, error: "Users can only cancel bookings", code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: parsed.data,
      include: { car: true, user: true },
    });

    // Send cancellation email
    if (parsed.data.status === "CANCELLED" && existing.user) {
      try {
        await sendBookingCancellation({
          to: existing.user.email,
          userName: existing.user.name,
          carName: existing.car.name,
          bookingId: id,
        });
      } catch (emailError) {
        console.error("[EMAIL_ERROR]", emailError);
      }
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("[BOOKING_PATCH]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await prisma.booking.delete({ where: { id } });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("[BOOKING_DELETE]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
