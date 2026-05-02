"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, Car } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & Filter",
    description:
      "Explore our curated fleet of premium vehicles. Filter by category, price, location, and availability.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book & Pay",
    description:
      "Select your dates, choose pickup and drop-off locations, and complete your secure payment in minutes.",
  },
  {
    icon: Car,
    step: "03",
    title: "Drive & Enjoy",
    description:
      "Pick up your vehicle and hit the road. Our 24/7 support team is always available if you need assistance.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest text-[#E8FF00]"
          >
            Simple Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 font-display text-4xl font-black uppercase text-white"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-zinc-500 max-w-md mx-auto"
          >
            Getting behind the wheel of your dream car takes just three simple steps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-10 left-full hidden w-full -translate-x-1/2 border-t border-dashed border-white/10 md:block" />
              )}

              <div className="rounded-2xl border border-white/5 bg-[#111113] p-8 transition-colors hover:border-white/10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8FF00]/10">
                    <step.icon className="h-6 w-6 text-[#E8FF00]" />
                  </div>
                  <span className="font-display text-5xl font-black text-white/5">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
