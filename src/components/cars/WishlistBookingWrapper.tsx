"use client";

import { Suspense, type ReactNode } from "react";
import { WishlistDraftProvider } from "@/contexts/WishlistDraftContext";

interface WishlistBookingWrapperProps {
  children: ReactNode;
}

export function WishlistBookingWrapper({ children }: WishlistBookingWrapperProps) {
  return <WishlistDraftProvider>{children}</WishlistDraftProvider>;
}

export function BookingFormSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="h-96 animate-pulse rounded-2xl border border-white/10 bg-[#113F67]" />
      }
    >
      {children}
    </Suspense>
  );
}
