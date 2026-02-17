"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import ProductCard from "@/components/ProductCard";
import { IconAdjustments, IconChevronDown, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export const PRODUCT_CATEGORIES = ["plants", "seeds", "pots-planters", "plant-care", "gifting"] as const;
export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number];

const CATEGORY_CONFIG: Record<
  ProductCategorySlug,
  { title: string; description: string }
> = {
  plants: {
    title: "Plants",
    description: "Discover our curated collection of healthy, vibrant plants",
  },
  seeds: {
    title: "Seeds",
    description: "Premium quality seeds for your garden",
  },
  "pots-planters": {
    title: "Pots & Planters",
    description: "Stylish pots and planters for every space",
  },
  "plant-care": {
    title: "Plant Care",
    description: "Everything you need to keep your plants thriving",
  },
  gifting: {
    title: "Gifting",
    description: "Perfect plant gifts for your loved ones",
  },
};

function getValidCategory(slug: string | null): ProductCategorySlug {
  if (slug && PRODUCT_CATEGORIES.includes(slug as ProductCategorySlug)) {
    return slug as ProductCategorySlug;
  }
  return "plants";
}

interface Product {
  id: number | string;
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

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Rating" },
  { value: "discount", label: "Discount" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

interface FilterState {
  priceMin: string;
  priceMax: string;
  ratingMin: string;
  newOnly: boolean;
  bestSellerOnly: boolean;
  handPickedOnly: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  priceMin: "",
  priceMax: "",
  ratingMin: "",
  newOnly: false,
  bestSellerOnly: false,
  handPickedOnly: false,
};

const PRICE_RANGE = { min: 0, max: 5000, step: 100 };

function sortProducts(products: Product[], sortBy: SortValue): Product[] {
  const arr = [...products];
  switch (sortBy) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "newest":
      return arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case "rating":
      return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "discount":
      return arr.sort((a, b) => {
        const dA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const dB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return dB - dA;
      });
    default:
      return arr;
  }
}

function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter((p) => {
    if (filters.priceMin) {
      const min = Number(filters.priceMin);
      if (!Number.isNaN(min) && p.price < min) return false;
    }
    if (filters.priceMax) {
      const max = Number(filters.priceMax);
      if (!Number.isNaN(max) && p.price > max) return false;
    }
    if (filters.ratingMin) {
      const r = Number(filters.ratingMin);
      if (!Number.isNaN(r) && (p.rating ?? 0) < r) return false;
    }
    if (filters.newOnly && !p.isNew) return false;
    if (filters.bestSellerOnly && !p.isBestSeller) return false;
    if (filters.handPickedOnly && !p.isHandPicked) return false;
    return true;
  });
}

function hasActiveFilters(f: FilterState): boolean {
  return !!(
    f.priceMin ||
    f.priceMax ||
    f.ratingMin ||
    f.newOnly ||
    f.bestSellerOnly ||
    f.handPickedOnly
  );
}

const CATEGORY_IMAGES: Record<ProductCategorySlug, string> = {
  plants: "/category-plant.webp",
  seeds: "/category-seeds.avif",
  "pots-planters": "/category-ceramics.webp",
  "plant-care": "/category-care.webp",
  gifting: "/category-plant.webp",
};

export default function ProductGallery() {
  const searchParams = useSearchParams();
  const category = getValidCategory(searchParams.get("category"));
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortValue>("recommended");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);
  const sortPopoverRef = useRef<HTMLDivElement>(null);

  const config = CATEGORY_CONFIG[category];
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Recommended";

  useEffect(() => {
    if (!filterOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  useEffect(() => {
    if (!sortOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSortOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (sortPopoverRef.current && !sortPopoverRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortOpen]);

  const displayedProducts = useMemo(() => {
    const filtered = filterProducts(products, filters);
    return sortProducts(filtered, sortBy);
  }, [products, filters, sortBy]);

  const activeFilterCount = useMemo(
    () =>
      [filters.priceMin, filters.priceMax, filters.ratingMin, filters.newOnly, filters.bestSellerOnly, filters.handPickedOnly].filter(
        Boolean
      ).length,
    [filters]
  );

  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  useEffect(() => {
    let cancelled = false;
    setTimeout(() => {
      setLoading(true);
    }, 0);
    const cfg = CATEGORY_CONFIG[category];
    const img = CATEGORY_IMAGES[category];

    const fetchProducts = async () => {
      await new Promise((r) => setTimeout(r, 500));
      if (cancelled) return;
      /* TODO BACKEND DEVELOPER: Replace mock data with GET /api/products?category=...&sort=...&page=...&limit=...
         when products API supports category slug, pagination, and filters (see app/api/products/route.ts). */
      const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${category}-${i + 1}`,
        name: `${cfg.title} Product ${i + 1}`,
        price: Math.floor(Math.random() * 500) + 100,
        originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 700) + 200 : undefined,
        image: img,
        rating: +(Math.random() * 1.5 + 3.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 300) + 10,
        category: cfg.title,
        isNew: Math.random() > 0.7,
        isBestSeller: Math.random() > 0.6,
        isHandPicked: Math.random() > 0.8,
      }));
      setProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="h-10 w-64 bg-primary-100 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-primary-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4"
        >
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-primary-600 font-mono sm:text-3xl lg:text-4xl">
              {config.title}
            </h1>
            <p className="mt-0.5 text-sm text-primary-500/70 font-sans sm:text-base">
              {config.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative" ref={filterPopoverRef}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-primary-200 font-sans font-medium text-primary-700 hover:bg-primary-50"
                onClick={() => setFilterOpen((o) => !o)}
              >
                <IconAdjustments size={18} stroke={1.5} />
                Filter
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-primary-200 bg-white p-4 shadow-lg sm:left-auto sm:right-0 sm:max-w-none sm:w-80"
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-primary-100 pb-3">
                      <span className="text-sm font-semibold text-primary-700">Filters</span>
                      <button
                        type="button"
                        onClick={() => setFilterOpen(false)}
                        className="rounded-full p-1.5 text-primary-500 hover:bg-primary-100"
                        aria-label="Close"
                      >
                        <IconX size={18} stroke={1.5} />
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600">Price (₹)</p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm font-medium text-primary-700">
                            <span>₹{filters.priceMin === "" ? PRICE_RANGE.min : filters.priceMin}</span>
                            <span>₹{filters.priceMax === "" ? PRICE_RANGE.max : filters.priceMax}</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="mb-1 text-xs font-medium text-primary-600">Min</p>
                              <input
                                type="range"
                                min={PRICE_RANGE.min}
                                max={PRICE_RANGE.max}
                                step={PRICE_RANGE.step}
                                value={filters.priceMin === "" ? PRICE_RANGE.min : Math.min(Number(filters.priceMin), Number(filters.priceMax || PRICE_RANGE.max))}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  const num = Number(v);
                                  setFilter("priceMin", v);
                                  if (filters.priceMax !== "" && num > Number(filters.priceMax)) {
                                    setFilter("priceMax", v);
                                  }
                                }}
                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-primary-200 accent-primary-600 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
                              />
                            </div>
                            <div>
                              <p className="mb-1 text-xs font-medium text-primary-600">Max</p>
                              <input
                                type="range"
                                min={PRICE_RANGE.min}
                                max={PRICE_RANGE.max}
                                step={PRICE_RANGE.step}
                                value={filters.priceMax === "" ? PRICE_RANGE.max : Math.max(Number(filters.priceMax), Number(filters.priceMin || PRICE_RANGE.min))}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  const num = Number(v);
                                  setFilter("priceMax", v);
                                  if (filters.priceMin !== "" && num < Number(filters.priceMin)) {
                                    setFilter("priceMin", v);
                                  }
                                }}
                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-primary-200 accent-primary-600 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600">Rating</p>
                        <select
                          value={filters.ratingMin}
                          onChange={(e) => setFilter("ratingMin", e.target.value)}
                          className="w-full rounded-lg border border-primary-200 bg-white px-2.5 py-1.5 text-sm text-primary-800 outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Any</option>
                          <option value="4">4+ stars</option>
                          <option value="3">3+ stars</option>
                        </select>
                      </div>
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary-600">Badges</p>
                        <div className="flex flex-col gap-2">
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filters.newOnly}
                              onChange={(e) => setFilter("newOnly", e.target.checked)}
                              className="h-3.5 w-3.5 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-primary-700">New arrivals</span>
                          </label>
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filters.bestSellerOnly}
                              onChange={(e) => setFilter("bestSellerOnly", e.target.checked)}
                              className="h-3.5 w-3.5 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-primary-700">Best sellers</span>
                          </label>
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filters.handPickedOnly}
                              onChange={(e) => setFilter("handPickedOnly", e.target.checked)}
                              className="h-3.5 w-3.5 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-medium text-primary-700">Handpicked</span>
                          </label>
                        </div>
                      </div>
                      {hasActiveFilters(filters) && (
                        <button
                          type="button"
                          onClick={() => { clearFilters(); setFilterOpen(false); }}
                          className="mt-1 text-left text-xs font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {hasActiveFilters(filters) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-primary-600 underline underline-offset-2 hover:text-primary-700"
              >
                Clear all
              </button>
            )}
            <div className="relative flex items-center gap-2" ref={sortPopoverRef}>
              <span className="text-sm font-medium text-primary-600">Sort</span>
              <button
                type="button"
                onClick={() => setSortOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-primary-200 bg-white py-2 pl-4 pr-3 text-sm font-medium text-primary-700 outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 hover:bg-primary-50"
                aria-expanded={sortOpen}
                aria-haspopup="listbox"
                aria-label="Sort by"
              >
                <span>{currentSortLabel}</span>
                <IconChevronDown
                  size={16}
                  className={`text-primary-500 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    role="listbox"
                    className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-xl border border-primary-200 bg-white py-1 shadow-lg"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt.value} role="option" aria-selected={sortBy === opt.value}>
                        <button
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-primary-50 ${
                            sortBy === opt.value ? "bg-primary-50 text-primary-700" : "text-primary-700"
                          }`}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-[425px]:gap-5 md:gap-6">
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="min-w-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <ProductCard {...product} className="h-full" />
            </motion.div>
          ))}
        </div>

        {displayedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <h3 className="mb-2 font-mono text-xl font-semibold text-primary-600">
              {hasActiveFilters(filters) ? "No products match your filters" : "No products found"}
            </h3>
            <p className="font-sans text-primary-500/60">
              {hasActiveFilters(filters)
                ? "Try adjusting or clearing filters to see more results."
                : `We're currently updating our ${config.title.toLowerCase()} collection.`}
            </p>
            {hasActiveFilters(filters) && (
              <Button variant="outline" size="sm" className="mt-4 rounded-full" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
