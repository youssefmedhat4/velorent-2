import { z } from "zod";

const draftFields = {
  note: z.string().max(300).optional(),
  draftStartDate: z.coerce.date().optional(),
  draftEndDate: z.coerce.date().optional(),
  draftPickupLocationId: z.string().cuid().optional().nullable(),
  draftDropoffLocationId: z.string().cuid().optional().nullable(),
  draftBookingNotes: z.string().max(500).optional(),
};

export const addToWishlistSchema = z
  .object({
    carId: z.string().min(1, "Car ID is required"),
    ...draftFields,
  })
  .refine(
    (data) => {
      if (data.draftStartDate && data.draftEndDate) {
        return data.draftEndDate > data.draftStartDate;
      }
      return true;
    },
    { message: "End date must be after start date", path: ["draftEndDate"] }
  );

export const updateWishlistSchema = z
  .object({
    ...draftFields,
    note: z.string().max(300).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.draftStartDate && data.draftEndDate) {
        return data.draftEndDate > data.draftStartDate;
      }
      return true;
    },
    { message: "End date must be after start date", path: ["draftEndDate"] }
  );

export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;
export type UpdateWishlistInput = z.infer<typeof updateWishlistSchema>;

export type WishlistDraftInput = {
  draftStartDate?: Date;
  draftEndDate?: Date;
  draftPickupLocationId?: string;
  draftDropoffLocationId?: string;
  draftBookingNotes?: string;
};
