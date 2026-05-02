import Link from "next/link";
import { Car } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0B] px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E8FF00]/10 mb-6">
        <Car className="h-10 w-10 text-[#E8FF00]" />
      </div>
      <p className="font-display text-8xl font-black text-[#E8FF00]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-zinc-500">
        The road you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#E8FF00] px-6 py-3 text-sm font-bold text-black hover:bg-[#d4e800] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
