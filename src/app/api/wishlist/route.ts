import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { draftToPrismaData, mapWishlistItem } from "@/lib/wishlist";
import { addToWishlistSchema } from "@/validations/wishlist.schema";

const carSelect = {
  id: true,
  name: true,
  brand: true,
  model: true,
  year: true,
  category: true,
  pricePerDay: true,
  seats: true,
  transmission: true,
  fuelType: true,
  images: true,
  available: true,
  location: { select: { id: true, name: true, city: true } },
  _count: { select: { reviews: true } },
  reviews: {
    select: { rating: true },
    take: 20,
  },
} as const;

const savedSelect = {
  id: true,
  carId: true,
  note: true,
  draftStartDate: true,
  draftEndDate: true,
  draftPickupLocationId: true,
  draftDropoffLocationId: true,
  draftBookingNotes: true,
  createdAt: true,
  updatedAt: true,
  car: { select: carSelect },
} as const;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;

    const saved = await prisma.savedCar.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: savedSelect,
    });

    const items = saved.map(mapWishlistItem);
    const carIds = items.map((item) => item.carId);

    return NextResponse.json({ success: true, data: { items, carIds } });
  } catch (error) {
    console.error("[WISHLIST_GET]", error);
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
    const parsed = addToWishlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { carId, ...draft } = parsed.data;
    const userId = session.user.id as string;

    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: { id: true },
    });

    if (!car) {
      return NextResponse.json(
        { success: false, error: "Car not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const draftData = draftToPrismaData(draft);

    const saved = await prisma.savedCar.upsert({
      where: { userId_carId: { userId, carId } },
      create: { userId, carId, ...draftData },
      update: draftData,
      select: savedSelect,
    });

    const item = mapWishlistItem(saved);

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("[WISHLIST_POST]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
