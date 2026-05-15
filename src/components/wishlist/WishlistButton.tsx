"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import { useWishlistDraftOptional } from "@/contexts/WishlistDraftContext";

interface WishlistButtonProps {
  carId: string;
  className?: string;
  size?: "sm" | "md";
  redirectOnAuth?: string;
}

export function WishlistButton({
  carId,
  className,
  size = "md",
  redirectOnAuth,
}: WishlistButtonProps) {
  const { isSaved, toggleSave, initialized } = useWishlist();
  const draftContext = useWishlistDraftOptional();
  const [pending, setPending] = useState(false);

  const saved = initialized && isSaved(carId);
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (pending) return;
    setPending(true);
    try {
      await toggleSave(carId, {
        redirectOnAuth,
        draft: draftContext?.getDraftPayload(),
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex items-center justify-center rounded-full border backdrop-blur-sm transition-all",
        buttonSize,
        saved
          ? "border-[#FDF5AA]/40 bg-[#FDF5AA]/20 text-[#FDF5AA] hover:bg-[#FDF5AA]/30"
          : "border-white/10 bg-black/40 text-white hover:border-[#FDF5AA]/30 hover:text-[#FDF5AA]",
        className
      )}
    >
      {pending ? (
        <Loader2 className={cn(iconSize, "animate-spin")} />
      ) : (
        <Heart className={cn(iconSize, saved && "fill-current")} />
      )}
    </button>
  );
}
