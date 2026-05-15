"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Fuel, Zap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { StarRating } from "@/components/shared/StarRating";
import { formatCurrency } from "@/lib/utils";
import type { CarWithRelations } from "@/types";

interface CarCardProps {
  car: CarWithRelations;
  index?: number;
}

const categoryColors: Record<string, string> = {
  LUXURY: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  SPORTS: "bg-red-500/10 text-red-400 border-red-500/20",
  ELECTRIC: "bg-green-500/10 text-green-400 border-green-500/20",
  SUV: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ECONOMY: "bg-zinc-500/10 text-slate-300 border-zinc-500/20",
  COMPACT: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  VAN: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export function CarCard({ car, index = 0 }: CarCardProps) {
  const image = car.images[0] ?? "/images/car-placeholder.jpg";
  const rating = car.averageRating ?? 0;
  const reviewCount = car._count?.reviews ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/cars/${car.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#113F67] transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-black/50">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={image}
              alt={car.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#113F67] via-transparent to-transparent" />

            <WishlistButton
              carId={car.id}
              size="sm"
              className="absolute right-3 top-3 z-10"
            />

            {/* Category badge */}
            <div className="absolute left-3 top-3">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                  categoryColors[car.category] ?? categoryColors.ECONOMY
                }`}
              >
                {car.category}
              </span>
            </div>

            {/* Available badge */}
            {!car.available && (
              <div className="absolute left-3 top-12">
                <Badge variant="destructive" className="text-xs">
                  Unavailable
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {car.brand}
                </p>
                <h3 className="mt-0.5 font-semibold text-white group-hover:text-[#FDF5AA] transition-colors line-clamp-1">
                  {car.name}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-white">
                  {formatCurrency(car.pricePerDay)}
                </p>
                <p className="text-xs text-slate-400">/ day</p>
              </div>
            </div>

            {/* Rating */}
            {reviewCount > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <StarRating rating={rating} size="sm" />
                <span className="text-xs text-slate-400">
                  {rating.toFixed(1)} ({reviewCount})
                </span>
              </div>
            )}

            {/* Specs */}
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {car.seats}
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {car.transmission === "AUTOMATIC" ? "Auto" : "Manual"}
              </span>
              <span className="flex items-center gap-1">
                <Fuel className="h-3 w-3" />
                {car.fuelType}
              </span>
              {car.location && (
                <span className="ml-auto text-slate-500 truncate max-w-[80px]">
                  {car.location.city}
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">{car.year}</span>
              <span className="flex items-center gap-1 text-xs font-medium text-[#FDF5AA] opacity-0 transition-opacity group-hover:opacity-100">
                View details
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* Hover glow */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ring-1 ring-[#FDF5AA]/20" />
        </div>
      </Link>
    </motion.div>
  );
}
