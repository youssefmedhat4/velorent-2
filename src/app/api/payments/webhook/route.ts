import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/resend";

// This webhook handler is only active when real Stripe keys are configured.
// The app uses mock payments by default — this route is dormant unless you
// set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in your environment.

const stripeConfigured =
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY !== "sk_test_your_key_here" &&
  process.env.STRIPE_WEBHOOK_SECRET &&
  process.env.STRIPE_WEBHOOK_SECRET !== "whsec_your_webhook_secret_here";

export async function POST(req: NextRequest) {
  if (!stripeConfigured) {
    console.warn("[WEBHOOK] Stripe is not configured — webhook ignored");
    return NextResponse.json(
      { success: false, error: "Stripe not configured", code: "NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  // Lazy-import stripe only when actually configured to avoid cold-start cost
  const { stripe } = await import("@/lib/stripe");
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Missing signature", code: "MISSING_SIGNATURE" },
      { status: 400 }
    );
  }

  let event: import("stripe").default.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
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
        const paymentIntent = event.data.object as import("stripe").default.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;
        if (!bookingId) break;

        const booking = await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "CONFIRMED", paymentStatus: "PAID" },
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

        try {
          await sendBookingConfirmation({
            to: booking.user.email,
            userName: booking.user.name,
            carName: booking.car.name,
            carBrand: booking.car.brand,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalDays: booking.totalDays,
            totalPrice: booking.totalPrice,
            bookingId: booking.id,
          });
        } catch (emailError) {
          console.error("[WEBHOOK_EMAIL]", emailError);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as import("stripe").default.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;
        if (!bookingId) break;

        await prisma.booking.update({ where: { id: bookingId }, data: { paymentStatus: "FAILED" } });
        await prisma.payment.update({ where: { bookingId }, data: { status: "FAILED" } });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as import("stripe").default.Charge;
        const paymentIntentId = charge.payment_intent as string;
        if (!paymentIntentId) break;

        const booking = await prisma.booking.findFirst({ where: { paymentIntentId } });
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
