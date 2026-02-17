"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { IconMenu2, IconShoppingBag, IconX } from "@tabler/icons-react";
import SearchBar from "@/components/SearchBar";
import { useWishlist } from "@/context/WishlistContext";
import { useSession } from "@/lib/auth-client";

const NAV_ITEMS = [
  { label: "PLANTS", href: "/product?category=plants" },
  { label: "SEEDS", href: "/product?category=seeds" },
  { label: "POTS & PLANTERS", href: "/product?category=pots-planters" },
  { label: "PLANT CARE", href: "/product?category=plant-care" },
  { label: "GIFTING", href: "/product?category=gifting" },
  { label: "GARDEN SERVICES", href: "/garden-services" },
  { label: "COURSES", href: "https://learn.vrukshavalligardenstore.com", target: "_blank" },
  { label: "ABOUT US", href: "/about-us" },
];

const SIDEBAR_LINKS_LOGGED_IN = [
  { label: "My Profile", href: "/profile" },
  { label: "Track Order", href: "/orders" },
];

export default function NavbarMobile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items: wishlistItems } = useWishlist();
  const { data: session } = useSession();
  const wishlistCount = wishlistItems.length;

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
              className="flex items-center justify-center rounded-full p-2 text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
              aria-label="Menu"
            >
              <IconMenu2 size={24} stroke={1.5} />
            </button>

            <Link href="/">
              <Image src="/vrukshavalli-logo.svg" alt="Vrukshavalli Logo" width={150} height={40} />
            </Link>

            <Link
              href="/cart"
              className="flex items-center justify-center rounded-full p-2 text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
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
              className="fixed inset-y-0 left-0 z-70 w-[min(320px,85vw)] overflow-y-auto border-r border-primary-200 bg-white shadow-xl lg:hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                <div className="mb-2 flex items-center justify-between border-b border-primary-100 pb-3">
                  <span className="text-sm font-sans font-semibold text-primary-500">
                    Menu
                  </span>
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="rounded-full p-2 text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
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
                    className="rounded-lg px-4 py-3 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-100 font-sans"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="my-2 border-t border-primary-100 pt-3">
                  <Link
                    href="/wishlist"
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-100 font-sans"
                  >
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-bold leading-none text-white">
                        {wishlistCount > 99 ? "99+" : wishlistCount}
                      </span>
                    )}
                  </Link>
                  {session?.user ? (
                    <>
                      {SIDEBAR_LINKS_LOGGED_IN.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="block rounded-lg px-4 py-3 text-sm font-medium text-primary-500 transition-colors hover:bg-primary-100 font-sans"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="mx-2 flex items-center justify-center rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 active:bg-primary-800 font-sans"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
