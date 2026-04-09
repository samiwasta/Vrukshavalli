"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { IconHeart, IconStar, IconStarFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util";
import { useWishlist } from "@/context/WishlistContext";
import { useBag } from "@/context/BagContext";
import Link from "next/link";
import { getStockLevel } from "@/lib/stock";

export interface ProductCardProps {
  id: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  stock?: number;
  stockCapacity?: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  isHandPicked?: boolean;
  /** Stacked actions, tighter padding — for narrow horizontal strips */
  compact?: boolean;
  className?: string;
}

export default function ProductCard({
  id,
  slug,
  name,
  price,
  originalPrice,
  image,
  rating = 0,
  reviewCount = 0,
  category,
  stock = 0,
  stockCapacity = null,
  isNew,
  isBestSeller,
  isHandPicked,
  compact = false,
  className,
}: ProductCardProps) {
  const wishlist = useWishlist();
  const bag = useBag();
  const itemId = String(id);
  const detailHref = `/product/${slug ?? id}`;
  const stockLevel = getStockLevel(stock, stockCapacity);
  const isFavorite = wishlist.has(itemId);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();   // ✅ prevent prop chain
    e.preventDefault();    // ✅ prevent parent navigation
    wishlist.toggle({
      id: itemId,
      slug,
      name,
      price,
      originalPrice,
      image,
      rating,
      reviewCount,
      category,
      stock,
      stockCapacity,
      isNew,
      isBestSeller,
      isHandPicked,
    });
  };

  const handleAddToBag = (e: React.MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();

  bag.addItem({
    id: itemId,
    slug: slug ?? undefined,
    name,
    price,
    image,
    quantity: 1,
    stock,
  });
};

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className={cn(
        "group relative flex min-h-0 flex-col overflow-hidden rounded-3xl bg-white border border-primary-100/50 hover:border-primary-200 transition-all duration-500 cursor-pointer",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-linear-to-br from-primary-50 to-primary-100/30">
        <motion.img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {stockLevel === "out" && (
          <div className="absolute bottom-3 left-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            Out of stock
          </div>
        )}
        {stockLevel === "few" && (
          <div className="absolute bottom-3 left-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            Few left
          </div>
        )}

        <motion.div
          className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* ❤️ FIXED BUTTON */}
        <motion.button
          type="button"
          onClick={handleToggleWishlist}
          className={cn(
            "absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all duration-300",
            isFavorite
              ? "bg-primary-600 text-white"
              : "bg-white/95 text-primary-600 hover:bg-primary-50"
          )}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 400,
            damping: 20,
          }}
        >
          <motion.div
            animate={{ rotate: isFavorite ? [0, -10, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            <IconHeart
              size={20}
              fill={isFavorite ? "currentColor" : "none"}
              stroke={2}
            />
          </motion.div>
        </motion.button>

        {/* BADGES unchanged */}
      </div>

      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col",
          compact ? "p-2.5 pb-3" : "p-3 sm:p-4 md:p-5",
        )}
      >
        {category && (
          <span
            className={cn(
              "mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary-600",
              compact && "line-clamp-1",
            )}
          >
            {category}
          </span>
        )}

        <h3
          className={cn(
            "mb-2 text-sm font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary-700 sm:text-base",
            compact
              ? "line-clamp-3 min-h-15"
              : "line-clamp-2 min-h-[2.5em] sm:mb-3 sm:min-h-[2.25em] md:min-h-[2em]",
          )}
        >
          {name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="mb-2 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.round(rating) ? (
                    <IconStarFilled size={12} className="text-amber-400" />
                  ) : (
                    <IconStar size={12} className="text-gray-300" />
                  )}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              {rating.toFixed(1)}
              {reviewCount > 0 && (
                <span className="text-gray-400"> ({reviewCount})</span>
              )}
            </span>
          </div>
        )}

        <div
          className={cn(
            "mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
            compact && "mb-2.5",
          )}
        >
          <span
            className={cn(
              "font-bold text-primary-700",
              compact ? "text-sm" : "text-base sm:text-lg",
            )}
          >
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-xs text-muted-foreground line-through sm:text-sm">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] font-semibold text-green-600 sm:text-xs">
                {discount}% off
              </span>
            </>
          )}
        </div>

        <div className="mt-auto flex min-w-0 flex-col gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href={detailHref} className="block w-full min-w-0">
              <Button
                variant="outline"
                className="h-auto min-h-9 w-full whitespace-normal rounded-full border-2 border-primary-600 px-3 py-2 text-center text-xs font-semibold leading-tight text-primary-600 hover:bg-primary-50 sm:text-sm"
                size="sm"
              >
                View Details
              </Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleAddToBag}
              className="h-auto min-h-9 w-full min-w-0 whitespace-normal rounded-full border-2 border-primary-600 bg-primary-600 px-3 py-2 text-center text-xs font-semibold leading-tight text-white shadow-md transition-all duration-300 hover:border-primary-700 hover:bg-primary-700 hover:shadow-lg sm:text-sm"
              size="sm"
            >
              Add to Bag
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
