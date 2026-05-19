"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StripeCheckout } from "@/components/payments/StripeCheckout";
import { StarRating } from "@/components/shared/StarRating";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { useBooking } from "@/hooks/useBooking";
import { showToast } from "@/components/shared/Toast";
import {
  formatCurrency,
  formatDate,
  formatDateRange,
  getStatusColor,
} from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema } from "@/validations/booking.schema";
import type { ReviewInput } from "@/validations/booking.schema";

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { booking, loading, error } = useBooking(id);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 },
  });

  const handleCancel = async () => {
    if (!confirm("Cancel this booking?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Booking cancelled successfully", "success");
        router.push("/bookings");
      } else {
        showToast(data.error || "Failed to cancel booking", "error");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      showToast(message, "error");
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSubmit = async (data: ReviewInput) => {
    if (!booking) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          carId: booking.carId,
          bookingId: booking.id,
          rating: selectedRating,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        showToast("Review submitted successfully", "success");
        setReviewOpen(false);
        router.refresh();
      } else {
        showToast(result.error || "Failed to submit review", "error");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      showToast(message, "error");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Booking not found</p>
      </div>
    );
  }

  const car = booking.car;
  const image = car?.images?.[0] ?? "/images/car-placeholder.jpg";
  const isPaid = booking.paymentStatus === "PAID";
  const canPay = booking.paymentStatus === "UNPAID" && booking.status !== "CANCELLED";
  const canCancel = ["PENDING", "CONFIRMED"].includes(booking.status);
  const canReview = booking.status === "COMPLETED" && !booking.review;

  const statusIcons: Record<string, React.ReactNode> = {
    CONFIRMED: <CheckCircle2 className="h-5 w-5 text-green-400" />,
    CANCELLED: <XCircle className="h-5 w-5 text-red-400" />,
    PENDING: <Clock className="h-5 w-5 text-yellow-400" />,
    ACTIVE: <CheckCircle2 className="h-5 w-5 text-blue-400" />,
    COMPLETED: <CheckCircle2 className="h-5 w-5 text-zinc-400" />,
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] pt-20">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/bookings"
          className="mb-6 flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Status Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 rounded-2xl border p-4 ${getStatusColor(booking.status)}`}
            >
              {statusIcons[booking.status]}
              <div>
                <p className="font-semibold">
                  Booking {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                </p>
                <p className="text-xs opacity-70">
                  ID: #{booking.id.slice(-8).toUpperCase()}
                </p>
              </div>
            </motion.div>

            {/* Car Info */}
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#111113]">
              <div className="relative h-40 sm:h-48">
                <Image
                  src={image}
                  alt={car?.name ?? "Car"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-xs text-zinc-500">{car?.brand}</p>
                <h2 className="text-xl font-bold text-white">{car?.name}</h2>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                    <div>
                      <p className="text-xs text-zinc-500">Rental Period</p>
                      <p className="text-sm text-white">
                        {formatDateRange(booking.startDate, booking.endDate)}
                      </p>
                      <p className="text-xs text-zinc-500">{booking.totalDays} days</p>
                    </div>
                  </div>

                  {booking.pickupLocation && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                      <div>
                        <p className="text-xs text-zinc-500">Pickup</p>
                        <p className="text-sm text-white">
                          {booking.pickupLocation.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {booking.pickupLocation.city}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {booking.notes && (
                  <div className="mt-4 rounded-lg border border-white/5 bg-white/5 p-3">
                    <p className="text-xs text-zinc-500">Notes</p>
                    <p className="mt-1 text-sm text-zinc-300">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Review (if completed and reviewed) */}
            {booking.review && (
              <div className="rounded-2xl border border-white/5 bg-[#111113] p-5">
                <h3 className="mb-3 font-semibold text-white">Your Review</h3>
                <StarRating rating={booking.review.rating} showValue />
                {booking.review.comment && (
                  <p className="mt-2 text-sm text-zinc-400">{booking.review.comment}</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar — stacks below on mobile, beside on lg */}
          <div className="space-y-4">
            {/* Payment Summary */}
            <div className="rounded-2xl border border-white/5 bg-[#111113] p-4 sm:p-5">
              <h3 className="mb-4 font-semibold text-white">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">
                    {formatCurrency(car?.pricePerDay ?? 0)} × {booking.totalDays} days
                  </span>
                  <span className="text-white">
                    {formatCurrency(booking.subtotalPrice)}
                  </span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">
                      Discount{booking.promoCode ? ` (${booking.promoCode})` : ""}
                    </span>
                    <span className="text-green-400">
                      −{formatCurrency(booking.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-white/5 pt-2 flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-[#E8FF00]">
                    {formatCurrency(booking.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Badge
                  className={`text-xs ${getStatusColor(booking.paymentStatus)}`}
                  variant="outline"
                >
                  {isPaid ? "✓ Paid" : booking.paymentStatus}
                </Badge>
              </div>

              {booking.payment?.paidAt && (
                <p className="mt-2 text-xs text-zinc-600">
                  Paid on {formatDate(booking.payment.paidAt)}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {canPay && (
                <Button
                  onClick={() => setPaymentOpen(true)}
                  className="w-full bg-[#E8FF00] text-black font-bold hover:bg-[#d4e800]"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Complete Payment
                </Button>
              )}

              {canReview && (
                <Button
                  onClick={() => setReviewOpen(true)}
                  variant="outline"
                  className="w-full border-[#E8FF00]/30 text-[#E8FF00] hover:bg-[#E8FF00]/10"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Leave a Review
                </Button>
              )}

              {canCancel && (
                <Button
                  onClick={handleCancel}
                  disabled={cancelling}
                  variant="ghost"
                  className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  {cancelling ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="border-white/10 bg-[#111113] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Complete Payment</DialogTitle>
          </DialogHeader>
          <StripeCheckout
            bookingId={booking.id}
            totalPrice={booking.totalPrice}
            onSuccess={() => {
              setPaymentOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="border-white/10 bg-[#111113] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Leave a Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Rating</label>
              <StarRating
                rating={selectedRating}
                size="lg"
                interactive
                onRate={setSelectedRating}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Comment (optional)</label>
              <textarea
                {...register("comment")}
                rows={4}
                placeholder="Share your experience..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#E8FF00]/30 resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={reviewSubmitting}
              className="w-full bg-[#E8FF00] text-black font-bold hover:bg-[#d4e800]"
            >
              {reviewSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Submit Review
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
