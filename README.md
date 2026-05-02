# VeloRent — Premium Car Rental Platform

A production-grade, full-stack car rental web application built with Next.js 16, TypeScript, Prisma 7, and a cinematic dark UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, Shadcn/UI |
| 3D | Three.js via @react-three/fiber + @react-three/drei |
| ORM | Prisma 7 + @prisma/adapter-pg |
| Database | PostgreSQL |
| Auth | NextAuth.js v5 (Credentials + Google OAuth) |
| Payments | Stripe |
| Storage | Cloudinary |
| Email | Resend |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Maps | Mapbox GL JS |

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL database (local, [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/velorent"

# NextAuth
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Resend
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN="pk...."
```

### 4. Set up the database

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed with sample data
npm run db:seed
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Seed Credentials

After running `npm run db:seed`:

| Role | Email | Password |
|---|---|---|
| Admin | admin@velorent.com | Admin1234! |
| User | alice@example.com | User1234! |

---

## Project Structure

```
velorent/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data seeder
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login & Register pages
│   │   ├── (main)/            # Public-facing pages
│   │   │   ├── page.tsx       # Homepage with 3D hero
│   │   │   ├── cars/          # Browse + Car detail
│   │   │   ├── bookings/      # User bookings
│   │   │   └── profile/       # User profile
│   │   ├── admin/             # Admin dashboard
│   │   └── api/               # API route handlers
│   ├── components/
│   │   ├── cars/              # Car3DViewer, CarCard, CarGrid, CarFilters
│   │   ├── booking/           # BookingForm, DateRangePicker, LocationPicker
│   │   ├── home/              # HeroSection, SearchBar, FeaturedCars, StatsSection
│   │   ├── payments/          # StripeCheckout
│   │   ├── layout/            # Navbar, Footer, AdminSidebar
│   │   ├── admin/             # CarForm
│   │   └── shared/            # LoadingSpinner, ErrorBoundary, StarRating
│   ├── hooks/                 # useCars, useBooking, useAuth
│   ├── lib/                   # prisma, auth, stripe, cloudinary, resend, mapbox, utils
│   ├── store/                 # Zustand: bookingStore, filterStore
│   ├── types/                 # Shared TypeScript types
│   └── validations/           # Zod schemas
└── proxy.ts                   # Auth protection (Next.js 16 proxy)
```

---

## Key Features

- **3D Car Viewer** — Interactive Three.js model on homepage and car detail pages. Drag to rotate, scroll to zoom. Falls back to image gallery if no `.glb` model is provided.
- **Booking Flow** — Date conflict detection, Stripe payment integration, confirmation email via Resend.
- **Admin Dashboard** — KPI cards, revenue chart, full CRUD for cars/bookings/users, Cloudinary image upload.
- **Auth** — NextAuth v5 with credentials + Google OAuth, JWT sessions, role-based access control.
- **Responsive** — Mobile-first, works on 375px+.

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:generate  # Regenerate Prisma client
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

---

## Stripe Webhook (local dev)

```bash
# Install Stripe CLI, then:
stripe listen --forward-to localhost:3000/api/payments/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## Deployment

The app is ready to deploy on **Vercel**:

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Set `DATABASE_URL` to your hosted PostgreSQL (Neon/Supabase/Railway)
5. Deploy

For the Stripe webhook in production, create a webhook endpoint in the Stripe dashboard pointing to `https://yourdomain.com/api/payments/webhook`.
