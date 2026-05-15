"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  CreditCard,
  Loader2,
  AlertCircle,
  LogIn,
  UserPlus,
  X,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DateRangePicker } from "./DateRangePicker";
import { LocationPicker } from "./LocationPicker";
import { PromoCodeInput } from "@/components/promo/PromoCodeInput";
import { formatCurrency, calculateDays } from "@/lib/utils";
import { useBookedDates } from "@/hooks/useBooking";
import { useWishlist } from "@/hooks/useWishlist";
import { useWishlistDraft } from "@/contexts/WishlistDraftContext";
import type { CarWithRelations, PromoPreview, WishlistDraft } from "@/types";
import type { Location } from "@prisma/client";

interface BookingFormValues {
  startDate: Date | undefined;
  endDate: Date | undefined;
  pickupLocationId: string | undefined;
  dropoffLocationId: string | undefined;
  notes: string | undefined;
}

interface BookingFormProps {
  car: CarWithRelations;
  locations: Location[];
}

function draftToFormValues(draft: WishlistDraft): Partial<BookingFormValues> {
  return {
    startDate: new Date(draft.startDate),
    endDate: new Date(draft.endDate),
    pickupLocationId: draft.pickupLocationId,
    dropoffLocationId: draft.dropoffLocationId,
    notes: draft.bookingNotes,
  };
}

export function BookingForm({ car, locations }: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromWishlist = searchParams.get("from") === "wishlist";
  const { data: session } = useSession();
  const { bookedDates } = useBookedDates(car.id);
  const { isSaved, updateWishlistEntry, initialized: wishlistReady } = useWishlist();
  const { setDraft } = useWishlistDraft();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [promo, setPromo] = useState<PromoPreview | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promoRevalidateRef = useRef(0);

  const { control, handleSubmit, watch, reset } = useForm<BookingFormValues>({
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      pickupLocationId: undefined,
      dropoffLocationId: undefined,
      notes: undefined,
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const pickupLocationId = watch("pickupLocationId");
  const dropoffLocationId = watch("dropoffLocationId");
  const notes = watch("notes");

  const totalDays = startDate && endDate ? calculateDays(startDate, endDate) : 0;
  const subtotal = totalDays * car.pricePerDay;
  const totalPrice = promo ? promo.totalPrice : subtotal;
  const saved = wishlistReady && isSaved(car.id);

  const syncDraftToContext = useCallback(() => {
    if (startDate && endDate) {
      setDraft({
        draftStartDate: startDate,
        draftEndDate: endDate,
        draftPickupLocationId: pickupLocationId,
        draftDropoffLocationId: dropoffLocationId,
        draftBookingNotes: notes,
      });
    } else {
      setDraft(null);
    }
  }, [startDate, endDate, pickupLocationId, dropoffLocationId, notes, setDraft]);

  useEffect(() => {
    syncDraftToContext();
  }, [syncDraftToContext]);

  useEffect(() => {
    if (!session?.user || draftLoaded) return;

    const loadDraft = async () => {
      try {
        const res = await fetch(`/api/wishlist/${car.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.data.draft) {
          reset(draftToFormValues(data.data.draft as WishlistDraft));
        }
      } finally {
        setDraftLoaded(true);
      }
    };

    loadDraft();
  }, [session?.user, car.id, draftLoaded, reset]);

  useEffect(() => {
    if (!promo || !startDate || !endDate || !session) return;

    const ticket = ++promoRevalidateRef.current;

    const revalidate = async () => {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promo.code,
          carId: car.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          fromWishlist: fromWishlist || saved,
        }),
      });
      const data = await res.json();
      if (ticket !== promoRevalidateRef.current) return;

      if (data.success) {
        setPromo(data.data as PromoPreview);
        setPromoError(null);
      } else {
        setPromo(null);
        setPromoError(data.error ?? "Promo no longer valid for these dates");
      }
    };

    void revalidate();
  }, [startDate, endDate, car.id, session, fromWishlist, saved, promo?.code]);

  useEffect(() => {
    if (!session?.user || !saved || !draftLoaded) return;
    if (!startDate || !endDate) return;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);

    syncTimerRef.current = setTimeout(() => {
      updateWishlistEntry(car.id, {
        draftStartDate: startDate,
        draftEndDate: endDate,
        draftPickupLocationId: pickupLocationId,
        draftDropoffLocationId: dropoffLocationId,
        draftBookingNotes: notes,
      });
    }, 800);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [
    session?.user,
    saved,
    draftLoaded,
    car.id,
    startDate,
    endDate,
    pickupLocationId,
    dropoffLocationId,
    notes,
    updateWishlistEntry,
  ]);

  const onSubmit = async (data: BookingFormValues) => {
    setDateError(null);
    if (!data.startDate) {
      setDateError("Please select a start date.");
      return;
    }
    if (!data.endDate) {
      setDateError("Please select an end date.");
      return;
    }
    if (data.endDate <= data.startDate) {
      setDateError("End date must be after start date.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
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
          promoCode: promo?.code,
          fromWishlist: fromWishlist || saved,
        }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingData.success) {
        throw new Error(bookingData.error ?? "Failed to create booking");
      }

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
      className="rounded-2xl border border-white/10 bg-[#113F67] p-6"
    >
      {fromWishlist && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#FDF5AA]/20 bg-[#FDF5AA]/5 px-3 py-2 text-xs text-[#FDF5AA]">
          <Heart className="h-3.5 w-3.5 fill-current" />
          Continuing from your wishlist — your saved dates are restored when available.
        </div>
      )}

      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold text-white">
            {formatCurrency(car.pricePerDay)}
          </span>
          <span className="text-sm text-slate-400"> / day</span>
        </div>
        {totalDays > 0 && (
          <div className="text-right">
            <p className="text-sm text-slate-300">{totalDays} days</p>
            <p className="text-lg font-bold text-[#FDF5AA]">
              {formatCurrency(totalPrice)}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
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
                    startDate={startField.value ?? null}
                    endDate={endField.value ?? null}
                    onChange={(start, end) => {
                      startField.onChange(start ?? undefined);
                      endField.onChange(end ?? undefined);
                      setDateError(null);
                    }}
                    bookedRanges={bookedDates}
                  />
                )}
              />
            )}
          />
          {dateError && (
            <p className="mt-1 text-xs text-red-400">{dateError}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
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

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
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

        {session && totalDays > 0 && (
          <PromoCodeInput
            carId={car.id}
            startDate={startDate}
            endDate={endDate}
            fromWishlist={fromWishlist || saved}
            applied={promo}
            onApplied={(next) => {
              setPromo(next);
              setPromoError(null);
            }}
          />
        )}
        {promoError && (
          <p className="text-xs text-amber-400">{promoError}</p>
        )}

        {totalDays > 0 && (
          <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">
                {formatCurrency(car.pricePerDay)} × {totalDays} days
              </span>
              <span className="text-white">{formatCurrency(subtotal)}</span>
            </div>
            {promo && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">
                  Promo ({promo.code})
                </span>
                <span className="text-green-400">
                  −{formatCurrency(promo.discountAmount)}
                </span>
              </div>
            )}
            <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
              <span className="text-white">Total</span>
              <span className="text-[#FDF5AA]">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button
          type={session ? "submit" : "button"}
          onClick={!session ? () => setAuthModalOpen(true) : undefined}
          disabled={submitting || !car.available}
          className="w-full bg-[#FDF5AA] text-black font-bold hover:bg-[#e8e090] disabled:opacity-50"
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

        <p className="text-center text-xs text-slate-500">
          No charge until confirmed. Free cancellation before pickup.
        </p>
      </form>

      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="border border-white/10 bg-[#0E2D4A] p-0 sm:max-w-md">
          <div className="p-6">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDF5AA]/10">
              <CreditCard className="h-6 w-6 text-[#FDF5AA]" />
            </div>

            <h2 className="text-xl font-bold text-white">Sign in to book</h2>
            <p className="mt-2 text-sm text-slate-400">
              You need an account to reserve this car. It only takes a minute to get started.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={() => router.push(`/login?callbackUrl=/cars/${car.id}`)}
                className="w-full bg-[#FDF5AA] text-black font-bold hover:bg-[#e8e090]"
                size="lg"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Button
                onClick={() => router.push(`/register?callbackUrl=/cars/${car.id}`)}
                variant="outline"
                className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                size="lg"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create an Account
              </Button>
            </div>

            <p className="mt-4 text-center text-xs text-slate-500">
              Free to join. No credit card required to sign up.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
