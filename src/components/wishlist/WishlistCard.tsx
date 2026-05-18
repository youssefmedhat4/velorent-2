"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, Trash2, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/StarRating";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { WishlistNoteEditor } from "@/components/wishlist/WishlistNoteEditor";
import { formatCurrency, formatDate, formatDateRange } from "@/lib/utils";
import type { WishlistItem } from "@/types";

interface WishlistCardProps {
  item: WishlistItem;
  index?: number;
  onRemove?: () => void | Promise<void>;
  isLoading?: boolean;
}

export function WishlistCard({ item, index = 0, onRemove, isLoading }: WishlistCardProps) {
  const { car } = item;
  const image = car.images[0] ?? "/images/car-placeholder.jpg";
  const reviewCount = car._count?.reviews ?? 0;
  const draft = item.draft;
  const draftDays =
    draft?.startDate && draft?.endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(draft.endDate).getTime() - new Date(draft.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;
  const estimatedTotal = draftDays > 0 ? draftDays * car.pricePerDay : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="overflow-hidden rounded-2xl border border-white/5 bg-[#111113]"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-56">
          <Image
            src={image}
            alt={car.name}
            fill
            className="object-cover"
            sizes="224px"
          />
          <div className="absolute right-3 top-3">
            <WishlistButton carId={car.id} size="sm" redirectOnAuth="/wishlist" />
          </div>
          {!car.available && (
            <div className="absolute left-3 top-3">
              <Badge variant="destructive" className="text-xs">
                Unavailable
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {car.brand}
            </p>
            <h3 className="mt-0.5 font-display text-xl font-black uppercase text-white">
              {car.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              {car.model} · {car.year} · {car.category}
            </p>

            {reviewCount > 0 && car.averageRating !== undefined && (
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={car.averageRating} size="sm" />
                <span className="text-xs text-zinc-500">
                  {car.averageRating.toFixed(1)} ({reviewCount})
                </span>
              </div>
            )}

            {draft && (
              <div className="mt-3 rounded-lg border border-[#FDF5AA]/15 bg-[#FDF5AA]/5 px-3 py-2">
                <p className="flex items-center gap-1.5 text-xs font-medium text-[#FDF5AA]">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Draft booking saved
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  {formatDateRange(new Date(draft.startDate), new Date(draft.endDate))}
                  {estimatedTotal !== null && (
                    <span className="text-zinc-500">
                      {" "}
                      · est. {formatCurrency(estimatedTotal)}
                    </span>
                  )}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                  <Tag className="h-3 w-3" />
                  Use code WISHLIST10 for 10% off
                </p>
              </div>
            )}

            <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-600">
              <CalendarDays className="h-3.5 w-3.5" />
              Saved {formatDate(new Date(item.savedAt))}
            </p>

            <WishlistNoteEditor carId={car.id} initialNote={item.note} />
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(car.pricePerDay)}
              </p>
              <p className="text-xs text-zinc-500">per day</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-red-400 disabled:opacity-50"
                onClick={onRemove}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-1.5 h-3 w-3 animate-spin rounded-full border border-zinc-400/30 border-t-zinc-400" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Remove
                  </>
                )}
              </Button>
              <Link href={`/cars/${car.id}?from=wishlist`}>
                <Button
                  size="sm"
                  className="bg-[#FDF5AA] font-semibold text-black hover:bg-[#e8e090]"
                  disabled={!car.available}
                >
                  Continue booking
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
