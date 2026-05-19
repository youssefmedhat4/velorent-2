"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Loader2, CheckCircle2 } from "lucide-react";

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

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error ?? "Failed to subscribe");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2.5">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
        <p className="text-sm text-green-400">
          Subscribed! Check your inbox for a <span className="font-bold">20% off</span> promo code.
        </p>
      </div>
    );
  }

  return (
    <form className="flex w-full max-w-sm flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#FDF5AA]/50 focus:ring-1 focus:ring-[#FDF5AA]/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-[#FDF5AA] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#e8e090] disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Subscribe"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0B2540]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
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
                Subscribe and get <span className="text-[#FDF5AA] font-medium">20% off</span> your first rental.
              </p>
            </div>
            <NewsletterForm />
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
