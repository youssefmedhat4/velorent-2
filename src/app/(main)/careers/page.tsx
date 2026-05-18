"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, Banknote } from "lucide-react";

const perks = [
  { emoji: "🚗", title: "Free rentals", description: "Use any car in our fleet on your days off." },
  { emoji: "🌍", title: "Remote-friendly", description: "Work from anywhere. We care about output, not office hours." },
  { emoji: "📈", title: "Equity", description: "Everyone who joins early gets a stake in what we're building." },
  { emoji: "🏥", title: "Full health cover", description: "Medical, dental, and vision — fully covered for you and your family." },
  { emoji: "📚", title: "Learning budget", description: "$2,000/year for courses, books, conferences — whatever helps you grow." },
  { emoji: "🏖️", title: "Unlimited PTO", description: "Take the time you need. We trust you to manage your own schedule." },
];

const openRoles = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$120k – $160k",
    description:
      "Own features end-to-end across our Next.js platform. You'll work on everything from booking flows to real-time fleet tracking.",
  },
  {
    title: "Product Designer",
    team: "Design",
    location: "Remote",
    type: "Full-time",
    salary: "$90k – $120k",
    description:
      "Shape the visual language of VeloRent. You'll own the design system and lead UX for our customer-facing products.",
  },
  {
    title: "Fleet Operations Manager",
    team: "Operations",
    location: "New York, NY",
    type: "Full-time",
    salary: "$70k – $90k",
    description:
      "Keep our fleet running at peak condition. You'll manage maintenance schedules, vendor relationships, and vehicle procurement.",
  },
  {
    title: "Customer Experience Lead",
    team: "Support",
    location: "Remote",
    type: "Full-time",
    salary: "$60k – $80k",
    description:
      "Be the voice of VeloRent. You'll handle escalations, build support playbooks, and make sure every customer leaves happy.",
  },
  {
    title: "Growth Marketing Manager",
    team: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$80k – $110k",
    description:
      "Drive acquisition and retention across paid, organic, and partnership channels. Data-driven, creative, and fast-moving.",
  },
];

const teamColors: Record<string, string> = {
  Engineering: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Design: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Operations: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Support: "bg-green-500/10 text-green-400 border-green-500/20",
  Marketing: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export default function CareersPage() {
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
            <span className="text-xs font-medium text-[#FDF5AA]">
              {openRoles.length} open positions
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-6xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Build the
            <br />
            <span className="text-[#FDF5AA]">Future</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300"
          >
            We&apos;re a small team doing big things. If you&apos;re passionate about great
            products and want to work somewhere your contributions actually matter, you&apos;re
            in the right place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <a
              href="#open-roles"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FDF5AA] px-8 py-3 text-sm font-bold text-black transition-colors hover:bg-[#e8e090]"
            >
              See open roles
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="border-t border-white/5 bg-[#0E2D4A] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]"
            >
              Why VeloRent
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-black tracking-wider text-white sm:text-5xl"
            >
              PERKS & BENEFITS
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map(({ emoji, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-white/5 bg-[#113F67] p-6 transition-colors hover:border-[#FDF5AA]/20"
              >
                <span className="text-3xl">{emoji}</span>
                <h3 className="mt-3 font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section id="open-roles" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]"
          >
            We&apos;re hiring
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-black tracking-wider text-white sm:text-5xl"
          >
            OPEN ROLES
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-slate-400"
          >
            {openRoles.length} positions available
          </motion.p>
        </div>

        <div className="space-y-4">
          {openRoles.map(({ title, team, location, type, salary, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group rounded-2xl border border-white/5 bg-[#113F67] p-6 transition-all hover:border-white/10"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${teamColors[team] ?? "bg-white/5 text-slate-400 border-white/10"}`}
                    >
                      {team}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Banknote className="h-3.5 w-3.5" />
                      {salary}
                    </span>
                  </div>
                </div>
                <a
                  href={`mailto:careers@velorent.com?subject=Application: ${encodeURIComponent(title)}`}
                  className="shrink-0 self-start rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#FDF5AA]/30 hover:bg-[#FDF5AA]/10 hover:text-[#FDF5AA]"
                >
                  Apply now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── No role CTA ── */}
      <section className="border-t border-white/5 bg-[#0E2D4A]">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-black tracking-wider text-white sm:text-4xl"
          >
            DON&apos;T SEE YOUR ROLE?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-base text-slate-400"
          >
            We&apos;re always interested in exceptional people. Send us a note and tell us how
            you&apos;d contribute.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <a
              href="mailto:careers@velorent.com?subject=General Application"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FDF5AA] px-8 py-3 text-sm font-bold text-black transition-colors hover:bg-[#e8e090]"
            >
              Get in touch
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
