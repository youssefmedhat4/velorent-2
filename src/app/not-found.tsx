import Link from "next/link";
import { Car } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B2540] px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FDF5AA]/10 mb-6">
        <Car className="h-10 w-10 text-[#FDF5AA]" />
      </div>
      <p className="font-display text-8xl font-black text-[#FDF5AA]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-slate-400">
        The road you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FDF5AA] px-6 py-3 text-sm font-bold text-black hover:bg-[#e8e090] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
