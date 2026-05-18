# VeloRent Neon Database Setup Guide

## Overview

You've just cloned VeloRent and need to set up a PostgreSQL database on **Neon** (serverless PostgreSQL). This guide walks you through the complete setup process.

**Status:** ✅ Project is ready for Neon. You have:
- Prisma configured with `@prisma/adapter-pg` (serverless-optimized)
- Database schema prepared in `prisma/schema.prisma`
- Initial migration ready in `prisma/migrations/20260502151121_init/`
- Seed script with 1 admin + 5 users + 15 cars + 10 bookings

---

## Step 1: Create Neon Database

1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up / Log in
3. Create a new project (or use existing one)
4. Click **Databases** → **Create database**
   - Name: `velorent`
   - Owner: (default user, e.g., `neondb_owner`)
5. Click **Connect** → Copy the **Pooled connection string** (look for the button that says "Pooler" or ends with `-pooler`)
   - Should look like: `postgresql://user:password@ep-xxx-pooler.neon.tech/velorent?sslmode=require`
   - **DO NOT USE the Direct URL** — use the pooled version for serverless

---

## Step 2: Configure Environment Variables

### Option A: Local Development (`.env.local`)

1. Open the `.env.local` file (created in your project root)
2. Replace the `DATABASE_URL` placeholder with your Neon pooled connection string from Step 1
3. Add the other required variables:

```env
# DATABASE_URL from Neon (pooler version)
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.neon.tech/velorent?sslmode=require"

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional for local dev (leave blank if you skip payments/emails)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"
NEXT_PUBLIC_MAPBOX_TOKEN="pk_..."
```

### Option B: Production (Vercel)

If deploying to Vercel:
1. Go to **Settings** → **Environment Variables**
2. Add `DATABASE_URL` with your Neon connection string (pooled)
3. Add `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (e.g., `https://yourdomain.com`), and other keys

---

## Step 3: Push Database Schema to Neon

This creates all tables, enums, and constraints on Neon.

```bash
npx prisma migrate deploy
```

**Expected output:**
```
2 migrations found in prisma/migrations

Applying migration `20250515000000_init`

The following migration(s) have been applied:

migrations/
  └─ 20250515000000_init/
     └─ migration.sql

All migrations have been successfully applied.
```

If you see errors:
- **`ENOTFOUND`** or **`Connection refused`** → Check your DATABASE_URL is correct
- **`SSL error`** → Ensure `?sslmode=require` is in your connection string
- **`permission denied`** → Verify Neon database name and user/password

---

## Step 4: Seed Demo Data (Optional)

Populates your database with test data: 1 admin, 5 users, 5 locations, 15 cars, 10 bookings.

```bash
npm run db:seed
```
  
**Expected output:**
```
Starting seed...
Cleaning up database...
✓ Seeding complete
```

**Test Credentials:**
- **Admin:** `admin@velorent.com` / `Admin1234!`
- **User:** `alice@example.com` / `User1234!` (or bob, carol, david, emma)

---

## Step 5: Start Dev Server & Test

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### What to Test

1. **Browse cars** → [http://localhost:3000/cars](http://localhost:3000/cars)
   - Should see 15 seeded cars
   - Filters (category, price, dates) should work
   
2. **Login** → Click "Sign In" → Use `alice@example.com` / `User1234!`
   - Should log in successfully
   - Your profile should show

3. **Admin** → Log in with `admin@velorent.com` / `Admin1234!`
   - Go to [http://localhost:3000/admin](http://localhost:3000/admin)
   - Should see dashboard, users, bookings

---

## Troubleshooting

### "Can't login" or "Cars not showing"

**Check 1:** Verify DATABASE_URL is set
```bash
echo $DATABASE_URL
```

**Check 2:** Verify migrations applied
```bash
npx prisma migrate status
```
Should show `✓ 1 migration applied`. If it says "1 migration pending", run:
```bash
npx prisma migrate deploy
```

**Check 3:** Verify seed data exists
```bash
npx prisma studio
```
Should show tables with rows. If empty, run:
```bash
npm run db:seed
```

**Check 4:** Check NextAuth secret
- Make sure `NEXTAUTH_SECRET` is set and non-empty
- It should be a 32-character hex string

### "SSL error" or "Connection refused"

**Issue:** DATABASE_URL is invalid

**Fix:**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Click your database → **Connection Details**
3. Select **Pooler** (not "Direct")
4. Ensure URL has `?sslmode=require` at the end
5. Copy the full URL and paste into `.env.local`

### "Migration failed" after seed

**Issue:** Schema mismatch

**Fix:**
```bash
# Reset everything (destructive!)
npm run db:push -- --force-reset

# Or manually migrate
npx prisma migrate reset
```

---

## Architecture

- **Prisma Adapter:** `@prisma/adapter-pg` (serverless-optimized)
- **Connection Pooling:** Neon Pooler handles connections
- **Schema:** `prisma/schema.prisma` (6 tables, 6 enums)
- **Migrations:** `prisma/migrations/` (1 initial migration)

---

## Next Steps

- [ ] Fill in `.env.local` with Neon connection string
- [ ] Run `npx prisma migrate deploy`
- [ ] Run `npm run db:seed` (optional, for demo data)
- [ ] Run `npm run dev` and test
- [ ] Read `docs/DEPLOYMENT.md` for production setup (Vercel + Neon)

---

## Getting Help

- **Neon docs:** [neon.tech/docs](https://neon.tech/docs)
- **Prisma docs:** [prisma.io/docs](https://prisma.io/docs)
- **VeloRent docs:** See `docs/SETUP.md` and `docs/DEPLOYMENT.md`
