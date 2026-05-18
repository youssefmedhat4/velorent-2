"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

// In a real app this would come from a CMS or MDX files.
// For now the content lives here so every post is fully readable.
const posts: Record<
  string,
  {
    category: string;
    categoryColor: string;
    title: string;
    excerpt: string;
    author: string;
    authorRole: string;
    date: string;
    readTime: string;
    content: string;
  }
> = {
  "how-to-choose-the-right-rental-car": {
    category: "Guide",
    categoryColor: "bg-blue-500/10 text-blue-400",
    title: "How to choose the right rental car for any trip",
    excerpt:
      "From weekend city breaks to cross-country road trips — here's how to match the car to the journey.",
    author: "Sofia Reyes",
    authorRole: "Co-founder & CTO",
    date: "May 12, 2025",
    readTime: "6 min read",
    content: `
Choosing a rental car sounds simple until you're staring at a grid of options and realising you have no idea whether you need a compact or an SUV. Here's a framework that makes the decision easy.

## Start with the trip, not the car

Before you look at any vehicle, answer three questions:

1. **How many people?** If it's just you or two people, a compact is almost always the right call. Four or more adults with luggage? You need at least a mid-size or an SUV.
2. **How far are you driving?** A long motorway haul favours comfort and fuel efficiency. A short city trip favours something small and easy to park.
3. **What's the terrain?** City streets and motorways — any car works. Mountain roads, gravel tracks, or winter conditions — you want an SUV with good ground clearance.

## The category breakdown

**Economy & Compact** — Best for solo travellers and couples in cities. Cheap to run, easy to park, and perfectly comfortable for trips under 200 miles.

**Mid-size & Full-size** — The sweet spot for most trips. Enough space for four adults and their bags, without the bulk of an SUV.

**SUV** — Go here when you have more than four people, a lot of luggage, or you're heading somewhere with rough roads. The fuel cost is higher, but the comfort is worth it for long trips.

**Luxury** — When the experience is part of the point. Business travel, special occasions, or when you just want to arrive in style.

**Electric** — Increasingly the best choice for city trips and medium-distance drives. Just plan your charging stops in advance.

## Don't over-spec

The most common mistake is renting more car than you need. A seven-seat SUV for two people is expensive to fuel, harder to park, and no more comfortable than a compact. Match the car to the actual trip.

## Check what's included

Before you confirm, verify:
- Is insurance included, or is it an add-on?
- What's the mileage limit?
- Is there a fuel policy (full-to-full vs. pre-purchase)?
- Are there any young driver surcharges?

At VeloRent, all of this is shown upfront — no surprises at the counter.
    `.trim(),
  },
  "electric-cars-rental-guide": {
    category: "Electric",
    categoryColor: "bg-green-500/10 text-green-400",
    title: "Your first time renting an electric car: what to expect",
    excerpt:
      "Range anxiety is real, but manageable. Everything you need to know before you drive off in an EV.",
    author: "James Okafor",
    authorRole: "Head of Fleet",
    date: "April 28, 2025",
    readTime: "8 min read",
    content: `
Electric vehicles are now a mainstream choice in our fleet, and first-time EV renters often have the same questions. Here's everything you need to know.

## Range anxiety: the real story

Modern EVs have ranges between 200 and 350 miles on a full charge. For most rental trips — a weekend away, a business trip, a city break — that's more than enough. The anxiety comes from not knowing where the chargers are. Solve that before you leave.

## Plan your charging stops

Before you pick up the car, spend 10 minutes on a route planner like ABRP (A Better Route Planner) or simply use the car's built-in navigation. Most modern EVs will automatically route you via chargers if your destination is beyond the car's range.

## Types of chargers

- **Level 2 (AC)** — Found at hotels, car parks, and shopping centres. Adds roughly 20–30 miles per hour. Good for overnight charging.
- **DC Fast Charger** — Found at motorway services and dedicated charging hubs. Adds 100–200 miles in 20–40 minutes. Use these on long journeys.

## Picking up the car

When you collect the car, check the state of charge. We aim to hand over all EVs at 80% or above. The car will show you the estimated range on the dashboard.

## Returning the car

Return the car with at least 20% charge remaining. This is standard practice and avoids any range stress on the final leg of your journey.

## The driving experience

EVs are genuinely more enjoyable to drive than most people expect. The instant torque makes them feel quick off the line, the cabin is quieter, and regenerative braking means you use the brake pedal less. Most people who rent an EV once want to rent one again.
    `.trim(),
  },
  "road-trip-packing-list": {
    category: "Travel",
    categoryColor: "bg-orange-500/10 text-orange-400",
    title: "The ultimate road trip packing list (from people who've done it)",
    excerpt:
      "We asked our team and our most frequent renters what they always bring. The answers might surprise you.",
    author: "Priya Nair",
    authorRole: "Head of Customer Experience",
    date: "April 14, 2025",
    readTime: "5 min read",
    content: `
We surveyed our team and our most frequent renters and asked one question: what do you always bring on a road trip that most people forget? Here's what came back.

## The obvious stuff (that people still forget)

- **Phone charger and a car adapter** — You'd be amazed how many people forget this.
- **Physical map or downloaded offline maps** — Mobile signal disappears in the best places.
- **Sunglasses** — Driving into a low sun without them is genuinely dangerous.

## The less obvious stuff

**A reusable water bottle** — Staying hydrated on long drives keeps you alert. Stopping for bottled water every two hours adds up fast.

**A small first aid kit** — Most rental cars don't have one. A basic kit with plasters, pain relief, and antiseptic wipes weighs almost nothing.

**A portable phone mount** — Using your phone for navigation while it's sitting in a cupholder is both illegal and dangerous. A proper windscreen mount costs £10 and is worth every penny.

**Snacks that don't melt** — Motorway service station food is expensive and mediocre. Pack nuts, dried fruit, and something savoury.

**A blanket** — For passengers who want to sleep, or for an unexpected overnight stop.

## What to leave behind

Heavy luggage you won't need until you arrive. If you're staying somewhere for a week, you don't need your whole wardrobe in the car. Pack light — you'll thank yourself when you're loading and unloading.
    `.trim(),
  },
  "luxury-car-rental-tips": {
    category: "Luxury",
    categoryColor: "bg-purple-500/10 text-purple-400",
    title: "5 things to know before renting a luxury car",
    excerpt:
      "Renting a premium vehicle is a different experience. Here's how to make the most of it.",
    author: "Alex Mercer",
    authorRole: "Co-founder & CEO",
    date: "March 30, 2025",
    readTime: "7 min read",
    content: `
Renting a luxury car is a genuinely different experience from renting a standard vehicle — in good ways and a few ways you should be prepared for. Here's what to know.

## 1. The deposit is higher

Premium vehicles carry higher deposits, typically £500–£2,000 held on your card at pickup. This is released within a few days of return, but make sure your card has the headroom before you arrive.

## 2. Insurance matters more

The cost of repairing a luxury vehicle is significantly higher than a standard car. Check whether your personal car insurance or credit card covers rental vehicles, and what the excess is. If not, consider taking the additional cover.

## 3. Take your time at pickup

Before you drive away, do a thorough walk-around with the rental agent and photograph every panel, wheel, and the interior. This protects you from being charged for pre-existing damage.

## 4. The driving experience is different

Luxury cars are often more powerful and more sensitive than what you're used to. The brakes bite harder, the steering is more responsive, and the acceleration is stronger. Take 10 minutes to get comfortable before you hit the motorway.

## 5. Fuel grade matters

Most luxury and performance vehicles require premium unleaded (95 RON or higher). Using the wrong fuel can cause engine damage and will void your insurance. Check the fuel cap or the manual before you fill up.
    `.trim(),
  },
  "velorent-product-update-spring-2025": {
    category: "Product",
    categoryColor: "bg-[#FDF5AA]/10 text-[#FDF5AA]",
    title: "Spring 2025 product update: wishlist, promo codes, and more",
    excerpt:
      "A look at everything we shipped in Q1 — including the new wishlist feature, promo codes, and a redesigned booking flow.",
    author: "Sofia Reyes",
    authorRole: "Co-founder & CTO",
    date: "March 15, 2025",
    readTime: "4 min read",
    content: `
Q1 was a big quarter for the VeloRent platform. Here's a summary of everything we shipped.

## Wishlist

You can now save cars to a wishlist and pick up your booking exactly where you left off. Save a car, add your preferred dates and pickup location, and come back to it whenever you're ready. Your draft is stored against your account so it's there on any device.

## Promo codes

We've launched a promo code system with four codes available at launch:

- **LOYAL15** — 15% off, no conditions
- **WELCOME20** — 20% off your first booking
- **SAVE50** — £50 off orders over £200
- **WEEK20** — 20% off rentals of 7 days or more

Codes are validated in real time as you build your booking, so you always know your final price before you confirm.

## Redesigned booking flow

The booking form has been rebuilt from scratch. It's faster, clearer, and now shows a live price breakdown as you select your dates and apply promo codes.

## What's next

We're working on a mobile app, a corporate accounts feature, and expanding to three new cities. More on that soon.
    `.trim(),
  },
  "airport-pickup-guide": {
    category: "Guide",
    categoryColor: "bg-blue-500/10 text-blue-400",
    title: "Airport pickup made easy: a step-by-step guide",
    excerpt:
      "Landing in a new city and picking up a rental shouldn't be stressful. Here's exactly what to do.",
    author: "Priya Nair",
    authorRole: "Head of Customer Experience",
    date: "February 28, 2025",
    readTime: "5 min read",
    content: `
Airport car rental pickups have a reputation for being stressful. Long queues, confusing signage, and unexpected charges at the counter. Here's how to make it smooth.

## Before you fly

**Book in advance.** Airport pickup slots fill up, especially on Friday evenings and Sunday afternoons. Book at least 48 hours ahead.

**Save your booking confirmation.** Screenshot it or download it to your phone. You'll need the booking reference at the counter.

**Check the pickup location.** Some rental desks are in the terminal; others require a shuttle bus to an off-site lot. Check your confirmation email for details.

## At the airport

Follow signs for "Car Rental" — most airports have a dedicated zone. If you're going to an off-site lot, look for the rental shuttle bus stop, usually just outside the arrivals hall.

## At the counter

Have ready:
- Your booking confirmation
- Your driving licence (and an IUP if you're driving abroad)
- The credit card you booked with (for the deposit hold)

Decline any add-ons you don't need. Sat-nav, additional drivers, and fuel pre-purchase are all optional.

## The walk-around

Before you accept the keys, walk around the car with the agent and note any existing damage on the condition report. Photograph everything — all four corners, the roof, and the interior. Email the photos to yourself so they're timestamped.

## Returning the car

Return with a full tank (unless you pre-purchased fuel) and allow 30 minutes before your flight for the return process. Most airports have a dedicated return lane — follow the signs.
    `.trim(),
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) notFound();

  // Render simple markdown-like content (headings and paragraphs only)
  const renderContent = (raw: string) => {
    return raw.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <motion.h2
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 mb-4 font-display text-2xl font-black tracking-wider text-white"
          >
            {block.replace("## ", "")}
          </motion.h2>
        );
      }
      const parts = block.split(/(\*\*[^*]+\*\*)/g);
      return (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 leading-relaxed text-slate-400"
        >
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-semibold text-white">
                {part.replace(/\*\*/g, "")}
              </strong>
            ) : (
              part
            )
          )}
        </motion.p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0B2540] pt-20">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/blog"
            className="mb-10 flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
        </motion.div>

        {/* Header */}
        <header className="mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${post.categoryColor}`}
          >
            {post.category}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-4xl font-black leading-tight tracking-wider text-white sm:text-5xl"
          >
            {post.title.toUpperCase()}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 text-lg leading-relaxed text-slate-400"
          >
            {post.excerpt}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex items-center justify-between border-t border-white/5 pt-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF5AA]/10 text-sm font-bold text-[#FDF5AA]">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{post.author}</p>
                <p className="text-xs text-slate-500">{post.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            </div>
          </motion.div>
        </header>

        {/* Hero image placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mb-12 flex h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#0E2D4A]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(88,160,200,0.12)_0%,_transparent_70%)]" />
          <span className="relative font-display text-6xl font-black tracking-widest text-white/10">
            VELO
          </span>
        </motion.div>

        {/* Content */}
        <article>{renderContent(post.content)}</article>

        {/* Footer */}
        <div className="mt-16 border-t border-white/5 pt-10">
          <p className="mb-6 text-sm text-slate-500">More from the blog</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-[#FDF5AA]/30 hover:bg-[#FDF5AA]/10 hover:text-[#FDF5AA]"
          >
            <ArrowLeft className="h-4 w-4" />
            All posts
          </Link>
        </div>
      </div>
    </div>
  );
}
