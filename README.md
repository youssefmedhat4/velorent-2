# VeloRent — Premium Car Rental Platform

> Drive the Future. A production-grade, full-stack car rental web application with a cinematic dark UI, 3D car viewer, Stripe payments, and a full admin dashboard.

---

## Quick Links

| Document | Description |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, data flow, component tree |
| [docs/API.md](docs/API.md) | Full API reference for all endpoints |
| [docs/SETUP.md](docs/SETUP.md) | Step-by-step local development setup |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment guide (Vercel + Neon) |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Code conventions, branching, PR process |
| [AGENTS.md](AGENTS.md) | AI agent instructions for working on this codebase |

---

## What is VeloRent?

VeloRent is a premium car rental platform targeting users who want a luxury, high-performance booking experience. Think Lamborghini meets Airbnb — dark, cinematic, fast.

### Core Features

- **3D Car Viewer** — Interactive Three.js model on the homepage hero and every car detail page. Drag to rotate, scroll to zoom. Falls back to an image gallery if no `.glb` model is provided.
- **Full Booking Flow** — Date conflict detection, pickup/dropoff location selection, real-time price calculation, Stripe payment, confirmation email.
- **Admin Dashboard** — KPI cards, 6-month revenue chart, full CRUD for cars/bookings/users, Cloudinary image upload.
- **Auth** — NextAuth v5 with email/password credentials and Google OAuth. JWT sessions with role-based access control (USER / ADMIN).
- **Responsive** — Mobile-first, tested down to 375px.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS v4 + Shadcn/UI | 4.x |
| 3D | Three.js via @react-three/fiber | 9.x |
| ORM | Prisma + @prisma/adapter-pg | 7.x |
| Database | PostgreSQL | 15+ |
| Auth | NextAuth.js | v5 beta |
| Payments | Stripe | 22.x |
| Storage | Cloudinary | 2.x |
| Email | Resend | 6.x |
| State | Zustand | 5.x |
| Forms | React Hook Form + Zod | 7.x / 4.x |
| Animations | Framer Motion | 12.x |
| Maps | Mapbox GL JS | 3.x |

---

## Getting Started

See [docs/SETUP.md](docs/SETUP.md) for the full setup guide.

**TL;DR:**

```bash
# 1. Install
npm install

# 2. Configure — copy and fill in your values
cp .env.example .env.local

# 3. Database
npx prisma migrate dev --name init
npm run db:seed

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Seed credentials:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@velorent.com | Admin1234! |
| User | alice@example.com | User1234! |

---

## Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:generate  # Regenerate Prisma client
npm run db:seed      # Seed with sample data
npm run db:studio    # Open Prisma Studio GUI
```

---

## Project Structure (top level)

```
velorent/
├── docs/               # All documentation
├── prisma/             # Schema, migrations, seed
├── public/             # Static assets (images, 3D models, fonts)
├── src/
│   ├── app/            # Next.js App Router pages + API routes
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Third-party client singletons
│   ├── store/          # Zustand state stores
│   ├── types/          # Shared TypeScript types
│   └── validations/    # Zod schemas
├── AGENTS.md           # AI agent instructions
└── README.md           # This file
```
