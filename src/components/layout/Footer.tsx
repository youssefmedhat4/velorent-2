"use client";

import Link from "next/link";
import { Car } from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { label: "Twitter", href: "https://x.com/velorent53530", symbol: "𝕏" },
  { label: "Instagram", href: "#", symbol: "◎" },
  { label: "LinkedIn", href: "#", symbol: "in" },
  { label: "GitHub", href: "#", symbol: "⌥" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0B2540]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDF5AA]">
                <Car className="h-5 w-5 text-black" />
              </div>
              <span className="font-display text-xl font-black tracking-widest text-white">
                VELORENT
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Premium car rental for those who demand the extraordinary. Drive the future, today.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ label, href, symbol }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 text-sm font-bold transition-colors hover:border-[#FDF5AA]/30 hover:text-[#FDF5AA]"
                >
                  {symbol}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-white/5 pt-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-semibold text-white">Stay in the fast lane</h3>
              <p className="mt-1 text-sm text-slate-400">
                Get exclusive deals and new arrivals in your inbox.
              </p>
            </div>
            <form className="flex w-full max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#FDF5AA]/50 focus:ring-1 focus:ring-[#FDF5AA]/20"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#FDF5AA] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#e8e090]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-8 text-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} VeloRent. All rights reserved. Built with passion for speed.
          </p>
        </div>
      </div>
    </footer>
  );
}
