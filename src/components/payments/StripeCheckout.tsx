"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface StripeCheckoutProps {
  bookingId: string;
  totalPrice: number;
  onSuccess: () => void;
}

export function StripeCheckout({ bookingId, totalPrice, onSuccess }: StripeCheckoutProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMockPayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error ?? "Payment failed");
      }

      setSucceeded(true);
      // Redirect to payment success page after a short delay so user sees the success state
      setTimeout(() => {
        onSuccess();
        router.push(`/payment/success?bookingId=${bookingId}`);
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (succeeded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-8 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Payment Confirmed!</h3>
          <p className="mt-1 text-sm text-slate-400">
            Your booking is confirmed. Check your email for details.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mock payment card UI */}
      <div className="rounded-xl border border-[#34699A]/40 bg-[#0E2D4A] p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-4 w-4 text-[#58A0C8]" />
          <span className="text-sm font-medium text-[#EEF4FA]">Payment Details</span>
          <span className="ml-auto text-xs text-[#58A0C8] border border-[#58A0C8]/30 rounded px-2 py-0.5">
            Demo Mode
          </span>
        </div>

        {/* Fake card number field */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Card Number</label>
            <div className="rounded-lg border border-[#34699A]/40 bg-[#113F67]/50 px-3 py-2.5 text-sm text-slate-300 font-mono tracking-widest">
              4242 4242 4242 4242
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Expiry</label>
              <div className="rounded-lg border border-[#34699A]/40 bg-[#113F67]/50 px-3 py-2.5 text-sm text-slate-300">
                12 / 28
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">CVC</label>
              <div className="rounded-lg border border-[#34699A]/40 bg-[#113F67]/50 px-3 py-2.5 text-sm text-slate-300">
                •••
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price summary */}
      <div className="flex items-center justify-between rounded-lg border border-[#34699A]/30 bg-[#113F67]/30 px-4 py-3">
        <span className="text-sm text-slate-400">Total due today</span>
        <span className="text-lg font-bold text-[#FDF5AA]">{formatCurrency(totalPrice)}</span>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <Button
        onClick={handleMockPayment}
        disabled={processing}
        className="w-full bg-[#FDF5AA] text-[#0B2540] font-bold hover:bg-[#e8e090]"
        size="lg"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Confirm Payment — {formatCurrency(totalPrice)}
          </>
        )}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <Lock className="h-3 w-3" />
        Demo mode — no real charge will be made
      </p>
    </div>
  );
}
