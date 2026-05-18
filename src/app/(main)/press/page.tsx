"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";

const facts = [
  { value: "2024", label: "Founded" },
  { value: "$2.4M", label: "Seed funding" },
  { value: "5", label: "Cities" },
  { value: "50+", label: "Vehicles" },
];

const coverage = [
  {
    outlet: "TechCrunch",
    date: "March 2025",
    headline: "VeloRent is quietly building the Airbnb of premium car rental",
    url: "#",
    logo: "TC",
    logoColor: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  {
    outlet: "The Verge",
    date: "February 2025",
    headline: "How VeloRent's booking experience puts traditional rental companies to shame",
    url: "#",
    logo: "TV",
    logoColor: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    outlet: "Forbes",
    date: "January 2025",
    headline: "30 Under 30: The founders reimagining how we rent cars",
    url: "#",
    logo: "F",
    logoColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    outlet: "Product Hunt",
    date: "December 2024",
    headline: "#1 Product of the Day — VeloRent launches to the public",
    url: "#",
    logo: "PH",
    logoColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    outlet: "Wired",
    date: "November 2024",
    headline: "The startup that wants to make renting a car feel like using Uber",
    url: "#",
    logo: "W",
    logoColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    outlet: "Business Insider",
    date: "October 2024",
    headline: "VeloRent raises seed round to expand its premium rental fleet",
    url: "#",
    logo: "BI",
    logoColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
];

const assets = [
  { name: "Logo pack (SVG + PNG)", size: "2.4 MB", type: "ZIP" },
  { name: "Brand guidelines", size: "4.1 MB", type: "PDF" },
  { name: "Product screenshots", size: "18 MB", type: "ZIP" },
  { name: "Founder headshots", size: "12 MB", type: "ZIP" },
];

export default function PressPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-32 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,160,200,0.10)_0%,_transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(88,160,200,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(88,160,200,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#58A0C8]/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FDF5AA]/20 bg-[#FDF5AA]/5 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FDF5AA]" />
            <span className="text-xs font-medium text-[#FDF5AA]">Media & press</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-6xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            In the
            <br />
            <span className="text-[#FDF5AA]">News</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300"
          >
            Resources for journalists and media professionals. For press enquiries, reach us at{" "}
            <a
              href="mailto:press@velorent.com"
              className="text-[#FDF5AA] underline-offset-4 hover:underline"
            >
              press@velorent.com
            </a>
          </motion.p>
        </div>
      </section>

      {/* ── Quick facts ── */}
      <section ref={statsRef} className="border-y border-white/5 bg-[#0E2D4A] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {facts.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-4xl font-black text-[#FDF5AA] sm:text-5xl">
                  {value}
                </p>
                <p className="mt-2 text-sm text-slate-400">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coverage ── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]"
          >
            Recent coverage
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-black tracking-wider text-white sm:text-5xl"
          >
            AS SEEN IN
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coverage.map(({ outlet, date, headline, url, logo, logoColor }, i) => (
            <motion.a
              key={headline}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-[#113F67] p-6 transition-all hover:border-white/10"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold ${logoColor}`}
                  >
                    {logo}
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-600 transition-colors group-hover:text-[#FDF5AA]" />
                </div>
                <p className="text-base font-medium leading-snug text-white">{headline}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-sm font-semibold text-slate-300">{outlet}</span>
                <span className="text-xs text-slate-500">{date}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── Media kit ── */}
      <section className="border-t border-white/5 bg-[#0E2D4A] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]"
              >
                Downloads
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl font-black tracking-wider text-white sm:text-5xl"
              >
                MEDIA KIT
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-base leading-relaxed text-slate-400"
              >
                Everything you need to write about VeloRent — logos, screenshots, brand
                guidelines, and founder photos. All assets are free to use for editorial
                purposes.
              </motion.p>
            </div>

            <div className="space-y-3">
              {assets.map(({ name, size, type }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-[#113F67] px-5 py-4 transition-colors hover:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FDF5AA]/10 text-xs font-bold text-[#FDF5AA]">
                      {type}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{name}</p>
                      <p className="text-xs text-slate-500">{size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-[#FDF5AA]/30 hover:text-[#FDF5AA]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-black tracking-wider text-white sm:text-4xl"
          >
            PRESS ENQUIRIES
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-base text-slate-400"
          >
            We aim to respond to all media requests within 24 hours.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <a
              href="mailto:press@velorent.com"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FDF5AA] px-8 py-3 text-sm font-bold text-black transition-colors hover:bg-[#e8e090]"
            >
              press@velorent.com
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
