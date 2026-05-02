"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  carId: string | null;
  startDate: Date | null;
  endDate: Date | null;
  pickupLocationId: string | null;
  dropoffLocationId: string | null;
  notes: string;
  totalDays: number;
  totalPrice: number;

  setCarId: (id: string) => void;
  setDates: (start: Date, end: Date) => void;
  setPickupLocation: (id: string | null) => void;
  setDropoffLocation: (id: string | null) => void;
  setNotes: (notes: string) => void;
  setTotalPrice: (pricePerDay: number) => void;
  reset: () => void;
}

const initialState = {
  carId: null,
  startDate: null,
  endDate: null,
  pickupLocationId: null,
  dropoffLocationId: null,
  notes: "",
  totalDays: 0,
  totalPrice: 0,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCarId: (id) => set({ carId: id }),

      setDates: (start, end) => {
        const days = Math.max(
          1,
          Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          )
        );
        set({ startDate: start, endDate: end, totalDays: days });
      },

      setPickupLocation: (id) => set({ pickupLocationId: id }),
      setDropoffLocation: (id) => set({ dropoffLocationId: id }),
      setNotes: (notes) => set({ notes }),

      setTotalPrice: (pricePerDay) => {
        const { totalDays } = get();
        set({ totalPrice: pricePerDay * totalDays });
      },

      reset: () => set(initialState),
    }),
    {
      name: "velorent-booking",
      partialize: (state) => ({
        carId: state.carId,
        startDate: state.startDate,
        endDate: state.endDate,
        pickupLocationId: state.pickupLocationId,
        dropoffLocationId: state.dropoffLocationId,
        notes: state.notes,
        totalDays: state.totalDays,
        totalPrice: state.totalPrice,
      }),
    }
  )
);
