import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/validations/booking.schema";
import { differenceInDays } from "date-fns";
import { sendBookingReservation } from "@/lib/resend";
import { validatePromoCode, redeemPromoCode } from "@/lib/promo";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const isAdmin = session.user.role === "ADMIN";
    const userId = session.user.id as string;

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const where = {
      ...(isAdmin ? {} : { userId }),
      ...(status ? { status: status as never } : {}),
    };

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: {
          car: {
            select: {
              id: true,
              name: true,
              brand: true,
              model: true,
              images: true,
              pricePerDay: true,
            },
          },
          user: { select: { id: true, name: true, email: true, avatar: true } },
          pickupLocation: true,
          dropoffLocation: true,
          payment: true,
          review: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[BOOKINGS_GET]", error);
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
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const {
      carId,
      startDate,
      endDate,
      pickupLocationId,
      dropoffLocationId,
      notes,
      promoCode,
      fromWishlist,
    } = parsed.data;

    // Check car exists and is available
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car || !car.available) {
      return NextResponse.json(
        { success: false, error: "Car not available", code: "CAR_UNAVAILABLE" },
        { status: 400 }
      );
    }

    // Check for date conflicts
    const conflict = await prisma.booking.findFirst({
      where: {
        carId,
        status: { in: ["CONFIRMED", "ACTIVE", "PENDING"] },
        OR: [
          { startDate: { lte: endDate }, endDate: { gte: startDate } },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, error: "Car is already booked for these dates", code: "DATE_CONFLICT" },
        { status: 409 }
      );
    }

    const totalDays = Math.max(1, differenceInDays(endDate, startDate));
    const subtotalPrice = car.pricePerDay * totalDays;
    const userId = session.user.id as string;

    let discountAmount = 0;
    let totalPrice = subtotalPrice;
    let appliedPromoCode: string | null = null;
    let appliedPromoCodeId: string | null = null;

    if (promoCode?.trim()) {
      const promoResult = await validatePromoCode({
        code: promoCode,
        userId,
        carId,
        subtotal: subtotalPrice,
        fromWishlist,
      });

      if (!promoResult.success) {
        return NextResponse.json(
          { success: false, error: promoResult.error, code: promoResult.code },
          { status: 400 }
        );
      }

      discountAmount = promoResult.data.discountAmount;
      totalPrice = promoResult.data.totalPrice;
      appliedPromoCode = promoResult.data.promo.code;
      appliedPromoCodeId = promoResult.data.promo.id;
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        carId,
        startDate,
        endDate,
        pickupLocationId,
        dropoffLocationId,
        totalDays,
        subtotalPrice,
        discountAmount,
        totalPrice,
        promoCode: appliedPromoCode,
        promoCodeId: appliedPromoCodeId,
        notes,
        status: "PENDING",
        paymentStatus: "UNPAID",
      },
      include: {
        car: true,
        pickupLocation: true,
        dropoffLocation: true,
      },
    });

    if (appliedPromoCodeId) {
      await redeemPromoCode({
        promoCodeId: appliedPromoCodeId,
        userId,
        bookingId: booking.id,
      });
    }

    // Send reservation email (fire and forget — don't block the response)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { email: true, name: true },
    });
    if (user) {
      sendBookingReservation({
        to: user.email,
        userName: user.name,
        carName: booking.car.name,
        carBrand: booking.car.brand,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalDays: booking.totalDays,
        totalPrice: booking.totalPrice,
        bookingId: booking.id,
        pickupLocation: booking.pickupLocation?.city,
      }).catch((err) => console.error("[RESERVATION_EMAIL]", err));
    }

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error("[BOOKINGS_POST]", error);    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
