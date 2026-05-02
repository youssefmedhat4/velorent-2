import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { carSchema, carFilterSchema } from "@/validations/car.schema";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries(searchParams.entries());
    const parsed = carFilterSchema.safeParse(params);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const {
      category,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      city,
      transmission,
      fuelType,
      seats,
      page,
      limit,
      sort,
    } = parsed.data;

    const where: Prisma.CarWhereInput = {
      available: true,
    };

    if (category) where.category = category;
    if (transmission) where.transmission = transmission;
    if (fuelType) where.fuelType = fuelType;
    if (seats) where.seats = { gte: seats };
    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay.gte = minPrice;
      if (maxPrice) where.pricePerDay.lte = maxPrice;
    }
    if (city) {
      where.location = { city: { contains: city, mode: "insensitive" } };
    }

    // Exclude cars with conflicting bookings
    if (startDate && endDate) {
      where.bookings = {
        none: {
          status: { in: ["CONFIRMED", "ACTIVE", "PENDING"] },
          OR: [
            { startDate: { lte: new Date(endDate) }, endDate: { gte: new Date(startDate) } },
          ],
        },
      };
    }

    const orderBy: Prisma.CarOrderByWithRelationInput =
      sort === "price_asc"
        ? { pricePerDay: "asc" }
        : sort === "price_desc"
        ? { pricePerDay: "desc" }
        : sort === "newest"
        ? { createdAt: "desc" }
        : { createdAt: "desc" };

    const [total, cars] = await Promise.all([
      prisma.car.count({ where }),
      prisma.car.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          location: true,
          reviews: { select: { rating: true } },
          _count: { select: { bookings: true, reviews: true } },
        },
      }),
    ]);

    const carsWithRating = cars.map((car) => ({
      ...car,
      averageRating:
        car.reviews.length > 0
          ? car.reviews.reduce((sum, r) => sum + r.rating, 0) / car.reviews.length
          : 0,
    }));

    // Sort by rating after fetching if needed
    if (sort === "rating") {
      carsWithRating.sort((a, b) => b.averageRating - a.averageRating);
    }

    return NextResponse.json({
      success: true,
      data: carsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[CARS_GET]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = carSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const car = await prisma.car.create({
      data: parsed.data,
      include: { location: true },
    });

    return NextResponse.json({ success: true, data: car }, { status: 201 });
  } catch (error) {
    console.error("[CARS_POST]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
