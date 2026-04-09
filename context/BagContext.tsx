"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface BagItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
  slug?: string;
  stock?: number;
}

interface BagContextValue {
  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  items: BagItem[];
  addItem: (item: BagItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearBag: () => void;
}

const BagContext = createContext<BagContextValue | null>(null);

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [items, setItems] = useState<BagItem[]>([]);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("vrukshavalli_bag");
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // ✅ Persist to localStorage
  useEffect(() => {
    localStorage.setItem("vrukshavalli_bag", JSON.stringify(items));
  }, [items]);

  const addItem = (item: BagItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        const merged = existing.quantity + item.quantity;
        const cap =
          item.stock !== undefined && item.stock > 0 ? item.stock : undefined;
        const nextQty = cap !== undefined ? Math.min(merged, cap) : merged;
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: nextQty,
                stock: item.stock ?? i.stock,
              }
            : i
        );
      }

      return [...prev, item];
    });
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) =>
            i.id === id ? { ...i, quantity: qty } : i
          )
    );

  const clearBag = () => {
    localStorage.removeItem("vrukshavalli_bag");
    setItems([]);
  };

  return (
    <BagContext.Provider
      value={{
        isBagOpen,
        openBag: () => setIsBagOpen(true),
        closeBag: () => setIsBagOpen(false),
        items,
        addItem,
        removeItem,
        updateQty,
        clearBag,
      }}
    >
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used inside <BagProvider>");
  return ctx;
}