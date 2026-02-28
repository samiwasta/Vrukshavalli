"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import ProductCard from "@/components/ProductCard";
import {
  IconAdjustments,
  IconChevronDown,
  IconX,
  IconGift,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util";

/* ───────────────── CONFIG ───────────────── */

export const PRODUCT_CATEGORIES = [
  "plants",
  "seeds",
  "pots-planters",
  "plant-care",
  "gifting",
] as const;

export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number];

function getValidCategory(slug: string | null): ProductCategorySlug {
  if (slug && PRODUCT_CATEGORIES.includes(slug as ProductCategorySlug)) {
    return slug as ProductCategorySlug;
  }
  return "plants";
}

/* ───────────────── TYPES ───────────────── */

interface Product {
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

/* ───────────────── COMPONENT ───────────────── */

export default function ProductGallery() {
  const searchParams = useSearchParams();
  const category = getValidCategory(searchParams.get("category"));

  const isNew = searchParams.get("isNew");
  const isBestSeller = searchParams.get("isBestSeller");
  const isHandPicked = searchParams.get("isHandPicked");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const filterPopoverRef = useRef<HTMLDivElement>(null);
  const sortPopoverRef = useRef<HTMLDivElement>(null);

  /* ───────────────── FETCH PRODUCTS ───────────────── */

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams();

        if (category) query.set("category", category);

        if (isNew === "true") query.set("isNew", "true");
        if (isBestSeller === "true") query.set("isBestSeller", "true");
        if (isHandPicked === "true") query.set("isHandPicked", "true");

        const res = await fetch(`/api/products?${query.toString()}`);
        const json = await res.json();

        if (!json.success) {
          setProducts([]);
          return;
        }

        const mapped: Product[] = json.data.map((p: any) => ({
          id: p.slug, // used for routing
          name: p.name,
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
          image: p.image,
          rating: Number(p.rating),
          reviewCount: p.reviewCount,
          category: p.category?.name,
          isNew: p.isNew,
          isBestSeller: p.isBestSeller,
          isHandPicked: p.isHandPicked,
        }));

        if (!cancelled) setProducts(mapped);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [category]);

  /* ───────────────── LOADING UI ───────────────── */

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="h-10 w-64 bg-primary-100 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-primary-100 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────── UI ───────────────── */

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary-600 font-mono sm:text-3xl">
            {category}
          </h1>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="font-mono text-xl font-semibold text-primary-600">
              No products found
            </h3>
            <p className="text-primary-500/60">
              We’re currently updating this collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
