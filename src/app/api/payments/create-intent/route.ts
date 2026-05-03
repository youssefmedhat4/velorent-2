import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/resend";

// MOCK PAYMENT — no Stripe required (university project)
// Instantly confirms the booking and marks it as paid.

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true, user: true },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    if (booking.userId !== (session.user.id as string)) {
      return NextResponse.json(
        { success: false, error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    if (booking.paymentStatus === "PAID") {
      return NextResponse.json(
        { success: false, error: "Booking already paid", code: "ALREADY_PAID" },
        { status: 400 }
      );
    }

    // Mock payment — instantly confirm
    const mockPaymentId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentIntentId: mockPaymentId,
      },
    });

    await prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        amount: booking.totalPrice,
        currency: "usd",
        method: "mock",
        status: "PAID",
        stripeId: mockPaymentId,
        paidAt: new Date(),
      },
      update: {
        status: "PAID",
        stripeId: mockPaymentId,
        paidAt: new Date(),
        method: "mock",
      },
    });

    // Try sending confirmation email (won't fail if Resend isn't configured)
    try {
      await sendBookingConfirmation({
        to: booking.user.email,
        userName: booking.user.name,
        carName: booking.car.name,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
        bookingId: booking.id,
      });
    } catch {
      // Email is optional — don't fail the payment if Resend isn't set up
    }

    return NextResponse.json({
      success: true,
      data: {
        mock: true,
        paymentId: mockPaymentId,
        message: "Payment confirmed (mock)",
      },
    });
  } catch (error) {
    console.error("[PAYMENT_MOCK]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
