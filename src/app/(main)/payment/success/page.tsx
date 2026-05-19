"use client";

import { Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  CalendarDays,
  CreditCard,
  ArrowRight,
  Loader2,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { useBooking } from "@/hooks/useBooking";
import { formatCurrency, formatDate } from "@/lib/utils";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const { booking, loading } = useBooking(bookingId ?? "");

  if (!bookingId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B2540] px-4">
        <div className="text-center">
          <p className="text-slate-400">No booking ID provided.</p>
          <Link href="/bookings" className="mt-4 inline-block text-[#FDF5AA] hover:underline">
            View my bookings
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        {/* Success icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 ring-4 ring-green-500/20">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
          </div>
          <h1 className="font-display text-4xl font-black uppercase text-white sm:text-5xl">
            Payment Confirmed
          </h1>
          <p className="mt-3 text-slate-400">
            Your booking is confirmed. Check your email for details.
          </p>
        </motion.div>

        {/* Booking summary card */}
        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/5 bg-[#113F67] p-6 space-y-4"
          >
            {/* Car */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDF5AA]/10">
                <Car className="h-5 w-5 text-[#FDF5AA]" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{booking.car?.brand}</p>
                <p className="font-semibold text-white">{booking.car?.name}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-400">
                  <CreditCard className="h-4 w-4" />
                  Booking ID
                </span>
                <span className="font-mono text-white">
                  #{booking.id.slice(-8).toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  Pickup
                </span>
                <span className="text-white">{formatDate(booking.startDate)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  Return
                </span>
                <span className="text-white">{formatDate(booking.endDate)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="font-semibold text-white">Total Paid</span>
                <span className="text-xl font-bold text-[#FDF5AA]">
                  {formatCurrency(booking.totalPrice)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Payment Status</span>
                <span className="rounded-full bg-green-500/10 px-3 py-0.5 text-xs font-semibold text-green-400">
                  ✓ PAID
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <Button
            onClick={() => router.push(`/bookings/${bookingId}`)}
            className="flex-1 bg-[#FDF5AA] text-black font-bold hover:bg-[#e8e090]"
            size="lg"
          >
            View Booking Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            onClick={() => router.push("/bookings")}
            variant="outline"
            className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
            size="lg"
          >
            My Bookings
          </Button>
        </motion.div>

        <p className="mt-6 text-center text-xs text-slate-500">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
