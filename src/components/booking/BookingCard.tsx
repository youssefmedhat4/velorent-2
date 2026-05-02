"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight, X, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateRange, getStatusColor } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

interface BookingCardProps {
  booking: BookingWithRelations;
  onCancel?: (id: string) => void;
  index?: number;
}

export function BookingCard({ booking, onCancel, index = 0 }: BookingCardProps) {
  const car = booking.car;
  const image = car?.images?.[0] ?? "/images/car-placeholder.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="overflow-hidden rounded-2xl border border-white/5 bg-[#111113] transition-colors hover:border-white/10"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Car Image */}
        <div className="relative h-40 sm:h-auto sm:w-48 shrink-0">
          <Image
            src={image}
            alt={car?.name ?? "Car"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 192px"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {car?.brand}
              </p>
              <h3 className="mt-0.5 font-semibold text-white">{car?.name}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {formatDateRange(booking.startDate, booking.endDate)}
                </span>
                {booking.pickupLocation && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {booking.pickupLocation.city}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
              <p className="mt-2 text-lg font-bold text-white">
                {formatCurrency(booking.totalPrice)}
              </p>
              <p className="text-xs text-zinc-500">{booking.totalDays} days</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2">
            <Link href={`/bookings/${booking.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                View Details
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>

            {booking.status === "COMPLETED" && !booking.review && (
              <Link href={`/bookings/${booking.id}#review`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#E8FF00]/30 text-[#E8FF00] hover:bg-[#E8FF00]/10"
                >
                  <Star className="mr-1 h-3 w-3" />
                  Leave Review
                </Button>
              </Link>
            )}

            {(booking.status === "PENDING" || booking.status === "CONFIRMED") &&
              onCancel && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCancel(booking.id)}
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <X className="mr-1 h-3 w-3" />
                  Cancel
                </Button>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
