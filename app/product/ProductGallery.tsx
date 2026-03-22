"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import ProductCard from "@/components/ProductCard";

export const PRODUCT_CATEGORIES = [
  "plants",
  "seeds",
  "pots-planters",
  "plant-care",
  "gifting",
] as const;

export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_INFO: Record<
  ProductCategorySlug,
  { title: string; subtitle: string }
> = {
  plants: {
    title: "Plants",
    subtitle: "Discover our curated collection of indoor & outdoor plants",
  },
  seeds: {
    title: "Seeds",
    subtitle: "Premium quality seeds to grow your own garden",
  },
  "pots-planters": {
    title: "Pots & Planters",
    subtitle: "Beautiful pots and planters for every style",
  },
  "plant-care": {
    title: "Plant Care",
    subtitle: "Everything you need to keep your plants thriving",
  },
  gifting: {
    title: "Gifting",
    subtitle: "Thoughtfully curated plant gifts for loved ones",
  },
};

function isCategorySlug(s: string | null): s is ProductCategorySlug {
  return s != null && PRODUCT_CATEGORIES.includes(s as ProductCategorySlug);
}

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  stock: number;
  stockCapacity: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  isHandPicked?: boolean;
}

interface ApiProductRow {
  id: string;
  slug: string;
  name: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  rating?: string | null;
  reviewCount?: number | null;
  category?: { name?: string } | null;
  stock?: number | null;
  stockCapacity?: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  isHandPicked?: boolean;
}

export default function ProductGallery() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search")?.trim() ?? "";

  const filterNew = searchParams.get("isNew") === "true";
  const filterBestSeller = searchParams.get("isBestSeller") === "true";
  const filterHandPicked = searchParams.get("isHandPicked") === "true";

  const hasCategoryInUrl = isCategorySlug(categoryParam);

  const shouldDefaultToPlants =
    !hasCategoryInUrl &&
    !filterNew &&
    !filterBestSeller &&
    !filterHandPicked &&
    !searchQuery;

  const categoryForApi = hasCategoryInUrl
    ? categoryParam
    : shouldDefaultToPlants
      ? "plants"
      : null;

  const header = useMemo(() => {
    if (searchQuery) {
      return {
        title: "Search results",
        subtitle: `Matches for "${searchQuery}"`,
      };
    }
    if (filterNew && !hasCategoryInUrl) {
      return {
        title: "Fresh to the Garden",
        subtitle: "Our newest plants and products",
      };
    }
    if (filterBestSeller && !hasCategoryInUrl) {
      return {
        title: "Flying Off the Shelves",
        subtitle: "Customer favourites right now",
      };
    }
    if (filterHandPicked && !hasCategoryInUrl) {
      return {
        title: "Handpicked, Just For You!",
        subtitle: "Curated picks from our team",
      };
    }
    const slug = categoryForApi ?? "plants";
    return CATEGORY_INFO[slug];
  }, [
    searchQuery,
    filterNew,
    filterBestSeller,
    filterHandPicked,
    hasCategoryInUrl,
    categoryForApi,
  ]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams();

        if (categoryForApi) {
          query.set("category", categoryForApi);
        }
        if (searchQuery) {
          query.set("search", searchQuery);
        }
        if (filterNew) query.set("isNew", "true");
        if (filterBestSeller) query.set("isBestSeller", "true");
        if (filterHandPicked) query.set("isHandPicked", "true");

        const res = await fetch(`/api/products?${query.toString()}`);
        const json = await res.json();

        if (!json.success) {
          if (!cancelled) setProducts([]);
          return;
        }

        const rows = json.data as ApiProductRow[];
        const mapped: Product[] = rows.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: Number(p.price),
          originalPrice: p.originalPrice
            ? Number(p.originalPrice)
            : undefined,
          image: p.image,
          rating: Number(p.rating ?? 0),
          reviewCount: p.reviewCount ?? 0,
          category: p.category?.name,
          stock: Number(p.stock ?? 0),
          stockCapacity: p.stockCapacity ?? null,
          isNew: p.isNew,
          isBestSeller: p.isBestSeller,
          isHandPicked: p.isHandPicked,
        }));

        if (!cancelled) setProducts(mapped);
      } catch (err) {
        console.error("Failed to fetch products", err);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [
    categoryForApi,
    searchQuery,
    filterNew,
    filterBestSeller,
    filterHandPicked,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
          <div className="mb-8 sm:mb-10">
            <div className="h-12 w-80 bg-primary-100 rounded-lg animate-pulse mb-3" />
            <div className="h-4 w-96 bg-primary-50 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-bold text-primary-700 font-mono sm:text-4xl lg:text-5xl mb-2">
            {header.title}
          </h1>
          <p className="text-sm sm:text-base text-primary-500/70 max-w-2xl">
            {header.subtitle}
          </p>
        </div>

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

        {products.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="font-mono text-xl font-semibold text-primary-600">
              No products found
            </h3>
            <p className="text-primary-500/60 mt-2">
              Try another category or check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
