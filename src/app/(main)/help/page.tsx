"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Search, ArrowRight, MessageCircle, Phone, Mail } from "lucide-react";

const categories = [
  {
    title: "Booking & Reservations",
    icon: "📅",
    faqs: [
      {
        q: "How do I make a booking?",
        a: "Browse our fleet at /cars, select a vehicle, choose your dates and pickup/dropoff locations, then click 'Reserve Now'. You'll be taken to the booking detail page to complete payment.",
      },
      {
        q: "Can I modify my booking after it's confirmed?",
        a: "Currently, modifications require cancelling and rebooking. Contact our support team if you need help with this — we'll do our best to accommodate changes.",
      },
      {
        q: "How far in advance can I book?",
        a: "You can book up to 12 months in advance. We recommend booking early for peak seasons and popular vehicles.",
      },
      {
        q: "What happens if the car I want is unavailable?",
        a: "The date picker automatically disables dates that are already booked. If a car shows as unavailable, try different dates or browse similar vehicles in the same category.",
      },
      {
        q: "Is there a minimum rental period?",
        a: "Our minimum rental period is 1 day. There's no maximum — long-term rentals are available and often come with better daily rates.",
      },
    ],
  },
  {
    title: "Payments & Pricing",
    icon: "💳",
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as digital wallets. All payments are processed securely.",
      },
      {
        q: "When am I charged?",
        a: "You're charged at the time of booking confirmation. The full rental amount is collected upfront.",
      },
      {
        q: "What is your refund policy?",
        a: "Cancellations made more than 48 hours before the pickup date receive a full refund. Cancellations within 48 hours are subject to a 50% cancellation fee. No-shows are non-refundable.",
      },
      {
        q: "Are there any hidden fees?",
        a: "The price shown is the total rental cost. Additional charges may apply for fuel (if not returned full), late returns, or damage beyond normal wear and tear.",
      },
      {
        q: "Do you offer promo codes or discounts?",
        a: "Yes! We run seasonal promotions. Enter your promo code at checkout to apply the discount. Sign up for our newsletter to be the first to know about deals.",
      },
    ],
  },
  {
    title: "Pickup & Return",
    icon: "🚗",
    faqs: [
      {
        q: "What do I need to bring for pickup?",
        a: "Bring a valid driver's license, the credit card used for booking, and a second form of ID. International renters should also bring their passport.",
      },
      {
        q: "What are your pickup hours?",
        a: "Pickup hours vary by location. Most locations are open 8am–8pm daily. Check your booking confirmation for the specific hours of your pickup location.",
      },
      {
        q: "Can someone else pick up the car on my behalf?",
        a: "The primary driver must be present at pickup with their own valid license. Additional drivers can be added at no extra cost — they must also be present at pickup.",
      },
      {
        q: "What happens if I return the car late?",
        a: "Late returns are charged at the daily rate pro-rated by the hour. Please contact us as soon as possible if you anticipate a late return.",
      },
      {
        q: "Can I return the car to a different location?",
        a: "One-way rentals are available between our locations. Select different pickup and dropoff locations when booking. A one-way fee may apply.",
      },
    ],
  },
  {
    title: "Account & Profile",
    icon: "👤",
    faqs: [
      {
        q: "How do I create an account?",
        a: "Click 'Get Started' in the top navigation and fill in your name, email, and password. You can also sign up instantly with your Google account.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "On the login page, click 'Forgot password' and enter your email. You'll receive a reset link within a few minutes. Check your spam folder if you don't see it.",
      },
      {
        q: "How do I update my personal information?",
        a: "Go to your Profile page (click your name in the top navigation). You can update your name, phone number, and password from there.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Contact our support team at support@velorent.com and we'll process your account deletion within 30 days, in accordance with our privacy policy.",
      },
    ],
  },
  {
    title: "Insurance & Damage",
    icon: "🛡️",
    faqs: [
      {
        q: "Is insurance included in the rental price?",
        a: "Basic third-party liability insurance is included in all rentals. Comprehensive coverage (CDW) is available as an add-on at checkout.",
      },
      {
        q: "What should I do if I'm in an accident?",
        a: "Ensure everyone is safe first. Call emergency services if needed. Then contact us immediately at our 24/7 emergency line. Do not admit fault or sign any documents at the scene.",
      },
      {
        q: "What counts as normal wear and tear?",
        a: "Minor scratches under 2cm, small stone chips on the windscreen, and light interior wear are considered normal. Larger damage, dents, or interior stains are chargeable.",
      },
      {
        q: "How is damage assessed at return?",
        a: "Our staff conduct a full inspection at return. We recommend taking photos of the vehicle before and after your rental as a record.",
      },
    ],
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border-b border-[#34699A]/20 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#58A0C8] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-relaxed text-slate-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0].title);

  const filtered = search.trim()
    ? categories.flatMap((c) =>
        c.faqs
          .filter(
            (f) =>
              f.q.toLowerCase().includes(search.toLowerCase()) ||
              f.a.toLowerCase().includes(search.toLowerCase())
          )
          .map((f) => ({ ...f, category: c.title }))
      )
    : null;

  const activeData = categories.find((c) => c.title === activeCategory)!;

  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#34699A]/20 bg-[#0E2D4A] py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,160,200,0.08)_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]"
          >
            Support
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl font-black uppercase text-white sm:text-6xl"
          >
            Help Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-400"
          >
            Find answers to common questions about renting with VeloRent.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative mt-8 mx-auto max-w-lg"
          >
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-xl border border-[#34699A]/40 bg-[#113F67]/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-[#FDF5AA]/30 focus:ring-1 focus:ring-[#FDF5AA]/10"
            />
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Search results */}
        {search.trim() ? (
          <div>
            <p className="mb-6 text-sm text-slate-400">
              {filtered?.length ?? 0} result{filtered?.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
            {filtered?.length === 0 ? (
              <div className="rounded-2xl border border-[#34699A]/20 bg-[#113F67]/30 p-12 text-center">
                <p className="text-slate-400">No results found. Try different keywords or</p>
                <Link href="/contact" className="mt-2 inline-flex items-center gap-1 text-[#FDF5AA] hover:underline text-sm">
                  contact our support team <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#34699A]/20 bg-[#113F67]/30 divide-y divide-[#34699A]/10 overflow-hidden">
                {filtered?.map((item, i) => (
                  <div key={i} className="p-5">
                    <p className="mb-1 text-xs text-[#58A0C8]">{item.category}</p>
                    <FaqItem q={item.q} a={item.a} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-8">
            {/* Category sidebar */}
            <div className="hidden w-56 shrink-0 lg:block">
              <div className="sticky top-24 space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.title}
                    onClick={() => setActiveCategory(cat.title)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                      activeCategory === cat.title
                        ? "bg-[#FDF5AA]/10 text-[#FDF5AA] font-medium"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile category select */}
            <div className="mb-6 lg:hidden w-full">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full rounded-xl border border-[#34699A]/40 bg-[#113F67]/60 px-4 py-3 text-sm text-white outline-none"
              >
                {categories.map((c) => (
                  <option key={c.title} value={c.title} className="bg-[#0E2D4A]">
                    {c.icon} {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* FAQ list */}
            <div className="flex-1 min-w-0">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#34699A]/20 bg-[#113F67]/30 px-6 py-2"
              >
                <h2 className="py-4 text-lg font-bold text-white border-b border-[#34699A]/20 mb-2">
                  {activeData.icon} {activeData.title}
                </h2>
                {activeData.faqs.map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
                ))}
              </motion.div>
            </div>
          </div>
        )}

        {/* Still need help */}
        <div className="mt-16 rounded-2xl border border-[#34699A]/20 bg-[#0E2D4A] p-8">
          <h2 className="text-xl font-bold text-white text-center mb-2">Still need help?</h2>
          <p className="text-slate-400 text-center text-sm mb-8">Our support team is available 7 days a week.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: MessageCircle, label: "Live Chat", desc: "Chat with us now", href: "/contact", cta: "Start chat" },
              { icon: Mail, label: "Email Support", desc: "support@velorent.com", href: "mailto:support@velorent.com", cta: "Send email" },
              { icon: Phone, label: "Phone", desc: "+1 (800) VELO-RENT", href: "tel:+18008356736", cta: "Call us" },
            ].map(({ icon: Icon, label, desc, href, cta }) => (
              <a
                key={label}
                href={href}
                className="flex flex-col items-center gap-3 rounded-xl border border-[#34699A]/30 bg-[#113F67]/40 p-5 text-center transition-colors hover:border-[#FDF5AA]/30 hover:bg-[#FDF5AA]/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF5AA]/10">
                  <Icon className="h-5 w-5 text-[#FDF5AA]" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
                <span className="text-xs text-[#58A0C8]">{cta} →</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
