# Vrikshavalli — TODO & Progress Tracker

> **Stack:** Next.js 16 (App Router) · Drizzle ORM · Neon (PostgreSQL) · Better Auth · Zod · UploadThing · Recharts  
> **DB scripts:** `pnpm db:push` (dev) · `pnpm db:seed` (initial data)

---

## Overall Progress

| Area | Status |
|------|--------|
| Frontend (all customer pages) | ✅ Complete |
| Auth (email + Google OAuth) | ✅ Complete |
| Database schema + migrations | ✅ Complete |
| All customer-facing API routes | ✅ Complete |
| Admin panel (all pages) | ✅ Complete |
| Admin API routes | ✅ Complete |
| Image uploads (UploadThing) | ✅ Complete |
| Coupon system (% + flat, new-users-only) | ✅ Complete |
| Role-based login redirect | ✅ Complete |
| Vruksha AI (Gemini 2.5 Flash) | ✅ Complete |

---

## Frontend Pages — Current Status

All pages are **complete and wired to real APIs**.

| Route | Page | Notes |
|-------|------|-------|
| `/` | ✅ Done | Homepage with real products + categories |
| `/about-us` | ✅ Done | Static |
| `/contact` | ✅ Done | Wired to `POST /api/contact` |
| `/faqs` | ✅ Done | Static |
| `/garden-services` | ✅ Done | Form UI only — API pending |
| `/gifting` | ✅ Done | Wired to `POST /api/gifting` |
| `/login` | ✅ Done | Email + Google, redirects to `/post-login` |
| `/register` | ✅ Done | Email + Google, Google redirects to `/post-login` |
| `/post-login` | ✅ Done | Role-based redirect (admin → `/admin`, customer → `/`) |
| `/orders` | ✅ Done | Wired to `GET /api/orders` |
| `/orders/[id]` | ✅ Done | Wired to `GET /api/orders/[id]` |
| `/our-story` | ✅ Done | Static |
| `/privacy-policy` | ✅ Done | Static |
| `/product` | ✅ Done | Product list wired to `GET /api/products` |
| `/product/[id]` | ✅ Done | Wired to `GET /api/products/[id]` |
| `/thankyou` | ✅ Done | Shows real order ID from checkout |
| `/terms` | ✅ Done | Static |
| `/vruksha-ai` | ✅ Done | Upload page with drag-drop and progress bar |
| `/vruksha-ai/results` | ✅ Done | Gemini 2.5 Flash AI diagnosis results |
| `/wishlist` | ✅ Done | Wired to real Wishlist API |
| `/profile` | ✅ Done | Name, phone, shipping address edit |
| `/admin` | ✅ Done | Dashboard — KPI cards + Recharts charts |
| `/admin/orders` | ✅ Done | Table + status edit modal |
| `/admin/products` | ✅ Done | Full CRUD + UploadThing images |
| `/admin/users` | ✅ Done | List + promote/demote |
| `/admin/coupons` | ✅ Done | Full CRUD + discountType + newUsersOnly |
| `/admin/contact` | ✅ Done | Paginated submissions viewer |
| `/admin/gifting` | ✅ Done | Paginated enquiries viewer |

---


## Completed Phases

### ✅ Phase 0 — Environment & Secrets
- `.env.local` documented in README with all required variables
- `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, Google OAuth, `GEMINI_API_KEY`, `UPLOADTHING_TOKEN`

### ✅ Phase 1 — Database Setup
- All schema files written and applied via `pnpm db:push`
- Tables: `user`, `session`, `account`, `verification` (Better Auth), `users`, `categories`, `products`, `orders`, `wishlist`, `coupons`, `addresses`, contact submissions, gifting enquiries
- `lib/db/seed.ts` created — run with `pnpm db:seed` (seeds 5 categories + 6 products)

### ✅ Phase 2 — Auth
- Better Auth wired at `app/api/auth/[...all]/route.ts`
- `lib/current-user.ts` — `getCurrentUser()` resolves session → `users` row, auto-creates on first login
- `lib/session.ts` — `getSession()` wrapper for Route Handlers
- Post-login role-based redirect: `/post-login` page checks `/api/profile` role → sends admins to `/admin`, others to `/`

### ✅ Phase 3 — Profile API
- `GET /api/profile` — returns id, name, email, phone, role, shippingAddress
- `PATCH /api/profile` — updates name, phone, shippingAddress (Zod-validated)
- BagSlider `useDeliveryAddress` hook wired to real API
- `/profile` page built (name, phone, shipping address edit)

### ✅ Phase 4 — Products API
- `GET /api/products` — search, category filter, page, limit, isActive
- `GET /api/products/[id]` — single product with category join; 404 on missing/inactive
- Admin variants at `GET/POST/PATCH/DELETE /api/admin/products` (admin-only via `requireAdmin()`)
- Product detail page wired to real API

### ✅ Phase 5 — Categories API
- `GET /api/categories` — all categories, no auth required
- `POST /api/categories` — admin only

### ✅ Phase 6 — Wishlist API
- `wishlist` DB table with unique constraint on `(userId, productId)`
- `GET /api/wishlist` — items joined with product details
- `POST /api/wishlist` — upsert with `onConflictDoNothing`
- `DELETE /api/wishlist/[productId]` — removes by userId + productId
- `WishlistContext` wired to real API; localStorage fallback for guests

### ✅ Phase 7 — Orders API
- `POST /api/orders` — validates stock, computes total server-side (subtotal + coupon + GST + shipping), generates `VRK-XXXXXXXX` order number, deducts stock in DB transaction
- `GET /api/orders` — paginated order history for current user
- `GET /api/orders/[id]` — single order; verifies ownership
- `/orders` and `/orders/[id]` pages wired to real API
- `/thankyou` page wired to real order ID from checkout

### ✅ Phase 8 — Coupon System
- `coupons` table: `discountType` ("percentage" | "flat"), `discountPct` (value), `description`, `newUsersOnly`, `maxUses`, `usedCount`, `expiresAt`, `isActive`
- `POST /api/coupons/validate` — case-insensitive lookup; checks active, expiry, max uses, new-users-only (queries orders table for prior purchases)
- BagSlider handles both `%` and flat `₹` discounts; shows coupon description
- Admin CRUD at `/api/admin/coupons` — create/toggle/delete with all fields

### ✅ Phase 9 — Contact & Gifting Forms
- `POST /api/contact` — Zod-validated; stores in DB; accessible in admin panel
- `POST /api/gifting` — Zod-validated; stores enquiry in DB; accessible in admin panel

### ✅ Phase 10 — Admin Panel

**Auth middleware:** `lib/admin-auth.ts` — `requireAdmin()` used in every admin route

**Dashboard** (`/admin`):
- KPI cards: total revenue, orders, registered users, active products
- Secondary stats: processing orders, active coupons, contact messages, gifting enquiries
- Recharts donut chart (order status distribution) + bar chart (store overview)
- Recent orders feed

**Orders** (`/admin/orders`):
- Paginated table; search + filter by status; edit modal for order/payment status; body scroll locked

**Products** (`/admin/products`):
- Full CRUD with create + edit modals
- UploadThing image upload: main cover + up to 4 extra images
- Table: thumbnail, discount badge, stock health bar, tag pills, numbered pagination

**Users** (`/admin/users`):
- Paginated list; promote to admin / demote to customer

**Coupons** (`/admin/coupons`):
- Create modal: code, discount type toggle (% / flat ₹), value, description, new-customers-only toggle, max uses, expiry
- Table shows formatted discount (e.g. "15% off" or "₹50 off"), new-users-only violet badge
- Toggle active/inactive, delete

**Contact** (`/admin/contact`):
- Paginated submissions table; modal to read full message

**Gifting** (`/admin/gifting`):
- Paginated enquiries table; modal to view full enquiry details

**Sidebar** (`AdminSidebar.tsx`):
- Vrukshavalli logo replacing text branding
- Logout button (calls `signOut()` → redirects to `/login`)
- Body scroll lock on all admin modals

### ✅ Phase 11 — Product Detail Page
- `/product/[id]` wired to `GET /api/products/[id]`

### ✅ Phase Vruksha AI — AI Plant Disease Analyzer
- Upload page with drag-drop, 6-stage animated progress bar
- Gemini 2.5 Flash API with retry + exponential backoff
- Results page: diagnosis, symptoms, causes, treatment, fertilization, care tips
- Navbar link on desktop + mobile (amber styled)

---

## Remaining / Future Work

### 🔲 Phase 12 — Live Search
- `components/SearchBar.tsx` renders but has no live API call
- Wire to `GET /api/products?search=<term>` with 300 ms debounce
- Show dropdown of up to 5 results with thumbnail; navigate to `/product/<id>` on click

### 🔲 Checkout Flow
- `POST /api/orders` is complete on the backend; bag currently has no "Place Order" button wired to it
- Connect BagSlider checkout to `POST /api/orders` and redirect to `/thankyou?orderId=...`
- Implement payment gateway integration (Razorpay recommended for INR)

### 🔲 Garden Services Enquiry API
- `/garden-services` page has a form; currently no API or DB storage
- Add `POST /api/garden-services` similar to contact/gifting

### 🔲 Order / Contact Email Notifications
- Send order confirmation email to customer after `POST /api/orders`
- Forward contact and gifting form submissions to store inbox
- Recommended: Resend (`resend.com`)

### 🔲 Product Reviews / Ratings
- Add `reviews` table (userId, productId, rating, comment, createdAt)
- `POST /api/products/[id]/reviews`, `GET /api/products/[id]/reviews`
- Star rating display on `/product/[id]` and `ProductCard.tsx`

### 🔲 Multiple Saved Addresses
- `GET/POST /api/addresses` and `PATCH/DELETE /api/addresses/[id]` routes exist
- Multi-address selection UI not yet built (currently single address from profile)

### 🔲 Profile Page Improvements
- Order history tab
- Avatar upload (UploadThing)

---

## API Routes — Final Status

| Route | Method(s) | Auth | Status |
|-------|-----------|------|--------|
| `/api/auth/[...all]` | GET, POST | — | ✅ Done |
| `/api/profile` | GET, PATCH | User | ✅ Done |
| `/api/products` | GET | Public | ✅ Done |
| `/api/products/[id]` | GET | Public | ✅ Done |
| `/api/categories` | GET | Public | ✅ Done |
| `/api/wishlist` | GET, POST | User | ✅ Done |
| `/api/wishlist/[productId]` | DELETE | User | ✅ Done |
| `/api/orders` | GET, POST | User | ✅ Done |
| `/api/orders/[id]` | GET | User | ✅ Done |
| `/api/addresses` | GET, POST | User | ✅ Done |
| `/api/addresses/[id]` | PATCH, DELETE | User | ✅ Done |
| `/api/coupons/validate` | POST | Public | ✅ Done |
| `/api/contact` | POST | Public | ✅ Done |
| `/api/gifting` | POST | Public | ✅ Done |
| `/api/uploadthing` | GET, POST | Admin | ✅ Done |
| `/api/vruksha-ai` | POST | Public | ✅ Done |
| `/api/admin/stats` | GET | Admin | ✅ Done |
| `/api/admin/orders` | GET | Admin | ✅ Done |
| `/api/admin/orders/[id]` | PATCH | Admin | ✅ Done |
| `/api/admin/products` | GET, POST | Admin | ✅ Done |
| `/api/admin/products/[id]` | PATCH, DELETE | Admin | ✅ Done |
| `/api/admin/users` | GET | Admin | ✅ Done |
| `/api/admin/users/[id]` | PATCH | Admin | ✅ Done |
| `/api/admin/coupons` | GET, POST | Admin | ✅ Done |
| `/api/admin/coupons/[id]` | PATCH, DELETE | Admin | ✅ Done |
| `/api/admin/contact` | GET | Admin | ✅ Done |
| `/api/admin/gifting` | GET | Admin | ✅ Done |
| `/api/garden-services` | POST | Public | 🔲 Pending |
| `/api/products/[id]/reviews` | GET, POST | User | 🔲 Pending |
| Search suggestions | GET | Public | 🔲 Pending |

---

## Response Shape Convention

```ts
// Success
{ "success": true, "data": <payload>, "pagination"?: { page, limit, total, totalPages } }

// Error
{ "success": false, "error": "<message>", "details"?: <zod field errors> }
```

HTTP status codes: `200` OK · `201` Created · `204` No Content · `400` Bad Request · `401` Unauthenticated · `403` Forbidden · `404` Not Found · `409` Conflict · `422` Unprocessable · `500` Server Error
