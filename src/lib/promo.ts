import { prisma } from "@/lib/prisma";
import { DiscountType, type PromoCode } from "@prisma/client";

const DEFAULT_PROMO_CODES = [
  {
    code: "WELCOME20",
    description: "20% off your first rental",
    discountType: DiscountType.PERCENT,
    discountValue: 20,
    requiresWishlist: false,
    firstBookingOnly: true,
    minOrderAmount: null as number | null,
    minRentalDays: null as number | null,
  },
  {
    code: "LOYAL15",
    description: "15% off for returning customers",
    discountType: DiscountType.PERCENT,
    discountValue: 15,
    requiresWishlist: false,
    firstBookingOnly: false,
    minOrderAmount: null,
    minRentalDays: null,
  },
  {
    code: "SAVE50",
    description: "$50 off orders over $200",
    discountType: DiscountType.FIXED,
    discountValue: 50,
    requiresWishlist: false,
    firstBookingOnly: false,
    minOrderAmount: 200,
    minRentalDays: null,
  },
  {
    code: "WEEK20",
    description: "20% off rentals 7+ days",
    discountType: DiscountType.PERCENT,
    discountValue: 20,
    requiresWishlist: false,
    firstBookingOnly: false,
    minOrderAmount: null,
    minRentalDays: 7,
  },
] as const;

let promoSeedPromise: Promise<void> | null = null;

/** Ensures default promo codes exist (migration does not seed data). */
export async function ensureDefaultPromoCodes(): Promise<void> {
  if (!promoSeedPromise) {
    promoSeedPromise = (async () => {
      // Check how many of the default codes already exist to avoid unnecessary writes.
      const existingCount = await prisma.promoCode.count({
        where: { code: { in: DEFAULT_PROMO_CODES.map((p) => p.code) } },
      });

      // All codes are present — nothing to do.
      if (existingCount === DEFAULT_PROMO_CODES.length) return;

      for (const promo of DEFAULT_PROMO_CODES) {
        await prisma.promoCode.upsert({
          where: { code: promo.code },
          create: {
            code: promo.code,
            description: promo.description,
            discountType: promo.discountType,
            discountValue: promo.discountValue,
            requiresWishlist: promo.requiresWishlist,
            firstBookingOnly: promo.firstBookingOnly,
            minOrderAmount: promo.minOrderAmount,
            minRentalDays: promo.minRentalDays,
          },
          update: {
            description: promo.description,
            discountType: promo.discountType,
            discountValue: promo.discountValue,
            requiresWishlist: promo.requiresWishlist,
            firstBookingOnly: promo.firstBookingOnly,
            minOrderAmount: promo.minOrderAmount,
            minRentalDays: promo.minRentalDays,
            isActive: true,
          },
        });
      }
    })().catch((err) => {
      promoSeedPromise = null;
      throw err;
    });
  }
  await promoSeedPromise;
}

export interface PromoValidationResult {
  promo: Pick<
    PromoCode,
    "id" | "code" | "description" | "discountType" | "discountValue"
  >;
  discountAmount: number;
  subtotal: number;
  totalPrice: number;
}

export function calculateDiscount(
  subtotal: number,
  promo: Pick<PromoCode, "discountType" | "discountValue">
): number {
  if (subtotal <= 0) return 0;

  const raw =
    promo.discountType === "PERCENT"
      ? (subtotal * promo.discountValue) / 100
      : promo.discountValue;

  return Math.min(Math.max(0, Math.round(raw * 100) / 100), subtotal);
}

export async function validatePromoCode(params: {
  code: string;
  userId: string;
  carId: string;
  subtotal: number;
  totalDays: number;
  fromWishlist?: boolean;
}): Promise<
  | { success: true; data: PromoValidationResult }
  | { success: false; error: string; code: string }
> {
  const normalized = params.code.trim().toUpperCase();

  if (!normalized) {
    return { success: false, error: "Enter a promo code", code: "VALIDATION_ERROR" };
  }

  if (params.subtotal <= 0) {
    return {
      success: false,
      error: "Select rental dates before applying a code",
      code: "VALIDATION_ERROR",
    };
  }

  await ensureDefaultPromoCodes();

  const promo = await prisma.promoCode.findUnique({
    where: { code: normalized },
  });

  if (!promo || !promo.isActive) {
    return { success: false, error: "Invalid or expired promo code", code: "INVALID_PROMO" };
  }

  const now = new Date();
  if (promo.validFrom > now) {
    return { success: false, error: "This promo code is not active yet", code: "INVALID_PROMO" };
  }
  if (promo.validUntil && promo.validUntil < now) {
    return { success: false, error: "This promo code has expired", code: "INVALID_PROMO" };
  }
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
    return { success: false, error: "This promo code has reached its usage limit", code: "INVALID_PROMO" };
  }
  if (promo.minOrderAmount !== null && params.subtotal < promo.minOrderAmount) {
    return {
      success: false,
      error: `Minimum order of $${promo.minOrderAmount.toFixed(0)} required`,
      code: "MIN_ORDER_NOT_MET",
    };
  }

  if (promo.minRentalDays !== null && params.totalDays < promo.minRentalDays) {
    return {
      success: false,
      error: `Minimum rental of ${promo.minRentalDays} days required`,
      code: "MIN_RENTAL_NOT_MET",
    };
  }

  if (promo.requiresWishlist) {
    const hasWishlist =
      params.fromWishlist === true ||
      (await prisma.savedCar.findUnique({
        where: { userId_carId: { userId: params.userId, carId: params.carId } },
      })) !== null;

    if (!hasWishlist) {
      return {
        success: false,
        error: "Save this car to your wishlist to unlock this code",
        code: "WISHLIST_REQUIRED",
      };
    }
  }

  if (promo.firstBookingOnly) {
    // Only block on bookings that have been confirmed or progressed — a PENDING
    // (unpaid, unconfirmed) booking should not disqualify a first-time user.
    const priorConfirmedOrCompleted = await prisma.booking.findFirst({
      where: {
        userId: params.userId,
        status: { in: ["CONFIRMED", "ACTIVE", "COMPLETED"] },
      },
      select: { id: true },
    });
    if (priorConfirmedOrCompleted) {
      return {
        success: false,
        error: "This code is only valid before your first reservation",
        code: "FIRST_BOOKING_ONLY",
      };
    }
  }

  const priorUse = await prisma.promoRedemption.findUnique({
    where: { userId_promoCodeId: { userId: params.userId, promoCodeId: promo.id } },
  });
  if (priorUse) {
    return {
      success: false,
      error: "You have already used this promo code",
      code: "PROMO_ALREADY_USED",
    };
  }

  const discountAmount = calculateDiscount(params.subtotal, promo);
  if (discountAmount <= 0) {
    return { success: false, error: "This promo code does not apply", code: "INVALID_PROMO" };
  }

  return {
    success: true,
    data: {
      promo: {
        id: promo.id,
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
      },
      discountAmount,
      subtotal: params.subtotal,
      totalPrice: Math.round((params.subtotal - discountAmount) * 100) / 100,
    },
  };
}

export async function redeemPromoCode(params: {
  promoCodeId: string;
  userId: string;
  bookingId: string;
}): Promise<void> {
  await prisma.$transaction([
    prisma.promoRedemption.create({
      data: {
        userId: params.userId,
        promoCodeId: params.promoCodeId,
        bookingId: params.bookingId,
      },
    }),
    prisma.promoCode.update({
      where: { id: params.promoCodeId },
      data: { usedCount: { increment: 1 } },
    }),
  ]);
}
