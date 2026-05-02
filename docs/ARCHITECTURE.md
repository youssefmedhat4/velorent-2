# VeloRent — Architecture

## Overview

VeloRent is a monolithic Next.js application using the App Router. There is no separate backend server — all API logic lives in Next.js Route Handlers. The database is PostgreSQL accessed via Prisma 7 with the `@prisma/adapter-pg` driver adapter.

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│  React 19 + Framer Motion + Three.js + Zustand + RHF        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / RSC
┌──────────────────────────▼──────────────────────────────────┐
│                    Next.js 16 (Turbopack)                    │
│                                                             │
│  ┌─────────────────┐   ┌──────────────────────────────────┐ │
│  │  App Router     │   │  Route Handlers (API)            │ │
│  │  Server + Client│   │  /api/cars, /api/bookings, ...   │ │
│  │  Components     │   │  Auth via NextAuth v5            │ │
│  └────────┬────────┘   └──────────────┬───────────────────┘ │
│           │                           │                     │
│  ┌────────▼───────────────────────────▼───────────────────┐ │
│  │                  src/lib/ (singletons)                  │ │
│  │  prisma  stripe  cloudinary  resend  mapbox  auth       │ │
│  └────────────────────────┬────────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼──────┐  ┌─────────▼──────┐  ┌────────▼───────┐
│  PostgreSQL  │  │    Stripe      │  │  Cloudinary    │
│  (local /    │  │  (payments)    │  │  (images)      │
│   Neon/      │  └────────────────┘  └────────────────┘
│   Supabase)  │
└──────────────┘
        │
┌───────▼──────┐  ┌─────────────────┐
│   Resend     │  │   Mapbox        │
│  (emails)    │  │  (location UI)  │
└──────────────┘  └─────────────────┘
```

---

## Directory Structure

```
src/
├── app/
│   ├── (auth)/                   # Route group — no shared layout
│   │   ├── login/page.tsx        # Login page (Client Component + Suspense)
│   │   └── register/page.tsx     # Register page
│   │
│   ├── (main)/                   # Route group — Navbar + Footer layout
│   │   ├── layout.tsx            # Wraps all public pages
│   │   ├── page.tsx              # Homepage (/ route)
│   │   ├── cars/
│   │   │   ├── page.tsx          # Browse & filter cars
│   │   │   └── [id]/page.tsx     # Car detail + 3D viewer + booking form
│   │   ├── bookings/
│   │   │   ├── page.tsx          # User's bookings (tabbed)
│   │   │   └── [id]/page.tsx     # Booking detail + payment + review
│   │   └── profile/page.tsx      # User profile settings
│   │
│   ├── admin/                    # Admin section — AdminSidebar layout
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard with KPIs + revenue chart
│   │   ├── cars/                 # Car management (table + CRUD)
│   │   ├── bookings/             # Booking management
│   │   └── users/                # User management
│   │
│   ├── api/                      # Route Handlers
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # NextAuth handler
│   │   │   └── register/         # POST — create account
│   │   ├── cars/
│   │   │   ├── route.ts          # GET (list+filter), POST (create)
│   │   │   └── [id]/
│   │   │       ├── route.ts      # GET, PATCH, DELETE
│   │   │       └── availability/ # GET — booked date ranges
│   │   ├── bookings/
│   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   └── [id]/route.ts     # GET, PATCH, DELETE
│   │   ├── payments/
│   │   │   ├── create-intent/    # POST — Stripe PaymentIntent
│   │   │   └── webhook/          # POST — Stripe webhook
│   │   ├── reviews/route.ts      # GET (by car), POST (submit)
│   │   ├── upload/route.ts       # POST — Cloudinary upload
│   │   ├── profile/route.ts      # GET, PATCH
│   │   └── admin/
│   │       ├── stats/route.ts    # GET — dashboard KPIs
│   │       └── users/            # GET (list), PATCH [id] (role)
│   │
│   ├── layout.tsx                # Root layout — SessionProvider
│   ├── globals.css               # Tailwind + custom CSS
│   ├── not-found.tsx             # 404 page
│   └── error.tsx                 # Global error boundary
│
├── components/
│   ├── cars/
│   │   ├── Car3DViewer.tsx       # Three.js canvas — loads .glb, OrbitControls
│   │   ├── CarImageGallery.tsx   # Fallback image gallery with lightbox
│   │   ├── CarCard.tsx           # Grid card with hover glow
│   │   ├── CarGrid.tsx           # Responsive grid + empty state
│   │   └── CarFilters.tsx        # Sidebar filters (category, price, specs)
│   │
│   ├── booking/
│   │   ├── BookingForm.tsx       # RHF form — dates, locations, price calc
│   │   ├── DateRangePicker.tsx   # react-day-picker with booked dates disabled
│   │   ├── LocationPicker.tsx    # Searchable dropdown from DB locations
│   │   └── BookingCard.tsx       # Booking list item with status badge
│   │
│   ├── home/
│   │   ├── HeroSection.tsx       # Fullscreen 3D hero + animated text
│   │   ├── SearchBar.tsx         # Quick search overlay
│   │   ├── FeaturedCars.tsx      # Horizontal scroll carousel
│   │   ├── StatsSection.tsx      # Animated counters
│   │   └── HowItWorks.tsx        # 3-step section
│   │
│   ├── payments/
│   │   └── StripeCheckout.tsx    # Stripe Elements payment form
│   │
│   ├── layout/
│   │   ├── Navbar.tsx            # Sticky nav with user menu dropdown
│   │   ├── Footer.tsx            # Links + newsletter
│   │   └── AdminSidebar.tsx      # Collapsible sidebar with active route
│   │
│   ├── admin/
│   │   └── CarForm.tsx           # Full car create/edit form
│   │
│   ├── shared/
│   │   ├── LoadingSpinner.tsx    # Spinner + PageLoader
│   │   ├── ErrorBoundary.tsx     # React class error boundary
│   │   └── StarRating.tsx        # Interactive + display star rating
│   │
│   └── ui/                       # Shadcn primitives (button, card, dialog, etc.)
│
├── hooks/
│   ├── useCars.ts                # Fetches /api/cars with filters
│   ├── useBooking.ts             # Fetches /api/bookings, useBookedDates
│   └── useAuth.ts                # Wraps useSession with helpers
│
├── lib/
│   ├── prisma.ts                 # PrismaClient singleton (adapter-pg)
│   ├── auth.ts                   # NextAuth config (credentials + Google)
│   ├── stripe.ts                 # Stripe client singleton
│   ├── cloudinary.ts             # Cloudinary config + uploadImage helper
│   ├── resend.ts                 # Resend client + email templates
│   ├── mapbox.ts                 # Mapbox token + geocode helper
│   └── utils.ts                  # cn, formatCurrency, formatDate, etc.
│
├── store/
│   ├── bookingStore.ts           # Zustand — booking form state (persisted)
│   └── filterStore.ts            # Zustand — car browse filters
│
├── types/
│   ├── index.ts                  # CarWithRelations, BookingWithRelations, etc.
│   └── next-auth.d.ts            # Session type augmentation
│
└── validations/
    ├── auth.schema.ts            # login, register, updateProfile, changePassword
    ├── car.schema.ts             # car, carUpdate, carFilter
    └── booking.schema.ts         # createBooking, updateBooking, review
```

---

## Data Flow

### Booking Flow

```
User selects dates on /cars/[id]
  → BookingForm validates with Zod
  → POST /api/bookings
      → Check car availability (date conflict query)
      → Create Booking (status: PENDING, paymentStatus: UNPAID)
      → Return booking ID
  → Redirect to /bookings/[id]
  → User clicks "Complete Payment"
  → POST /api/payments/create-intent
      → Create Stripe PaymentIntent
      → Store paymentIntentId on Booking
      → Create Payment record
      → Return clientSecret
  → StripeCheckout component renders Stripe Elements
  → User submits card
  → Stripe calls POST /api/payments/webhook
      → payment_intent.succeeded event
      → Update Booking: status=CONFIRMED, paymentStatus=PAID
      → Update Payment: status=PAID, paidAt=now
      → Send confirmation email via Resend
```

### Auth Flow

```
User submits login form
  → signIn("credentials", { email, password })
  → NextAuth CredentialsProvider.authorize()
      → prisma.user.findUnique({ where: { email } })
      → bcrypt.compare(password, user.password)
      → Return { id, name, email, role }
  → JWT callback: attach id + role to token
  → Session callback: attach id + role to session.user
  → Client gets session via useSession()
```

### Admin Upload Flow

```
Admin selects image in CarForm
  → FileReader → base64 string
  → POST /api/upload (multipart/form-data)
      → auth() check — must be ADMIN
      → cloudinary.uploader.upload(base64, { folder: "velorent/cars" })
      → Return { url, publicId }
  → URL stored in car.images[]
```

---

## Database Schema (ERD Summary)

```
User ──< Booking >── Car
User ──< Review >── Car
Booking ──── Payment (1:1)
Booking ──── Review (1:1)
Car >── Location
Booking >── Location (pickup)
Booking >── Location (dropoff)
```

### Enums

| Enum | Values |
|---|---|
| `UserRole` | USER, ADMIN |
| `BookingStatus` | PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED |
| `PaymentStatus` | UNPAID, PAID, REFUNDED, FAILED |
| `CarCategory` | ECONOMY, COMPACT, SUV, LUXURY, SPORTS, VAN, ELECTRIC |
| `Transmission` | AUTOMATIC, MANUAL |
| `FuelType` | PETROL, DIESEL, HYBRID, ELECTRIC |

---

## Rendering Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` | Static (SSG) | No user-specific data at build time |
| `/cars` | Static shell + client fetch | Filters are client-side |
| `/cars/[id]` | Dynamic (SSR) | Car data + reviews fetched server-side |
| `/bookings` | Static shell + client fetch | User-specific, needs session |
| `/bookings/[id]` | Client | Payment state, real-time updates |
| `/admin/*` | Static shell + client fetch | Admin data fetched client-side |
| `/api/*` | Dynamic | All route handlers are server-side |

---

## Security Model

- **Proxy (src/proxy.ts)** — First line of defense. Redirects unauthenticated users away from `/admin/*`, `/bookings/*`, `/profile/*`.
- **API route auth checks** — Every protected handler calls `auth()` independently. Never rely solely on the proxy.
- **Role checks** — Admin endpoints check `session.user.role === "ADMIN"` explicitly.
- **Ownership checks** — Users can only read/modify their own bookings. Checked by comparing `booking.userId === session.user.id`.
- **Input validation** — All API inputs go through Zod before touching the database.
- **Passwords** — Hashed with bcrypt (12 rounds). Never returned in API responses.
- **Stripe webhook** — Verified with `stripe.webhooks.constructEvent()` using the webhook secret.
