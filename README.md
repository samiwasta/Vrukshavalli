# Vrukshavalli

India's premier luxury plant e-commerce destination — indoor and outdoor plants, planters, seeds, plant care products, and accessories with expert care guides and nationwide delivery.

---

## Tech Stack

### Frontend
| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Animations | Motion (`motion/react`) |
| Icons | Tabler Icons React |
| Carousel | Swiper |
| Charts | Recharts |

### Backend / Data
| Layer | Technology |
|-------|------------|
| Database | Neon (serverless PostgreSQL) |
| ORM | Drizzle ORM + Drizzle Kit |
| Validation | Zod + drizzle-zod |
| Auth | Better Auth (email/password + Google OAuth) |
| File Uploads | UploadThing 7.x |
| AI | Google Gemini 2.5 Flash |

### Tooling
| Tool | Purpose |
|------|---------|
| pnpm | Package manager |
| TypeScript | Type safety across the entire codebase |
| ESLint | Linting (`eslint-config-next`) |

---

## Prerequisites

- Node.js 20+
- pnpm 9+ (`npm i -g pnpm`)
- A [Neon](https://neon.tech) PostgreSQL database
- (Optional) Google OAuth credentials for social login
- (Optional) UploadThing account for product image uploads

---

## Local Development Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create `.env.local` at the project root — **never commit this file**.

```env
# Neon PostgreSQL — get from neon.tech dashboard
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Better Auth — generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=<long-random-string>

# App base URL (used for OAuth callbacks)
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional — social login is skipped if omitted)
# Authorised redirect URI: http://localhost:3000/api/auth/callback/google
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Gemini AI — for Vruksha AI plant disease analyzer
# Get your API key from: https://aistudio.google.com/apikey
GEMINI_API_KEY=<your-gemini-api-key>

# UploadThing — for product image uploads in the admin panel
# Get your token from: https://uploadthing.com/dashboard
UPLOADTHING_TOKEN=<your-uploadthing-token>

# Cashfree (payments) — https://www.cashfree.com
CASHFREE_APP_ID=<app-id>
CASHFREE_SECRET_KEY=<secret-key>
# "sandbox" for test, "production" for live (server-side order API)
CASHFREE_ENV=sandbox
# Client SDK env: "sandbox" or "production" (must match NEXT_PUBLIC)
NEXT_PUBLIC_CASHFREE_ENV=sandbox

# Optional: only for local webhook testing — never use in production
# CASHFREE_SKIP_WEBHOOK_VERIFY=true
```

### 3. Set up the database

```bash
# Development (quick sync; no new migration file)
pnpm db:push
pnpm db:seed     # optional — categories + sample products

# Production / CI (apply versioned migrations under lib/db/migrations)
pnpm db:migrate
```

### 4. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin) (requires an account with `role = "admin"` in the `users` table).

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate SQL migrations from schema |
| `pnpm db:migrate` | Apply pending migrations to the database |
| `pnpm db:push` | Push schema directly (no migration file — dev only) |
| `pnpm db:studio` | Open Drizzle Studio (local DB GUI) |
| `pnpm db:seed` | Seed categories and sample products |

---

## Project Structure

```
vrukshavalli/
├── app/
│   ├── (auth)/               # Auth pages (login, register, post-login redirect)
│   ├── about-us/
│   ├── admin/                # Admin panel (role-protected)
│   │   ├── AdminSidebar.tsx  # Sidebar with logo + logout
│   │   ├── layout.tsx        # Admin layout (server component, role check)
│   │   ├── page.tsx          # Dashboard — KPI cards, Recharts charts, recent orders
│   │   ├── orders/           # Orders list + status/payment PATCH modal
│   │   ├── products/         # Products CRUD + UploadThing image upload
│   │   ├── users/            # Customer list + search
│   │   ├── coupons/          # Coupon CRUD (type toggle, new-users-only flag)
│   │   ├── contact/          # Contact submissions viewer
│   │   ├── gifting/          # Gifting enquiries viewer
│   │   └── garden-services/  # Garden services enquiries
│   ├── api/
│   │   ├── addresses/        # Saved delivery addresses CRUD
│   │   ├── admin/            # Admin-only REST routes
│   │   │   ├── coupons/      # GET, POST, PATCH, DELETE
│   │   │   ├── gifting/      # GET enquiries
│   │   │   ├── orders/       # GET list; [id]/ PATCH status
│   │   │   ├── products/     # GET, POST, PATCH, DELETE
│   │   │   ├── stats/        # Dashboard KPI aggregates
│   │   │   ├── contact/      # GET submissions
│   │   │   ├── garden-services/ # GET enquiries
│   │   │   └── users/        # GET customers (PATCH exists for legacy)
│   │   ├── auth/[...all]/    # Better Auth handler
│   │   ├── categories/       # GET all, POST (admin)
│   │   ├── checkout/         # POST — Cashfree order session (auth)
│   │   ├── contact/          # POST contact form submission
│   │   ├── coupons/validate/ # POST coupon validation (public)
│   │   ├── garden-services/  # POST garden enquiry (public)
│   │   ├── gifting/          # POST gifting enquiry
│   │   ├── payments/webhook/ # POST Cashfree webhook
│   │   ├── products/         # GET list + GET [id]
│   │   ├── profile/          # GET + PATCH user profile
│   │   ├── uploadthing/      # UploadThing file router handler
│   │   ├── vruksha-ai/       # Gemini AI plant analysis
│   │   └── wishlist/         # GET, POST, DELETE [productId]
│   ├── contact/
│   ├── faqs/
│   ├── features/
│   │   ├── bag/              # BagSlider (coupon, address, tax, shipping)
│   │   ├── footer/
│   │   ├── homepage/         # Hero, BestSellers, NewArrivals, CategoryBanners, etc.
│   │   ├── navbar/           # Desktop + mobile navbar
│   │   ├── product/
│   │   └── ribbon/
│   ├── garden-services/
│   ├── gifting/
│   ├── orders/               # Order history + [id] detail
│   ├── our-story/
│   ├── privacy-policy/
│   ├── product/              # Product listing + [id] detail
│   ├── terms/
│   ├── thankyou/
│   ├── vruksha-ai/           # AI plant disease analyzer + results
│   ├── wishlist/
│   └── profile/              # User profile page
├── components/
│   ├── ProductCard.tsx
│   ├── SearchBar.tsx
│   └── ui/
├── context/
│   ├── BagContext.tsx
│   └── WishlistContext.tsx
├── lib/
│   ├── admin-auth.ts         # requireAdmin() helper
│   ├── auth.ts               # Better Auth server config
│   ├── auth-client.ts        # signIn, signOut, useSession
│   ├── current-user.ts       # getCurrentUser() — resolves session → users row
│   ├── session.ts            # getSession() wrapper
│   ├── uploadthing.ts        # UploadThing file router
│   ├── uploadthing-react.ts  # useUploadThing hook export
│   ├── util.ts               # cn() and other utilities
│   └── db/
│       ├── index.ts
│       ├── seed.ts           # Category + product seed script
│       └── schema/
│           ├── addresses.ts
│           ├── auth.ts
│           ├── categories.ts
│           ├── coupons.ts
│           ├── orders.ts
│           ├── products.ts
│           ├── users.ts
│           └── wishlist.ts
├── drizzle.config.ts
├── next.config.ts
├── README.md
├── TODO.md
└── .env.local                # ← create this (not committed)
```

---

## Current Features

### Customer-Facing Pages
| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ Done | Hero, BestSellers, NewArrivals, HandPicked, CategoryBanners, Ceramics, CourseBanner, CTA, Features, ImageBento, Testimonials |
| `/about-us` | ✅ Done | Brand overview, founders, stats, award callout, contact info |
| `/contact` | ✅ Done | Contact form wired to `POST /api/contact` — stores submissions in DB |
| `/faqs` | ✅ Done | Help centre — search, category filter chips, accordion |
| `/garden-services` | ✅ Done | Enquiry modal wired to `POST /api/garden-services`; admin inbox at `/admin/garden-services` |
| `/gifting` | ✅ Done | Corporate gifting enquiry form wired to `POST /api/gifting` |
| `/login` | ✅ Done | Email/password + Google OAuth; role-based redirect (admin → `/admin`) |
| `/orders` | ✅ Done | Order history from real API |
| `/orders/[id]` | ✅ Done | Single order detail + tracking timeline |
| `/our-story` | ✅ Done | Full brand story, 1993 roots, award, mission |
| `/privacy-policy` | ✅ Done | Static |
| `/product` | ✅ Done | Product gallery from `GET /api/products` (category, flags, search); `SearchBar` live suggestions |
| `/product/[id]` | ✅ Done | Product detail page |
| `/profile` | ✅ Done | User profile — name, phone, shipping address |
| `/register` | ✅ Done | Email/password + Google OAuth |
| `/thankyou` | ✅ Done | Post-checkout confirmation |
| `/terms` | ✅ Done | Static |
| `/vruksha-ai` | ✅ Done | AI plant disease analyzer — upload, progress bar, Gemini analysis |
| `/vruksha-ai/results` | ✅ Done | Diagnosis results — symptoms, causes, treatment, care tips |
| `/wishlist` | ✅ Done | Wishlist page backed by real API |

### Admin Panel (`/admin`)
| Route | Status | Notes |
|-------|--------|-------|
| `/admin` | ✅ Done | KPI cards, Recharts donut + bar charts, recent orders feed |
| `/admin/orders` | ✅ Done | Paginated order list; PATCH status + payment via modal |
| `/admin/products` | ✅ Done | Full CRUD; UploadThing image upload; stock health bar; discount badge |
| `/admin/users` | ✅ Done | Customers only; name, phone, email, primary address, joined date; search |
| `/admin/coupons` | ✅ Done | Create/toggle/delete coupons; % or flat ₹ discount; new-users-only flag |
| `/admin/contact` | ✅ Done | View all contact form submissions |
| `/admin/gifting` | ✅ Done | View all gifting enquiries |
| `/admin/garden-services` | ✅ Done | Garden services enquiries (list, search, detail modal) |

### Shopping Bag & Checkout
- Slide-in bag panel — quantity stepper, item remove
- Coupon validation against real DB; supports percentage and flat ₹ off; new-users-only restriction
- Tax (GST 18%) and shipping (flat ₹129; free bag subtotal ₹999+ before GST) calculated live
- Delivery address from saved addresses API (`useDeliveryAddress`); validation before pay
- **Cashfree Payments** — `POST /api/checkout` creates a Cashfree order; client opens Cashfree checkout; `POST /api/payments/webhook` updates order payment status (configure webhook URL in Cashfree dashboard)
- Thank-you page loads order by id after successful payment

### Auth
- Email + password sign-up and sign-in via Better Auth
- Google OAuth (enabled when `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are set)
- Post-login role-based redirect: admin users land on `/admin`, others on `/`
- Session available client-side via `useSession()` from `lib/auth-client.ts`

---

## Backend API Routes

| Route | Methods | Auth | Status |
|-------|---------|------|--------|
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
| `/api/garden-services` | POST | Public | ✅ Done |
| `/api/checkout` | POST | User | ✅ Done |
| `/api/payments/webhook` | POST | — (Cashfree signature) | ✅ Done |
| `/api/uploadthing` | GET, POST | Admin | ✅ Done |
| `/api/vruksha-ai` | POST | Public | ✅ Done |
| `/api/admin/stats` | GET | Admin | ✅ Done |
| `/api/admin/orders` | GET | Admin | ✅ Done |
| `/api/admin/orders/[id]` | PATCH | Admin | ✅ Done |
| `/api/admin/products` | GET, POST, PATCH, DELETE | Admin | ✅ Done |
| `/api/admin/users` | GET, PATCH | Admin | ✅ Done |
| `/api/admin/coupons` | GET, POST, PATCH, DELETE | Admin | ✅ Done |
| `/api/admin/contact` | GET | Admin | ✅ Done |
| `/api/admin/gifting` | GET | Admin | ✅ Done |
| `/api/admin/garden-services` | GET | Admin | ✅ Done |

---

## Documentation

| File | Purpose |
|------|---------|
| **`README.md`** | Setup, env vars, feature map, API index, deployment |
| **`TODO.md`** | Backlog, **production readiness checklist**, full API reference |

---

## Production readiness (summary)

Before going live, work through the detailed checklist in **[`TODO.md`](./TODO.md)** (`## Production readiness checklist`). Highlights:

- Run **`pnpm db:migrate`** on production DB; confirm admin user `role = admin`.
- Set **Cashfree** production keys, **`NEXT_PUBLIC_CASHFREE_ENV=production`**, **`CASHFREE_ENV=production`**, and register webhook URL: `https://<your-domain>/api/payments/webhook`.
- Set **`BETTER_AUTH_URL`** to the canonical HTTPS origin; update **Google OAuth** redirect URIs.
- **Operational:** transactional email (order confirmation, enquiry alerts), monitoring/error tracking, backups, legal pages review, returns/refund SOP aligned with `/terms`.

---

## Deployment

The app is designed for deployment on [Vercel](https://vercel.com).

1. Connect the repository to a Vercel project.
2. Set all environment variables from `.env.local` in the Vercel dashboard (including Cashfree and UploadThing).
3. Set `BETTER_AUTH_URL` to your production domain (e.g. `https://vrukshavalli.com`).
4. Update the Google OAuth authorised redirect URI to `https://<your-domain>/api/auth/callback/google`.
5. In Cashfree dashboard, point the payment webhook to `https://<your-domain>/api/payments/webhook`.
6. Deploy — `pnpm build` runs automatically.

For other platforms see the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
