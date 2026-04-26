"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { IconHeart, IconShoppingBag, IconUserCircle, IconSparkles, IconLogout } from "@tabler/icons-react";
import SearchBar from "@/components/SearchBar";
import { useWishlist } from "@/context/WishlistContext";
import { useSession, signOut } from "@/lib/auth-client";
import { useBag } from "@/context/BagContext";
import { cn } from "@/lib/util";

interface NavItem {
  label: string;
  href: string;
  target?: string;
  icon?: typeof IconSparkles;
}

const navItems: NavItem[] = [
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
    label: "FARM FRESH",
    href: "/product?category=farm-fresh",
  },
  {
    label: "VRUKSHA AI",
    href: "/vruksha-ai",
    icon: IconSparkles,
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

const SCROLL_TOP_SHOW_LINKS_PX = 80;
/** Cumulative px in one direction before toggling (small scrolls still count). */
const SCROLL_ACCUM_SHOW_PX = 5;
const SCROLL_ACCUM_HIDE_PX = 5;
/** Ignore scroll-driven toggles while header height animates (avoids layout-shift feedback). */
const LAYOUT_COOLDOWN_MS = 380;

export default function NavbarDesktop() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [navLinksVisible, setNavLinksVisible] = useState(true);
  const [navLinksHeight, setNavLinksHeight] = useState(0);
  const lastScrollY = useRef(0);
  const scrollAccumRef = useRef(0);
  const lastScrollDirRef = useRef<"up" | "down" | null>(null);
  const navLinksVisibleRef = useRef(true);
  const ignoreScrollUntilRef = useRef(0);
  const rafScrollId = useRef<number | null>(null);
  const navLinksInnerRef = useRef<HTMLDivElement>(null);
  const userPopoverRef = useRef<HTMLDivElement>(null);
  const { items: wishlistItems } = useWishlist();
  const { data: session } = useSession();
  const { openBag, items: bagItems } = useBag();
  const bagCount = bagItems.reduce((sum, i) => sum + i.quantity, 0);
  const router = useRouter();
  const wishlistCount = wishlistItems.length;

  const handleLogout = async () => {
    await signOut();
    setUserPopoverOpen(false);
    router.push("/");
  };

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

  useLayoutEffect(() => {
    const el = navLinksInnerRef.current;
    if (!el) return;
    const sync = () => setNavLinksHeight(el.scrollHeight);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const setNavLinksVisibleStable = useCallback((next: boolean) => {
    if (navLinksVisibleRef.current === next) return;
    navLinksVisibleRef.current = next;
    setNavLinksVisible(next);
    ignoreScrollUntilRef.current = Date.now() + LAYOUT_COOLDOWN_MS;
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    navLinksVisibleRef.current = true;

    const runScrollLogic = () => {
      rafScrollId.current = null;
      const y = window.scrollY;
      const now = Date.now();

      if (now < ignoreScrollUntilRef.current) {
        lastScrollY.current = y;
        scrollAccumRef.current = 0;
        lastScrollDirRef.current = null;
        return;
      }

      if (y < SCROLL_TOP_SHOW_LINKS_PX) {
        scrollAccumRef.current = 0;
        lastScrollDirRef.current = null;
        lastScrollY.current = y;
        setNavLinksVisibleStable(true);
        return;
      }

      const delta = y - lastScrollY.current;
      lastScrollY.current = y;

      if (Math.abs(delta) < 0.5) return;

      if (delta > 0) {
        if (!navLinksVisibleRef.current) {
          scrollAccumRef.current = 0;
          lastScrollDirRef.current = null;
          return;
        }
        if (lastScrollDirRef.current !== "down") {
          scrollAccumRef.current = 0;
          lastScrollDirRef.current = "down";
        }
        scrollAccumRef.current += delta;
        if (scrollAccumRef.current >= SCROLL_ACCUM_HIDE_PX) {
          scrollAccumRef.current = 0;
          lastScrollDirRef.current = null;
          setNavLinksVisibleStable(false);
        }
      } else {
        if (navLinksVisibleRef.current) {
          scrollAccumRef.current = 0;
          lastScrollDirRef.current = null;
          return;
        }
        if (lastScrollDirRef.current !== "up") {
          scrollAccumRef.current = 0;
          lastScrollDirRef.current = "up";
        }
        scrollAccumRef.current += -delta;
        if (scrollAccumRef.current >= SCROLL_ACCUM_SHOW_PX) {
          scrollAccumRef.current = 0;
          lastScrollDirRef.current = null;
          setNavLinksVisibleStable(true);
        }
      }
    };

    const onScroll = () => {
      if (rafScrollId.current != null) return;
      rafScrollId.current = window.requestAnimationFrame(runScrollLogic);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafScrollId.current != null) {
        window.cancelAnimationFrame(rafScrollId.current);
      }
    };
  }, [setNavLinksVisibleStable]);

  return (
    <nav className="bg-white">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 py-4">
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
                    className="absolute right-0 top-full z-50 mt-2 min-w-45 rounded-xl border border-primary-200 bg-white py-2 shadow-lg"
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
                          My Orders
                        </Link>
                        <div className="mx-3 my-1 border-t border-primary-200" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <IconLogout size={16} stroke={1.5} />
                          Logout
                        </button>
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
              {bagCount > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 z-30 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold leading-none text-white"
                  aria-label={`${bagCount} items in bag`}
                >
                  {bagCount > 9 ? "9+" : bagCount}
                </span>
              )}
            </button>
          </motion.div>
        </div>

        <motion.div
          layout={false}
          className={cn(
            "w-full overflow-hidden",
            !navLinksVisible && "pointer-events-none",
          )}
          initial={false}
          animate={{
            height: navLinksVisible ? navLinksHeight : 0,
            opacity: navLinksVisible ? 1 : 0,
          }}
          transition={{
            height: {
              duration: 0.34,
              ease: [0.25, 0.1, 0.25, 1],
            },
            opacity: {
              duration: navLinksVisible ? 0.24 : 0.16,
              ease: "easeOut",
            },
          }}
          aria-hidden={!navLinksVisible}
        >
          <div ref={navLinksInnerRef} className="pt-8">
            <motion.div
              onMouseLeave={() => setHovered(null)}
              className="flex flex-1 flex-row flex-wrap items-center justify-center gap-2 text-sm font-medium text-primary-500"
            >
              {navItems.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHovered(idx)}
                  className="relative px-4 py-2 font-sans text-primary-500"
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
                  <span
                    className={`relative z-20 flex items-center gap-1.5 ${
                      item.icon ? "font-semibold text-amber-600" : ""
                    }`}
                  >
                    {item.icon && <item.icon size={13} stroke={2} />}
                    {item.label}
                  </span>
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
