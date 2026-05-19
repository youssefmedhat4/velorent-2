"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Car,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/cars", label: "Cars", icon: Car },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/careers", label: "Candidates", icon: Briefcase },
];

function SidebarContent({
  collapsed,
  onClose,
}: {
  collapsed: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/5 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#FDF5AA]">
            <Car className="h-4 w-4 text-black" />
          </div>
          {!collapsed && (
            <span className="font-display text-sm font-black tracking-widest text-white">
              VELORENT
            </span>
          )}
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1 text-slate-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive(href, exact)
                ? "bg-[#FDF5AA]/10 text-[#FDF5AA]"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-1 border-t border-white/5 p-3">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all"
        >
          <Home className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Back to Site</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center gap-3 border-b border-white/5 bg-[#0E2D4A] px-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-1.5 text-slate-300 hover:bg-white/5 hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FDF5AA]">
            <Car className="h-3.5 w-3.5 text-black" />
          </div>
          <span className="font-display text-sm font-black tracking-widest text-white">
            VELORENT ADMIN
          </span>
        </div>
      </div>

      {/* ── Mobile drawer overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-[#0E2D4A] lg:hidden"
            >
              <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative hidden h-screen flex-col border-r border-white/5 bg-[#0E2D4A] lg:flex"
      >
        <SidebarContent collapsed={collapsed} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#0E2D4A] text-slate-300 hover:text-white transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </motion.aside>
    </>
  );
}
