import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/resend";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Missing signature", code: "MISSING_SIGNATURE" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (err) {
    console.error("[WEBHOOK_VERIFY]", err);
    return NextResponse.json(
      { success: false, error: "Invalid signature", code: "INVALID_SIGNATURE" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;

        if (!bookingId) break;

        const booking = await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: "CONFIRMED",
            paymentStatus: "PAID",
          },
          include: { user: true, car: true },
        });

        await prisma.payment.update({
          where: { bookingId },
          data: {
            status: "PAID",
            paidAt: new Date(),
            method: paymentIntent.payment_method_types[0] ?? "card",
          },
        });

        // Send confirmation email
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
        } catch (emailError) {
          console.error("[EMAIL_ERROR]", emailError);
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;

        if (!bookingId) break;

        await prisma.booking.update({
          where: { id: bookingId },
          data: { paymentStatus: "FAILED" },
        });

        await prisma.payment.update({
          where: { bookingId },
          data: { status: "FAILED" },
        });

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        if (!paymentIntentId) break;

        const booking = await prisma.booking.findFirst({
          where: { paymentIntentId },
        });

        if (booking) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { paymentStatus: "REFUNDED", status: "CANCELLED" },
          });

          await prisma.payment.update({
            where: { bookingId: booking.id },
            data: { status: "REFUNDED" },
          });
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK_HANDLER]", error);
    return NextResponse.json(
      { success: false, error: "Webhook handler failed", code: "HANDLER_ERROR" },
      { status: 500 }
    );
  }
}
