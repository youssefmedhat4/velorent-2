import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { draftToPrismaData, mapWishlistItem } from "@/lib/wishlist";
import { updateWishlistSchema } from "@/validations/wishlist.schema";

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
  reviews: { select: { rating: true }, take: 20 },
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { carId } = await params;
    const userId = session.user.id as string;

    const saved = await prisma.savedCar.findUnique({
      where: { userId_carId: { userId, carId } },
      select: savedSelect,
    });

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Not in wishlist", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: mapWishlistItem(saved) });
  } catch (error) {
    console.error("[WISHLIST_CAR_GET]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { carId } = await params;
    const userId = session.user.id as string;
    const body = await req.json();
    const parsed = updateWishlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const existing = await prisma.savedCar.findUnique({
      where: { userId_carId: { userId, carId } },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Not in wishlist", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const saved = await prisma.savedCar.update({
      where: { userId_carId: { userId, carId } },
      data: draftToPrismaData(parsed.data),
      select: savedSelect,
    });

    return NextResponse.json({ success: true, data: mapWishlistItem(saved) });
  } catch (error) {
    console.error("[WISHLIST_CAR_PATCH]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { carId } = await params;
    const userId = session.user.id as string;

    const saved = await prisma.savedCar.findUnique({
      where: { userId_carId: { userId, carId } },
    });

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Not in wishlist", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    await prisma.savedCar.delete({
      where: { userId_carId: { userId, carId } },
    });

    return NextResponse.json({ success: true, data: { carId } });
  } catch (error) {
    console.error("[WISHLIST_DELETE]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
