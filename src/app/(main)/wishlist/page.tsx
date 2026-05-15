"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { WishlistCard } from "@/components/wishlist/WishlistCard";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { items, loading, initialized, toggleSave, refetch } = useWishlist();

  const handleRemove = async (carId: string) => {
    await toggleSave(carId, { redirectOnAuth: "/wishlist" });
  };

  useEffect(() => {
    if (initialized) {
      refetch({ silent: true });
    }
  }, [initialized, refetch]);

  if (!initialized || loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-[#0A0A0B] pt-24"
      >
        <PageLoader />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDF5AA]/10">
              <Heart className="h-6 w-6 fill-[#FDF5AA] text-[#FDF5AA]" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-black uppercase text-white">
                My Wishlist
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {items.length === 0
                  ? "Save cars you love and book them when you're ready"
                  : `${items.length} saved ${items.length === 1 ? "car" : "cars"}`}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111113] py-20 text-center"
          >
            <Car className="mb-4 h-12 w-12 text-zinc-600" />
            <h2 className="font-display text-2xl font-black uppercase text-white">
              No saved cars yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Browse our fleet and tap the heart icon on any car to add it to your wishlist.
            </p>
            <Link href="/cars" className="mt-6">
              <Button className="bg-[#FDF5AA] font-semibold text-black hover:bg-[#e8e090]">
                Browse cars
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <WishlistCard
                key={item.id}
                item={item}
                index={index}
                onRemove={() => handleRemove(item.carId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
