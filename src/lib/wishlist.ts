import type { CarWithRelations, WishlistDraft, WishlistItem } from "@/types";

type SavedCarWithCar = {
  id: string;
  carId: string;
  note: string | null;
  draftStartDate: Date | null;
  draftEndDate: Date | null;
  draftPickupLocationId: string | null;
  draftDropoffLocationId: string | null;
  draftBookingNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  car: {
    id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    category: string;
    pricePerDay: number;
    seats: number;
    transmission: string;
    fuelType: string;
    images: string[];
    available: boolean;
    location: { id: string; name: string; city: string } | null;
    _count: { reviews: number };
    reviews: { rating: number }[];
  };
};

export function buildWishlistDraft(
  saved: Pick<
    SavedCarWithCar,
    | "draftStartDate"
    | "draftEndDate"
    | "draftPickupLocationId"
    | "draftDropoffLocationId"
    | "draftBookingNotes"
  >
): WishlistDraft | null {
  if (!saved.draftStartDate || !saved.draftEndDate) return null;

  return {
    startDate: saved.draftStartDate.toISOString(),
    endDate: saved.draftEndDate.toISOString(),
    pickupLocationId: saved.draftPickupLocationId ?? undefined,
    dropoffLocationId: saved.draftDropoffLocationId ?? undefined,
    bookingNotes: saved.draftBookingNotes ?? undefined,
  };
}

export function mapWishlistItem(saved: SavedCarWithCar): WishlistItem {
  const averageRating =
    saved.car.reviews.length > 0
      ? saved.car.reviews.reduce((sum, r) => sum + r.rating, 0) / saved.car.reviews.length
      : 0;
  const { reviews: _reviews, ...carData } = saved.car;

  return {
    id: saved.id,
    carId: saved.carId,
    note: saved.note,
    savedAt: saved.createdAt,
    updatedAt: saved.updatedAt,
    draft: buildWishlistDraft(saved),
    car: { ...carData, averageRating } as CarWithRelations,
  };
}

export function draftToPrismaData(draft?: {
  draftStartDate?: Date;
  draftEndDate?: Date;
  draftPickupLocationId?: string | null;
  draftDropoffLocationId?: string | null;
  draftBookingNotes?: string;
  note?: string | null;
}) {
  if (!draft) return {};

  return {
    ...(draft.note !== undefined ? { note: draft.note } : {}),
    ...(draft.draftStartDate !== undefined
      ? { draftStartDate: draft.draftStartDate }
      : {}),
    ...(draft.draftEndDate !== undefined ? { draftEndDate: draft.draftEndDate } : {}),
    ...(draft.draftPickupLocationId !== undefined
      ? { draftPickupLocationId: draft.draftPickupLocationId }
      : {}),
    ...(draft.draftDropoffLocationId !== undefined
      ? { draftDropoffLocationId: draft.draftDropoffLocationId }
      : {}),
    ...(draft.draftBookingNotes !== undefined
      ? { draftBookingNotes: draft.draftBookingNotes }
      : {}),
  };
}
