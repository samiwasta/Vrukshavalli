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
