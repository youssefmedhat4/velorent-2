"use client";

import { useState } from "react";
import { Tag, Loader2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import type { PromoPreview } from "@/types";

interface PromoCodeInputProps {
  carId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  fromWishlist?: boolean;
  applied: PromoPreview | null;
  onApplied: (promo: PromoPreview | null) => void;
}

export function PromoCodeInput({
  carId,
  startDate,
  endDate,
  fromWishlist,
  applied,
  onApplied,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!startDate || !endDate) {
      setError("Select your rental dates first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          carId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          fromWishlist,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? "Invalid promo code");
        return;
      }

      onApplied(data.data as PromoPreview);
      setCode("");
    } catch {
      setError("Could not validate promo code");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onApplied(null);
    setError(null);
  };

  if (applied) {
    return (
      <div className="rounded-xl border border-[#FDF5AA]/20 bg-[#FDF5AA]/5 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FDF5AA]" />
            <div>
              <p className="text-sm font-medium text-[#FDF5AA]">{applied.code}</p>
              <p className="text-xs text-slate-400">{applied.description}</p>
              <p className="mt-1 text-xs text-slate-300">
                You save {formatCurrency(applied.discountAmount)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Remove promo code"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
        <Tag className="h-3.5 w-3.5" />
        Promo code
      </label>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="ENTER PROMO CODE...."
          className="border-white/10 bg-white/5 text-white uppercase placeholder:normal-case placeholder:text-slate-500"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="shrink-0 border-white/10 bg-white/5 text-white hover:bg-white/10"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
        </Button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
