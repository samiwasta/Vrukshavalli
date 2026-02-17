"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * TODO BACKEND DEVELOPER - Wishlist persistence
 *
 * TASK:
 * - Add backend storage for wishlist items per user (e.g. wishlist table: userId, productId, createdAt).
 * - Expose API: GET /api/wishlist (list for current user), POST /api/wishlist (add), DELETE /api/wishlist/[productId] (remove).
 * - Require auth for all wishlist API routes; return 401 when unauthenticated.
 * - Once API exists, replace localStorage in this context with fetch calls; on mount load from API if
 *   session exists, else keep current localStorage for guest; on login merge guest wishlist into user
 *   wishlist and clear local storage.
 *
 * EDGE CASES:
 * - Guest user: keep current localStorage behaviour until login; after login merge and sync.
 * - Duplicate add: backend should upsert or return 409; frontend should not add duplicate.
 * - Product deleted: API can return 404 for product id; frontend should remove from list or show
 *   "no longer available".
 * - Session expiry during request: return 401; frontend should clear or fall back to guest state.
 */
export interface WishlistItem {
  id: string | number;
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
  has: (id: string | number) => boolean;
  add: (item: WishlistItem) => void;
  remove: (id: string | number) => void;
  toggle: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function loadStored(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStored(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    //
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveStored(items);
  }, [hydrated, items]);

  const has = useCallback(
    (id: string | number) => items.some((i) => String(i.id) === String(id)),
    [items]
  );

  const add = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => String(i.id) === String(item.id))) return prev;
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((id: string | number) => {
    setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => String(i.id) === String(item.id));
      if (exists) return prev.filter((i) => String(i.id) !== String(item.id));
      return [...prev, item];
    });
  }, []);

  const value: WishlistContextValue = { items, has, add, remove, toggle };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

export function useWishlistOptional(): WishlistContextValue | null {
  return useContext(WishlistContext);
}
