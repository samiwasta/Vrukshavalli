"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";
import ProductCard from "@/components/ProductCard";

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
}

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/products?isBestSeller=true");
      const json = await res.json();

      if (!json.success) return;

      const mapped = json.data.map((p: any) => ({
        id: p.slug, // for routing
        name: p.name,
        price: Number(p.price),
        originalPrice: p.originalPrice
          ? Number(p.originalPrice)
          : undefined,
        image: p.image,
        rating: Number(p.rating ?? 0),
        reviewCount: p.reviewCount ?? 0,
        category: p.category?.name,
        isBestSeller: p.isBestSeller,
        isNew: p.isNew,
      }));

      setProducts(mapped);
    };

    load();
  }, []);

  if (!products.length) return null;

  return (
    <section className="container mx-auto px-4 w-full bg-background py-10 sm:py-12 lg:py-14">
      {/* Header */}
      <div className="px-4 sm:px-6 mb-8 flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary-600 font-mono">
          Flying Off the Shelves
        </h2>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="sm" className="rounded-full">
            View All
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <IconArrowRight size={16} />
            </motion.span>
          </Button>
        </motion.div>
      </div>

      {/* Scroll row */}
      <div className="overflow-x-auto pb-4 px-4 sm:px-6 flex gap-4 sm:gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="w-65 sm:w-70 md:w-75 lg:w-80 shrink-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.08 }}
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}