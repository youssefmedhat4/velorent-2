"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CarGrid } from "@/components/cars/CarGrid";
import { CarFilters } from "@/components/cars/CarFilters";
import { useCars } from "@/hooks/useCars";
import { useFilterStore } from "@/store/filterStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, SlidersHorizontal, X } from "lucide-react";

type CarCategory = "ECONOMY" | "COMPACT" | "SUV" | "LUXURY" | "SPORTS" | "VAN" | "ELECTRIC";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "rating", label: "Top Rated" },
] as const;

function CarsContent() {
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
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

  const hasActiveFilters =
    category || transmission || fuelType || seats || minPrice > 0 || maxPrice < 1000;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile filter button */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilterOpen(true)}
          className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FDF5AA] text-[10px] font-bold text-black">
              !
            </span>
          )}
        </Button>
        <p className="text-sm text-slate-400">
          {loading ? "..." : `${pagination.total} results`}
        </p>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-[#0E2D4A] p-6 shadow-2xl lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Filters</h2>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CarFilters />
              <Button
                onClick={() => setFilterOpen(false)}
                className="mt-6 w-full bg-[#FDF5AA] text-black font-bold hover:bg-[#e8e090]"
              >
                Show Results
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex gap-8">
        {/* Sidebar Filters — desktop only */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <CarFilters />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sort & Count Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="hidden text-sm text-slate-400 lg:block">
              {loading ? "..." : `${pagination.total} results`}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500">Sort:</span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                    sort === opt.value
                      ? "bg-[#FDF5AA]/10 text-[#FDF5AA]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <CarGrid cars={cars} loading={loading} />

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white disabled:opacity-30"
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
                        ? "bg-[#FDF5AA] text-black"
                        : "border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
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
                className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white disabled:opacity-30"
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
    <div className="min-h-screen bg-[#0B2540] pt-20">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0E2D4A] py-8">
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
            <Loader2 className="h-8 w-8 animate-spin text-[#FDF5AA]" />
          </div>
        }
      >
        <CarsContent />
      </Suspense>
    </div>
  );
}
