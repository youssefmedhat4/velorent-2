# VeloRent — Deployment Guide

## Recommended Stack

| Service | Purpose | Free Tier |
|---|---|---|
| [Vercel](https://vercel.com) | Hosting (Next.js) | Yes |
| [Neon](https://neon.tech) | PostgreSQL | Yes (0.5 GB) |
| [Cloudinary](https://cloudinary.com) | Image storage | Yes (25 GB) |
| [Resend](https://resend.com) | Transactional email | Yes (3k/month) |
| [Stripe](https://stripe.com) | Payments | No fees in test mode |
| [Mapbox](https://mapbox.com) | Maps | Yes (50k loads/month) |

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial VeloRent build"
git remote add origin https://github.com/YOUR_USERNAME/velorent.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js — no build config needed

### 3. Add Environment Variables

In Vercel → Project → Settings → Environment Variables, add all variables from `.env.example`:

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL              ← set to your production URL, e.g. https://velorent.vercel.app
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_MAPBOX_TOKEN
```

### 4. Set Up Neon Database

1. Create a project at [neon.tech](https://neon.tech)
2. Create a database named `velorent`
3. Copy the connection string (with `?sslmode=require`)
4. Set it as `DATABASE_URL` in Vercel

### 5. Run Migrations on Production

After deploying, run migrations against your production database:

```bash
# Set DATABASE_URL to your Neon connection string temporarily
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

Or add a build command in Vercel: `npx prisma migrate deploy && next build`

### 6. Set Up Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET` in Vercel

### 7. Update Google OAuth Redirect

In Google Cloud Console → OAuth credentials, add your production URL:
```
https://yourdomain.com/api/auth/callback/google
```

---

## Environment-Specific Notes

### NEXTAUTH_URL

Must match your actual deployment URL exactly:
- Dev: `http://localhost:3000`
- Production: `https://velorent.vercel.app` (or your custom domain)

### Database Connection Pooling

For production with Neon, use the **pooled connection string** (port 5432 with `-pooler` in the hostname). This prevents connection exhaustion under load.

```
postgresql://user:pass@ep-xxx-pooler.neon.tech/velorent?sslmode=require
```

### Prisma in Serverless

The `@prisma/adapter-pg` adapter is already configured for serverless environments. No additional setup needed.

---

## Custom Domain

In Vercel → Project → Settings → Domains, add your domain and follow the DNS instructions.

After adding a custom domain, update:
- `NEXTAUTH_URL` in Vercel env vars
- Google OAuth authorized redirect URIs
- Stripe webhook endpoint URL

---

## Monitoring

Vercel provides built-in:
- **Analytics** — page views, performance
- **Logs** — real-time function logs
- **Speed Insights** — Core Web Vitals

For error tracking, consider adding [Sentry](https://sentry.io):

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Seeding Production

To seed production data (optional — only for demos):

```bash
DATABASE_URL="your-production-url" npm run db:seed
```

**Warning:** The seed script deletes all existing data first. Only run on a fresh database.
