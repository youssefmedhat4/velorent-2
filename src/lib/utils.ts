import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatDateRange(start: Date | string, end: Date | string): string {
  return `${formatDate(start)} — ${formatDate(end)}`;
}

export function calculateDays(start: Date | string, end: Date | string): number {
  const s = typeof start === "string" ? parseISO(start) : start;
  const e = typeof end === "string" ? parseISO(end) : end;
  return Math.max(1, differenceInDays(e, s));
}

export function calculateTotalPrice(
  pricePerDay: number,
  startDate: Date | string,
  endDate: Date | string
): number {
  return pricePerDay * calculateDays(startDate, endDate);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    CONFIRMED: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    ACTIVE: "text-green-400 bg-green-400/10 border-green-400/20",
    COMPLETED: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
    PAID: "text-green-400 bg-green-400/10 border-green-400/20",
    UNPAID: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    REFUNDED: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    FAILED: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  return map[status] ?? "text-gray-400 bg-gray-400/10 border-gray-400/20";
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }
  const str = searchParams.toString();
  return str ? `?${str}` : "";
}
