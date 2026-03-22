"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";
import ProductCard from "@/components/ProductCard";
import type { ApiProductListRow } from "@/lib/api-product-list-row";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isHandPicked?: boolean;
}

export default function Ceramics() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/products?isCeramicFeatured=true");
        const json = await res.json();

        if (!json.success) return;

        const rows = json.data as ApiProductListRow[];
        const mapped = rows.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
          image: p.image,
          rating: Number(p.rating ?? 0),
          reviewCount: p.reviewCount ?? 0,
          category: p.category?.name,
          stock: Number(p.stock ?? 0),
          stockCapacity: p.stockCapacity ?? null,
          isBestSeller: p.isBestSeller,
          isNew: p.isNew,
          isHandPicked: p.isHandPicked,
        }));

        setProducts(mapped);
      } catch {
        console.error("Failed to load ceramic products");
      }
    };

    load();
  }, []);

  return (
    <section className="container mx-auto px-4 w-full bg-background py-10 sm:py-12 lg:py-14">
      {/* Header */}
      <div className="px-4 sm:px-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary-600 font-mono leading-tight tracking-tight">
            Handcrafted Ceramic Planters
          </h2>
          <Link href="/product?category=pots-planters">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="outline" size="sm" className="rounded-full">
                View All
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <IconArrowRight size={16} />
                </motion.span>
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Scroll row */}
      <div className="overflow-x-auto pb-4 px-4 sm:px-6 flex gap-4 sm:gap-6">
        {products.length === 0 ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <span className="text-4xl">🏺</span>
            <p className="text-base font-medium">No Products Yet</p>
            <p className="text-sm text-gray-400">Our ceramic collection is coming soon!</p>
          </div>
        ) : products.map((product, index) => (
          <motion.div
            key={product.id}
            className="w-65 sm:w-70 md:w-75 lg:w-80 shrink-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}