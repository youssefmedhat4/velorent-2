"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const posts = [
  {
    slug: "how-to-choose-the-right-rental-car",
    category: "Guide",
    categoryColor: "bg-blue-500/10 text-blue-400",
    title: "How to choose the right rental car for any trip",
    excerpt:
      "From weekend city breaks to cross-country road trips — here's how to match the car to the journey and avoid paying for more than you need.",
    author: "Sofia Reyes",
    date: "May 12, 2025",
    readTime: "6 min read",
    featured: true,
  },
  {
    slug: "electric-cars-rental-guide",
    category: "Electric",
    categoryColor: "bg-green-500/10 text-green-400",
    title: "Your first time renting an electric car: what to expect",
    excerpt:
      "Range anxiety is real, but manageable. We break down everything you need to know before you drive off in an EV for the first time.",
    author: "James Okafor",
    date: "April 28, 2025",
    readTime: "8 min read",
    featured: false,
  },
  {
    slug: "road-trip-packing-list",
    category: "Travel",
    categoryColor: "bg-orange-500/10 text-orange-400",
    title: "The ultimate road trip packing list (from people who've done it)",
    excerpt:
      "We asked our team and our most frequent renters what they always bring. The answers might surprise you.",
    author: "Priya Nair",
    date: "April 14, 2025",
    readTime: "5 min read",
    featured: false,
  },
  {
    slug: "luxury-car-rental-tips",
    category: "Luxury",
    categoryColor: "bg-purple-500/10 text-purple-400",
    title: "5 things to know before renting a luxury car",
    excerpt:
      "Renting a premium vehicle is a different experience. Here's how to make the most of it — and avoid the common pitfalls.",
    author: "Alex Mercer",
    date: "March 30, 2025",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "velorent-product-update-spring-2025",
    category: "Product",
    categoryColor: "bg-[#FDF5AA]/10 text-[#FDF5AA]",
    title: "Spring 2025 product update: wishlist, promo codes, and more",
    excerpt:
      "A look at everything we shipped in Q1 — including the new wishlist feature, promo codes, and a completely redesigned booking flow.",
    author: "Sofia Reyes",
    date: "March 15, 2025",
    readTime: "4 min read",
    featured: false,
  },
  {
    slug: "airport-pickup-guide",
    category: "Guide",
    categoryColor: "bg-blue-500/10 text-blue-400",
    title: "Airport pickup made easy: a step-by-step guide",
    excerpt:
      "Landing in a new city and picking up a rental shouldn't be stressful. Here's exactly what to do from the moment your flight lands.",
    author: "Priya Nair",
    date: "February 28, 2025",
    readTime: "5 min read",
    featured: false,
  },
];

const featured = posts.find((p) => p.featured);
const rest = posts.filter((p) => !p.featured);

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
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
            <span className="text-xs font-medium text-[#FDF5AA]">From the team</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-6xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            The Velo
            <br />
            <span className="text-[#FDF5AA]">Journal</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300"
          >
            Stories, guides, and product updates from the people building VeloRent.
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* ── Featured post ── */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]">
              Featured
            </p>
            <Link
              href={`/blog/${featured.slug}`}
              className="group block overflow-hidden rounded-2xl border border-white/5 bg-[#113F67] transition-all hover:border-white/10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#0E2D4A] lg:h-auto lg:min-h-[320px]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,160,200,0.12)_0%,_transparent_70%)]" />
                  <span className="relative font-display text-6xl font-black tracking-widest text-white/10">
                    VELO
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <span
                    className={`mb-4 inline-block self-start rounded-full px-3 py-1 text-xs font-medium ${featured.categoryColor}`}
                  >
                    {featured.category}
                  </span>
                  <h2 className="text-2xl font-bold leading-snug text-white transition-colors group-hover:text-[#FDF5AA] lg:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-400">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDF5AA]/10 text-xs font-bold text-[#FDF5AA]">
                        {featured.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{featured.author}</p>
                        <p className="text-xs text-slate-500">{featured.date}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {featured.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* ── All posts ── */}
        <div>
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#FDF5AA]">
            All posts
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map(({ slug, category, categoryColor, title, excerpt, author, date, readTime }, i) => (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  href={`/blog/${slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#113F67] transition-all hover:border-white/10"
                >
                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-[#0E2D4A]">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,160,200,0.08)_0%,_transparent_70%)]" />
                    <span className="relative font-display text-3xl font-black tracking-widest text-white/10">
                      VELO
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span
                      className={`mb-3 inline-block self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColor}`}
                    >
                      {category}
                    </span>
                    <h3 className="flex-1 text-base font-semibold leading-snug text-white transition-colors group-hover:text-[#FDF5AA]">
                      {title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
                      {excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FDF5AA]/10 text-xs font-bold text-[#FDF5AA]">
                          {author.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-400">{author}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
