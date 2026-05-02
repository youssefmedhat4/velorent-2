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

  const isDateBooked = (date: Date) => {
    return bookedRanges.some((range) =>
      isWithinInterval(date, { start: range.start, end: range.end })
    );
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfDay(new Date())) || isDateBooked(date);
  };

  const handleSelect = (range: DateRange | undefined) => {
    onChange(range?.from ?? null, range?.to ?? null);
    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-colors hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#E8FF00]/20"
      >
        <Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
        <div className="flex-1 min-w-0">
          {startDate ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white">{format(startDate, "MMM d, yyyy")}</span>
              {endDate && (
                <>
                  <span className="text-zinc-500">→</span>
                  <span className="text-white">{format(endDate, "MMM d, yyyy")}</span>
                </>
              )}
            </div>
          ) : (
            <span className="text-sm text-zinc-500">Select dates</span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 rounded-2xl border border-white/10 bg-[#111113] p-4 shadow-2xl">
          <style>{`
            .rdp {
              --rdp-accent-color: #E8FF00;
              --rdp-background-color: rgba(232, 255, 0, 0.1);
              --rdp-accent-color-dark: #E8FF00;
              --rdp-background-color-dark: rgba(232, 255, 0, 0.1);
              color: white;
            }
            .rdp-day_selected, .rdp-day_range_start, .rdp-day_range_end {
              background-color: #E8FF00 !important;
              color: black !important;
            }
            .rdp-day_range_middle {
              background-color: rgba(232, 255, 0, 0.15) !important;
              color: white !important;
            }
            .rdp-day:hover:not(.rdp-day_disabled) {
              background-color: rgba(255,255,255,0.1) !important;
            }
            .rdp-day_disabled {
              opacity: 0.3;
            }
            .rdp-caption_label {
              color: white;
              font-weight: 600;
            }
            .rdp-nav_button {
              color: #9ca3af;
            }
            .rdp-head_cell {
              color: #6b7280;
              font-size: 0.75rem;
            }
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
              className="text-xs text-zinc-500 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
