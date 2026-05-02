"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CarGrid } from "@/components/cars/CarGrid";
import { CarFilters } from "@/components/cars/CarFilters";
import { useCars } from "@/hooks/useCars";
import { useFilterStore } from "@/store/filterStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { CarCategory } from "@prisma/client";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
] as const;

function CarsContent() {
  const searchParams = useSearchParams();
  const {
    category,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    city,
    transmission,
    fuelType,
    seats,
    sort,
    page,
    setCategory,
    setCity,
    setDates,
    setSort,
    setPage,
  } = useFilterStore();

  // Sync URL params to store on mount
  useEffect(() => {
    const urlCategory = searchParams.get("category") as CarCategory | null;
    const urlCity = searchParams.get("city");
    const urlStart = searchParams.get("startDate");
    const urlEnd = searchParams.get("endDate");

    if (urlCategory) setCategory(urlCategory);
    if (urlCity) setCity(urlCity);
    if (urlStart && urlEnd) setDates(new Date(urlStart), new Date(urlEnd));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filters = {
    category: category ?? undefined,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < 1000 ? maxPrice : undefined,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    city: city || undefined,
    transmission: transmission ?? undefined,
    fuelType: fuelType ?? undefined,
    seats: seats ?? undefined,
    sort,
    page,
    limit: 12,
  };

  const { cars, loading, pagination } = useCars(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <CarFilters />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sort & Count Bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              {loading ? "..." : `${pagination.total} results`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-600">Sort:</span>
              <div className="flex gap-1">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      sort === opt.value
                        ? "bg-[#E8FF00]/10 text-[#E8FF00]"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <CarGrid cars={cars} loading={loading} />

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                      p === page
                        ? "bg-[#E8FF00] text-black"
                        : "border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] pt-20">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0D0D0F] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-black uppercase text-white">
              Browse Vehicles
            </h1>
          </motion.div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-[#E8FF00]" />
          </div>
        }
      >
        <CarsContent />
      </Suspense>
    </div>
  );
}
