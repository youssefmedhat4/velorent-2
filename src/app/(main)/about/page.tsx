"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe, Users } from "lucide-react";

const stats = [
  { value: "15,000+", label: "Rentals completed" },
  { value: "98%", label: "Customer satisfaction" },
  { value: "5", label: "Cities covered" },
  { value: "50+", label: "Vehicles in fleet" },
];

const values = [
  {
    icon: Zap,
    title: "Speed without compromise",
    description:
      "Every car in our fleet is hand-selected for performance, comfort, and reliability. We don't do average.",
  },
  {
    icon: Shield,
    title: "Transparent pricing",
    description:
      "No hidden fees, no surprise charges. The price you see is the price you pay — full stop.",
  },
  {
    icon: Globe,
    title: "Built for everywhere",
    description:
      "From city centres to airport pickups, our network of locations means a VeloRent is always close.",
  },
  {
    icon: Users,
    title: "People first",
    description:
      "Our support team is real humans who actually care. Reach us any time — we're here when it matters.",
  },
];

const team = [
  {
    name: "Alex Mercer",
    role: "Co-founder & CEO",
    bio: "Former automotive engineer turned entrepreneur. Obsessed with the intersection of technology and driving.",
    gradient: "from-[#FDF5AA]/20 to-[#0B2540]/40",
  },
  {
    name: "Sofia Reyes",
    role: "Co-founder & CTO",
    bio: "Built the platform from scratch. Believes great software should be invisible — it just works.",
    gradient: "from-[#00D4FF]/20 to-[#0B2540]/40",
  },
  {
    name: "James Okafor",
    role: "Head of Fleet",
    bio: "15 years in automotive. If it has wheels, James knows it. Every car in our fleet has his personal sign-off.",
    gradient: "from-[#FDF5AA]/10 to-[#00D4FF]/10",
  },
  {
    name: "Priya Nair",
    role: "Head of Customer Experience",
    bio: "Turned our support from a cost centre into our biggest competitive advantage.",
    gradient: "from-[#00D4FF]/15 to-[#FDF5AA]/10",
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]"
    >
      {children}
    </motion.p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="font-display text-4xl font-black tracking-wider text-white sm:text-5xl"
    >
      {children}
    </motion.h2>
  );
}

export default function AboutPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-32 sm:px-6 lg:px-8">
        {/* Background */}
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
            <span className="text-xs font-medium text-[#FDF5AA]">Our story</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-6xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Driven by
            <br />
            <span className="text-[#FDF5AA]">Passion</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300"
          >
            VeloRent was born from a simple frustration: renting a car shouldn&apos;t feel like
            a punishment. We set out to build the rental experience we always wanted — fast,
            honest, and genuinely enjoyable.
          </motion.p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="border-y border-white/5 bg-[#0E2D4A] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map(({ value, label }, i) => (
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

      {/* ── Mission ── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionLabel>Our mission</SectionLabel>
            <SectionHeading>
              REDEFINING
              <br />
              CAR RENTAL
            </SectionHeading>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-base leading-relaxed text-slate-400"
            >
              The traditional car rental industry is broken. Long queues, confusing contracts,
              hidden fees, and fleets full of cars nobody actually wants to drive.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-base leading-relaxed text-slate-400"
            >
              We built VeloRent to fix that. Every decision we make — from the cars we stock to
              the way we write our pricing — is guided by one question: would we be happy with
              this if we were the customer?
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/cars"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FDF5AA] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[#e8e090]"
              >
                Browse our fleet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-80 overflow-hidden rounded-2xl border border-white/5 bg-[#113F67] lg:h-96"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,160,200,0.15)_0%,_transparent_70%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FDF5AA]/10">
                  <Zap className="h-10 w-10 text-[#FDF5AA]" />
                </div>
                <p className="font-display text-2xl font-black tracking-widest text-white">
                  VELORENT
                </p>
                <p className="mt-1 text-sm text-slate-500">Est. 2024</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="border-t border-white/5 bg-[#0E2D4A] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <SectionLabel>What we stand for</SectionLabel>
            <SectionHeading>OUR VALUES</SectionHeading>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-white/5 bg-[#113F67] p-6 transition-colors hover:border-[#FDF5AA]/20"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDF5AA]/10">
                  <Icon className="h-6 w-6 text-[#FDF5AA]" />
                </div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <SectionLabel>The people behind it</SectionLabel>
          <SectionHeading>MEET THE TEAM</SectionHeading>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map(({ name, role, bio, gradient }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/5 bg-[#113F67] p-6 transition-colors hover:border-white/10"
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-lg font-bold text-white`}
              >
                {name.charAt(0)}
              </div>
              <h3 className="font-semibold text-white">{name}</h3>
              <p className="mb-3 text-xs text-[#FDF5AA]">{role}</p>
              <p className="text-sm leading-relaxed text-slate-400">{bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/5 bg-[#0E2D4A]">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-black tracking-wider text-white sm:text-5xl"
          >
            WANT TO JOIN US?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-base text-slate-400"
          >
            We&apos;re always looking for people who care deeply about craft and customer
            experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/careers"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#FDF5AA] px-8 py-3 text-sm font-bold text-black transition-colors hover:bg-[#e8e090]"
            >
              See open roles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
