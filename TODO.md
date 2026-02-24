# Vrukshavalli — Backend Developer TODO

> **Stack:** Next.js 16 (App Router) · Drizzle ORM · Neon (PostgreSQL) · Better Auth · Zod  
> **DB scripts:** `pnpm db:generate` → `pnpm db:migrate` → `pnpm db:push`  
> **Follow tasks in the order they appear here.** Each task lists the files to touch, the exact behaviour required, and the edge cases you must handle.

---

## Frontend Pages — Current Status

All pages below are **frontend-complete**. Items marked ⚠️ are wired to mock / localStorage data and must be connected to the real API once the corresponding backend phase is done.

| Route | Frontend | Backend dependency |
|-------|----------|--------------------|
| `/` | ✅ Done | Products API (Phase 4) |
| `/about-us` | ✅ Done | — (static) |
| `/contact` | ✅ Done | Phase 9.1 |
| `/faqs` | ✅ Done | — (static) |
| `/garden-services` | ✅ Done | — (enquiry form, no API yet) |
| `/gifting` | ✅ Done | Phase 9.2 |
| `/login` | ✅ Done | Better Auth (done) |
| `/orders` | ✅ Done | Phase 7.2 — wire real API |
| `/orders/[id]` | ✅ Done | Phase 7.3 — wire real API |
| `/our-story` | ✅ Done | — (static) |
| `/privacy-policy` | ✅ Done | — (static) |
| `/product` | ✅ Done | Phase 4.1 — wire real API |
| `/product/[id]` | ✅ Done | Phase 11 |
| `/register` | ✅ Done | Better Auth (done) |
| `/thankyou` | ✅ Done | Phase 7.1 — wire order ID |
| `/terms` | ✅ Done | — (static) |
| `/vruksha-ai` | ✅ Done | Gemini AI (Phase Vruksha AI) |
| `/vruksha-ai/results` | ✅ Done | Gemini AI (Phase Vruksha AI) |
| `/wishlist` | ✅ Done | Phase 6.5 — wire real API |
| `/profile` | ❌ Not built | Phase 3 |

---

## Phase Vruksha AI — AI Plant Disease Analyzer ✅ COMPLETED

**Status:** ✅ Feature complete and deployed

AI-powered plant disease analyzer using Google Gemini 2.5 Flash. Users upload a plant image and receive instant diagnosis with treatment recommendations.

### Features Implemented

1. **Upload Page** (`/app/vruksha-ai/page.tsx`)
   - Drag-and-drop file upload zone with visual feedback
   - File validation (PNG/JPG/JPEG only, max 10MB)
   - Image preview with file metadata
   - 6-stage animated progress bar during analysis:
     - Uploading Image → Scanning Plant → Identifying Species → Detecting Issues → AI Analysis → Generating Report
   - Error handling with user-friendly messages
   - Responsive design with emerald/teal color theme

2. **Gemini API Integration** (`/app/api/vruksha-ai/route.ts`)
   - POST endpoint accepting multipart/form-data
   - Model: `gemini-2.5-flash` (confirmed working)
   - Retry logic with exponential backoff for rate limiting (429 errors)
   - Structured JSON response prompt requesting:
     - Plant identification (common + scientific name)
     - Health status (healthy/diseased)
     - Confidence percentage
     - Disease name and severity (none/mild/moderate/severe)
     - Summary, symptoms, causes
     - Precautions, treatment steps
     - Fertilization guide, general care tips
   - Error handling: 422 for non-plant images, 429 for rate limits, 500 for server errors

3. **Results Page** (`/app/vruksha-ai/results/page.tsx`)
   - Compact header with breadcrumb navigation
   - Status hero card with gradient background (emerald for healthy, rose for diseased)
   - Large plant image thumbnail with decorative blur elements
   - Status icon, disease name, severity badge, confidence meter
   - AI-generated summary
   - 4-column info grid (2-col on mobile) with plant name, scientific name, date, file size
   - 3 grouped content sections with gradient headers:
     - **Diagnosis & Analysis** — Symptoms + Causes
     - **Treatment & Prevention** — Precautions + Treatment steps
     - **Ongoing Plant Care** — Fertilization guide + General care tips
   - Each section uses color-coded icons and bullet points with ring decorations
   - "Analyse Another Plant" CTA button
   - Results stored in sessionStorage for persistence across page reloads

4. **Environment Configuration**
   - Added `GEMINI_API_KEY` to `.env` (documented in README.md)
   - API key obtained from: https://aistudio.google.com/apikey

5. **Navbar Integration**
   - Added "✦ VRUKSHA AI" navigation link with sparkle icon
   - Styled in amber to distinguish from other nav items
   - Updated both `NavbarDesktop.tsx` and `NavbarMobile.tsx`

### Files Modified/Created

**New Files:**
- `/app/vruksha-ai/page.tsx` — Upload page with drag-drop and progress tracking
- `/app/vruksha-ai/layout.tsx` — Layout wrapper with metadata
- `/app/vruksha-ai/results/page.tsx` — Results display page
- `/app/vruksha-ai/results/layout.tsx` — Results page metadata

**Modified Files:**
- `/app/features/navbar/NavbarDesktop.tsx` — Added Vruksha AI link
- `/app/features/navbar/NavbarMobile.tsx` — Added Vruksha AI link
- `/app/globals.css` — Added missing primary color shades (50, 900, 950)
- `/.env` — Added GEMINI_API_KEY
- `/README.md` — Documented Gemini AI integration and environment setup
- `/TODO.md` — This file

**API Route:**
- `/app/api/vruksha-ai/route.ts` — Gemini analysis endpoint

### Dependencies Added

```bash
pnpm add @google/generative-ai@1.42.0
```

### Known Limitations

- Free tier Gemini API has rate limits (15 requests/minute)
- Large images (>10MB) are rejected with clear error message
- Results are stored in sessionStorage (cleared on tab close)
- No analysis history or database persistence (could be added in future phase)

### Testing Notes

- Tested with various plant images (healthy and diseased)
- Confirmed working with model `gemini-2.5-flash`
- Retry logic successfully handles temporary rate limit cooldowns
- UI tested on desktop and mobile viewports

---

## Phase 0 — Environment & Secrets

### 0.1 — Configure `.env.local`

Create `.env.local` at the project root (never commit it) with the following variables:

```env
# Neon PostgreSQL — get connection string from neon.tech dashboard
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Better Auth — generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=<long-random-string>

# App base URL  (used for OAuth callback and Better Auth)
BETTER_AUTH_URL=http://localhost:3000   # change to production URL on deployment

# Google OAuth — create credentials at console.cloud.google.com
# Authorised redirect URI: https://<your-domain>/api/auth/callback/google
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

**Edge cases:**
- Missing `DATABASE_URL` → `lib/db/index.ts` already throws a startup error. Good; do not remove that guard.
- Missing `BETTER_AUTH_SECRET` → Better Auth uses an insecure default; always set in production.
- Missing Google credentials → Google sign-in is skipped gracefully (see `lib/auth.ts`). Document this for ops.

---

## Phase 1 — Database Setup

### 1.1 — Run First Migration

The schema files are already written. You only need to apply them.

```bash
pnpm db:generate   # generates SQL from lib/db/schema/*
pnpm db:migrate    # applies migrations to Neon
```

Tables that will be created:
- `user`, `session`, `account`, `verification` — managed by Better Auth (`lib/db/schema/auth.ts`)
- `users` — app user profile table (`lib/db/schema/users.ts`)
- `categories` — product categories (`lib/db/schema/categories.ts`)
- `products` — product catalogue (`lib/db/schema/products.ts`)
- `orders` — customer orders (`lib/db/schema/orders.ts`)

### 1.2 — Resolve the Dual User Identity Problem

**This is the most critical architectural decision; fix it before writing any other API.**

The project currently has two separate user tables:

| Table | `id` type | Managed by | Purpose |
|-------|-----------|------------|---------|
| `auth.user` | `text` | Better Auth | Login, session, OAuth |
| `users` | `uuid` | App code | Profile, orders FK |

**Decision to make (choose one):**

**Option A — Recommended:** Add `authId text unique` to the `users` table. After Better Auth creates a `user` row, your API creates a matching `users` row and stores `auth.user.id` in `authId`. Use `users.id` (uuid) as the FK in `orders`.

```ts
// lib/db/schema/users.ts — add this column
authId: text("auth_id").unique(),
```

Then run `pnpm db:generate && pnpm db:migrate`.

**Option B:** Abandon the `users` table entirely and extend `auth.user` via Better Auth's plugin system. Only do this if you do not need the extra profile columns (phone, role, etc.).

**After deciding**, update the `orders` table FK comment and delete the `TODO` block in `lib/db/schema/users.ts` and `lib/db/schema/orders.ts`.

### 1.3 — Seed Categories

The homepage components (`BestSellers`, `CategoryBanners`, `Ceramics`, etc.) reference these category slugs: `plants`, `seeds`, `pots-planters`, `plant-care`, `gifting`.

Create a seed script at `lib/db/seed.ts`:

```ts
import { db } from "./index";
import { categories } from "./schema/categories";

await db.insert(categories).values([
  { name: "Plants",        slug: "plants",        image: "/category-plant.webp" },
  { name: "Seeds",         slug: "seeds",         image: "/category-seeds.avif" },
  { name: "Pots & Planters", slug: "pots-planters", image: "/category-ceramics.webp" },
  { name: "Plant Care",    slug: "plant-care",    image: "/category-care.webp" },
  { name: "Gifting",       slug: "gifting",       image: "/category-plant.webp" },
]).onConflictDoNothing();
```

Run once: `npx tsx lib/db/seed.ts`

### 1.4 — Seed Products

Create at least 20 sample products per category so the product gallery and homepage sections have real data during development. Use `lib/db/schema/products.ts` shape. Set `isNew`, `isBestSeller`, and `isHandPicked` on a subset of products — the homepage components filter by these flags.

---

## Phase 2 — Auth

Better Auth is already wired at `app/api/auth/[...all]/route.ts`. The sign-in and register UI pages are complete (`app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`). You do not need to touch the auth endpoints themselves.

### 2.1 — Post-Registration User Profile Creation

After a user registers (email/password or Google OAuth), create a corresponding row in `users` that links via `authId`.

Use Better Auth's `after:signUp` hook in `lib/auth.ts`:

```ts
// lib/auth.ts
hooks: {
  after: [
    {
      matcher: (context) => context.path === "/sign-up/email" || context.path === "/sign-up/social",
      handler: async (context) => {
        const authUser = context.context.newSession?.user;
        if (authUser) {
          await db.insert(users).values({
            authId:  authUser.id,
            email:   authUser.email,
            name:    authUser.name ?? "User",
            role:    "customer",
          }).onConflictDoNothing();
        }
      },
    },
  ],
},
```

**Edge cases:**
- OAuth sign-up may run the hook twice (first login = registration) — the `.onConflictDoNothing()` guard handles it.
- `authUser.name` can be null for some providers — provide a fallback.

### 2.2 — Session Helper Utility

Create `lib/session.ts` for use inside any Route Handler:

```ts
import { auth } from "./auth";
import { headers } from "next/headers";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
```

All subsequent API routes will import from here.

---

## Phase 3 — Profile API

### 3.1 — `GET /api/profile`

**File:** `app/api/profile/route.ts`

- Call `getSession()`; return `401` if no session.
- Look up `users` row by `authId = session.user.id`.
- If a row does not exist (user registered before the hook was in place), create one on the fly.
- Return:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Sami Khan",
    "email": "sami@example.com",
    "phone": "9876543210",
    "role": "customer",
    "shippingAddress": null
  }
}
```

**Note:** `shippingAddress` here is read from the **most recent order's `shippingAddress`** field or from a dedicated column you add to `users` (see 3.2).

### 3.2 — Add `shippingAddress` Column to `users`

```ts
// lib/db/schema/users.ts
import { jsonb } from "drizzle-orm/pg-core";

shippingAddress: jsonb("shipping_address"),
```

Run `pnpm db:generate && pnpm db:migrate`.

The `DeliveryAddress` shape used by the BagSlider (`app/features/bag/useDeliveryAddress.ts`) is already compatible:

```ts
{
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}
```

### 3.3 — `PATCH /api/profile`

**File:** `app/api/profile/route.ts` (add `PATCH` export)

- Require auth — `401` if no session.
- Accept body: `{ name?, phone?, shippingAddress? }`.
- Validate with Zod; reject unknown keys.
- Update the `users` row where `authId = session.user.id`.
- Return updated profile.

**Edge cases:**
- Do not allow changing `email` or `role` via this endpoint.
- Validate phone: 10-digit numeric string.
- Validate `shippingAddress.pincode`: 6-digit numeric string.

### 3.4 — Connect BagSlider Hook

Once `GET /api/profile` is live, replace the stub in `app/features/bag/useDeliveryAddress.ts`:

```ts
// Replace the [address, isLoading] stubs with real fetch
useEffect(() => {
  if (!session?.user?.id) return;
  setIsLoading(true);
  fetch("/api/profile")
    .then((r) => r.json())
    .then((data) => setAddress(data.data.shippingAddress ?? null))
    .catch(() => setAddress(null))
    .finally(() => setIsLoading(false));
}, [session?.user?.id]);
```

And replace `updateAddress`:

```ts
const updateAddress = async (next: DeliveryAddress) => {
  setAddress(next);
  await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shippingAddress: next }),
  });
};
```

---

## Phase 4 — Products API

**Existing file:** `app/api/products/route.ts`

The GET endpoint exists but is minimal. Harden and extend it.

### 4.1 — Harden `GET /api/products`

Add support for the following query parameters:

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Filter by name or description (already partially implemented) |
| `category` | string | Category **slug** — map to `categoryId` before querying |
| `page` | number | 1-based page number, default `1` |
| `limit` | number | Items per page, default `20`, max `100` |
| `sort` | `price_asc` \| `price_desc` \| `rating` \| `newest` | Sorting |
| `isNew` | boolean | Filter new arrivals |
| `isBestSeller` | boolean | Filter best sellers |
| `isHandPicked` | boolean | Filter hand-picked |
| `priceMin` | number | Minimum price filter |
| `priceMax` | number | Maximum price filter |

Response shape:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 85,
    "totalPages": 5
  }
}
```

**Edge cases:**
- Invalid `category` slug → return `400` with message, do not crash.
- `limit > 100` → clamp to `100`.
- `page < 1` → return `400`.
- Empty results → return `{ data: [], pagination: { total: 0 ... } }` with `200`.

### 4.2 — Add `GET /api/products/[id]`

**File:** `app/api/products/[id]/route.ts`

- Accept either a UUID (`id`) or a `slug` query param.
- Return single product with its category name joined.
- Return `404` if not found or `isActive = false`.

**Key:** The product detail page at `app/product/[id]/page.tsx` currently uses `getMockProduct()`. Once this endpoint is live, replace the mock with a real `fetch("/api/products/" + id)` call.

### 4.3 — Harden `POST /api/products` (Admin Only)

- Require auth and `users.role === "admin"` — return `403` otherwise.
- Validate body with `insertProductSchema` from `lib/db/schema/products.ts`.
- Auto-generate `slug` from `name` if not provided (e.g. `slugify(name)`).
- Return `201` on success.

### 4.4 — Add `PATCH /api/products/[id]` and `DELETE /api/products/[id]`

Both admin-only. PATCH accepts a partial product body and updates only provided fields. DELETE sets `isActive = false` (soft delete).

---

## Phase 5 — Categories API

### 5.1 — `GET /api/categories`

**File:** `app/api/categories/route.ts`

- Return all categories ordered by `name`.
- No auth required.
- Response: `{ success: true, data: [{ id, name, slug, description, image }] }`

### 5.2 — `POST /api/categories` (Admin Only)

- Require admin auth.
- Validate with `insertCategorySchema`.
- Return `201`.

---

## Phase 6 — Wishlist API

**Context file:** `context/WishlistContext.tsx` already has detailed instructions at the top of the file.

### 6.1 — Add `wishlist` DB Table

**File:** `lib/db/schema/wishlist.ts` (create new)

```ts
import { pgTable, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { products } from "./products";

export const wishlist = pgTable("wishlist", {
  id:        uuid("id").defaultRandom().primaryKey(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  uniq: unique().on(t.userId, t.productId),
}));
```

Export it from `lib/db/schema/index.ts`. Then run `pnpm db:generate && pnpm db:migrate`.

### 6.2 — `GET /api/wishlist`

- Require auth — `401` if unauthenticated.
- Return all wishlist items for the current user, joined with product details.

### 6.3 — `POST /api/wishlist`

- Require auth.
- Body: `{ productId: string }`.
- Validate product exists; return `404` otherwise.
- Upsert (use `onConflictDoNothing`) — do not error on duplicate.
- Return `201`.

### 6.4 — `DELETE /api/wishlist/[productId]`

- Require auth.
- Delete the row where `userId` and `productId` match.
- Return `204`.

### 6.5 — Connect WishlistContext

Replace the `localStorage` reads/writes in `context/WishlistContext.tsx` with API calls. Keep `localStorage` as fallback for guests; on login, merge guest list to the backend and clear storage.

---

## Phase 7 — Orders API

### 7.1 — `POST /api/orders`

**File:** `app/api/orders/route.ts`

- Require auth — `401` if unauthenticated.
- Accept body:

```ts
{
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: DeliveryAddress; // same shape as lib/db/schema/orders.ts shippingAddress
  couponCode?: string;
  paymentMethod: string;
}
```

- Validate each `productId` exists and `stock >= quantity`.
- Compute `totalAmount` server-side (do **not** trust the client total):
  - Subtotal = sum of `product.price * quantity`.
  - Apply coupon discount if `couponCode` is valid (see Phase 8).
  - Add GST 18%.
  - Add shipping: ₹0 if subtotal ≥ ₹999, else ₹79.
- Deduct stock for each product atomically (use a DB transaction).
- Generate `orderNumber`: e.g. `VRK-` + 8 upper-case alphanumeric chars.
- Insert into `orders`.
- Return `201` with the new order.

**Edge cases:**
- Insufficient stock → `409` with per-product details.
- Empty `items` array → `400`.
- Unknown `productId` → `400`.
- DB transaction failure → roll back all stock changes; return `500`.

### 7.2 — `GET /api/orders`

- Require auth.
- Return paginated list of orders for the current user, sorted by `createdAt` desc.
- Support `page` and `limit` query params.

### 7.3 — `GET /api/orders/[id]`

- Require auth.
- Return single order; `404` if not found.
- Verify `order.userId === users.id (for current user)` — do not allow a user to fetch another user's order.

### 7.4 — Orders Page ✔️ Frontend Complete

`app/orders/page.tsx` and `app/orders/[id]/page.tsx` are already built and display order history + an order detail / tracking timeline. They currently run on mock data.

Once `GET /api/orders` (7.2) and `GET /api/orders/[id]` (7.3) are live:
- Replace the mock data fetch in `app/orders/page.tsx` with a real `fetch("/api/orders")`.
- Replace the mock data fetch in `app/orders/[id]/page.tsx` with a real `fetch("/api/orders/" + id)`.
- `app/thankyou/page.tsx` also exists and shows a post-checkout confirmation — wire the real order ID from the checkout flow once `POST /api/orders` (7.1) is implemented.

---

## Phase 8 — Coupon Codes

### 8.1 — Add `coupons` DB Table

**File:** `lib/db/schema/coupons.ts` (create new)

```ts
export const coupons = pgTable("coupons", {
  id:          uuid("id").defaultRandom().primaryKey(),
  code:        text("code").notNull().unique(),
  discountPct: integer("discount_pct").notNull(),    // 0-100
  maxUses:     integer("max_uses"),                  // null = unlimited
  usedCount:   integer("used_count").default(0).notNull(),
  expiresAt:   timestamp("expires_at"),
  isActive:    boolean("is_active").default(true).notNull(),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
});
```

Export from `lib/db/schema/index.ts` and migrate.

Insert the demo codes that the BagSlider already recognises:

```sql
INSERT INTO coupons (code, discount_pct, is_active)
VALUES ('SAVE10', 10, true), ('GREEN5', 5, true), ('PLANT15', 15, true);
```

### 8.2 — `POST /api/coupons/validate`

- No auth required (so guests can check before checkout).
- Body: `{ code: string }`.
- Look up code (case-insensitive); check `isActive`, `expiresAt`, `usedCount < maxUses`.
- Return `{ valid: true, discountPct: 10 }` or `{ valid: false, reason: "..." }`.

### 8.3 — Connect BagSlider to Real Coupon API

Replace the `couponMap` constant in `app/features/bag/BagSlider.tsx` with a call to `POST /api/coupons/validate`. The 700 ms artificial delay can be removed once the real fetch is in place.

---

## Phase 9 — Contact & Gifting Forms

### 9.1 — `POST /api/contact`

**File:** `app/api/contact/route.ts`

The contact form at `app/contact/page.tsx` currently shows a local success state but **does not call any API**.

- Accept body: `{ name, email, phone?, subject, message }`.
- Validate with Zod (name required, email valid, message ≥ 20 chars).
- Send an email notification (use Resend, Nodemailer, or similar) to the store's inbox.
- Optionally store submissions in a `contact_submissions` DB table for reference.
- Return `{ success: true }` on success.
- Return `422` with field-level errors on validation failure.

**Edge cases:**
- Email provider failure → still return `200` if you saved to DB; log the send error.
- Rate limit: max 5 submissions per IP per hour to prevent spam.

### 9.2 — `POST /api/gifting`

**File:** `app/api/gifting/route.ts`

The gifting enquiry form at `app/gifting/page.tsx` also has no API call.

- Accept body: `{ fullName, email, phone, company?, giftOption, moq?, message }`.
- Validate with Zod.
- Notify the sales team by email with the full enquiry.
- Return `{ success: true }`.

---

## Phase 10 — Admin Routes

Once the product and order APIs are hardened, add lightweight admin-only utilities:

### 10.1 — Auth Middleware for Admin Routes

Create `lib/requireAdmin.ts`:

```ts
import { getSession } from "./session";
import { db } from "./db";
import { users } from "./db/schema/users";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await db.query.users.findFirst({ where: eq(users.authId, session.user.id) });
  if (user?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null; // null = allowed
}
```

Use in every admin route handler:
```ts
const denied = await requireAdmin();
if (denied) return denied;
```

### 10.2 — Order Status Update

`PATCH /api/orders/[id]` — admin only. Accept `{ status }` and update the order.

---

## Phase 11 — Product Detail Page Wire-up

**File:** `app/product/[id]/page.tsx`

The page uses `getMockProduct()`. Replace with a real fetch:

```ts
// Inside the page component or a server component wrapper
const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/products/${id}`, { cache: "no-store" });
if (!res.ok) notFound();
const { data: product } = await res.json();
```

The `Product` interface at the top of the file mostly matches the DB schema; align `careLevel`, `light`, `water`, `size`, and `petFriendly` either by adding them to the `products` table or computing them from `description` until proper fields exist.

---

## Phase 12 — Search API

**File:** `components/SearchBar.tsx`

SearchBar already renders but has no live API call. Once `GET /api/products?search=<term>` is hardened (Phase 4.1), wire it up:

- Debounce the input by 300 ms.
- Show a dropdown of up to 5 matching product names with thumbnail.
- On item click, navigate to `/product/<id>`.

---

## Summary of API Routes to Create

| Route | Method | Auth | Status |
|-------|--------|------|--------|
| `/api/auth/[...all]` | GET, POST | — | ✅ Done |
| `/api/products` | GET | None | ⚠️ Needs hardening |
| `/api/products` | POST | Admin | ⚠️ Needs auth + validation |
| `/api/products/[id]` | GET | None | ❌ Missing |
| `/api/products/[id]` | PATCH, DELETE | Admin | ❌ Missing |
| `/api/categories` | GET | None | ❌ Missing |
| `/api/categories` | POST | Admin | ❌ Missing |
| `/api/profile` | GET, PATCH | User | ❌ Missing |
| `/api/wishlist` | GET, POST | User | ❌ Missing |
| `/api/wishlist/[productId]` | DELETE | User | ❌ Missing |
| `/api/orders` | GET, POST | User | ❌ Missing — frontend pages ready |
| `/api/orders/[id]` | GET | User | ❌ Missing — frontend pages ready |
| `/api/orders/[id]` | PATCH | Admin | ❌ Missing |
| `/api/coupons/validate` | POST | None | ❌ Missing |
| `/api/contact` | POST | None | ❌ Missing |
| `/api/gifting` | POST | None | ❌ Missing |

---

## Response Shape Convention

Use a consistent envelope across all routes:

```ts
// Success
{ "success": true, "data": <payload>, "pagination"?: { ... } }

// Error
{ "success": false, "error": "<human-readable message>", "details"?: <zod errors> }
```

Map HTTP status codes as:
- `200` — OK (GET, PATCH)
- `201` — Created (POST)
- `204` — No Content (DELETE)
- `400` — Bad Request / Validation
- `401` — Unauthenticated
- `403` — Forbidden (not admin)
- `404` — Not Found
- `409` — Conflict (e.g. duplicate, insufficient stock)
- `422` — Unprocessable Entity (form validation)
- `500` — Internal Server Error (log but do not expose stack traces)
