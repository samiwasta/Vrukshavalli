"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { IconMenu2, IconShoppingBag, IconX } from "@tabler/icons-react";
import SearchBar from "@/components/SearchBar";
import { colors } from "@/app/constants/colors";

const NAV_ITEMS = [
  { label: "PLANTS", href: "/plants" },
  { label: "SEEDS", href: "/seeds" },
  { label: "POTS & PLANTERS", href: "/pots-and-planters" },
  { label: "PLANT CARE", href: "/plant-care" },
  { label: "GIFTING", href: "/gifting" },
  { label: "GARDEN SERVICES", href: "/garden-services" },
  { label: "COURSES", href: "/courses" },
  { label: "ABOUT US", href: "/about-us" },
];

const MENU_LINKS = [
  { label: "My Profile", href: "/profile" },
  { label: "Order Tracking", href: "/orders" },
  { label: "Wishlist", href: "/wishlist" },
];

export default function NavbarMobile() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur lg:hidden">
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex w-full items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex items-center justify-center rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Menu"
            >
              <IconMenu2 size={24} stroke={1.5} />
            </button>

            <Link href="/" className="flex-1 text-center">
              <h1
                className="text-xl font-bold font-mono"
                style={{ color: colors.darkGreen }}
              >
                Vrukshavalli
              </h1>
            </Link>

            <Link
              href="/cart"
              className="flex items-center justify-center rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Cart"
            >
              <IconShoppingBag size={24} stroke={1.5} />
            </Link>
          </div>

          <SearchBar className="w-full max-w-none" />
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-60 bg-black/40 lg:hidden"
              onClick={closeMenu}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 40,
              }}
              className="fixed inset-y-0 left-0 z-70 w-[min(320px,85vw)] overflow-y-auto border-r border-zinc-200 bg-white shadow-xl lg:hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                <div className="mb-2 flex items-center justify-between border-b border-zinc-100 pb-3">
                  <span className="text-sm font-sans font-semibold text-zinc-500">
                    Menu
                  </span>
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label="Close menu"
                  >
                    <IconX size={22} stroke={1.5} />
                  </button>
                </div>

                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 font-sans"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="my-2 border-t border-zinc-100 pt-3">
                  <Link
                    href={MENU_LINKS[0].href}
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 font-sans"
                  >
                    {MENU_LINKS[0].label}
                  </Link>
                  <Link
                    href={MENU_LINKS[1].href}
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 font-sans"
                  >
                    {MENU_LINKS[1].label}
                  </Link>
                  <Link
                    href={MENU_LINKS[2].href}
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 font-sans"
                  >
                    {MENU_LINKS[2].label}
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
