# Vrikshavalli

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
```

### 3. Set up the database

```bash
pnpm db:push     # push schema directly to Neon (dev)
pnpm db:seed     # seed categories and sample products
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
vrikshavalli/
├── app/
│   ├── (auth)/               # Auth pages (login, register, post-login redirect)
│   ├── about-us/
│   ├── admin/                # Admin panel (role-protected)
│   │   ├── AdminSidebar.tsx  # Sidebar with logo + logout
│   │   ├── layout.tsx        # Admin layout (server component, role check)
│   │   ├── page.tsx          # Dashboard — KPI cards, Recharts charts, recent orders
│   │   ├── orders/           # Orders list + status/payment PATCH modal
│   │   ├── products/         # Products CRUD + UploadThing image upload
│   │   ├── users/            # User list + role management
│   │   ├── coupons/          # Coupon CRUD (type toggle, new-users-only flag)
│   │   ├── contact/          # Contact submissions viewer
│   │   └── gifting/          # Gifting enquiries viewer
│   ├── api/
│   │   ├── addresses/        # Saved delivery addresses CRUD
│   │   ├── admin/            # Admin-only REST routes
│   │   │   ├── coupons/      # GET, POST, PATCH, DELETE
│   │   │   ├── gifting/      # GET enquiries
│   │   │   ├── orders/       # GET list, PATCH status
│   │   │   ├── products/     # GET, POST, PATCH, DELETE
│   │   │   ├── stats/        # Dashboard KPI aggregates
│   │   │   ├── contact/      # GET submissions
│   │   │   └── users/        # GET list, PATCH role
│   │   ├── auth/[...all]/    # Better Auth handler
│   │   ├── categories/       # GET all, POST (admin)
│   │   ├── contact/          # POST contact form submission
│   │   ├── coupons/validate/ # POST coupon validation (public)
│   │   ├── gifting/          # POST gifting enquiry
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
| `/garden-services` | ✅ Done | Garden services enquiry page |
| `/gifting` | ✅ Done | Corporate gifting enquiry form wired to `POST /api/gifting` |
| `/login` | ✅ Done | Email/password + Google OAuth; role-based redirect (admin → `/admin`) |
| `/orders` | ✅ Done | Order history from real API |
| `/orders/[id]` | ✅ Done | Single order detail + tracking timeline |
| `/our-story` | ✅ Done | Full brand story, 1993 roots, award, mission |
| `/privacy-policy` | ✅ Done | Static |
| `/product` | ✅ Done | Filterable product gallery from real API |
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
| `/admin/users` | ✅ Done | User list; promote/demote role |
| `/admin/coupons` | ✅ Done | Create/toggle/delete coupons; % or flat ₹ discount; new-users-only flag |
| `/admin/contact` | ✅ Done | View all contact form submissions |
| `/admin/gifting` | ✅ Done | View all gifting enquiries |

### Shopping Bag & Checkout
- Slide-in bag panel — quantity stepper, item remove
- Coupon validation against real DB; supports percentage and flat ₹ off; new-users-only restriction
- Tax (GST 18%) and shipping (₹79; free above ₹999) calculated live
- Delivery address card with animated add/edit overlay and per-field validation
- Coupon description shown under discount line

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
| `/api/uploadthing` | GET, POST | Admin | ✅ Done |
| `/api/vruksha-ai` | POST | Public | ✅ Done |
| `/api/admin/stats` | GET | Admin | ✅ Done |
| `/api/admin/orders` | GET, PATCH | Admin | ✅ Done |
| `/api/admin/products` | GET, POST, PATCH, DELETE | Admin | ✅ Done |
| `/api/admin/users` | GET, PATCH | Admin | ✅ Done |
| `/api/admin/coupons` | GET, POST, PATCH, DELETE | Admin | ✅ Done |
| `/api/admin/contact` | GET | Admin | ✅ Done |
| `/api/admin/gifting` | GET | Admin | ✅ Done |

---

## Deployment

The app is designed for deployment on [Vercel](https://vercel.com).

1. Connect the repository to a Vercel project.
2. Set all environment variables from `.env.local` in the Vercel dashboard.
3. Set `BETTER_AUTH_URL` to your production domain (e.g. `https://vrikshavalli.com`).
4. Update the Google OAuth authorised redirect URI to `https://<your-domain>/api/auth/callback/google`.
5. Deploy — `pnpm build` runs automatically.

For other platforms see the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).


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

### Backend / Data
| Layer | Technology |
|-------|------------|
| Database | Neon (serverless PostgreSQL) |
| ORM | Drizzle ORM + Drizzle Kit |
| Validation | Zod + drizzle-zod |
| Auth | Better Auth (email/password + Google OAuth) |
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
```

### 3. Set up the database

```bash
pnpm db:generate   # generate SQL from schema files
pnpm db:migrate    # apply migrations to Neon
```

### 4. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

---

## Project Structure

```
vrikshavalli/
├── app/
│   ├── (auth)/               # Auth pages (login, register)
│   ├── about-us/             # About Us — brand, founders, contact info
│   ├── api/
│   │   ├── auth/[...all]/    # Better Auth handler (all auth endpoints)
│   │   ├── products/         # Products REST API
│   │   └── vruksha-ai/       # Gemini AI plant disease analysis endpoint
│   ├── contact/              # Contact Us page + form
│   ├── faqs/                 # Help centre / FAQ accordion page
│   ├── features/
│   │   ├── bag/              # Cart slider (BagSlider, useDeliveryAddress)
│   │   ├── footer/           # Site footer
│   │   ├── homepage/         # Homepage sections (Hero, BestSellers, etc.)
│   │   ├── navbar/           # Desktop + mobile navbar
│   │   ├── product/          # Product feature components
│   │   └── ribbon/           # Top promo ribbon
│   ├── garden-services/      # Garden services enquiry page
│   ├── gifting/              # Corporate gifting enquiry page
│   ├── orders/               # Order history + order detail pages
│   │   └── [id]/             # Single order detail page
│   ├── our-story/            # Brand story, founders, award, mission
│   ├── privacy-policy/       # Privacy Policy
│   ├── terms/                # Terms & Conditions, Cancellation & Shipping Policy
│   ├── product/              # Product listing + detail pages
│   │   ├── ProductGallery.tsx
│   │   └── [id]/page.tsx
│   ├── thankyou/             # Post-checkout thank you page
│   ├── vruksha-ai/           # AI-powered plant disease analyzer
│   │   ├── page.tsx          # Upload page with drag-drop, progress bar
│   │   ├── results/
│   │   │   ├── page.tsx      # Analysis results with diagnosis & treatment
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── wishlist/             # Wishlist page
│   ├── globals.css
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/
│   ├── ProductCard.tsx
│   ├── SearchBar.tsx
│   └── ui/                   # Shared UI primitives (button, etc.)
├── context/
│   ├── BagContext.tsx         # Shopping bag state
│   └── WishlistContext.tsx    # Wishlist state (localStorage, pending API)
├── lib/
│   ├── auth.ts               # Better Auth server config
│   ├── auth-client.ts        # Better Auth client (useSession, signIn, etc.)
│   ├── util.ts               # cn() and other utilities
│   └── db/
│       ├── index.ts          # Drizzle client (Neon)
│       └── schema/
│           ├── auth.ts       # Better Auth tables
│           ├── categories.ts
│           ├── orders.ts
│           ├── products.ts
│           └── users.ts
├── drizzle.config.ts
├── next.config.ts
├── README.md
├── TODO.md                   # Backend developer task list
└── .env.local                # ← create this (not committed)
```

---

## Current Features

### Pages
| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ Done | Hero, BestSellers, NewArrivals, HandPicked, CategoryBanners, Ceramics, CourseBanner, CTA, Features, ImageBento, Testimonials |
| `/about-us` | ✅ Done | Brand overview, founders, stats, award callout, contact info, Get Directions |
| `/contact` | ✅ Done | Contact form with real address, phone, email (no backend API yet) |
| `/faqs` | ✅ Done | Help centre — search, category filter chips, accordion per FAQ |
| `/garden-services` | ✅ Done | Garden services enquiry page |
| `/gifting` | ✅ Done | Corporate gifting enquiry form (no backend API yet) |
| `/login` | ✅ Done | Email/password + Google OAuth |
| `/orders` | ✅ Done | Order history list (pending real API — see `TODO.md` Phase 7) |
| `/orders/[id]` | ✅ Done | Single order detail + tracking timeline (pending real API) |
| `/our-story` | ✅ Done | Full brand story, 1993 roots, achievement award, mission pillars, values |
| `/privacy-policy` | ✅ Done | Privacy Policy (static) |
| `/product` | ✅ Done | Filterable product gallery (mock data — pending real API) |
| `/product/[id]` | ✅ Done | Product detail page (mock data — pending real API) |
| `/register` | ✅ Done | Email/password + Google OAuth |
| `/thankyou` | ✅ Done | Post-checkout confirmation with order summary |
| `/terms` | ✅ Done | Terms & Conditions, Cancellation Policy, Shipping Policy (static) |
| `/vruksha-ai` | ✅ Done | AI plant disease analyzer — upload, progress bar, Gemini analysis |
| `/vruksha-ai/results` | ✅ Done | Diagnosis results with symptoms, causes, treatment, fertilization, care tips |
| `/wishlist` | ✅ Done | Wishlist page; state persisted in localStorage |
| `/profile` | ❌ Pending | See `TODO.md` Phase 3 |

### Shopping Bag (Cart Sidebar)
- Slide-in bag panel with item list, quantity stepper, and remove
- Coupon code input with validation, loading state, success/error feedback (codes: `SAVE10`, `GREEN5`, `PLANT15` — backed by mock data pending Phase 8)
- Tax (GST 18%) and shipping (₹79; free above ₹999) calculated live
- Delivery address card with animated add/edit overlay and per-field validation

### Auth
- Email + password sign-up and sign-in via Better Auth
- Google OAuth (enabled when `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` are set)
- Session available client-side via `useSession()` from `lib/auth-client.ts`

---

## Backend Status

The frontend is largely complete and running on mock/localStorage data. All backend API routes are pending implementation by the backend developer.

**See [`TODO.md`](./TODO.md) for the full, ordered task list** covering:

- Phase 0 — Environment & secrets
- Phase 1 — Database migrations and seeding
- Phase 2 — Auth hooks and session utilities
- Phase 3 — Profile API (`GET /PATCH /api/profile`)
- Phase 4 — Products API (hardening + admin CRUD)
- Phase 5 — Categories API
- Phase 6 — Wishlist API + DB table
- Phase 7 — Orders API (frontend pages are ✅ done — backend API endpoints pending)
- Phase 8 — Coupon codes (DB table + validation endpoint)
- Phase 9 — Contact and gifting form endpoints
- Phase 10 — Admin middleware and order status updates
- Phase 11 — Product detail page real-data wire-up
- Phase 12 — Live search

---

## Deployment

The app is designed for deployment on [Vercel](https://vercel.com).

1. Connect the repository to a Vercel project.
2. Set all environment variables from `.env.local` in the Vercel dashboard.
3. Set `BETTER_AUTH_URL` to your production domain (e.g. `https://vrikshavalli.com`).
4. Update the Google OAuth authorised redirect URI to `https://<your-domain>/api/auth/callback/google`.
5. Deploy — `pnpm build` runs automatically.

For other platforms see the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
