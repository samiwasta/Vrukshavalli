"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { IconHeart, IconShoppingBag, IconUserCircle } from "@tabler/icons-react";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/app/constants/colors";

const navItems = [
  {
    label: "PLANTS",
    href: "/plants",
  },
  {
    label: "SEEDS",
    href: "/seeds",
  },
  {
    label: "POTS & PLANTERS",
    href: "/pots-and-planters",
  },
  {
    label: "PLANT CARE",
    href: "/plant-care",
  },
  {
    label: "GIFTING",
    href: "/gifting",
  },
  {
    label: "GARDEN SERVICES",
    href: "/garden-services",
  },
  {
    label: "ABOUT US",
    href: "/about-us",
  },
  {
    label: "COURSES",
    href: "/courses",
  },
]

const actionIcons = [
  { href: "/profile", label: "User", icon: IconUserCircle },
  { href: "/wishlist", label: "Wishlist", icon: IconHeart },
  { href: "/cart", label: "Cart", icon: IconShoppingBag },
] as const;

export default function NavbarDesktop() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-4 py-4">
        <div className="flex w-full items-center justify-between gap-4">
          <Link href="/">
            <h1
              className="text-2xl font-bold font-mono"
              style={{ color: colors.darkGreen }}
            >
              Vrukshavalli
            </h1>
          </Link>

          <SearchBar className="max-w-4xl" />

          <motion.div
            onMouseLeave={() => setHoveredAction(null)}
            className="flex items-center gap-2"
          >
            {actionIcons.map(({ href, label, icon: Icon }, idx) => (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setHoveredAction(idx)}
                className="relative flex items-center justify-center rounded-full p-2 text-zinc-600 transition-colors hover:text-zinc-900"
                aria-label={label}
              >
                {hoveredAction === idx && (
                  <motion.div
                    layoutId="hoveredAction"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: colors.lightGreen }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-20">
                  <Icon size={24} stroke={1.5} />
                </span>
              </Link>
            ))}
          </motion.div>
        </div>

        <motion.div
          onMouseLeave={() => setHovered(null)}
          className="flex flex-1 flex-row items-center justify-center gap-2 text-sm font-medium text-zinc-600"
        >
          {navItems.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHovered(idx)}
              className="relative px-4 py-2 text-neutral-600 font-sans"
            >
              {hovered === idx && (
                <motion.div
                  layoutId="hovered"
                  className="absolute inset-0 h-full w-full rounded-full"
                  style={{ backgroundColor: colors.lightGreen }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-20">{item.label}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </nav>
  );
}
