import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/validations/booking.schema";
import { differenceInDays } from "date-fns";

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

    const { carId, startDate, endDate, pickupLocationId, dropoffLocationId, notes } =
      parsed.data;

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
    const totalPrice = car.pricePerDay * totalDays;

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id as string,
        carId,
        startDate,
        endDate,
        pickupLocationId,
        dropoffLocationId,
        totalDays,
        totalPrice,
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

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error("[BOOKINGS_POST]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
