"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";

interface WishlistNavLinkProps {
  className?: string;
  onClick?: () => void;
}

export function WishlistNavLink({ className, onClick }: WishlistNavLinkProps) {
  const pathname = usePathname();
  const { count } = useWishlist();
  const isActive = pathname === "/wishlist";

  return (
    <Link
      href="/wishlist"
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 text-sm font-medium transition-colors",
        isActive ? "text-[#FDF5AA]" : "text-slate-300 hover:text-white",
        className
      )}
    >
      Wishlist
      {count > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FDF5AA] px-1.5 text-xs font-bold text-black">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
