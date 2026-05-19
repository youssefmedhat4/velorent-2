"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle2, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(3, "Subject is required"),
  category: z.enum(["booking", "payment", "vehicle", "account", "other"]),
  message: z.string().min(20, "Please provide more detail (min 20 characters)"),
});

type FormValues = z.infer<typeof schema>;

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@velorent.com",
    sub: "We reply within 24 hours",
    href: "mailto:support@velorent.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (800) VELO-RENT",
    sub: "Mon–Sun, 8am–10pm EST",
    href: "tel:+18008356736",
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "350 Fifth Avenue, New York",
    sub: "NY 10118, United States",
    href: null,
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "7 days a week",
    sub: "8:00 AM – 10:00 PM EST",
    href: null,
  },
];

const categories = [
  { value: "booking", label: "Booking & Reservations" },
  { value: "payment", label: "Payments & Billing" },
  { value: "vehicle", label: "Vehicle / Damage" },
  { value: "account", label: "Account & Profile" },
  { value: "other", label: "Other" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: "booking" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitError(null);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error ?? "Failed to send message");
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#34699A]/20 bg-[#0E2D4A] py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,160,200,0.08)_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]"
          >
            Get in touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl font-black uppercase text-white sm:text-6xl"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-400"
          >
            Have a question or need help? We&apos;re here for you.
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white mb-6">Reach us directly</h2>
            {contactInfo.map(({ icon: Icon, label, value, sub, href }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 rounded-xl border border-[#34699A]/20 bg-[#113F67]/30 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FDF5AA]/10">
                  <Icon className="h-5 w-5 text-[#FDF5AA]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
                  {href ? (
                    <a href={href} className="mt-0.5 block font-medium text-white hover:text-[#FDF5AA] transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="mt-0.5 font-medium text-white">{value}</p>
                  )}
                  <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Emergency */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm font-semibold text-red-400 mb-1">🚨 Roadside Emergency?</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                If you&apos;re stranded or in an accident, call our 24/7 emergency line immediately:
              </p>
              <a href="tel:+18009999999" className="mt-2 block text-sm font-bold text-white hover:text-red-400 transition-colors">
                +1 (800) 999-9999
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[#34699A]/20 bg-[#113F67]/30 p-6 sm:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-12 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                    <p className="mt-2 text-sm text-slate-400 max-w-xs">
                      Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setSubmitError(null); }}
                    className="mt-2 text-sm text-[#58A0C8] hover:text-white transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <MessageCircle className="h-5 w-5 text-[#58A0C8]" />
                    <h2 className="text-lg font-bold text-white">Send us a message</h2>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label className="text-slate-400">Your Name</Label>
                        <Input
                          {...register("name")}
                          placeholder="John Doe"
                          className="mt-1.5 border-[#34699A]/40 bg-[#0E2D4A]/60 text-white placeholder-slate-500 focus:border-[#FDF5AA]/30"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label className="text-slate-400">Email Address</Label>
                        <Input
                          {...register("email")}
                          type="email"
                          placeholder="you@example.com"
                          className="mt-1.5 border-[#34699A]/40 bg-[#0E2D4A]/60 text-white placeholder-slate-500 focus:border-[#FDF5AA]/30"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-400">Category</Label>
                      <select
                        {...register("category")}
                        className="mt-1.5 w-full rounded-xl border border-[#34699A]/40 bg-[#0E2D4A]/60 px-3 py-2.5 text-sm text-white outline-none focus:border-[#FDF5AA]/30"
                      >
                        {categories.map((c) => (
                          <option key={c.value} value={c.value} className="bg-[#0E2D4A]">
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="text-slate-400">Subject</Label>
                      <Input
                        {...register("subject")}
                        placeholder="Brief description of your issue"
                        className="mt-1.5 border-[#34699A]/40 bg-[#0E2D4A]/60 text-white placeholder-slate-500 focus:border-[#FDF5AA]/30"
                      />
                      {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                    </div>

                    <div>
                      <Label className="text-slate-400">Message</Label>
                      <textarea
                        {...register("message")}
                        rows={5}
                        placeholder="Describe your issue or question in detail..."
                        className="mt-1.5 w-full rounded-xl border border-[#34699A]/40 bg-[#0E2D4A]/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#FDF5AA]/30 resize-none"
                      />
                      {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#FDF5AA] text-[#0B2540] font-bold hover:bg-[#e8e090]"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                      ) : (
                        "Send Message"
                      )}
                    </Button>

                    {submitError && (
                      <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                        <p className="text-sm text-red-400">{submitError}</p>
                      </div>
                    )}

                    <p className="text-center text-xs text-slate-600">
                      We typically respond within 24 hours on business days.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
