"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { IconHeart } from "@tabler/icons-react";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="font-mono text-2xl font-semibold text-primary-600 sm:text-3xl lg:text-4xl">
              Wishlist
            </h1>
            <p className="mt-0.5 font-sans text-sm text-primary-500/70 sm:text-base">
              {items.length === 0
                ? "Items you save will appear here."
                : `${items.length} ${items.length === 1 ? "item" : "items"} saved`}
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" size="sm" className="w-fit rounded-full" asChild>
              <Link href="/product?category=plants">Continue shopping</Link>
            </Button>
          )}
        </motion.div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-[425px]:gap-5 md:gap-6">
            {items.map((product, index) => (
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
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-500">
              <IconHeart size={40} stroke={1.5} />
            </div>
            <h2 className="mb-2 font-mono text-xl font-semibold text-primary-600">
              Your wishlist is empty
            </h2>
            <p className="mb-6 max-w-sm font-sans text-primary-500/70">
              Save items you like by tapping the heart on any product. They will show up here.
            </p>
            <Button className="rounded-full" asChild>
              <Link href="/product?category=plants">Browse plants</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
