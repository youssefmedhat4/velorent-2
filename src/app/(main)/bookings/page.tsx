"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookingCard } from "@/components/booking/BookingCard";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { useBookings } from "@/hooks/useBooking";
import { showToast } from "@/components/shared/Toast";
import { cn } from "@/lib/utils";
import { Clock, Zap, CheckCircle2, XCircle } from "lucide-react";
import type { BookingWithRelations } from "@/types";

type BookingStatus = "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

const tabs: {
  value: string;
  label: string;
  statuses: BookingStatus[];
  icon: React.ComponentType<{ className?: string }>;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
  dotColor: string;
}[] = [
  {
    value: "upcoming",
    label: "Upcoming",
    statuses: ["PENDING", "CONFIRMED"],
    icon: Clock,
    activeColor: "text-blue-300",
    activeBg: "bg-blue-500/10",
    activeBorder: "border-blue-500/40",
    dotColor: "bg-blue-400",
  },
  {
    value: "active",
    label: "Active",
    statuses: ["ACTIVE"],
    icon: Zap,
    activeColor: "text-[#FDF5AA]",
    activeBg: "bg-[#FDF5AA]/10",
    activeBorder: "border-[#FDF5AA]/40",
    dotColor: "bg-[#FDF5AA]",
  },
  {
    value: "completed",
    label: "Completed",
    statuses: ["COMPLETED"],
    icon: CheckCircle2,
    activeColor: "text-green-300",
    activeBg: "bg-green-500/10",
    activeBorder: "border-green-500/40",
    dotColor: "bg-green-400",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    statuses: ["CANCELLED"],
    icon: XCircle,
    activeColor: "text-red-300",
    activeBg: "bg-red-500/10",
    activeBorder: "border-red-500/40",
    dotColor: "bg-red-400",
  },
];

export default function BookingsPage() {
  const { bookings, loading, refetch } = useBookings();
  const [activeTab, setActiveTab] = useState("upcoming");
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
      const data = await res.json();
      if (res.ok) {
        showToast("Booking cancelled successfully", "success");
        refetch();
      } else {
        showToast(data.error || "Failed to cancel booking", "error");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      showToast(message, "error");
    } finally {
      setCancelling(null);
    }
  };

  const getBookingsForTab = (statuses: BookingStatus[]) =>
    bookings.filter((b) => statuses.includes(b.status as BookingStatus));

  const activeTabConfig = tabs.find((t) => t.value === activeTab)!;
  const activeBookings = getBookingsForTab(activeTabConfig.statuses);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-black uppercase text-white">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Tab Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {tabs.map((tab) => {
            const count = getBookingsForTab(tab.statuses).length;
            const isActive = activeTab === tab.value;
            const Icon = tab.icon;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "group relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200",
                  isActive
                    ? cn(tab.activeBg, tab.activeBorder, "shadow-lg")
                    : "border-white/5 bg-[#113F67]/40 hover:border-white/10 hover:bg-[#113F67]/70"
                )}
              >
                {/* Icon + count row */}
                <div className="flex w-full items-center justify-between">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                      isActive ? tab.activeBg : "bg-white/5 group-hover:bg-white/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? tab.activeColor : "text-slate-400 group-hover:text-slate-300"
                      )}
                    />
                  </div>
                  {count > 0 && (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold",
                        isActive
                          ? cn(tab.activeBg, tab.activeColor)
                          : "bg-white/10 text-slate-400"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isActive ? tab.activeColor : "text-slate-400 group-hover:text-slate-200"
                  )}
                >
                  {tab.label}
                </span>

                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBar"
                    className={cn("absolute bottom-0 left-4 right-4 h-0.5 rounded-full", tab.dotColor)}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Bookings List */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-[#113F67]/20 py-20 text-center">
              <activeTabConfig.icon className="h-10 w-10 text-slate-600" />
              <div>
                <p className="font-medium text-slate-300">
                  No {activeTabConfig.label.toLowerCase()} bookings
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {activeTab === "upcoming"
                    ? "Browse cars to make your first reservation."
                    : `Your ${activeTabConfig.label.toLowerCase()} bookings will appear here.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((booking: BookingWithRelations, i) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={activeTab === "upcoming" ? handleCancel : undefined}
                  isLoading={cancelling === booking.id}
                  index={i}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
