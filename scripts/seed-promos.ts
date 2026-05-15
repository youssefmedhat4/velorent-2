import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

import { DiscountType } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const promos = [
  {
    code: "WISHLIST10",
    description: "10% off when booking a wishlisted car",
    discountType: DiscountType.PERCENT,
    discountValue: 10,
    requiresWishlist: true,
  },
  {
    code: "WELCOME15",
    description: "15% off your first rental",
    discountType: DiscountType.PERCENT,
    discountValue: 15,
    firstBookingOnly: true,
  },
  {
    code: "SAVE50",
    description: "$50 off rentals over $200",
    discountType: DiscountType.FIXED,
    discountValue: 50,
    minOrderAmount: 200,
  },
];

async function main() {
  for (const promo of promos) {
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      create: promo,
      update: {
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        requiresWishlist: promo.requiresWishlist ?? false,
        firstBookingOnly: promo.firstBookingOnly ?? false,
        minOrderAmount: promo.minOrderAmount ?? null,
        isActive: true,
      },
    });
    console.log(`✓ ${promo.code}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
