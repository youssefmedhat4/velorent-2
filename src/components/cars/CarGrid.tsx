"use client";

import { CarCard } from "./CarCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Car } from "lucide-react";
import type { CarWithRelations } from "@/types";

interface CarGridProps {
  cars: CarWithRelations[];
  loading?: boolean;
}

export function CarGrid({ cars, loading }: CarGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-2xl bg-zinc-900"
          />
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900">
          <Car className="h-8 w-8 text-zinc-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">No cars found</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Try adjusting your filters to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car, i) => (
        <CarCard key={car.id} car={car} index={i} />
      ))}
    </div>
  );
}
