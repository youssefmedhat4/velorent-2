"use client";

import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWishlistStore } from "@/store/wishlistStore";
import type { WishlistItem } from "@/types";
import type { WishlistDraftInput } from "@/validations/wishlist.schema";

interface ToggleSaveOptions {
  redirectOnAuth?: string;
  draft?: WishlistDraftInput;
}

export function useWishlist() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    carIds,
    items,
    loading,
    initialized,
    setFromResponse,
    setLoading,
    setInitialized,
    addCarId,
    removeCarId,
    updateItem,
    reset,
  } = useWishlistStore();

  const fetchWishlist = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!session?.user) return;

      if (!options?.silent) setLoading(true);
      try {
        const res = await fetch("/api/wishlist");
        const data = await res.json();

        if (data.success) {
          setFromResponse(
            data.data.carIds as string[],
            data.data.items as WishlistItem[]
          );
        }
      } finally {
        if (!options?.silent) setLoading(false);
        setInitialized(true);
      }
    },
    [session?.user, setFromResponse, setLoading, setInitialized]
  );

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      reset();
      return;
    }

    if (!initialized) {
      fetchWishlist();
    }
  }, [status, session?.user, initialized, fetchWishlist, reset]);

  const isSaved = useCallback(
    (carId: string) => carIds.includes(carId),
    [carIds]
  );

  const saveToWishlist = useCallback(
    async (carId: string, draft?: WishlistDraftInput) => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, ...draft }),
      });
      const data = await res.json();
      if (data.success) {
        updateItem(data.data as WishlistItem);
        addCarId(carId);
        return true;
      }
      return false;
    },
    [addCarId, updateItem]
  );

  const updateWishlistEntry = useCallback(
    async (carId: string, payload: WishlistDraftInput & { note?: string | null }) => {
      const res = await fetch(`/api/wishlist/${carId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        updateItem(data.data as WishlistItem);
        return true;
      }
      return false;
    },
    [updateItem]
  );

  const toggleSave = useCallback(
    async (carId: string, options?: ToggleSaveOptions) => {
      if (!session?.user) {
        const callback = options?.redirectOnAuth ?? `/cars/${carId}`;
        router.push(`/login?callbackUrl=${encodeURIComponent(callback)}`);
        return false;
      }

      const saved = isSaved(carId);

      if (saved) {
        removeCarId(carId);
        try {
          const res = await fetch(`/api/wishlist/${carId}`, { method: "DELETE" });
          const data = await res.json();
          if (!data.success) {
            addCarId(carId);
            return false;
          }
        } catch {
          addCarId(carId);
          return false;
        }
      } else {
        addCarId(carId);
        try {
          const ok = await saveToWishlist(carId, options?.draft);
          if (!ok) {
            removeCarId(carId);
            return false;
          }
        } catch {
          removeCarId(carId);
          return false;
        }
      }

      return true;
    },
    [session?.user, isSaved, addCarId, removeCarId, router, saveToWishlist]
  );

  return {
    carIds,
    items,
    count: carIds.length,
    loading,
    initialized,
    isSaved,
    toggleSave,
    saveToWishlist,
    updateWishlistEntry,
    refetch: fetchWishlist,
  };
}
