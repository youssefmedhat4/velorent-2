"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { WishlistDraftInput } from "@/validations/wishlist.schema";

export interface WishlistDraftSnapshot {
  draftStartDate?: Date;
  draftEndDate?: Date;
  draftPickupLocationId?: string;
  draftDropoffLocationId?: string;
  draftBookingNotes?: string;
}

interface WishlistDraftContextValue {
  draft: WishlistDraftSnapshot | null;
  setDraft: (draft: WishlistDraftSnapshot | null) => void;
  getDraftPayload: () => WishlistDraftInput | undefined;
}

const WishlistDraftContext = createContext<WishlistDraftContextValue | null>(null);

interface WishlistDraftProviderProps {
  children: ReactNode;
}

export function WishlistDraftProvider({ children }: WishlistDraftProviderProps) {
  const [draft, setDraft] = useState<WishlistDraftSnapshot | null>(null);

  const getDraftPayload = useCallback((): WishlistDraftInput | undefined => {
    if (!draft?.draftStartDate || !draft?.draftEndDate) return undefined;

    return {
      draftStartDate: draft.draftStartDate,
      draftEndDate: draft.draftEndDate,
      draftPickupLocationId: draft.draftPickupLocationId,
      draftDropoffLocationId: draft.draftDropoffLocationId,
      draftBookingNotes: draft.draftBookingNotes,
    };
  }, [draft]);

  const value = useMemo(
    () => ({ draft, setDraft, getDraftPayload }),
    [draft, getDraftPayload]
  );

  return (
    <WishlistDraftContext.Provider value={value}>
      {children}
    </WishlistDraftContext.Provider>
  );
}

export function useWishlistDraft() {
  const ctx = useContext(WishlistDraftContext);
  if (!ctx) {
    throw new Error("useWishlistDraft must be used within WishlistDraftProvider");
  }
  return ctx;
}

export function useWishlistDraftOptional() {
  return useContext(WishlistDraftContext);
}
