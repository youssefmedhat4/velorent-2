import { z } from "zod";
import { BookingStatus } from "@prisma/client";

export const createBookingSchema = z
  .object({
    carId: z.string().cuid("Invalid car ID"),
    startDate: z.coerce.date().refine((d) => d >= new Date(), {
      message: "Start date must be in the future",
    }),
    endDate: z.coerce.date(),
    pickupLocationId: z.string().cuid().optional(),
    dropoffLocationId: z.string().cuid().optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const updateBookingSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  notes: z.string().max(500).optional(),
});

export const reviewSchema = z.object({
  carId: z.string().cuid("Invalid car ID"),
  bookingId: z.string().cuid("Invalid booking ID"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
