"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingCard } from "@/components/booking/BookingCard";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { useBookings } from "@/hooks/useBooking";
import type { BookingStatus } from "@prisma/client";
import type { BookingWithRelations } from "@/types";

const tabs: { value: string; label: string; statuses: BookingStatus[] }[] = [
  { value: "upcoming", label: "Upcoming", statuses: ["PENDING", "CONFIRMED"] },
  { value: "active", label: "Active", statuses: ["ACTIVE"] },
  { value: "completed", label: "Completed", statuses: ["COMPLETED"] },
  { value: "cancelled", label: "Cancelled", statuses: ["CANCELLED"] },
];

export default function BookingsPage() {
  const { bookings, loading, refetch } = useBookings();
  const [cancelling, setCancelling] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (res.ok) refetch();
    } finally {
      setCancelling(null);
    }
  };

  const getBookingsForTab = (statuses: BookingStatus[]) =>
    bookings.filter((b) => statuses.includes(b.status as BookingStatus));

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#0A0A0B] pt-20">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-black uppercase text-white">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6 bg-[#111113] border border-white/5">
            {tabs.map((tab) => {
              const count = getBookingsForTab(tab.statuses).length;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-[#E8FF00] data-[state=active]:text-black"
                >
                  {tab.label}
                  {count > 0 && (
                    <span className="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-xs">
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map((tab) => {
            const tabBookings = getBookingsForTab(tab.statuses);
            return (
              <TabsContent key={tab.value} value={tab.value}>
                {tabBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                    <p className="text-zinc-500">No {tab.label.toLowerCase()} bookings</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tabBookings.map((booking: BookingWithRelations, i) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onCancel={
                          tab.value === "upcoming" ? handleCancel : undefined
                        }
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
