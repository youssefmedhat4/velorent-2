"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";
import type { BookingStatus } from "@prisma/client";

const statusOptions: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    const params = statusFilter !== "ALL" ? `?status=${statusFilter}&limit=50` : "?limit=50";
    const res = await fetch(`/api/bookings${params}`);
    const data = await res.json();
    if (data.success) setBookings(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setUpdating(id);
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchBookings();
    } finally {
      setUpdating(null);
    }
  };

  const filtered = bookings.filter(
    (b) =>
      b.car?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-black uppercase text-white">
          Bookings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{bookings.length} total bookings</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="pl-10 border-white/10 bg-white/5 text-white placeholder-zinc-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              statusFilter === "ALL"
                ? "bg-[#E8FF00]/10 text-[#E8FF00]"
                : "border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            All
          </button>
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === s
                  ? "bg-[#E8FF00]/10 text-[#E8FF00]"
                  : "border border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#E8FF00]" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  {["ID", "Customer", "Car", "Dates", "Total", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((booking, i) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs font-mono text-zinc-500">
                      #{booking.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-white">{booking.user?.name}</p>
                      <p className="text-xs text-zinc-500">{booking.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {booking.car?.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {formatDate(booking.startDate)} →{" "}
                      {formatDate(booking.endDate)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-white">
                      {formatCurrency(booking.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking.id, e.target.value as BookingStatus)
                        }
                        disabled={updating === booking.id}
                        className="rounded-lg border border-white/10 bg-[#111113] px-2 py-1 text-xs text-zinc-300 outline-none"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s} className="bg-[#111113]">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-zinc-500">No bookings found</div>
          )}
        </div>
      )}
    </div>
  );
}
