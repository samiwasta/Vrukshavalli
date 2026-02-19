"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { IconHeart, IconShoppingBag, IconUserCircle } from "@tabler/icons-react";
import SearchBar from "@/components/SearchBar";
import { useWishlist } from "@/context/WishlistContext";
import { useSession } from "@/lib/auth-client";
import { useBag } from "@/context/BagContext";

const navItems = [
  {
    label: "PLANTS",
    href: "/product?category=plants",
  },
  {
    label: "SEEDS",
    href: "/product?category=seeds",
  },
  {
    label: "POTS & PLANTERS",
    href: "/product?category=pots-planters",
  },
  {
    label: "PLANT CARE",
    href: "/product?category=plant-care",
  },
  {
    label: "GIFTING",
    href: "/product?category=gifting",
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
    href: "https://learn.vrukshavalligardenstore.com",
    target: "_blank",
  },
]

const actionIcons = [
  { href: "/wishlist", label: "Wishlist", icon: IconHeart },
] as const;

export default function NavbarDesktop() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const userPopoverRef = useRef<HTMLDivElement>(null);
  const { items: wishlistItems } = useWishlist();
  const { data: session } = useSession();
  const { openBag } = useBag();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userPopoverRef.current && !userPopoverRef.current.contains(e.target as Node)) {
        setUserPopoverOpen(false);
      }
    }
    if (userPopoverOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userPopoverOpen]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-4 py-4">
        <div className="flex w-full items-center justify-between gap-4">
          <Link href="/">
            <Image src="/vrukshavalli-logo.svg" alt="Vrukshavalli Logo" width={150} height={40} />
          </Link>

          <SearchBar className="max-w-4xl" />

          <motion.div
            onMouseLeave={() => setHoveredAction(null)}
            className="flex items-center gap-2"
          >
            <div className="relative" ref={userPopoverRef}>
              <button
                type="button"
                onClick={() => setUserPopoverOpen((o) => !o)}
                onMouseEnter={() => setHoveredAction(-1)}
                className="relative flex items-center justify-center rounded-full p-2 text-primary-500 transition-colors hover:text-primary-600"
                aria-label="User menu"
                aria-expanded={userPopoverOpen}
              >
                {hoveredAction === -1 && (
                  <motion.div
                    layoutId="hoveredAction"
                    className="absolute inset-0 rounded-full bg-primary-100"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-20">
                  <IconUserCircle size={24} stroke={1.5} />
                </span>
              </button>
              <AnimatePresence>
                {userPopoverOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-xl border border-primary-200 bg-white py-2 shadow-lg"
                  >
                    {session?.user ? (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setUserPopoverOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setUserPopoverOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
                        >
                          Track Order
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setUserPopoverOpen(false)}
                        className="mx-3 mb-1 mt-1 flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 active:bg-primary-800"
                      >
                        Login
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {actionIcons.map(({ href, label, icon: Icon }, idx) => (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setHoveredAction(idx)}
                className="relative flex items-center justify-center rounded-full p-2 text-primary-500 transition-colors hover:text-primary-600"
                aria-label={label}
              >
                {hoveredAction === idx && (
                  <motion.div
                    layoutId="hoveredAction"
                    className="absolute inset-0 rounded-full bg-primary-100"
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
                {href === "/wishlist" && wishlistCount > 0 && (
                  <span
                    className="absolute -right-0.5 -top-0.5 z-30 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold leading-none text-white"
                    aria-label={`${wishlistCount} items in wishlist`}
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>
            ))}

            {/* Bag button */}
            <button
              type="button"
              onMouseEnter={() => setHoveredAction(99)}
              onClick={openBag}
              className="relative flex items-center justify-center rounded-full p-2 text-primary-500 transition-colors hover:text-primary-600"
              aria-label="Open bag"
            >
              {hoveredAction === 99 && (
                <motion.div
                  layoutId="hoveredAction"
                  className="absolute inset-0 rounded-full bg-primary-100"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-20">
                <IconShoppingBag size={24} stroke={1.5} />
              </span>
            </button>
          </motion.div>
        </div>

        <motion.div
          onMouseLeave={() => setHovered(null)}
          className="flex flex-1 flex-row items-center justify-center gap-2 text-sm font-medium text-primary-500"
        >
          {navItems.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHovered(idx)}
              className="relative px-4 py-2 text-primary-500 font-sans"
            >
              {hovered === idx && (
                <motion.div
                  layoutId="hovered"
                  className="absolute inset-0 h-full w-full rounded-full bg-primary-100"
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
