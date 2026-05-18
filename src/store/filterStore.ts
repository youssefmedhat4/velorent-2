"use client";

import { create } from "zustand";
import type { CarCategory, Transmission, FuelType } from "@/types";

interface FilterState {
  category: CarCategory | null;
  minPrice: number;
  maxPrice: number;
  startDate: Date | null;
  endDate: Date | null;
  city: string;
  transmission: Transmission | null;
  fuelType: FuelType | null;
  seats: number | null;
  sort: "price_asc" | "price_desc" | "rating" | "newest";
  page: number;

  setCategory: (category: CarCategory | null) => void;
  setPriceRange: (min: number, max: number) => void;
  setDates: (start: Date | null, end: Date | null) => void;
  setCity: (city: string) => void;
  setTransmission: (t: Transmission | null) => void;
  setFuelType: (f: FuelType | null) => void;
  setSeats: (s: number | null) => void;
  setSort: (sort: FilterState["sort"]) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const initialState = {
  category: null,
  minPrice: 0,
  maxPrice: 1000,
  startDate: null,
  endDate: null,
  city: "",
  transmission: null,
  fuelType: null,
  seats: null,
  sort: "newest" as const,
  page: 1,
};

export const useFilterStore = create<FilterState>()((set) => ({
  ...initialState,

  setCategory: (category) => set({ category, page: 1 }),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max, page: 1 }),
  setDates: (start, end) => set({ startDate: start, endDate: end, page: 1 }),
  setCity: (city) => set({ city, page: 1 }),
  setTransmission: (transmission) => set({ transmission, page: 1 }),
  setFuelType: (fuelType) => set({ fuelType, page: 1 }),
  setSeats: (seats) => set({ seats, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () => set(initialState),
}));
