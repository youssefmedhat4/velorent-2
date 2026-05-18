/**
 * Shared enum types — defined as plain TypeScript string unions.
 * Safe to import in both Server and Client Components.
 * These mirror the Prisma enums exactly so they're interchangeable.
 */

export type UserRole = "USER" | "ADMIN";

export type BookingStatus = "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED" | "FAILED";

export type CarCategory = "ECONOMY" | "COMPACT" | "SUV" | "LUXURY" | "SPORTS" | "VAN" | "ELECTRIC";

export type Transmission = "AUTOMATIC" | "MANUAL";

export type FuelType = "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC";

export type ApplicationStatus = "PENDING" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED";

export type DiscountType = "PERCENT" | "FIXED";
