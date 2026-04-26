"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { IconGift } from "@tabler/icons-react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/util";

export const PRODUCT_CATEGORIES = [
  "plants",
  "indoor-plants",
  "outdoor-plants",
  "seeds",
  "pots-planters",
  "plant-care",
  "gifting",
  "farm-fresh",
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
  "indoor-plants": {
    title: "Indoor Plants",
    subtitle: "Beautiful plants perfect for your home and office spaces",
  },
  "outdoor-plants": {
    title: "Outdoor Plants",
    subtitle: "Stunning plants for your garden, balcony, and outdoor areas",
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
  "farm-fresh": {
    title: "Farm Fresh",
    subtitle: "Fresh from the farm - fruits, vegetables, and organic produce",
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

type GiftingFormData = {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  moq: string;
  deliveryType: "single" | "multiple" | "";
};

const MOQ_OPTIONS = [
  "10 – 25 units",
  "26 – 50 units",
  "51 – 100 units",
  "101 – 250 units",
  "251 – 500 units",
  "500+ units",
] as const;

function GiftEnquiryModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<GiftingFormData>({
    fullName: "",
    phone: "",
    email: "",
    company: "",
    moq: "",
    deliveryType: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/gifting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) setSubmitted(true);
      else toast.error(json.error ?? "Failed to submit enquiry");
    } catch {
      toast.error("Failed to submit enquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-70 flex items-end justify-end bg-black/40 p-4 backdrop-blur-sm sm:items-center sm:justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="py-10 text-center">
            <h3 className="font-mono text-xl font-semibold text-zinc-900">Enquiry Submitted</h3>
            <p className="mt-2 text-sm text-zinc-500">Our gifting team will contact you shortly.</p>
            <Button onClick={onClose} className="mt-6 rounded-full px-8">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="font-mono text-lg font-semibold text-zinc-900">Gift Enquiry</h3>
            <input name="fullName" required placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm" />
            <input name="phone" required placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm" />
            <input name="email" type="email" required placeholder="Email Address" value={formData.email} onChange={handleChange} className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm" />
            <input name="company" required placeholder="Company Name" value={formData.company} onChange={handleChange} className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm" />
            <select name="moq" required value={formData.moq} onChange={handleChange} className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm">
              <option value="" disabled>Minimum Order Quantity</option>
              {MOQ_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <div className="flex gap-2">
              {(["single", "multiple"] as const).map((type) => (
                <label key={type} className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm">
                  <input type="radio" name="deliveryType" value={type} checked={formData.deliveryType === type} onChange={handleChange} />
                  {type === "single" ? "Single Location" : "Multiple Locations"}
                </label>
              ))}
            </div>
            <Button type="submit" disabled={isSubmitting || !formData.moq || !formData.deliveryType} className="h-11 w-full rounded-xl text-sm font-semibold">
              {isSubmitting ? "Sending…" : "Submit Gift Enquiry"}
            </Button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
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

  const plantTypeInUrl = searchParams.get("plantType");
  const plantTypeForApi =
    categoryForApi === "plants" &&
    (plantTypeInUrl === "indoor" || plantTypeInUrl === "outdoor")
      ? plantTypeInUrl
      : null;

  // Determine which plant tab should be active based on category or plantType
  const plantsTabActive: "all" | "indoor" | "outdoor" =
    categoryForApi === "indoor-plants" || plantTypeForApi === "indoor"
      ? "indoor"
      : categoryForApi === "outdoor-plants" || plantTypeForApi === "outdoor"
        ? "outdoor"
        : "all";

  // Show plant tabs for plants, indoor-plants, or outdoor-plants categories
  const shouldShowPlantTabs = 
    categoryForApi === "plants" || 
    categoryForApi === "indoor-plants" || 
    categoryForApi === "outdoor-plants";

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
  const [giftModalOpen, setGiftModalOpen] = useState(false);

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
        if (plantTypeForApi) query.set("plantType", plantTypeForApi);

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
    plantTypeForApi,
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

        {shouldShowPlantTabs && (
          <div
            className="mb-8 flex flex-wrap gap-2 border-b border-primary-100 pb-1"
            role="tablist"
            aria-label="Plant type"
          >
            <Link
              href="/product?category=plants"
              scroll={false}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                plantsTabActive === "all"
                  ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                  : "bg-primary-50 text-primary-700 hover:bg-primary-100",
              )}
            >
              All plants
            </Link>
            <Link
              href="/product?category=indoor-plants"
              scroll={false}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                plantsTabActive === "indoor"
                  ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                  : "bg-primary-50 text-primary-700 hover:bg-primary-100",
              )}
            >
              Indoor plants
            </Link>
            <Link
              href="/product?category=outdoor-plants"
              scroll={false}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                plantsTabActive === "outdoor"
                  ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                  : "bg-primary-50 text-primary-700 hover:bg-primary-100",
              )}
            >
              Outdoor plants
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="h-full"
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

      {categoryForApi === "gifting" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 26 }}
          className="fixed bottom-6 right-24 z-60 sm:right-24"
        >
          <Button
            size="lg"
            onClick={() => setGiftModalOpen(true)}
            className="group flex items-center gap-2 rounded-full pl-5 pr-6 shadow-xl shadow-primary-600/30 hover:shadow-primary-600/40"
          >
            <motion.span
              animate={{ rotate: [0, -12, 12, -8, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.6 }}
            >
              <IconGift size={20} />
            </motion.span>
            <span className="text-sm font-semibold">Gift Enquiry</span>
          </Button>
        </motion.div>
      )}
      <AnimatePresence>
        {giftModalOpen && <GiftEnquiryModal onClose={() => setGiftModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
