import { z } from "zod";

export const validatePromoSchema = z.object({
  code: z.string().min(1, "Promo code is required").max(32),
  carId: z.string().cuid("Invalid car ID"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  fromWishlist: z.boolean().optional(),
});

export type ValidatePromoInput = z.infer<typeof validatePromoSchema>;
