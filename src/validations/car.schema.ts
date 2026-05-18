import { z } from "zod";

// Plain string enums — no @prisma/client import so this file is safe in Client Components
const carCategoryValues = ["ECONOMY", "COMPACT", "SUV", "LUXURY", "SPORTS", "VAN", "ELECTRIC"] as const;
const transmissionValues = ["AUTOMATIC", "MANUAL"] as const;
const fuelTypeValues = ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"] as const;

export const carSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  brand: z.string().min(1, "Brand is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  year: z
    .number()
    .int()
    .min(1990, "Year must be 1990 or later")
    .max(new Date().getFullYear() + 1),
  category: z.enum(carCategoryValues),
  pricePerDay: z.number().positive("Price must be positive"),
  seats: z.number().int().min(1).max(20),
  transmission: z.enum(transmissionValues),
  fuelType: z.enum(fuelTypeValues),
  mileage: z.number().int().positive().optional(),
  color: z.string().min(1, "Color is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.array(z.string()).default([]),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  modelUrl: z.string().optional(),
  available: z.boolean().default(true),
  locationId: z.string().optional(),
});

export const carUpdateSchema = carSchema.partial();

export const carFilterSchema = z.object({
  category: z.enum(carCategoryValues).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  city: z.string().optional(),
  transmission: z.enum(transmissionValues).optional(),
  fuelType: z.enum(fuelTypeValues).optional(),
  seats: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  sort: z
    .enum(["price_asc", "price_desc", "rating", "newest"])
    .default("newest"),
});

export type CarInput = z.infer<typeof carSchema>;
export type CarUpdateInput = z.infer<typeof carUpdateSchema>;
export type CarFilterInput = z.infer<typeof carFilterSchema>;
