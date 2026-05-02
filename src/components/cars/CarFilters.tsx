"use client";

import { useFilterStore } from "@/store/filterStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn, formatCurrency } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";
import { CarCategory, Transmission, FuelType } from "@prisma/client";

const categories = Object.values(CarCategory);
const transmissions = Object.values(Transmission);
const fuelTypes = Object.values(FuelType);
const seatOptions = [2, 4, 5, 7, 8];

interface CarFiltersProps {
  className?: string;
}

export function CarFilters({ className }: CarFiltersProps) {
  const {
    category,
    minPrice,
    maxPrice,
    transmission,
    fuelType,
    seats,
    setCategory,
    setPriceRange,
    setTransmission,
    setFuelType,
    setSeats,
    reset,
  } = useFilterStore();

  const hasActiveFilters =
    category || transmission || fuelType || seats || minPrice > 0 || maxPrice < 1000;

  return (
    <aside className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-white">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? null : cat)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                category === cat
                  ? "border-[#E8FF00]/50 bg-[#E8FF00]/10 text-[#E8FF00]"
                  : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Price / Day
          </h3>
          <span className="text-xs text-zinc-400">
            {formatCurrency(minPrice)} — {formatCurrency(maxPrice)}
          </span>
        </div>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={[minPrice, maxPrice]}
          onValueChange={(value) => {
            const vals = Array.isArray(value) ? value : [value, value];
            setPriceRange(vals[0] as number, vals[1] as number);
          }}
          className="[&_[data-slot=slider-range]]:bg-[#E8FF00] [&_[data-slot=slider-thumb]]:border-[#E8FF00]"
        />
      </div>

      {/* Transmission */}
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Transmission
        </h3>
        <div className="flex gap-2">
          {transmissions.map((t) => (
            <button
              key={t}
              onClick={() => setTransmission(transmission === t ? null : t)}
              className={cn(
                "flex-1 rounded-lg border py-2 text-xs font-medium transition-all",
                transmission === t
                  ? "border-[#E8FF00]/50 bg-[#E8FF00]/10 text-[#E8FF00]"
                  : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
              )}
            >
              {t === "AUTOMATIC" ? "Auto" : "Manual"}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Fuel Type
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {fuelTypes.map((f) => (
            <button
              key={f}
              onClick={() => setFuelType(fuelType === f ? null : f)}
              className={cn(
                "rounded-lg border py-2 text-xs font-medium transition-all",
                fuelType === f
                  ? "border-[#E8FF00]/50 bg-[#E8FF00]/10 text-[#E8FF00]"
                  : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Seats */}
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Min. Seats
        </h3>
        <div className="flex flex-wrap gap-2">
          {seatOptions.map((s) => (
            <button
              key={s}
              onClick={() => setSeats(seats === s ? null : s)}
              className={cn(
                "h-9 w-9 rounded-lg border text-xs font-medium transition-all",
                seats === s
                  ? "border-[#E8FF00]/50 bg-[#E8FF00]/10 text-[#E8FF00]"
                  : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
              )}
            >
              {s}+
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
