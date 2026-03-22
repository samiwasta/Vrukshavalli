"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "@/lib/auth-client";

export interface WishlistItem {
  id: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  stock?: number;
  stockCapacity?: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  isHandPicked?: boolean;
}

const STORAGE_KEY = "vrikshavalli-wishlist";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isProductUuid(id: string): boolean {
  return UUID_RE.test(String(id).trim());
}

function mergeWishlistFetch(
  server: WishlistItem[],
  prev: WishlistItem[],
): WishlistItem[] {
  const map = new Map<string, WishlistItem>();
  for (const s of server) {
    map.set(String(s.id), s);
  }
  for (const p of prev) {
    const pid = String(p.id);
    if (!map.has(pid)) {
      map.set(pid, p);
    }
  }
  return Array.from(map.values());
}

interface WishlistContextValue {
  items: WishlistItem[];
  has: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function loadStored(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as WishlistItem[]) : [];
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

async function fetchWishlist(): Promise<WishlistItem[]> {
  const res = await fetch("/api/wishlist", {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { data?: WishlistItem[] };
  return Array.isArray(json.data) ? json.data : [];
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const sessionResult = useSession();
  const session = sessionResult.data;
  const isPending = sessionResult.isPending ?? false;

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const lastLoggedInUserIdRef = useRef<string | undefined>(undefined);
  const syncGenerationRef = useRef(0);

  useLayoutEffect(() => {
    setItems(loadStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || isPending) return;

    let cancelled = false;
    const uid = session?.user?.id;
    const syncGen = ++syncGenerationRef.current;

    async function syncLoggedIn() {
      const guestSnapshot = loadStored();
      let serverItems = await fetchWishlist();
      if (cancelled || syncGen !== syncGenerationRef.current) return;

      const serverIds = new Set(serverItems.map((i) => String(i.id)));

      for (const g of guestSnapshot) {
        if (!isProductUuid(String(g.id))) continue;
        if (serverIds.has(String(g.id))) continue;
        const post = await fetch("/api/wishlist", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: g.id }),
        });
        if (post.ok || post.status === 201) {
          serverIds.add(String(g.id));
        }
        if (cancelled || syncGen !== syncGenerationRef.current) return;
      }

      if (cancelled || syncGen !== syncGenerationRef.current) return;
      serverItems = await fetchWishlist();
      if (cancelled || syncGen !== syncGenerationRef.current) return;

      const nonUuidGuest = guestSnapshot.filter(
        (g) => !isProductUuid(String(g.id)),
      );
      const mergedMap = new Map<string, WishlistItem>();
      for (const s of serverItems) {
        mergedMap.set(String(s.id), s);
      }
      for (const g of nonUuidGuest) {
        if (!mergedMap.has(String(g.id))) {
          mergedMap.set(String(g.id), g);
        }
      }
      const merged = Array.from(mergedMap.values());
      if (cancelled || syncGen !== syncGenerationRef.current) return;
      setItems(merged);
      saveStored(merged);
    }

    if (uid) {
      lastLoggedInUserIdRef.current = uid;
      void syncLoggedIn();
    } else {
      if (lastLoggedInUserIdRef.current) {
        lastLoggedInUserIdRef.current = undefined;
        setItems(loadStored());
      }
    }

    return () => {
      cancelled = true;
    };
  }, [hydrated, isPending, session?.user?.id]);

  useEffect(() => {
    if (!hydrated) return;
    saveStored(items);
  }, [hydrated, items]);

  const has = useCallback(
    (id: string) => items.some((i) => String(i.id) === String(id)),
    [items],
  );

  const toggle = useCallback(
    async (item: WishlistItem) => {
      const id = String(item.id);

      if (!session?.user) {
        setItems((prev) => {
          const existed = prev.some((i) => String(i.id) === id);
          return existed
            ? prev.filter((i) => String(i.id) !== id)
            : [...prev, { ...item, id }];
        });
        return;
      }

      let existed = false;
      setItems((prev) => {
        existed = prev.some((i) => String(i.id) === id);
        return existed
          ? prev.filter((i) => String(i.id) !== id)
          : [...prev, { ...item, id }];
      });

      if (!isProductUuid(id)) {
        return;
      }

      try {
        if (existed) {
          const res = await fetch(`/api/wishlist/${encodeURIComponent(id)}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok && res.status !== 204) {
            throw new Error("remove failed");
          }
        } else {
          const res = await fetch("/api/wishlist", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: id }),
          });
          if (res.status === 404 || res.status === 400) {
            syncGenerationRef.current += 1;
            return;
          }
          if (!res.ok && res.status !== 201) {
            throw new Error("add failed");
          }
        }

        syncGenerationRef.current += 1;
        const fresh = await fetchWishlist();
        setItems((prev) => mergeWishlistFetch(fresh, prev));
      } catch {
        setItems((prev) => {
          if (existed) {
            const already = prev.some((i) => String(i.id) === id);
            return already ? prev : [...prev, { ...item, id }];
          }
          return prev.filter((i) => String(i.id) !== id);
        });
      }
    },
    [session?.user],
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
