"use client";

import { createContext, useContext, useState } from "react";

export interface BagItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

// ── Mock products for testing ─────────────────────────────────────────────────
const MOCK_ITEMS: BagItem[] = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=200&q=80",
    price: 1299,
    quantity: 1,
    variant: "Medium (6\" pot)",
  },
  {
    id: "2",
    name: "Peace Lily",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=200&q=80",
    price: 549,
    quantity: 2,
    variant: "Small (4\" pot)",
  },
  {
    id: "3",
    name: "Snake Plant",
    image: "https://images.unsplash.com/photo-1616690710400-a16d146927c5?w=200&q=80",
    price: 799,
    quantity: 1,
    variant: "Large (8\" pot)",
  },
];

interface BagContextValue {
  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  items: BagItem[];
  addItem: (item: Omit<BagItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearBag: () => void;
}

const BagContext = createContext<BagContextValue | null>(null);

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [items, setItems] = useState<BagItem[]>(MOCK_ITEMS);

  const addItem = (item: Omit<BagItem, "quantity">) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
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
