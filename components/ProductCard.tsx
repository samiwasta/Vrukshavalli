"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { IconHeart, IconStar, IconStarFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util";
import { useWishlist } from "@/context/WishlistContext";
import { useBag } from "@/context/BagContext";
import Link from "next/link";

export interface ProductCardProps {
  // IDs come from the database (UUID strings), always treated as strings
  id: string;
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
  className?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating = 0,
  reviewCount = 0,
  category,
  isNew,
  isBestSeller,
  isHandPicked,
  className,
}: ProductCardProps) {
  const wishlist = useWishlist();
  // ensure the ID is a string for the wishlist API
  const bag = useBag();
  const itemId = String(id);
  const isFavorite = wishlist.has(itemId);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();   // ✅ prevent prop chain
    e.preventDefault();    // ✅ prevent parent navigation
    wishlist.toggle({
      id: itemId,
      name,
      price,
      originalPrice,
      image,
      rating,
      reviewCount,
      category,
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
    name,
    price,
    image,
    quantity: 1,
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

      {/* CONTENT unchanged */}
      <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4 md:p-5">
        {category && (
          <span className="mb-1 text-[10px] font-semibold text-primary-600 uppercase tracking-wider sm:mb-1.5 sm:text-[10px]">
            {category}
          </span>
        )}

        <h3 className="mb-2 line-clamp-2 min-h-[2.5em] text-sm font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary-700 sm:min-h-[2.25em] sm:mb-3 sm:text-base md:min-h-[2em]">
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

        {/* Price */}
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-primary-700 sm:text-lg">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-xs text-muted-foreground line-through sm:text-sm">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-semibold text-green-600">
                {discount}% off
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 xl:flex-row">
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href={`/product/${id}`} className="block w-full">
              <Button
                variant="outline"
                className="w-full rounded-full font-semibold border-2 border-primary-600 text-primary-600 hover:bg-primary-50 text-xs sm:text-sm"
                size="sm"
              >
                View Details
              </Button>
            </Link>
          </motion.div>

          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
                onClick={handleAddToBag}
                className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 border-2 border-primary-600 hover:border-primary-700 text-xs sm:text-sm"
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
