"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Plus, X, Upload, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { carSchema } from "@/validations/car.schema";
import { showToast } from "@/components/shared/Toast";
import type { CarInput } from "@/validations/car.schema";
import { CarCategory, Transmission, FuelType } from "@prisma/client";
import type { CarWithRelations } from "@/types";
import Image from "next/image";

interface CarFormProps {
  car?: CarWithRelations;
  mode: "create" | "edit";
}

export function CarForm({ car, mode }: CarFormProps) {
  const router = useRouter();
  const [featureInput, setFeatureInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CarInput>({
    resolver: zodResolver(carSchema),
    defaultValues: car
      ? {
          name: car.name,
          brand: car.brand,
          model: car.model,
          year: car.year,
          category: car.category,
          pricePerDay: car.pricePerDay,
          seats: car.seats,
          transmission: car.transmission,
          fuelType: car.fuelType,
          mileage: car.mileage ?? undefined,
          color: car.color,
          description: car.description,
          features: car.features,
          images: car.images,
          modelUrl: car.modelUrl ?? undefined,
          available: car.available,
          locationId: car.locationId ?? undefined,
        }
      : {
          features: [],
          images: [],
          available: true,
          year: new Date().getFullYear(),
          seats: 5,
          category: CarCategory.ECONOMY,
          transmission: Transmission.AUTOMATIC,
          fuelType: FuelType.PETROL,
        },
  });

  const features = watch("features") ?? [];
  const images = watch("images") ?? [];

  const addFeature = () => {
    if (featureInput.trim()) {
      setValue("features", [...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (i: number) => {
    setValue("features", features.filter((_, idx) => idx !== i));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "velorent/cars");

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) uploadedUrls.push(data.data.url);
      }
      setValue("images", [...images, ...uploadedUrls]);
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i: number) => {
    setValue("images", images.filter((_, idx) => idx !== i));
  };

  const onSubmit = async (data: CarInput) => {
    setError(null);
    try {
      const url = mode === "create" ? "/api/cars" : `/api/cars/${car?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      showToast(mode === "create" ? "Car added successfully" : "Car updated successfully", "success");
      router.push("/admin/cars");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save car";
      setError(message);
      showToast(message, "error");
    }
  };

  const selectClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#FDF5AA]/30 [&>option]:bg-[#113F67]";

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display text-4xl font-black uppercase text-white">
            {mode === "create" ? "Add New Car" : "Edit Car"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
        {/* Basic Info */}
        <div className="rounded-2xl border border-white/5 bg-[#113F67] p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-slate-300">Car Name</Label>
              <Input
                {...register("name")}
                placeholder="e.g. Lamborghini Huracán"
                className="mt-1.5 border-white/10 bg-white/5 text-white placeholder-zinc-500"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <Label className="text-slate-300">Brand</Label>
              <Input
                {...register("brand")}
                placeholder="e.g. Lamborghini"
                className="mt-1.5 border-white/10 bg-white/5 text-white placeholder-zinc-500"
              />
              {errors.brand && <p className="mt-1 text-xs text-red-400">{errors.brand.message}</p>}
            </div>
            <div>
              <Label className="text-slate-300">Model</Label>
              <Input
                {...register("model")}
                placeholder="e.g. Huracán EVO"
                className="mt-1.5 border-white/10 bg-white/5 text-white placeholder-zinc-500"
              />
            </div>
            <div>
              <Label className="text-slate-300">Year</Label>
              <Input
                {...register("year", { valueAsNumber: true })}
                type="number"
                min={1990}
                max={new Date().getFullYear() + 1}
                className="mt-1.5 border-white/10 bg-white/5 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Color</Label>
              <Input
                {...register("color")}
                placeholder="e.g. Matte Black"
                className="mt-1.5 border-white/10 bg-white/5 text-white placeholder-zinc-500"
              />
            </div>
            <div>
              <Label className="text-slate-300">Price per Day ($)</Label>
              <Input
                {...register("pricePerDay", { valueAsNumber: true })}
                type="number"
                min={1}
                step={0.01}
                className="mt-1.5 border-white/10 bg-white/5 text-white"
              />
              {errors.pricePerDay && <p className="mt-1 text-xs text-red-400">{errors.pricePerDay.message}</p>}
            </div>
          </div>

          <div>
            <Label className="text-slate-300">Description</Label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe the vehicle..."
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#FDF5AA]/30 resize-none"
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>
        </div>

        {/* Specs */}
        <div className="rounded-2xl border border-white/5 bg-[#113F67] p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Specifications
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label className="text-slate-300">Category</Label>
              <select {...register("category")} className={`mt-1.5 ${selectClass}`}>
                {Object.values(CarCategory).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-slate-300">Transmission</Label>
              <select {...register("transmission")} className={`mt-1.5 ${selectClass}`}>
                {Object.values(Transmission).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-slate-300">Fuel Type</Label>
              <select {...register("fuelType")} className={`mt-1.5 ${selectClass}`}>
                {Object.values(FuelType).map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-slate-300">Seats</Label>
              <Input
                {...register("seats", { valueAsNumber: true })}
                type="number"
                min={1}
                max={20}
                className="mt-1.5 border-white/10 bg-white/5 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Mileage (km, optional)</Label>
              <Input
                {...register("mileage", { valueAsNumber: true })}
                type="number"
                min={0}
                className="mt-1.5 border-white/10 bg-white/5 text-white"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                {...register("available")}
                type="checkbox"
                id="available"
                className="h-4 w-4 rounded border-white/10 bg-white/5 accent-[#FDF5AA]"
              />
              <Label htmlFor="available" className="text-slate-300 cursor-pointer">
                Available for booking
              </Label>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="rounded-2xl border border-white/5 bg-[#113F67] p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Features
          </h2>
          <div className="flex gap-2">
            <Input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              placeholder="e.g. Heated Seats"
              className="border-white/10 bg-white/5 text-white placeholder-zinc-500"
            />
            <Button
              type="button"
              onClick={addFeature}
              variant="outline"
              className="border-white/10 text-slate-200 hover:bg-white/5"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((f, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200"
              >
                {f}
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-slate-400 hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-white/5 bg-[#113F67] p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Images
          </h2>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 p-4 hover:border-white/40 transition-colors">
            <Upload className="h-5 w-5 text-slate-300" />
            <span className="text-sm text-slate-300">
              {uploading ? "Uploading..." : "Click to upload images"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {errors.images && <p className="text-xs text-red-400">{errors.images.message}</p>}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((url, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-lg">
                <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="150px" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || uploading}
            className="bg-[#FDF5AA] text-black font-bold hover:bg-[#e8e090]"
            size="lg"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {mode === "create" ? "Create Car" : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-white/10 text-slate-200 hover:bg-white/5"
            size="lg"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
