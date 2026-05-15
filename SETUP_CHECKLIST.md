# VeloRent Setup Checklist

Follow these steps in order:

## ✅ Step 1: Install Prerequisites

### 1.1 Node.js & npm
- [ ] Download from https://nodejs.org/ (LTS version 18+)
- [ ] Install and restart terminal
- [ ] Verify: Run `node --version` and `npm --version`

### 1.2 PostgreSQL Database
Choose ONE option:

**Option A: Local PostgreSQL**
- [ ] Download from https://www.postgresql.org/download/windows/
- [ ] Install (remember the postgres user password!)
- [ ] Default port: 5432

**Option B: Docker**
- [ ] Run: `docker run --name velorent-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=velorent -p 5432:5432 -d postgres:15`

**Option C: Neon (Cloud - Easiest)**
- [ ] Sign up at https://neon.tech
- [ ] Create a project
- [ ] Copy the connection string

---

## ✅ Step 2: Install Dependencies

```bash
npm install
```

---

## ✅ Step 3: Configure Environment Variables

Edit `.env.local` file and fill in these values:

### Required (Minimum to run)
- [ ] `DATABASE_URL` - Your PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] `NEXTAUTH_URL` - Keep as `http://localhost:3000`

### For Full Features (Get free accounts)
- [ ] **Stripe** (payments) - https://stripe.com → Developers → API Keys
  - `STRIPE_SECRET_KEY` (starts with sk_test_)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with pk_test_)
  - `STRIPE_WEBHOOK_SECRET` (see Stripe CLI setup below)

- [ ] **Cloudinary** (image uploads) - https://cloudinary.com → Dashboard
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

- [ ] **Resend** (emails) - https://resend.com → API Keys
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`

- [ ] **Mapbox** (location picker) - https://mapbox.com → Account → Tokens
  - `NEXT_PUBLIC_MAPBOX_TOKEN`

- [ ] **Google OAuth** (optional) - https://console.cloud.google.com
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

---

## ✅ Step 4: Database Setup

```bash
# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Seed with sample data (1 admin, 5 users, 15 cars, etc.)
npm run db:seed
```

---

## ✅ Step 5: Stripe Webhook (Optional - for local payment testing)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/payments/webhook`
4. Copy the webhook secret (whsec_...) to `STRIPE_WEBHOOK_SECRET` in `.env.local`

---

## ✅ Step 6: Run the App

```bash
npm run dev
```

Open http://localhost:3000

---

## 🎉 Test Credentials (after seeding)

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@velorent.com     | Admin1234!  |
| User  | alice@example.com      | User1234!   |
| User  | bob@example.com        | User1234!   |

---

## 🛠️ Useful Commands

```bash
npm run dev           # Start development server
npm run build         # Test production build
npm run lint          # Run linter
npm run db:studio     # Open Prisma Studio (database GUI)
npm run db:migrate    # Run new migrations
npm run db:seed       # Re-seed database (WARNING: deletes existing data)
```

---

## 🐛 Common Issues

### "psql is not recognized"
PostgreSQL is not installed or not in PATH. Install it first.

### "npm is not recognized"
Node.js is not installed. Download from nodejs.org.

### "Authentication failed against database"
Wrong DATABASE_URL. Check username, password, host, and port.

### "PrismaClientInitializationError"
Run `npx prisma generate` to regenerate the Prisma client.

### Port 3000 already in use
Another app is using port 3000. Either stop it or run: `npm run dev -- -p 3001`

---

## 📚 Next Steps

After the app is running:
1. Browse cars at http://localhost:3000/cars
2. Sign in with alice@example.com / User1234!
3. Book a car and test the flow
4. Sign in as admin@velorent.com / Admin1234! to access /admin
5. Read docs/ARCHITECTURE.md to understand the codebase
6. Read AGENTS.md before making code changes
