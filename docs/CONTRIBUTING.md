# VeloRent — Contributing Guide

## Code Style

### TypeScript

- Strict mode is on — no `any`, no `@ts-ignore`
- Prefer `interface` over `type` for object shapes
- Always type function return values explicitly for exported functions
- Use `unknown` instead of `any` when the type is genuinely unknown

### React

- Default to Server Components — only add `"use client"` when needed
- Props interfaces go directly above the component function
- Destructure props in the function signature
- Keep components focused — if a component exceeds ~200 lines, split it

### Naming

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `CarCard.tsx` |
| Hooks | camelCase with `use` prefix | `useCars.ts` |
| Stores | camelCase with `Store` suffix | `bookingStore.ts` |
| API routes | `route.ts` in folder | `api/cars/route.ts` |
| Types | PascalCase | `CarWithRelations` |
| Zod schemas | camelCase with `Schema` suffix | `carSchema` |
| Zod inferred types | PascalCase with `Input` suffix | `CarInput` |

### File Organization

- One component per file
- Co-locate types with the component if they're only used there
- Shared types go in `src/types/index.ts`
- Shared utilities go in `src/lib/utils.ts`

---

## Git Workflow

### Branch Naming

```
feat/car-comparison-view
fix/booking-date-conflict
chore/update-dependencies
refactor/admin-dashboard-layout
docs/api-reference
```

### Commit Messages (Conventional Commits)

```
feat: add car comparison feature
fix: prevent double booking on same dates
chore: update Stripe to v22
refactor: extract BookingCard from bookings page
docs: add API reference for reviews endpoint
style: fix spacing in CarCard component
test: add unit tests for calculateDays utility
```

### Pull Request Process

1. Branch off `main`
2. Make your changes
3. Run `npm run build` — must pass with zero errors
4. Run `npx tsc --noEmit` — must pass with zero errors
5. Run `npm run lint` — fix any warnings
6. Open a PR with a clear description of what changed and why
7. PR title follows the same Conventional Commits format

---

## Adding a New Page

1. Create the file in the appropriate route group:
   - Public page → `src/app/(main)/your-page/page.tsx`
   - Auth-required page → add to `src/proxy.ts` matcher
   - Admin page → `src/app/admin/your-page/page.tsx`

2. If the page needs data, decide:
   - Static data → fetch in the Server Component directly
   - User-specific data → use a client hook (`useCars`, `useBooking`, etc.)
   - New data type → add a hook in `src/hooks/`

3. Add a link to it in `Navbar.tsx` or `AdminSidebar.tsx` as appropriate

---

## Adding a New API Endpoint

1. Create `src/app/api/your-resource/route.ts`
2. Follow the auth + validation + response shape pattern (see `AGENTS.md`)
3. Add the Zod schema to `src/validations/`
4. Add types to `src/types/index.ts` if needed
5. Document it in `docs/API.md`

---

## Modifying the Database Schema

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name describe-your-change`
3. Run `npx prisma generate`
4. Update `src/types/index.ts` if the change affects shared types
5. Update `prisma/seed.ts` if the seed data needs updating

---

## Environment Variables

- Never commit `.env.local` or `.env` with real credentials
- Add new variables to `.env.example` with a placeholder value and a comment
- Document new variables in `docs/SETUP.md`

---

## Testing

There's no automated test suite yet. Before submitting a PR, manually verify:

- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes
- [ ] The feature works end-to-end in the browser
- [ ] Mobile layout looks correct at 375px width
- [ ] No console errors in the browser
- [ ] API endpoints return the correct response shape
