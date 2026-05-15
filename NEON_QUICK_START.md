# VeloRent + Neon: Complete Setup Walkthrough

## What You Have Right Now

✅ Project cloned  
✅ Node modules installed  
✅ Prisma configured for Neon (serverless-ready)  
✅ Database schema prepared  
✅ Migration files ready  
✅ Seed script ready  
⏳ **Database:** Not yet created  
⏳ **Environment:** Not yet configured  
⏳ **Schema:** Not yet applied to Neon  

---

## The 5-Step Setup Process

### **Step 1️⃣: Create Neon Database (2 minutes)**

**Location:** https://console.neon.tech

```
[Neon Console]
  └─ Projects
       └─ Your Project
            └─ Databases
                 └─ [+ Create Database]
                      ├─ Name: "velorent"
                      ├─ Owner: (default)
                      └─ [Create] ✓
```

**Result:** You now have an empty PostgreSQL database on Neon

---

### **Step 2️⃣: Get Connection String (1 minute)**

**Location:** Neon Console → Your Database

```
[Neon Console - Connection Details]
  ├─ Direct URL: postgresql://...neon.tech/velorent?sslmode=require
  └─ Pooled URL: postgresql://...neon-pooler.neon.tech/velorent?sslmode=require
                 ⬆️ USE THIS ONE (for serverless)
```

**Copy:** The **Pooled URL** (it should end with `-pooler`)

Example:
```
postgresql://neondb_owner:abc123xyz@ep-cool-cloud-12345-pooler.neon.tech/velorent?sslmode=require
```

---

### **Step 3️⃣: Configure Environment (2 minutes)**

**File:** `.env.local` (in your project root — already created)

Open and fill in:

```env
# Paste your pooled connection string from Neon
DATABASE_URL="postgresql://neondb_owner:abc123xyz@ep-cool-cloud-12345-pooler.neon.tech/velorent?sslmode=require"

# Generate random secret (run in terminal):
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET="your-generated-32-char-hex-string-here"

# Your app URL (for local dev, this is correct)
NEXTAUTH_URL="http://localhost:3000"
```

**Save the file.**

---

### **Step 4️⃣: Apply Schema to Neon (1 minute)**

**Terminal:**

```bash
cd c:\Users\Ehab\velorent
npx prisma migrate deploy
```

**Expected Output:**
```
Applying migration `20260502151121_init`

The following migration(s) have been successfully applied:

migrations/
  └─ 20260502151121_init/
     └─ migration.sql

All migrations have been successfully applied.
```

**What Happened:**
- Prisma read your schema from `prisma/schema.prisma`
- Created 6 tables on Neon: users, locations, cars, bookings, payments, reviews
- Created 6 enums: UserRole, BookingStatus, PaymentStatus, CarCategory, Transmission, FuelType

✅ Your Neon database is now ready for data!

---

### **Step 5️⃣: Seed Demo Data (30 seconds)**

**Terminal:**

```bash
npm run db:seed
```

**Expected Output:**
```
Starting seed...
Cleaning up database...
✓ Creating admin user (admin@velorent.com)
✓ Creating 5 regular users
✓ Creating 5 locations
✓ Creating 15 cars
✓ Creating 10 bookings
✓ Creating 8 payments
✓ Creating reviews
✓ Seeding complete
```

**What Happened:**
- Added 1 admin user
- Added 5 test users (alice, bob, carol, david, emma)
- Added 5 locations (JFK, LAX, Miami, Chicago, Vegas)
- Added 15 cars (Lamborghini, Ferrari, Tesla, BMW, etc.)
- Added 10 bookings with various statuses
- Added sample payments and reviews

✅ Your database now has realistic test data!

---

## Test It Out

### **Start the dev server:**
```bash
npm run dev
```

### **Test 1: Browse cars**
- Open http://localhost:3000/cars
- Should see 15 cars with images
- Filters (category, price, dates) should work

✅ **If you see cars → Step 1-5 worked!**

### **Test 2: Login as admin**
- Click "Sign In"
- Email: `admin@velorent.com`
- Password: `Admin1234!`
- Should log in successfully

✅ **If you can log in → Database & auth working!**

### **Test 3: Admin dashboard**
- Once logged in as admin, go to http://localhost:3000/admin
- Should see stats, users, bookings, cars

✅ **If admin page loads → Everything is working!**

### **Test 4: Login as regular user**
- Sign out
- Sign in with: `alice@example.com` / `User1234!`
- Browse cars, make a booking (doesn't charge without Stripe keys)

✅ **If you can browse & book → Full setup complete!**

---

## What Each Setup File Does

| File | Purpose | What Happens |
|------|---------|--------------|
| `.env.local` | Environment variables | Tells your app how to connect to Neon |
| `prisma/schema.prisma` | Database schema | Defines tables, fields, relationships |
| `prisma/migrations/20260502151121_init/migration.sql` | Schema changes | Applied to Neon to create tables |
| `prisma/seed.ts` | Demo data | Populates test users, cars, bookings |
| `src/lib/prisma.ts` | Database client | Singleton that connects to Neon |

---

## Troubleshooting

### **"Connection refused" or "ENOTFOUND"**
→ Check your `DATABASE_URL` in `.env.local`
→ Make sure the Neon connection string is correct
→ Restart your dev server after updating `.env.local`

### **"SSL error"**
→ Ensure your `DATABASE_URL` ends with `?sslmode=require`
→ Use the **Pooled** URL, not the Direct URL

### **"Cars not showing" or "Can't log in"**
→ Check migrations were applied: `npx prisma migrate status`
→ Check seed data exists: Open Prisma Studio with `npx prisma studio`
→ Re-run seed if needed: `npm run db:seed`

### **"Permission denied" errors**
→ Double-check your Neon user/password in the connection string
→ Try generating a new password in Neon console

---

## File Locations

```
c:\Users\Ehab\velorent\
├─ .env.local ← Fill this with DATABASE_URL
├─ .env ← Don't edit (used for production secrets)
├─ prisma\
│  ├─ schema.prisma ← Database schema (don't edit)
│  ├─ migrations\ ← Migration files (auto-generated)
│  └─ seed.ts ← Demo data (don't edit unless you want custom data)
├─ src\
│  └─ lib\
│     └─ prisma.ts ← Database client (don't edit)
└─ NEON_SETUP_GUIDE.md ← This file
```

---

## Next: Production Deployment

Once local dev works, see `docs/DEPLOYMENT.md` for deploying to Vercel + Neon:
- Set environment variables in Vercel
- Run migrations in production
- Configure Stripe, Cloudinary, Resend (optional)

---

## Support

**Neon Docs:** https://neon.tech/docs  
**Prisma Docs:** https://prisma.io/docs  
**VeloRent Docs:** See `docs/SETUP.md` and `docs/DEPLOYMENT.md`

---

**You're ready to go! Start with Step 1 above.** 🚀
