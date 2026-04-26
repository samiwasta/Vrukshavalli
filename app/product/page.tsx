import { Suspense } from "react";
import ProductGallery from "./ProductGallery";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const CATEGORIES = [
  "plants",
  "indoor-plants",
  "outdoor-plants", 
  "seeds",
  "pots-planters",
  "plant-care",
  "gifting",
  "farm-fresh",
] as const;

const CATEGORY_META: Record<string, { title: string; subtitle: string }> = {
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
    subtitle: "Fresh from the farm — fruits, vegetables, and organic produce",
  },
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const categoryParam = typeof params.category === "string" ? params.category : null;
  
  const validCategory =
    categoryParam &&
    (CATEGORIES as readonly string[]).includes(categoryParam)
      ? (categoryParam as (typeof CATEGORIES)[number])
      : "plants";
  
  const categoryInfo = CATEGORY_META[validCategory];
  
  return {
    title: `${categoryInfo.title} — Vrukshavalli`,
    description: `${categoryInfo.subtitle}. Shop premium ${categoryInfo.title.toLowerCase()} online at Vrukshavalli.`,
  };
}

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductGallerySkeleton />}>
      <ProductGallery />
    </Suspense>
  );
}

function ProductGallerySkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
        <div className="mb-8 sm:mb-10">
          <div className="h-12 w-80 bg-primary-100 rounded-lg animate-pulse mb-3" />
          <div className="h-4 w-96 bg-primary-50 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-primary-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
