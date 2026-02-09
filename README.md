# Vrukshavalli

India's premier luxury plant ecommerce destination: indoor and outdoor plants, planters, and accessories with expert care guides and nationwide delivery.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4
- **Animations:** Motion (motion/react)
- **Icons:** Tabler Icons React
- **Package manager:** pnpm

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other scripts:

- `pnpm build` – production build
- `pnpm start` – run production server
- `pnpm lint` – run ESLint

## Project Structure

- **`app/`** – App Router pages and layout
  - **`app/constants/`** – Shared constants (e.g. `colors.ts`)
  - **`app/features/`** – Feature-based modules
    - **`navbar/`** – Desktop and mobile nav (logo, search, nav items, profile, wishlist, cart). Mobile: sliding menu with nav items, My Profile, Order Tracking, Wishlist
    - **`ribbon/`** – Top ribbon (promo/features). Desktop: all items in a row; mobile/tablet: one item at a time with slide animation
  - **`app/globals.css`** – Global styles and theme
  - **`app/layout.tsx`** – Root layout (Poppins, Bricolage Grotesque fonts)
  - **`app/page.tsx`** – Home page
- **`components/`** – Reusable UI (e.g. `SearchBar`)
- **`lib/`** – Utilities (e.g. `cn` in `util.ts`)

## Features

- **Top ribbon:** Promo strip with features; on mobile/tablet items cycle with a slide animation
- **Navbar (desktop):** Logo, search bar, nav links with hover pill animation, profile, wishlist, cart
- **Navbar (mobile):** Menu icon, brand name, cart; search bar below; sliding full-height menu with nav links, My Profile, Order Tracking, Wishlist; body scroll locked when menu is open

## Deploy

The app can be deployed on [Vercel](https://vercel.com) or any platform that supports Next.js. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.
