# VeloRent — Local Development Setup

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 18+ | Use [nvm](https://github.com/nvm-sh/nvm) to manage versions |
| npm | 9+ | Comes with Node |
| PostgreSQL | 15+ | Local install or Docker |
| Git | Any | |

---

## Step 1 — Clone & Install

```bash
git clone <your-repo-url>
cd velorent
npm install
```

---

## Step 2 — Configure Environment

Copy the example file:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values. Here's what each one does:

### Required (app won't start without these)

```env
# Your PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/velorent"

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET="your-random-secret"

# Your local dev URL
NEXTAUTH_URL="http://localhost:3000"
```

### Stripe (required for payments)

1. Create a free account at [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. Copy your **test** keys (start with `sk_test_` and `pk_test_`)

```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."   # See Stripe webhook setup below
```

### Cloudinary (required for image uploads in admin)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → copy your Cloud Name, API Key, API Secret

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789"
CLOUDINARY_API_SECRET="your-secret"
```

### Resend (required for confirmation emails)

1. Create a free account at [resend.com](https://resend.com)
2. Create an API key

```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

> For local dev, Resend will send to your verified email. You don't need a custom domain.

### Mapbox (required for location picker map)

1. Create a free account at [mapbox.com](https://mapbox.com)
2. Go to Account → Tokens → copy your default public token

```env
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."
```

### Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI

```env
GOOGLE_CLIENT_ID="....apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-..."
```

---

## Step 3 — Database Setup

### Option A: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE velorent;"

# Run migrations
npx prisma migrate dev --name init

# Seed with sample data
npm run db:seed
```

### Option B: Docker

```bash
docker run --name velorent-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=velorent \
  -p 5432:5432 \
  -d postgres:15

# Then run migrations
npx prisma migrate dev --name init
npm run db:seed
```

### Option C: Neon (free cloud PostgreSQL)

1. Create a free database at [neon.tech](https://neon.tech)
2. Copy the connection string (it looks like `postgresql://user:pass@ep-xxx.neon.tech/velorent?sslmode=require`)
3. Set it as `DATABASE_URL` in `.env.local`
4. Run migrations and seed as above

---

## Step 4 — Stripe Webhook (local)

To test the full payment flow locally, you need to forward Stripe webhook events to your local server.

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Start forwarding:

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

4. Copy the webhook signing secret it prints (starts with `whsec_`) into `STRIPE_WEBHOOK_SECRET` in `.env.local`

---

## Step 5 — Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Seed Data

After `npm run db:seed`, the database contains:

| Type | Count | Details |
|---|---|---|
| Users | 6 | 1 admin + 5 regular users |
| Locations | 5 | New York, Los Angeles, Miami, Chicago, Las Vegas |
| Cars | 15 | All categories — Lamborghini, Ferrari, Porsche, Rolls-Royce, Tesla, BMW, etc. |
| Bookings | 10 | Mix of PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED |
| Payments | 8 | For all paid bookings |
| Reviews | 5 | For completed bookings |

**Login credentials:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@velorent.com | Admin1234! |
| User | alice@example.com | User1234! |
| User | bob@example.com | User1234! |

---

## Useful Commands

```bash
npm run dev           # Start dev server
npm run build         # Production build (run this to check for errors)
npm run lint          # ESLint
npx tsc --noEmit      # TypeScript check without building

npm run db:migrate    # Run pending migrations
npm run db:generate   # Regenerate Prisma client after schema changes
npm run db:seed       # Re-seed (WARNING: deletes all existing data first)
npm run db:studio     # Open Prisma Studio at http://localhost:5555
```

---

## Troubleshooting

### `PrismaClientInitializationError: needs to be constructed with a non-empty, valid PrismaClientOptions`

Prisma 7 requires a driver adapter. Make sure you're importing from `@/lib/prisma` and not calling `new PrismaClient()` directly anywhere.

### `Authentication failed against the database server`

Your `DATABASE_URL` credentials are wrong. Double-check the username, password, host, and port. For local PostgreSQL on Windows, the default user is `postgres`.

### `useSearchParams() should be wrapped in a suspense boundary`

Any component that calls `useSearchParams()` must be wrapped in `<Suspense>`. See `src/app/(auth)/login/page.tsx` for the pattern.

### `Event handlers cannot be passed to Client Component props`

A Server Component is trying to pass an `onClick` or `onSubmit` to a child. Either add `"use client"` to the parent, or move the handler into the Client Component itself.

### Build fails with `middleware.ts` warning

Next.js 16 renamed `middleware.ts` to `proxy.ts`. This project already uses `proxy.ts` — if you see this warning, make sure there's no leftover `middleware.ts` file.
