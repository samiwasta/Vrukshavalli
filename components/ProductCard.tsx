"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  IconHeart,
  IconMinus,
  IconPlus,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
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
  const bagLine = bag.items.find((i) => i.id === itemId);
  const qtyInBag = bagLine?.quantity ?? 0;
  const maxQty = stock > 0 ? stock : Number.MAX_SAFE_INTEGER;
  const atMaxQty = qtyInBag >= maxQty;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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

  const handleDecrementBag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!bagLine) return;
    if (bagLine.quantity <= 1) {
      bag.removeItem(itemId);
    } else {
      bag.updateQty(itemId, bagLine.quantity - 1);
    }
  };

  const handleIncrementBag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!bagLine) return;
    if (atMaxQty) return;
    bag.updateQty(itemId, bagLine.quantity + 1);
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className={cn(
        "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-primary-100/50 bg-white transition-all duration-500 hover:border-primary-200 cursor-pointer",
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

      </div>

      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col",
          compact ? "p-2.5 pb-3" : "p-3 sm:p-4 md:p-5",
        )}
      >
        <div
          className={cn(
            "mb-1 flex min-h-4 items-end",
            compact && "min-h-3.5",
          )}
        >
          {category ? (
            <span
              className={cn(
                "line-clamp-1 text-[10px] font-semibold uppercase tracking-wider text-primary-600",
              )}
            >
              {category}
            </span>
          ) : null}
        </div>

        <h3
          className={cn(
            "mb-2 text-sm font-semibold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary-700 sm:text-base",
            compact
              ? "line-clamp-3 min-h-[3.6rem]"
              : "line-clamp-2 min-h-11 sm:mb-3 sm:min-h-12",
          )}
        >
          {name}
        </h3>

        <div
          className={cn(
            "mb-2 flex min-h-[22px] items-center gap-1.5",
            compact && "min-h-[20px]",
          )}
        >
          {rating > 0 ? (
            <>
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
              <span className="text-[11px] font-medium text-muted-foreground">
                {rating.toFixed(1)}
                {reviewCount > 0 && (
                  <span className="text-gray-400"> ({reviewCount})</span>
                )}
              </span>
            </>
          ) : null}
        </div>

        <div
          className={cn(
            "mb-3 flex min-h-10 flex-wrap items-baseline gap-x-2 gap-y-0.5",
            compact && "mb-2.5 min-h-9",
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

          {qtyInBag > 0 ? (
            <div
              className={cn(
                "flex h-9 min-h-9 w-full min-w-0 overflow-hidden rounded-full border-2 border-primary-600 bg-primary-600 shadow-md",
                compact && "h-8 min-h-8",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleDecrementBag}
                className="flex flex-1 items-center justify-center text-white transition-colors hover:bg-primary-700 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Decrease quantity in bag"
              >
                <IconMinus
                  size={compact ? 15 : 17}
                  stroke={2.25}
                  aria-hidden
                />
              </button>
              <span
                className={cn(
                  "flex min-w-8 shrink-0 items-center justify-center border-x border-primary-500/35 font-mono text-sm font-bold tabular-nums text-white select-none sm:min-w-9 sm:text-base",
                  compact && "min-w-7 text-xs sm:min-w-8",
                )}
                aria-live="polite"
              >
                {qtyInBag}
              </span>
              <button
                type="button"
                onClick={handleIncrementBag}
                disabled={atMaxQty}
                className={cn(
                  "flex flex-1 items-center justify-center text-white transition-colors hover:bg-primary-700 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  atMaxQty && "cursor-not-allowed opacity-40 hover:bg-primary-600",
                )}
                aria-label={
                  atMaxQty
                    ? "Maximum quantity reached"
                    : "Increase quantity in bag"
                }
              >
                <IconPlus
                  size={compact ? 15 : 17}
                  stroke={2.25}
                  aria-hidden
                />
              </button>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleAddToBag}
                className="h-auto min-h-9 w-full min-w-0 whitespace-normal rounded-full border-2 border-primary-600 bg-primary-600 px-3 py-2 text-center text-xs font-semibold leading-tight text-white shadow-md transition-all duration-300 hover:border-primary-700 hover:bg-primary-700 hover:shadow-lg sm:text-sm"
                size="sm"
              >
                Add to Bag
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
