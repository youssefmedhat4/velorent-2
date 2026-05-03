"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { CarCard } from "@/components/cars/CarCard";
import { useCars } from "@/hooks/useCars";

export function FeaturedCars() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { cars, loading } = useCars({ sort: "rating", limit: 6 });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-24 bg-[#0B2540]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest text-[#FDF5AA]"
            >
              Top Picks
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 font-display text-4xl font-black uppercase text-white"
            >
              Featured Vehicles
            </motion.h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 hover:border-white/20 hover:text-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 hover:border-white/20 hover:text-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link
              href="/cars"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 w-72 shrink-0 animate-pulse rounded-2xl bg-[#0E2D4A]" />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {cars.map((car, i) => (
              <div key={car.id} className="w-72 shrink-0">
                <CarCard car={car} index={i} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/cars"
            className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-white transition-colors"
          >
            Browse all cars
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
