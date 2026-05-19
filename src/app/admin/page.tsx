"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Car,
  BookOpen,
  Users,
  DollarSign,
  Activity,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { DashboardStats, RevenueDataPoint } from "@/types";

interface StatsData extends DashboardStats {
  revenueData: RevenueDataPoint[];
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  index,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-white/5 bg-[#113F67] p-4 sm:p-6"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 truncate">
            {title}
          </p>
          <p className="mt-1.5 text-2xl sm:text-3xl font-bold text-white truncate">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400 truncate">{subtitle}</p>}
        </div>
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF5AA]/10">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#FDF5AA]" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs text-green-400">
          <ArrowUpRight className="h-3 w-3" />
          {trend}
        </div>
      )}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 sm:h-32 animate-pulse rounded-2xl bg-[#0E2D4A]" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      subtitle: `${formatCurrency(stats?.monthlyRevenue ?? 0)} this month`,
      icon: DollarSign,
      trend: "Revenue growing",
    },
    {
      title: "Total Bookings",
      value: formatNumber(stats?.totalBookings ?? 0),
      subtitle: `${stats?.todayBookings ?? 0} today`,
      icon: BookOpen,
    },
    {
      title: "Active Rentals",
      value: formatNumber(stats?.activeRentals ?? 0),
      subtitle: "Currently on road",
      icon: Activity,
    },
    {
      title: "Fleet Size",
      value: formatNumber(stats?.totalCars ?? 0),
      subtitle: `${stats?.availableCars ?? 0} available`,
      icon: Car,
    },
    {
      title: "Total Users",
      value: formatNumber(stats?.totalUsers ?? 0),
      subtitle: `${stats?.newUsersThisMonth ?? 0} new this month`,
      icon: Users,
      trend: "Growing community",
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Welcome back. Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5 mb-6 sm:mb-8">
        {kpis.map((kpi, i) => (
          <StatCard key={kpi.title} {...kpi} index={i} />
        ))}
      </div>

      {/* Revenue Chart */}
      {stats?.revenueData && stats.revenueData.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-[#113F67] p-6">
          <h2 className="mb-6 text-lg font-semibold text-white">
            Revenue — Last 6 Months
          </h2>
          <div className="flex items-end gap-3 h-40">
            {stats.revenueData.map((point, i) => {
              const maxRevenue = Math.max(...stats.revenueData.map((p) => p.revenue));
              const height = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end" style={{ height: "120px" }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="w-full rounded-t-lg bg-[#FDF5AA]/20 hover:bg-[#FDF5AA]/30 transition-colors relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap rounded bg-[#113F67] px-2 py-1 text-xs text-white">
                        {formatCurrency(point.revenue)}
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-xs text-slate-400">{point.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
