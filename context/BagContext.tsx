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
    const stored = localStorage.getItem("vrikshavalli_bag");
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // ✅ Persist to localStorage
  useEffect(() => {
    localStorage.setItem("vrikshavalli_bag", JSON.stringify(items));
  }, [items]);

  const addItem = (item: BagItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prev, item];
    });

    setIsBagOpen(true); // ✅ auto open bag
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

  const clearBag = () => setItems([]);

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