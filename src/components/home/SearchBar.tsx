"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Car, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildQueryString } from "@/lib/utils";
import { format } from "date-fns";

const categories = ["All", "ECONOMY", "COMPACT", "SUV", "LUXURY", "SPORTS", "VAN", "ELECTRIC"];

export function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("All");
  const [startType, setStartType] = useState<"text" | "date">("text");
  const [endType, setEndType] = useState<"text" | "date">("text");

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (city) params.city = city;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (category !== "All") params.category = category;

    router.push(`/cars${buildQueryString(params)}`);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#113F67]/90 p-4 backdrop-blur-md shadow-2xl">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Location */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <MapPin className="h-4 w-4 shrink-0 text-slate-300" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City or location"
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
        </div>

        {/* Pickup Date */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <Calendar className="h-4 w-4 shrink-0 text-slate-300" />
          <input
            type={startType}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onFocus={() => setStartType("date")}
            onBlur={() => { if (!startDate) setStartType("text"); }}
            placeholder="Start date"
            min={format(new Date(), "yyyy-MM-dd")}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none [color-scheme:dark]"
          />
        </div>

        {/* Return Date */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <Calendar className="h-4 w-4 shrink-0 text-slate-300" />
          <input
            type={endType}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onFocus={() => setEndType("date")}
            onBlur={() => { if (!endDate) setEndType("text"); }}
            placeholder="End date"
            min={startDate || format(new Date(), "yyyy-MM-dd")}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none [color-scheme:dark]"
          />
        </div>

        {/* Category */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <Car className="h-4 w-4 shrink-0 text-slate-300" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#113F67]">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          onClick={handleSearch}
          className="bg-[#FDF5AA] text-black font-bold hover:bg-[#e8e090] px-8"
          size="lg"
        >
          <Search className="mr-2 h-4 w-4" />
          Find Cars
        </Button>
      </div>
    </div>
  );
}
