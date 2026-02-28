"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  isHandPicked?: boolean;
}

export default function HandPicked() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/products?isHandPicked=true");
        const json = await res.json();

        if (!json.success) return;

        const mapped = json.data.map((p: any) => ({
          id: p.slug,
          name: p.name,
          price: Number(p.price),
          originalPrice: p.originalPrice
            ? Number(p.originalPrice)
            : undefined,
          image: p.image,
          rating: Number(p.rating ?? 0),
          reviewCount: p.reviewCount ?? 0,
          category: p.category?.name,
          isHandPicked: p.isHandPicked,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("Failed to load handpicked products");
      }
    };

    load();
  }, []);

  if (!products.length) return null;

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary-600 font-mono">
          Handpicked, Just For You!
        </h2>

        <Link href="/product?isHandPicked=true">
          <Button variant="outline" size="sm" className="rounded-full">
            View All
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <IconArrowRight size={16} />
            </motion.span>
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="w-65 sm:w-70 md:w-75 lg:w-80 shrink-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <ProductCard {...product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}