"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Location } from "@prisma/client";

interface LocationPickerProps {
  locations: Location[];
  value?: string | null;
  onChange: (locationId: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function LocationPicker({
  locations,
  value,
  onChange,
  placeholder = "Select location",
  className,
}: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = locations.find((l) => l.id === value);

  const filtered = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-colors hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#E8FF00]/20"
      >
        <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
        <span className={cn("flex-1 text-sm", selected ? "text-white" : "text-zinc-500")}>
          {selected ? `${selected.name}, ${selected.city}` : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl border border-white/10 bg-[#111113] shadow-2xl">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search locations..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#E8FF00]/30"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            <button
              type="button"
              onClick={() => { onChange(null); setOpen(false); setSearch(""); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:bg-white/5 hover:text-white"
            >
              <span>No preference</span>
            </button>
            {filtered.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => {
                  onChange(location.id);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors",
                  value === location.id
                    ? "bg-[#E8FF00]/10 text-[#E8FF00]"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <MapPin className="h-3 w-3 shrink-0" />
                <div className="text-left">
                  <p className="font-medium">{location.name}</p>
                  <p className="text-xs text-zinc-500">{location.city}</p>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-zinc-500">
                No locations found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
