# VeloRent Neon Setup Checklist

## Phase 0: Pre-Setup
- [ ] Project cloned to `c:\Users\Ehab\velorent`
- [ ] `npm install` completed (node_modules present)
- [ ] Node.js and npm installed

## Phase 1: Neon Account & Database
- [ ] Neon account created at https://console.neon.tech
- [ ] Neon project created
- [ ] Database "velorent" created in Neon
- [ ] Pooled connection string copied (ends with `-pooler` and `?sslmode=require`)

## Phase 2: Environment Configuration
- [ ] `.env.local` file exists in project root
- [ ] `DATABASE_URL` filled with Neon pooled connection string
- [ ] `NEXTAUTH_SECRET` generated and filled (32-char hex)
- [ ] `NEXTAUTH_URL` set to `http://localhost:3000`
- [ ] File saved

## Phase 3: Database Schema
- [ ] Terminal opened in project root (`c:\Users\Ehab\velorent`)
- [ ] `npx prisma migrate deploy` executed successfully
- [ ] Migrations applied to Neon (check output says "successfully applied")
- [ ] 6 tables created: users, locations, cars, bookings, payments, reviews

## Phase 4: Demo Data (Optional but Recommended)
- [ ] `npm run db:seed` executed successfully
- [ ] Seed output shows all data created
- [ ] Database now contains:
  - 1 admin user
  - 5 test users
  - 15 cars
  - 5 locations
  - 10 bookings
  - 8 payments
  - 5+ reviews

## Phase 5: Development Server
- [ ] `npm run dev` executed
- [ ] Server started (message: "ready - started server on 0.0.0.0:3000")
- [ ] No database connection errors in console

## Phase 6: Testing

### Test 6A: Browse Cars
- [ ] Opened http://localhost:3000/cars
- [ ] See list of cars (should show 15 if seeded)
- [ ] Filters work (category, price range, dates)
- [ ] Sorting works (price, rating)

### Test 6B: Admin Login
- [ ] Clicked "Sign In"
- [ ] Logged in with: `admin@velorent.com` / `Admin1234!`
- [ ] Successfully authenticated
- [ ] Redirected to dashboard or home

### Test 6C: Admin Dashboard
- [ ] Navigated to http://localhost:3000/admin
- [ ] Dashboard loads without errors
- [ ] Can see statistics
- [ ] Can see users list
- [ ] Can see bookings list
- [ ] Can see cars management

### Test 6D: Regular User Login
- [ ] Signed out or logged out
- [ ] Logged in with: `alice@example.com` / `User1234!`
- [ ] Successfully authenticated as regular user
- [ ] Can browse cars
- [ ] Profile page works

### Test 6E: Booking Flow (Optional)
- [ ] As regular user, clicked on a car
- [ ] Set travel dates
- [ ] Click "Reserve"
- [ ] Booking page loads (may require Stripe keys for payment)

## Phase 7: Documentation
- [ ] Reviewed `NEON_SETUP_GUIDE.md` (comprehensive reference)
- [ ] Reviewed `NEON_QUICK_START.md` (visual walkthrough)
- [ ] Reviewed `NEON_COMMANDS.sh` (command reference)
- [ ] Bookmarked for future reference

## Phase 8: Next Steps

### For Local Development
- [ ] Keep `.env.local` with your Neon credentials
- [ ] Use `npm run dev` to start development server
- [ ] Use `npx prisma studio` to view/edit database

### For Production (Later)
- [ ] See `docs/DEPLOYMENT.md` for Vercel setup
- [ ] Create separate Neon database for production
- [ ] Set environment variables in Vercel dashboard
- [ ] Deploy using Vercel CLI or GitHub integration

### Optional Features (When Needed)
- [ ] Set up Stripe keys for payment processing
- [ ] Set up Cloudinary for image uploads
- [ ] Set up Resend for email notifications
- [ ] Set up Google OAuth for social login
- [ ] Set up Mapbox for location maps

---

## Success Criteria

✅ **Setup is complete when:**

1. Database is created on Neon
2. `.env.local` is filled with valid Neon credentials
3. `npx prisma migrate deploy` runs without errors
4. `npm run db:seed` runs successfully (if you want demo data)
5. `npm run dev` starts without database errors
6. Can log in with test credentials
7. Can see cars on /cars page
8. Admin dashboard loads

✅ **You're ready to develop!**

---

## File Locations & Reference

| File | Location | Purpose |
|------|----------|---------|
| `.env.local` | Project root | Your local environment secrets |
| `prisma/schema.prisma` | `prisma/` folder | Database schema definition |
| `prisma/migrations/` | `prisma/` folder | Schema change history |
| `prisma/seed.ts` | `prisma/` folder | Demo data seeder |
| `src/lib/prisma.ts` | `src/lib/` folder | Database client singleton |
| `NEON_SETUP_GUIDE.md` | Project root | Detailed setup guide |
| `NEON_QUICK_START.md` | Project root | Visual walkthrough |
| `NEON_COMMANDS.sh` | Project root | Command reference |

---

## Troubleshooting Quick Links

- **Connection failed?** → Check `DATABASE_URL` in `.env.local`
- **SSL error?** → Ensure URL ends with `?sslmode=require`
- **Can't log in?** → Run `npx prisma migrate deploy`
- **Cars not showing?** → Run `npm run db:seed`
- **Migration failed?** → See `NEON_SETUP_GUIDE.md` "Troubleshooting" section
- **Missing dependencies?** → Run `npm install`

---

## Estimated Time

- Neon account & DB creation: **2-3 minutes**
- Environment setup: **1-2 minutes**
- Schema migration: **1 minute**
- Seed data: **30 seconds**
- Testing: **5 minutes**
- **Total: ~10-15 minutes**

---

## Support Resources

- **VeloRent docs:** `docs/SETUP.md`, `docs/DEPLOYMENT.md`
- **Neon:** https://neon.tech/docs
- **Prisma:** https://prisma.io/docs
- **Next.js:** https://nextjs.org/docs
- **NextAuth:** https://next-auth.js.org

---

**Status:** Ready to start setup  
**Target:** Have VeloRent running locally with Neon in 15 minutes

Print this checklist and check off items as you complete them! ✅
