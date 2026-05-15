import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validatePromoCode } from "@/lib/promo";
import { validatePromoSchema } from "@/validations/promo.schema";
import { differenceInDays } from "date-fns";

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
    const parsed = validatePromoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { code, carId, startDate, endDate, fromWishlist } = parsed.data;
    const userId = session.user.id as string;

    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: { id: true, pricePerDay: true, available: true },
    });

    if (!car || !car.available) {
      return NextResponse.json(
        { success: false, error: "Car not available", code: "CAR_UNAVAILABLE" },
        { status: 400 }
      );
    }

    const totalDays = Math.max(1, differenceInDays(endDate, startDate));
    const subtotal = car.pricePerDay * totalDays;

    const result = await validatePromoCode({
      code,
      userId,
      carId,
      subtotal,
      fromWishlist,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, code: result.code },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        code: result.data.promo.code,
        description: result.data.promo.description,
        discountAmount: result.data.discountAmount,
        subtotal: result.data.subtotal,
        totalPrice: result.data.totalPrice,
        discountType: result.data.promo.discountType,
        discountValue: result.data.promo.discountValue,
      },
    });
  } catch (error) {
    console.error("[PROMO_VALIDATE]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
