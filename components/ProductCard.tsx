"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { IconHeart, IconStar, IconStarFilled } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";

export interface ProductCardProps {
  id: string | number;
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
  const isFavorite = wishlist.has(id);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleWishlist = () => {
    wishlist.toggle({
      id,
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
        damping: 25
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-linear-to-br from-primary-50 to-primary-100/30">
        <motion.img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Badges - Minimalist and Non-intrusive */}
        <div className="absolute left-0 right-0 top-3 flex items-center justify-between px-3">
          {/* Left badges */}
          <div className="flex items-center gap-1.5">
            {isNew && (
              <motion.span
                className="rounded-md bg-white/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-primary-700 shadow-sm border border-primary-100 leading-none h-5.5 flex items-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 500,
                  damping: 25
                }}
              >
                NEW
              </motion.span>
            )}
            {isBestSeller && (
              <motion.span
                className="rounded-md bg-primary-600/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-sm leading-none h-5.5 flex items-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.25,
                  type: "spring",
                  stiffness: 500,
                  damping: 25
                }}
              >
                BEST
              </motion.span>
            )}
            {isHandPicked && (
              <motion.span
                className="rounded-md bg-primary-600/95 backdrop-blur-md  px-2.5 py-1 text-[10px] font-bold text-white shadow-sm leading-none h-5.5 flex items-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 500,
                  damping: 25
                }}
              >
                HANDPICKED
              </motion.span>
            )}
          </div>

          {/* Right badge - Discount */}
          {discount > 0 && (
            <motion.span
              className="rounded-md bg-successDark/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-sm leading-none h-5.5 flex items-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.35,
                type: "spring",
                stiffness: 500,
                damping: 25
              }}
            >
              -{discount}%
            </motion.span>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button
          className={cn(
            "absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md shadow-lg transition-all duration-300",
            isFavorite 
              ? "bg-primary-600 text-white" 
              : "bg-white/95 text-primary-600 hover:bg-primary-50"
          )}
          onClick={handleToggleWishlist}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            delay: 0.1,
            type: "spring",
            stiffness: 400,
            damping: 20
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

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-4 md:p-5">
        {category && (
          <span className="mb-1 text-[10px] font-semibold text-primary-600 uppercase tracking-wider sm:mb-1.5 sm:text-[10px]">
            {category}
          </span>
        )}

        <h3 className="mb-2 line-clamp-2 min-h-[2.5em] text-sm font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary-700 sm:min-h-[2.25em] sm:mb-3 sm:text-base md:min-h-[2em]">
          {name}
        </h3>

        {rating > 0 && (
          <div className="mb-2 flex items-center gap-1.5 sm:mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) =>
                i < Math.floor(rating) ? (
                  <IconStarFilled key={i} size={12} className="text-amber-400" />
                ) : (
                  <IconStar key={i} size={12} className="text-gray-300" />
                )
              )}
            </div>
            <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({reviewCount})</span>
          </div>
        )}

        <div className="mt-auto mb-2 sm:mb-3 md:mb-4">
          <div className="flex flex-wrap items-baseline gap-1.5 gap-y-0.5 sm:gap-2">
            <span className="text-lg font-bold text-primary-800 sm:text-xl md:text-2xl">
              ₹{price}
            </span>
            {originalPrice && (
              <>
                <span className="text-xs text-gray-400 line-through sm:text-sm">₹{originalPrice}</span>
                <span className="text-xs font-bold text-successDark">{discount}% OFF</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 xl:flex-row">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
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
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              className="w-full bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 border-2 border-primary-600 hover:border-primary-700 text-xs sm:text-sm" 
              size="sm"
            >
              Add to Cart
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
