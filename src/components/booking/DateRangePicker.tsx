"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format, isWithinInterval, isBefore, startOfDay } from "date-fns";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  bookedRanges?: { start: Date; end: Date }[];
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  bookedRanges = [],
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const selected: DateRange | undefined =
    startDate ? { from: startDate, to: endDate ?? undefined } : undefined;

  const isDateBooked = (date: Date) =>
    bookedRanges.some((range) =>
      isWithinInterval(date, { start: range.start, end: range.end })
    );

  const isDateDisabled = (date: Date) =>
    isBefore(date, startOfDay(new Date())) || isDateBooked(date);

  const handleSelect = (range: DateRange | undefined) => {
    onChange(range?.from ?? null, range?.to ?? null);
    if (range?.from && range?.to) setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl border border-[#34699A]/50 bg-[#113F67]/60 px-4 py-3 text-left transition-colors hover:border-[#58A0C8]/50 focus:outline-none focus:ring-2 focus:ring-[#FDF5AA]/20"
      >
        <Calendar className="h-4 w-4 shrink-0 text-[#58A0C8]" />
        <div className="flex-1 min-w-0">
          {startDate ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#EEF4FA]">{format(startDate, "MMM d, yyyy")}</span>
              {endDate && (
                <>
                  <span className="text-[#7BAAC8]">→</span>
                  <span className="text-[#EEF4FA]">{format(endDate, "MMM d, yyyy")}</span>
                </>
              )}
            </div>
          ) : (
            <span className="text-sm text-[#7BAAC8]">Select dates</span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 rounded-2xl border border-[#34699A]/50 bg-[#0E2D4A] p-4 shadow-2xl">
          <style>{`
            .rdp {
              --rdp-accent-color: #FDF5AA;
              --rdp-background-color: rgba(253,245,170,0.12);
              --rdp-accent-color-dark: #FDF5AA;
              --rdp-background-color-dark: rgba(253,245,170,0.12);
              color: #EEF4FA;
            }
            .rdp-day_selected, .rdp-day_range_start, .rdp-day_range_end {
              background-color: #FDF5AA !important;
              color: #0B2540 !important;
              font-weight: 700;
            }
            .rdp-day_range_middle {
              background-color: rgba(253,245,170,0.15) !important;
              color: #EEF4FA !important;
            }
            .rdp-day:hover:not(.rdp-day_disabled) {
              background-color: rgba(88,160,200,0.2) !important;
            }
            .rdp-day_disabled { opacity: 0.3; }
            .rdp-caption_label { color: #EEF4FA; font-weight: 600; }
            .rdp-nav_button { color: #7BAAC8; }
            .rdp-head_cell { color: #58A0C8; font-size: 0.75rem; }
          `}</style>
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            numberOfMonths={1}
            fromDate={new Date()}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-[#7BAAC8] hover:text-[#EEF4FA]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
