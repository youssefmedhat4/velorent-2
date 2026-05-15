"use client";

import { create } from "zustand";
import type { WishlistItem } from "@/types";

interface WishlistState {
  carIds: string[];
  items: WishlistItem[];
  loading: boolean;
  initialized: boolean;

  setFromResponse: (carIds: string[], items: WishlistItem[]) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  addCarId: (carId: string) => void;
  removeCarId: (carId: string) => void;
  updateItem: (item: WishlistItem) => void;
  reset: () => void;
}

const initialState = {
  carIds: [] as string[],
  items: [] as WishlistItem[],
  loading: false,
  initialized: false,
};

export const useWishlistStore = create<WishlistState>()((set) => ({
  ...initialState,

  setFromResponse: (carIds, items) => set({ carIds, items }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  addCarId: (carId) =>
    set((state) => ({
      carIds: state.carIds.includes(carId) ? state.carIds : [...state.carIds, carId],
    })),
  removeCarId: (carId) =>
    set((state) => ({
      carIds: state.carIds.filter((id) => id !== carId),
      items: state.items.filter((item) => item.carId !== carId),
    })),
  updateItem: (item) =>
    set((state) => {
      const exists = state.items.some((i) => i.carId === item.carId);
      const items = exists
        ? state.items.map((i) => (i.carId === item.carId ? item : i))
        : [item, ...state.items];
      const carIds = state.carIds.includes(item.carId)
        ? state.carIds
        : [...state.carIds, item.carId];
      return { items, carIds };
    }),
  reset: () => set(initialState),
}));
