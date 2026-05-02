"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "./DateRangePicker";
import { LocationPicker } from "./LocationPicker";
import { formatCurrency, calculateDays } from "@/lib/utils";
import { useBookedDates } from "@/hooks/useBooking";
import type { CarWithRelations } from "@/types";
import type { Location } from "@prisma/client";

const bookingFormSchema = z.object({
  startDate: z.date().refine((d) => d >= new Date(), {
    message: "Start date must be in the future",
  }),
  endDate: z.date(),
  pickupLocationId: z.string().optional(),
  dropoffLocationId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  car: CarWithRelations;
  locations: Location[];
}

export function BookingForm({ car, locations }: BookingFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { bookedDates } = useBookedDates(car.id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const totalDays = startDate && endDate ? calculateDays(startDate, endDate) : 0;
  const totalPrice = totalDays * car.pricePerDay;

  const onSubmit = async (data: BookingFormValues) => {
    if (!session) {
      router.push(`/login?callbackUrl=/cars/${car.id}`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Create booking
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
          pickupLocationId: data.pickupLocationId,
          dropoffLocationId: data.dropoffLocationId,
          notes: data.notes,
        }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingData.success) {
        throw new Error(bookingData.error ?? "Failed to create booking");
      }

      // Redirect to booking page for payment
      router.push(`/bookings/${bookingData.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-[#111113] p-6"
    >
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold text-white">
            {formatCurrency(car.pricePerDay)}
          </span>
          <span className="text-sm text-zinc-500"> / day</span>
        </div>
        {totalDays > 0 && (
          <div className="text-right">
            <p className="text-sm text-zinc-400">{totalDays} days</p>
            <p className="text-lg font-bold text-[#E8FF00]">
              {formatCurrency(totalPrice)}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Dates */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Rental Period
          </label>
          <Controller
            name="startDate"
            control={control}
            render={({ field: startField }) => (
              <Controller
                name="endDate"
                control={control}
                render={({ field: endField }) => (
                  <DateRangePicker
                    startDate={startField.value}
                    endDate={endField.value}
                    onChange={(start, end) => {
                      startField.onChange(start);
                      endField.onChange(end);
                    }}
                    bookedRanges={bookedDates}
                  />
                )}
              />
            )}
          />
          {(errors.startDate || errors.endDate) && (
            <p className="mt-1 text-xs text-red-400">
              {errors.startDate?.message ?? errors.endDate?.message}
            </p>
          )}
        </div>

        {/* Pickup Location */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <MapPin className="h-3.5 w-3.5" />
            Pickup Location
          </label>
          <Controller
            name="pickupLocationId"
            control={control}
            render={({ field }) => (
              <LocationPicker
                locations={locations}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select pickup location"
              />
            )}
          />
        </div>

        {/* Dropoff Location */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
            <MapPin className="h-3.5 w-3.5" />
            Drop-off Location
          </label>
          <Controller
            name="dropoffLocationId"
            control={control}
            render={({ field }) => (
              <LocationPicker
                locations={locations}
                value={field.value}
                onChange={field.onChange}
                placeholder="Same as pickup"
              />
            )}
          />
        </div>

        {/* Price breakdown */}
        {totalDays > 0 && (
          <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">
                {formatCurrency(car.pricePerDay)} × {totalDays} days
              </span>
              <span className="text-white">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
              <span className="text-white">Total</span>
              <span className="text-[#E8FF00]">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting || !car.available}
          className="w-full bg-[#E8FF00] text-black font-bold hover:bg-[#d4e800] disabled:opacity-50"
          size="lg"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : !session ? (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Sign in to Book
            </>
          ) : !car.available ? (
            "Currently Unavailable"
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Reserve Now
            </>
          )}
        </Button>

        <p className="text-center text-xs text-zinc-600">
          No charge until confirmed. Free cancellation before pickup.
        </p>
      </form>
    </motion.div>
  );
}
