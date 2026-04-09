"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  IconArrowLeft,
  IconHeart,
  IconShoppingCart,
  IconStar,
  IconStarFilled,
  IconTruckDelivery,
  IconShieldCheck,
  IconRefresh,
  IconMinus,
  IconPlus,
  IconShare,
  IconCheck,
  IconSun,
  IconDroplet,
  IconRuler,
  IconPaw,
  IconSparkles,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { ApiProductListRow } from "@/lib/api-product-list-row";
import { cn } from "@/lib/util";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useBag } from "@/context/BagContext";
import { getStockLevel } from "@/lib/stock";

// ── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  stock: number;
  stockCapacity?: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  isHandPicked?: boolean;
  careLevel: "Easy" | "Moderate" | "Expert";
  light: string;
  water: string;
  size: string;
  petFriendly: boolean;
  plantType: "indoor" | "outdoor" | null;
  potSizes: string[];
}

// ── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) =>
        i < Math.floor(rating) ? (
          <IconStarFilled key={i} size={size} className="text-amber-400" />
        ) : i < rating ? (
          <IconStar key={i} size={size} className="text-amber-300" />
        ) : (
          <IconStar key={i} size={size} className="text-zinc-300" />
        ),
      )}
    </div>
  );
}

// ── Care Badge ───────────────────────────────────────────────────────────────
const CARE_COLORS: Record<Product["careLevel"], string> = {
  Easy: "bg-successLight text-successDark",
  Moderate: "bg-warningLight text-warningDark",
  Expert: "bg-errorLight text-errorDark",
};

function formatSizeSpec(
  sizeDetail: string | null | undefined,
  potSizes: string[] | null | undefined,
): string {
  const detail = sizeDetail?.trim();
  if (detail) return detail;
  const pots = potSizes?.filter(Boolean) ?? [];
  if (pots.length === 0) return "—";
  return pots.join(", ");
}

function potSizeCmHint(potLabel: string): string | null {
  if (potLabel === '4"') return "~10 cm";
  if (potLabel === '6"') return "~15 cm";
  return null;
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const wishlist = useWishlist();
  const bag = useBag();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSize(null);
    setActiveImage(0);
  }, [id]);

  const isFav = product ? wishlist.has(product.id) : false;

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();

        if (json.success) {
          const p = json.data;
          const extra = p.images;
          const gallery =
            Array.isArray(extra) && extra.length > 0
              ? extra.filter(
                  (u): u is string => typeof u === "string" && u.length > 0,
                )
              : p.image
                ? [p.image]
                : [];

          const potSizes = Array.isArray(p.potSizes)
            ? p.potSizes
            : [];
          const plantType =
            p.plantType === "indoor" || p.plantType === "outdoor"
              ? p.plantType
              : null;

          setProduct({
            ...p,
            category: p.category?.name ?? "",
            categorySlug: p.category?.slug ?? "",
            price: Number(p.price),
            originalPrice: p.originalPrice
            ? Number(p.originalPrice)
            : undefined,
            rating: Number(p.rating ?? 0),
            reviewCount: Number(p.reviewCount ?? 0),
            stock: Number(p.stock ?? 0),
            stockCapacity: p.stockCapacity ?? null,
            images: gallery,
            careLevel:
              p.careLevel === "Moderate" || p.careLevel === "Expert"
                ? p.careLevel
                : "Easy",
            light: p.light?.trim() || "—",
            water: p.water?.trim() || "—",
            size: formatSizeSpec(p.sizeDetail, potSizes),
            petFriendly: Boolean(p.petFriendly),
            plantType,
            potSizes,
          });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    if (product.stock > 0) {
      setQuantity((q) =>
        Math.min(Math.max(1, q), product.stock)
      );
    } else {
      setQuantity(1);
    }
  }, [product?.id, product?.stock]);

  const handleAddToCart = () => {
    if (!product) return;

    const qty =
      product.stock > 0 ? quantity : Math.min(1, Math.max(1, quantity));

    bag.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
      slug: product.slug,
      stock: product.stock,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* silently ignore */
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    wishlist.toggle({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      rating: product.rating,
      reviewCount: product.reviewCount,
      category: product.category,
      stock: product.stock,
      stockCapacity: product.stockCapacity ?? null,
      isNew: product.isNew,
      isBestSeller: product.isBestSeller,
      isHandPicked: product.isHandPicked,
    });
  };

  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  // ── Skeleton ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:px-6">
          <div className="h-5 w-32 animate-pulse rounded-lg bg-primary-100 mb-8" />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-3xl bg-primary-100" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "animate-pulse rounded-xl bg-primary-100",
                    i === 0 ? "h-10 w-3/4" : "h-5 w-full",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:py-10">
        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center gap-2 text-sm text-zinc-500"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            <IconArrowLeft size={16} />
            Back
          </button>
          <span>/</span>
          <Link
            href="/product"
            className="hover:text-primary-600 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <Link
             href={`/product?category=${product.categorySlug}`}
          >
             {product.category}
          </Link>
          <span>/</span>
          <span className="text-zinc-700 font-medium line-clamp-1">
            {product.name}
          </span>
        </motion.div>

        {/* ── Main Grid ─────────────────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Left — Image Gallery: sticky, full viewport height */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:sticky lg:top-4"
          >
            {/* Thumbnail strip + main image side by side */}
            <div className="flex gap-3">
              {/* Vertical thumbnail strip */}
              <div className="hidden sm:flex flex-col gap-2.5 shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative h-22 w-22 overflow-hidden rounded-2xl border-2 transition-all duration-200",
                      activeImage === i
                        ? "border-primary-600 shadow-md"
                        : "border-zinc-200 opacity-60 hover:opacity-100 hover:border-primary-300",
                    )}
                  >
                    <img
                      src={img}
                      alt={`View ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="relative flex-1 overflow-hidden rounded-3xl bg-primary-50 aspect-square">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Badges only — no action buttons on image */}
                <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                  {product.isNew && (
                    <span className="rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold text-primary-700 shadow-sm border border-primary-100">
                      NEW
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="rounded-md bg-primary-600/95 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                      BEST SELLER
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="rounded-md bg-green-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile thumbnail strip (horizontal, shown below image on small screens) */}
            <div className="mt-3 flex gap-2.5 sm:hidden">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200",
                    activeImage === i
                      ? "border-primary-600 shadow-md"
                      : "border-zinc-200 opacity-60 hover:opacity-100",
                  )}
                >
                  <img
                    src={img}
                    alt={`View ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {/* Category + Action buttons row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">
                {product.category}
              </span>
              {/* Wishlist + Share */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleWishlist}
                  title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-150",
                    isFav
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-primary-200 bg-white text-primary-600 hover:border-primary-400 hover:bg-primary-50",
                  )}
                >
                  <IconHeart size={18} fill={isFav ? "currentColor" : "none"} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  title="Copy link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-200 bg-white text-zinc-500 transition-all hover:border-zinc-300 hover:bg-zinc-50"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <IconCheck size={16} className="text-successDark" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="share"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <IconShare size={16} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <h1 className="font-mono text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>
              {product.plantType && (
                <span className="w-fit rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
                  {product.plantType === "indoor"
                    ? "Indoor plant"
                    : "Outdoor plant"}
                </span>
              )}
            </div>

            {/* Rating Row */}
            <div className="flex flex-wrap items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-sm font-semibold text-zinc-700">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-zinc-400">
                ({product.reviewCount} reviews)
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  CARE_COLORS[product.careLevel],
                )}
              >
                {product.careLevel} care
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-3xl font-bold text-primary-700">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-zinc-400 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="rounded-full bg-successLight px-2.5 py-0.5 text-sm font-bold text-successDark">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-zinc-600">
              {product.description}
            </p>

            {/* Pot size selector — indoor / outdoor when pot sizes configured */}
            <AnimatePresence>
              {(product.plantType === "indoor" ||
                product.plantType === "outdoor") &&
                product.potSizes &&
                product.potSizes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-primary-100 bg-primary-50/40 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Pot Size
                    </span>
                    {selectedSize && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs font-semibold text-primary-600"
                      >
                        Selected: {selectedSize}
                      </motion.span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.potSizes.map((s) => (
                      <motion.button
                        key={s}
                        whileTap={{ scale: 0.93 }}
                        onClick={() =>
                          setSelectedSize(s === selectedSize ? null : s)
                        }
                        className={cn(
                          "relative flex flex-col items-center gap-1.5 rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all duration-200",
                          selectedSize === s
                            ? "border-primary-600 bg-primary-600 text-white shadow-md shadow-primary-600/25"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-primary-300 hover:bg-primary-50",
                        )}
                      >
                        <span className="text-base font-bold">{s}</span>
                        {potSizeCmHint(s) && (
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            selectedSize === s
                              ? "text-primary-100"
                              : "text-zinc-400",
                          )}
                        >
                          {potSizeCmHint(s)}
                        </span>
                        )}
                        {selectedSize === s && (
                          <motion.span
                            layoutId="sizeCheck"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm"
                          >
                            <IconCheck size={11} className="text-primary-600" />
                          </motion.span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <p className="mt-2.5 text-[11px] text-zinc-400">
                    Pot diameter measured at the rim. Plants are shipped in
                    nursery pots.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Care Specs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  icon: IconSun,
                  label: "Light",
                  value: product.light,
                  iconBg: "bg-amber-50",
                  iconColor: "text-amber-500",
                  accent: "hover:border-amber-200 hover:bg-amber-50/60",
                },
                {
                  icon: IconDroplet,
                  label: "Water",
                  value: product.water,
                  iconBg: "bg-sky-50",
                  iconColor: "text-sky-500",
                  accent: "hover:border-sky-200 hover:bg-sky-50/60",
                },
                {
                  icon: IconRuler,
                  label: "Size",
                  value: product.size,
                  iconBg: "bg-violet-50",
                  iconColor: "text-violet-500",
                  accent: "hover:border-violet-200 hover:bg-violet-50/60",
                },
                {
                  icon: IconPaw,
                  label: "Pet Safe",
                  value: product.petFriendly ? "Yes" : "No",
                  iconBg: product.petFriendly ? "bg-green-50" : "bg-red-50",
                  iconColor: product.petFriendly
                    ? "text-green-600"
                    : "text-red-500",
                  valueClass: product.petFriendly
                    ? "text-green-700"
                    : "text-red-600",
                  accent: product.petFriendly
                    ? "hover:border-green-200 hover:bg-green-50/60"
                    : "hover:border-red-200 hover:bg-red-50/60",
                },
              ].map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className={cn(
                    "group flex flex-col items-center gap-2 rounded-2xl border border-primary-100 bg-white px-3 py-4 text-center cursor-default transition-colors duration-200 shadow-sm",
                    spec.accent,
                  )}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -6, 0] }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200",
                      spec.iconBg,
                    )}
                  >
                    <spec.icon size={20} className={spec.iconColor} />
                  </motion.div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-500 transition-colors">
                    {spec.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold leading-tight text-zinc-700",
                      spec.valueClass,
                    )}
                  >
                    {spec.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Stock */}
            <p
              className={cn(
                "text-sm font-medium",
                getStockLevel(product.stock, product.stockCapacity) === "out" && "text-red-600",
                getStockLevel(product.stock, product.stockCapacity) === "few" && "text-amber-700",
                getStockLevel(product.stock, product.stockCapacity) === "in" && "text-successDark",
              )}
            >
              {getStockLevel(product.stock, product.stockCapacity) === "out" && "Out of stock — you can still add to your bag or wishlist, but checkout is disabled until it is back."}
              {getStockLevel(product.stock, product.stockCapacity) === "few" &&
                `Few left — only ${product.stock} available (order soon).`}
              {getStockLevel(product.stock, product.stockCapacity) === "in" &&
                `In stock (${product.stock} available)`}
            </p>

            {/* Quantity + CTA */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center gap-0 rounded-full border-2 border-primary-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <IconMinus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-zinc-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() =>
                    setQuantity((q) =>
                      product.stock > 0
                        ? Math.min(product.stock, q + 1)
                        : q
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center text-primary-600 hover:bg-primary-50 transition-colors disabled:pointer-events-none disabled:opacity-30"
                >
                  <IconPlus size={16} />
                </button>
              </div>

              {/* Add to Bag */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 rounded-full font-semibold shadow-md shadow-primary-600/20 transition-all"
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="done"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <IconCheck size={18} /> Added!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <IconShoppingCart size={18} /> Add to Bag
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 border-t border-primary-100 pt-5">
              {[
                { icon: IconTruckDelivery, text: "Free delivery above ₹499" },
                { icon: IconShieldCheck, text: "Plant health guarantee" },
                { icon: IconRefresh, text: "7-day easy returns" },
              ].map((badge) => (
                <div
                  key={badge.text}
                  className="flex items-center gap-2 text-xs text-zinc-500"
                >
                  <badge.icon size={16} className="text-primary-500 shrink-0" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── You May Also Like ──────────────────────────────────────────── */}
        <RelatedProducts
  categorySlug={product.categorySlug}
  currentId={product.id}
/>
      </div>

      {/* ── Sticky Bottom Bar (mobile) ───────────────────────────────────── */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-primary-100 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-mono text-lg font-bold text-primary-700">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-zinc-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            className="rounded-full px-8 font-semibold shadow-md shadow-primary-600/20"
          >
            <IconShoppingCart size={18} />
            Add to Bag
          </Button>
        </div>
      </motion.div>

      {/* Bottom padding for sticky bar on mobile */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}

// ── Related Products ─────────────────────────────────────────────────────────
type RelatedCardProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category?: string;
  stock: number;
  stockCapacity: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
};

function mapListRow(p: ApiProductListRow): RelatedCardProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    image: p.image,
    rating: Number(p.rating ?? 0),
    reviewCount: Number(p.reviewCount ?? 0),
    category: p.category?.name,
    stock: Number(p.stock ?? 0),
    stockCapacity: p.stockCapacity ?? null,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
  };
}

function RelatedProducts({
  categorySlug,
  currentId,
}: {
  categorySlug: string;
  currentId: string;
}) {
  const [products, setProducts] = useState<RelatedCardProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRelated = async () => {
      setLoading(true);
      try {
        const seen = new Set<string>([currentId]);
        const merged: RelatedCardProduct[] = [];

        if (categorySlug) {
          const res = await fetch(
            `/api/products?category=${encodeURIComponent(categorySlug)}&limit=16`,
          );
          const json = await res.json();
          if (json.success && !cancelled) {
            const rows = json.data as ApiProductListRow[];
            for (const row of rows) {
              if (seen.has(row.id)) continue;
              seen.add(row.id);
              merged.push(mapListRow(row));
              if (merged.length >= 8) break;
            }
          }
        }

        if (merged.length < 6 && !cancelled) {
          const res = await fetch("/api/products?limit=24&isBestSeller=true");
          const json = await res.json();
          if (json.success && !cancelled) {
            const rows = json.data as ApiProductListRow[];
            for (const row of rows) {
              if (seen.has(row.id)) continue;
              seen.add(row.id);
              merged.push(mapListRow(row));
              if (merged.length >= 10) break;
            }
          }
        }

        if (!cancelled) setProducts(merged);
      } catch (err) {
        console.error("Related products error", err);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchRelated();
    return () => {
      cancelled = true;
    };
  }, [categorySlug, currentId]);

  if (loading) {
    return (
      <section className="mt-12 sm:mt-16">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded-md bg-zinc-200" />
          <div className="h-7 w-48 animate-pulse rounded-md bg-zinc-200 sm:w-56" />
        </div>
        <div className="flex gap-3 overflow-hidden pb-1">
          {[0, 1, 2, 3].map((k) => (
            <div
              key={k}
              className="h-72 w-[min(240px,78vw)] shrink-0 animate-pulse rounded-3xl bg-zinc-100 sm:w-[260px]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16">
      <div className="mb-4 flex items-center gap-2 sm:mb-5">
        <IconSparkles
          size={22}
          stroke={1.5}
          className="shrink-0 text-primary-600"
        />
        <h2 className="font-mono text-xl font-bold text-zinc-900 sm:text-2xl">
          You may also like
        </h2>
      </div>
      <div className="-mx-1 border-t border-zinc-100 bg-linear-to-b from-primary-50/40 to-transparent px-1 py-4 sm:rounded-2xl sm:border sm:px-3">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin] sm:gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="w-[min(240px,78vw)] shrink-0 snap-start sm:w-[260px]"
            >
              <ProductCard {...p} slug={p.slug} compact className="h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}