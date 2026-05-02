# VeloRent — AI Agent Instructions

This file tells any AI coding agent (Kiro, Copilot, Cursor, Claude, etc.) how to work on this codebase correctly. Read this before making any changes.

---

## Project Identity

**VeloRent** is a production-grade, full-stack car rental web app built with Next.js 16 (App Router), TypeScript strict mode, Prisma 7, and a cinematic dark UI. Every decision in this codebase prioritizes type safety, clean architecture, and maintainability.

---

## Non-Negotiable Rules

1. **TypeScript strict mode is ON.** No `any`, no `@ts-ignore`, no implicit returns. If you can't type something, use a proper generic or a well-named interface.
2. **No inline styles.** Tailwind classes only. Use `cn()` from `@/lib/utils` to merge conditional classes.
3. **No raw `useState` for forms.** All forms use React Hook Form + Zod resolver. See existing forms for the pattern.
4. **No unbounded Prisma queries.** Every `findMany` must have a `take` limit or pagination. Always `select` only the fields you need.
5. **Every API route validates input with Zod** and returns the standard response shape (see API Conventions below).
6. **Every protected API route checks the session** via `auth()` from `@/lib/auth` before doing anything.
7. **Server Components by default.** Only add `"use client"` when you need interactivity, hooks, or browser APIs. If in doubt, keep it a Server Component.
8. **No TODO comments in committed code.** Either implement it or open an issue.
9. **`useSearchParams()` must be wrapped in `<Suspense>`** — Next.js 16 requirement. See `/src/app/(auth)/login/page.tsx` for the pattern.

---

## Architecture Overview

```
Browser
  └── Next.js App Router (src/app/)
        ├── (main)/          Public pages — Server Components where possible
        ├── (auth)/          Login / Register — Client Components with Suspense
        ├── admin/           Admin dashboard — Client Components (data fetching via fetch)
        └── api/             Route Handlers — all server-side, no client code
              ├── auth/      NextAuth handlers + register
              ├── cars/      CRUD + availability check
              ├── bookings/  CRUD + status management
              ├── payments/  Stripe intent creation + webhook
              ├── reviews/   Submit + list
              ├── upload/    Cloudinary upload
              ├── profile/   User profile + password
              └── admin/     Stats + user management

src/
  ├── lib/          Singleton clients (prisma, stripe, cloudinary, resend, mapbox)
  ├── store/        Zustand — bookingStore, filterStore (client-side only)
  ├── hooks/        useCars, useBooking, useAuth — data fetching hooks
  ├── types/        Shared TypeScript types (CarWithRelations, BookingWithRelations, etc.)
  └── validations/  Zod schemas — single source of truth for input shapes
```

---

## Key Files to Know

| File | Purpose |
|---|---|
| `src/lib/prisma.ts` | Prisma singleton with `@prisma/adapter-pg`. Import this everywhere — never `new PrismaClient()` directly. |
| `src/lib/auth.ts` | NextAuth config. Exports `auth`, `handlers`, `signIn`, `signOut`. |
| `src/lib/utils.ts` | `cn()`, `formatCurrency()`, `formatDate()`, `calculateDays()`, `getStatusColor()`, etc. |
| `src/types/index.ts` | All shared types. `CarWithRelations`, `BookingWithRelations`, `SessionUser`, etc. |
| `src/validations/` | Zod schemas. These are the canonical shapes for all input data. |
| `src/proxy.ts` | Next.js 16 proxy (was middleware). Handles auth-based route protection. |
| `prisma/schema.prisma` | Database schema. Source of truth for all models and enums. |
| `prisma/seed.ts` | Seeds 1 admin, 5 users, 5 locations, 15 cars, 10 bookings, 8 reviews. |

---

## API Conventions

### Response Shape

Every API route returns this shape — no exceptions:

```typescript
// Success
{ success: true, data: T }

// Success with pagination
{ success: true, data: T[], pagination: { page, limit, total, totalPages } }

// Error
{ success: false, error: "Human-readable message", code: "SNAKE_CASE_CODE" }
```

### Error Codes

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Zod parse failed |
| `UNAUTHORIZED` | 401 | No session |
| `FORBIDDEN` | 403 | Session exists but wrong role |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `DATE_CONFLICT` | 409 | Car already booked for those dates |
| `EMAIL_EXISTS` | 409 | Registration with duplicate email |
| `ALREADY_PAID` | 400 | Trying to pay an already-paid booking |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Auth Pattern in Route Handlers

```typescript
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();

  // Public route — no check needed

  // User-only route
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  // Admin-only route
  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Forbidden", code: "FORBIDDEN" },
      { status: 403 }
    );
  }
}
```

### Zod Validation Pattern

```typescript
const parsed = mySchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json(
    { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
    { status: 400 }
  );
}
// Use parsed.data — fully typed
```

Note: Zod v4 uses `.issues` not `.errors`.

---

## Component Conventions

### File Structure

```
ComponentName.tsx
  "use client";          ← only if needed
  imports
  interface Props { }    ← always define props interface
  export function ComponentName({ prop }: Props) { }
```

### Styling

- Dark theme: background `#0A0A0B`, card `#111113`, border `white/5` to `white/10`
- Accent yellow: `#E8FF00` — used for CTAs, active states, highlights
- Accent blue: `#00D4FF` — secondary accent
- Text hierarchy: `text-white` → `text-zinc-300` → `text-zinc-400` → `text-zinc-500` → `text-zinc-600`
- Display font: `font-display` class (Bebas Neue) — headings only
- Body font: DM Sans — set on `body` in globals.css

### Animation Pattern (Framer Motion)

```tsx
// Staggered list items
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: index * 0.05 }}
>
```

```tsx
// Page section reveal
<motion.div
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
```

### Loading States

Every async action needs a loading indicator. Use `<LoadingSpinner>` from `@/components/shared/LoadingSpinner` or the `animate-pulse` skeleton pattern for lists.

---

## Database Conventions

### Prisma Client

Always import from `@/lib/prisma`:

```typescript
import { prisma } from "@/lib/prisma";
```

Never instantiate `new PrismaClient()` anywhere else — it uses the `@prisma/adapter-pg` adapter and the singleton pattern prevents connection pool exhaustion.

### Query Patterns

```typescript
// Always paginate findMany
const items = await prisma.car.findMany({
  where: { ... },
  select: { id: true, name: true, ... },  // select only what you need
  orderBy: { createdAt: "desc" },
  skip: (page - 1) * limit,
  take: limit,
});

// Always run count + findMany in parallel
const [total, items] = await Promise.all([
  prisma.car.count({ where }),
  prisma.car.findMany({ where, ... }),
]);
```

### Enums

All enums are defined in `prisma/schema.prisma` and re-exported from `@/types/index.ts`. Import from `@prisma/client` in server code, from `@/types` in shared code.

---

## State Management

### Zustand Stores

| Store | File | Purpose |
|---|---|---|
| `useBookingStore` | `src/store/bookingStore.ts` | Persists booking form state across navigation |
| `useFilterStore` | `src/store/filterStore.ts` | Car browse filters — category, price, dates, etc. |

Both stores are client-side only (`"use client"`). Never import them in Server Components.

### When to Use Each

- **Server Component data** — fetch directly in the component with `prisma` or `fetch`
- **Client Component data** — use the custom hooks (`useCars`, `useBooking`, `useAuth`)
- **Cross-component UI state** — Zustand stores
- **Form state** — React Hook Form only

---

## Auth & Sessions

### Session Shape

```typescript
session.user = {
  id: string,        // cuid
  name: string,
  email: string,
  role: "USER" | "ADMIN",
  image?: string | null,
}
```

### Route Protection

- `/admin/*` — requires `role === "ADMIN"`, handled in `src/proxy.ts`
- `/bookings/*`, `/profile/*` — requires any authenticated session, handled in `src/proxy.ts`
- API routes — each handler checks `auth()` individually (don't rely solely on proxy)

### Checking Auth in Client Components

```typescript
import { useAuth } from "@/hooks/useAuth";

const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
```

---

## Adding New Features — Checklist

When adding a new feature, follow this order:

1. **Schema** — Add/modify models in `prisma/schema.prisma`, run `npx prisma migrate dev`
2. **Types** — Add types to `src/types/index.ts`
3. **Validation** — Add Zod schema to `src/validations/`
4. **API** — Add route handler in `src/app/api/`, follow auth + validation + response shape conventions
5. **Hook** — Add a data-fetching hook in `src/hooks/` if the feature needs client-side data
6. **Component** — Build the UI component, default to Server Component
7. **Page** — Wire it up in `src/app/`
8. **Proxy** — Update `src/proxy.ts` if the new route needs auth protection

---

## Common Mistakes to Avoid

| Mistake | Correct Approach |
|---|---|
| `import { PrismaClient } from "@prisma/client"; new PrismaClient()` | `import { prisma } from "@/lib/prisma"` |
| `parsed.error.errors[0]` | `parsed.error.issues[0]` (Zod v4) |
| `"use client"` on every component | Only add it when you actually need client features |
| `useSearchParams()` without Suspense | Wrap the component using it in `<Suspense>` |
| Passing event handlers from Server to Client components | Move the handler into the Client Component |
| `middleware.ts` | Use `proxy.ts` (Next.js 16 renamed it) |
| `experimental.serverComponentsExternalPackages` | Use `serverExternalPackages` (top-level in Next.js 16) |
| `apiVersion: "..."` with type cast in Stripe | Use the literal string from `Stripe.API_VERSION` |

---

## Environment Variables

See `.env.example` for the full list. Required for each feature:

| Feature | Variables needed |
|---|---|
| Database | `DATABASE_URL` |
| Auth (any) | `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| Google OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Stripe payments | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Image upload | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Emails | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| Location picker | `NEXT_PUBLIC_MAPBOX_TOKEN` |

---

## Testing the App Manually

After `npm run db:seed`, you can test the full flow:

1. **Browse** — Go to `/cars`, use filters, sort by price/rating
2. **Car detail** — Click a car, see the 3D viewer (geometric placeholder) or image gallery
3. **Book** — Sign in as `alice@example.com` / `User1234!`, pick dates, click Reserve
4. **Pay** — On the booking detail page, click "Complete Payment" (needs real Stripe test keys)
5. **Review** — After a booking is marked COMPLETED, leave a review
6. **Admin** — Sign in as `admin@velorent.com` / `Admin1234!`, go to `/admin`
