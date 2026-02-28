"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "@/lib/auth-client";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isHandPicked?: boolean;
}

const STORAGE_KEY = "vrikshavalli-wishlist";

interface WishlistContextValue {
  items: WishlistItem[];
  has: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function loadStored(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStored(items: WishlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [ready, setReady] = useState(false);

  const isLoggedIn = !!session?.user;

  // ================= INITIAL LOAD =================

  useEffect(() => {
    if (isPending) return;

    const load = async () => {
      // LOGGED IN → always trust DB
      if (session?.user) {
        const res = await fetch("/api/wishlist", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          setItems(json.data || []);
        }

        setReady(true);
        return;
      }

      // GUEST
      if (session === null) {
        setItems(loadStored());
        setReady(true);
      }
    };

    load();
  }, [session, isPending]);

  // ================= PERSIST GUEST =================

  useEffect(() => {
    if (!ready || isLoggedIn) return;
    saveStored(items);
  }, [items, ready, isLoggedIn]);

  // ================= HELPERS =================

  const has = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  // ================= TOGGLE =================

  const toggle = useCallback(
    async (item: WishlistItem) => {
      const exists = items.some((i) => i.id === item.id);

      // ⭐ optimistic UI
      if (exists) {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        setItems((prev) => [...prev, item]);
      }

      // 👤 guest → done
      if (!isLoggedIn) return;

      // 🔐 logged in → sync server
      if (exists) {
        await fetch(`/api/wishlist/${item.id}`, {
          method: "DELETE",
          credentials: "include",
        });
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.id }),
        });
      }
    },
    [items, isLoggedIn]
  );

  return (
    <WishlistContext.Provider value={{ items, has, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
