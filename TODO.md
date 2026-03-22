# Vrikshavalli — Progress, backlog & production checklist

> **Stack:** Next.js 16 (App Router) · Drizzle ORM · Neon (PostgreSQL) · Better Auth · Cashfree · Zod · UploadThing · Recharts · Gemini  
> **DB:** `pnpm db:push` + `pnpm db:seed` for quick local setup · `pnpm db:migrate` for production (versioned SQL under `lib/db/migrations/`)

---

## Implemented (high level)

| Area | Status |
|------|--------|
| Storefront pages + product gallery & PDP | Done (real APIs) |
| Auth (email + Google OAuth) + post-login role redirect | Done |
| Profile + saved addresses (`/api/addresses`) | Done |
| Wishlist, bag, coupons, checkout + **Cashfree** + payment webhook | Done |
| Orders (create, list, detail), admin orders/products/users/coupons | Done |
| Contact, gifting, **garden services** forms + DB + admin viewers | Done |
| Live **SearchBar** (`GET /api/products?search=&limit=5`) | Done |
| Vruksha AI (Gemini) | Done |
| Admin dashboard stats (incl. garden enquiries count) | Done |

---

## Customer & admin routes (reference)

### Customer pages

| Route | Notes |
|-------|-------|
| `/` | Homepage, real product/category data |
| `/product`, `/product/[slug-or-id]` | Gallery + PDP |
| `/contact` | `POST /api/contact` |
| `/gifting` | `POST /api/gifting` |
| `/garden-services` | `POST /api/garden-services` |
| `/profile` | Profile + multiple saved addresses |
| `/orders`, `/orders/[id]` | `GET /api/orders`, `GET /api/orders/[id]` |
| `/thankyou` | Post-payment; order id in query |
| `/wishlist`, `/vruksha-ai`, static pages | As implemented |

### Admin pages

| Route | Notes |
|-------|-------|
| `/admin` | KPIs, charts, recent orders |
| `/admin/orders`, `/products`, `/coupons` | CRUD / status |
| `/admin/users` | **Customers only** (no promote/demote UI); search |
| `/admin/contact`, `/gifting`, `/garden-services` | Enquiry/submission viewers |

---

## Production readiness checklist

Use this before or during go-live. Items are **operational** unless marked *optional*.

### Infrastructure & config

- [ ] **Database:** Run all migrations on production (`pnpm db:migrate`). Avoid `db:push` on prod if you rely on migration history.
- [ ] **Secrets:** Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (canonical `https://` origin), `UPLOADTHING_TOKEN`, `GEMINI_API_KEY` (if AI is enabled).
- [ ] **Cashfree:** `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENV=production`, `NEXT_PUBLIC_CASHFREE_ENV=production`. Register webhook URL: `https://<domain>/api/payments/webhook`. Do **not** set `CASHFREE_SKIP_WEBHOOK_VERIFY` in production.
- [ ] **Google OAuth:** Production redirect URI `https://<domain>/api/auth/callback/google`.
- [ ] **Admin access:** At least one `users` row with `role = admin` (via DB or controlled PATCH).

### Commerce & risk

- [ ] **Test full checkout** on Cashfree **production** with a small real/UAT payment; confirm webhook updates `paymentStatus` and order appears in admin.
- [ ] **Stock:** Confirm low/out-of-stock behaviour matches policy (PDP, bag, checkout validation).
- [ ] **Coupons:** Verify expiry, max uses, new-users-only in production data.
- [ ] **Refunds / cancellations:** Define SOP; align with `/terms` and admin order status workflow.

### Customer trust & compliance

- [ ] **Transactional email:** Order confirmation after successful payment; *optional* alerts for contact/gifting/garden enquiries (e.g. Resend, SES).
- [ ] **Privacy / GST:** Ensure legal pages and invoice/GST copy match how you operate.
- [ ] **Content:** Replace any placeholder homepage empty states (“coming soon”) with real merchandising when ready.

### Observability & safety

- [ ] **Error monitoring:** e.g. Sentry on Next.js API + client (*optional* but recommended).
- [ ] **Backups:** Neon backup/restore tested; document RPO/RTO.
- [ ] **Rate limits:** Public POST endpoints (contact, gifting, garden, AI) have basic limits; review if abused.

---

## Backlog (product / engineering)

Not required for a minimal launch, but typical next steps:

| Item | Description |
|------|-------------|
| **Product reviews** | `reviews` table; `GET/POST` APIs; stars on PDP / cards |
| **Profile extras** | Order history tab on `/profile`; avatar upload (UploadThing) |
| **Search / discovery** | Category facets, sort UX polish, SEO for product URLs |
| **Admin** | Export orders CSV; inventory alerts; richer analytics |
| **API hardening** | Trim stale comment blocks in `app/api/products/route.ts`; stricter admin POST validation; optional rate limits per route |

---

## API routes — status

| Route | Methods | Auth | Status |
|-------|---------|------|--------|
| `/api/auth/[...all]` | GET, POST | — | Done |
| `/api/profile` | GET, PATCH | User | Done |
| `/api/products` | GET | Public | Done |
| `/api/products/[id]` | GET | Public | Done |
| `/api/categories` | GET, POST | Public / Admin | Done |
| `/api/wishlist` | GET, POST | User | Done |
| `/api/wishlist/[productId]` | DELETE | User | Done |
| `/api/orders` | GET, POST | User | Done |
| `/api/orders/[id]` | GET | User | Done |
| `/api/checkout` | POST | User | Done |
| `/api/payments/webhook` | POST | Cashfree HMAC | Done |
| `/api/addresses` | GET, POST | User | Done |
| `/api/addresses/[id]` | PATCH, DELETE | User | Done |
| `/api/coupons/validate` | POST | Public | Done |
| `/api/contact` | POST | Public | Done |
| `/api/gifting` | POST | Public | Done |
| `/api/garden-services` | POST | Public | Done |
| `/api/uploadthing` | GET, POST | Admin | Done |
| `/api/vruksha-ai` | POST | Public | Done |
| `/api/admin/stats` | GET | Admin | Done |
| `/api/admin/orders` | GET | Admin | Done |
| `/api/admin/orders/[id]` | PATCH | Admin | Done |
| `/api/admin/products` | GET, POST | Admin | Done |
| `/api/admin/products/[id]` | PATCH, DELETE | Admin | Done |
| `/api/admin/users` | GET | Admin | Done |
| `/api/admin/users/[id]` | PATCH | Admin | Done (legacy role change) |
| `/api/admin/coupons` | GET, POST | Admin | Done |
| `/api/admin/coupons/[id]` | PATCH, DELETE | Admin | Done |
| `/api/admin/contact` | GET | Admin | Done |
| `/api/admin/gifting` | GET | Admin | Done |
| `/api/admin/garden-services` | GET | Admin | Done |
| `/api/products/[id]/reviews` | GET, POST | User | Not built |

**Search:** Implemented via `GET /api/products?search=` (used by `SearchBar` and product gallery).

---

## Response shape convention

```ts
// Success
{ "success": true, "data": <payload>, "pagination"?: { page, limit, total, totalPages } }

// Error
{ "success": false, "error": "<message>", "errors"?: <zod flatten> }
```

HTTP: `200` · `201` · `204` · `400` · `401` · `403` · `404` · `409` · `422` · `429` · `500`

---

## Phase history (archived summary)

Phases 0–11 and Vruksha AI delivered: env, Drizzle schema, Better Auth, profile, products/categories, wishlist, orders, coupons, contact & gifting, admin panel, PDP wiring. Subsequent work added Cashfree checkout/webhook, garden services end-to-end, customer-only admin users with address join, product gallery query fixes, and dashboard stats for garden enquiries.
