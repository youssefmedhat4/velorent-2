"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B2540] px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="mt-2 text-sm text-slate-400">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-[#FDF5AA] px-6 py-3 text-sm font-bold text-black hover:bg-[#e8e090] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
