"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Loader2,
  CheckCircle2,
  X,
  FileText,
  User,
  Mail,
  Phone,
  Link2,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  linkedIn: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  coverLetter: z.string().max(3000, "Max 3000 characters").optional(),
});

type FormValues = z.infer<typeof schema>;

interface ApplicationFormProps {
  jobTitle: string;
  jobTeam: string;
  onClose: () => void;
}

export function ApplicationForm({ jobTitle, jobTeam, onClose }: ApplicationFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvError(null);
    setCvFile(file);
    setCvUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/cv", { method: "POST", body: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.error ?? "Upload failed");
      setCvUrl(data.data.url);
    } catch (err) {
      setCvError(err instanceof Error ? err.message : "Upload failed");
      setCvFile(null);
    } finally {
      setCvUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!cvUrl) {
      setCvError("Please upload your CV before submitting");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          jobTitle,
          jobTeam,
          cvUrl,
          cvFileName: cvFile?.name ?? "cv.pdf",
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5 py-8 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-10 w-10 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
          <p className="mt-2 text-sm text-slate-400 max-w-xs">
            Thanks for applying for <span className="text-[#FDF5AA]">{jobTitle}</span>. We&apos;ll
            review your application and get back to you within 5–7 business days.
          </p>
        </div>
        <Button
          onClick={onClose}
          className="mt-2 bg-[#FDF5AA] text-[#0B2540] font-bold hover:bg-[#e8e090]"
        >
          Done
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[#58A0C8]">
            Applying for
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">{jobTitle}</h2>
          <span className="mt-1 inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
            {jobTeam}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step === s
                  ? "bg-[#FDF5AA] text-[#0B2540]"
                  : step > s
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/5 text-slate-500"
              }`}
            >
              {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
            </div>
            <span className={`text-xs ${step === s ? "text-white" : "text-slate-500"}`}>
              {s === 1 ? "Your Details" : "CV & Cover Letter"}
            </span>
            {s < 2 && <ChevronRight className="h-3 w-3 text-slate-600" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Full Name */}
              <div>
                <Label className="text-slate-400 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Full Name *
                </Label>
                <Input
                  {...register("fullName")}
                  placeholder="John Doe"
                  className="mt-1.5 border-[#34699A]/40 bg-[#113F67]/50 text-white placeholder-slate-500 focus:border-[#FDF5AA]/30"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email Address *
                </Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1.5 border-[#34699A]/40 bg-[#113F67]/50 text-white placeholder-slate-500 focus:border-[#FDF5AA]/30"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone (optional)
                </Label>
                <Input
                  {...register("phone")}
                  placeholder="+1 555 000 0000"
                  className="mt-1.5 border-[#34699A]/40 bg-[#113F67]/50 text-white placeholder-slate-500 focus:border-[#FDF5AA]/30"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <Label className="text-slate-400 flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5" /> LinkedIn (optional)
                </Label>
                <Input
                  {...register("linkedIn")}
                  placeholder="https://linkedin.com/in/yourname"
                  className="mt-1.5 border-[#34699A]/40 bg-[#113F67]/50 text-white placeholder-slate-500 focus:border-[#FDF5AA]/30"
                />
                {errors.linkedIn && (
                  <p className="mt-1 text-xs text-red-400">{errors.linkedIn.message}</p>
                )}
              </div>

              {/* Portfolio */}
              <div>
                <Label className="text-slate-400 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Portfolio / Website (optional)
                </Label>
                <Input
                  {...register("portfolio")}
                  placeholder="https://yoursite.com"
                  className="mt-1.5 border-[#34699A]/40 bg-[#113F67]/50 text-white placeholder-slate-500 focus:border-[#FDF5AA]/30"
                />
                {errors.portfolio && (
                  <p className="mt-1 text-xs text-red-400">{errors.portfolio.message}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-[#FDF5AA] text-[#0B2540] font-bold hover:bg-[#e8e090]"
              >
                Next — Upload CV
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* CV Upload */}
              <div>
                <Label className="text-slate-400 flex items-center gap-1.5 mb-2">
                  <FileText className="h-3.5 w-3.5" /> Upload CV / Resume *
                </Label>

                {cvFile && cvUrl ? (
                  <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
                    <FileText className="h-5 w-5 shrink-0 text-green-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{cvFile.name}</p>
                      <p className="text-xs text-green-400">Uploaded successfully</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setCvFile(null); setCvUrl(null); }}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[#34699A]/50 bg-[#113F67]/30 px-6 py-8 text-center transition-colors hover:border-[#FDF5AA]/40 hover:bg-[#113F67]/50">
                    {cvUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-[#58A0C8]" />
                        <p className="text-sm text-slate-400">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-[#58A0C8]" />
                        <div>
                          <p className="text-sm font-medium text-white">
                            Click to upload your CV
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            PDF, DOC, or DOCX — max 5 MB
                          </p>
                        </div>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleCvChange}
                      className="hidden"
                      disabled={cvUploading}
                    />
                  </label>
                )}

                {cvError && (
                  <p className="mt-1.5 text-xs text-red-400">{cvError}</p>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <Label className="text-slate-400 mb-2 block">
                  Cover Letter (optional)
                </Label>
                <textarea
                  {...register("coverLetter")}
                  rows={5}
                  placeholder={`Tell us why you're a great fit for the ${jobTitle} role...`}
                  className="w-full rounded-xl border border-[#34699A]/40 bg-[#113F67]/50 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#FDF5AA]/30 resize-none"
                />
                {errors.coverLetter && (
                  <p className="mt-1 text-xs text-red-400">{errors.coverLetter.message}</p>
                )}
              </div>

              {submitError && (
                <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {submitError}
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-[#34699A]/40 text-slate-300 hover:bg-white/5"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || cvUploading || !cvUrl}
                  className="flex-1 bg-[#FDF5AA] text-[#0B2540] font-bold hover:bg-[#e8e090] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
