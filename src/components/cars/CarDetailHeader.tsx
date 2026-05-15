"use client";

import { WishlistButton } from "@/components/wishlist/WishlistButton";

interface CarDetailHeaderProps {
  carId: string;
}

export function CarDetailHeader({ carId }: CarDetailHeaderProps) {
  return (
    <div className="flex items-start justify-end">
      <WishlistButton
        carId={carId}
        redirectOnAuth={`/cars/${carId}`}
        className="shrink-0"
      />
    </div>
  );
}
