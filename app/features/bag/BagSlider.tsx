"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconX,
  IconShoppingBag,
  IconLeaf,
  IconPlus,
  IconMinus,
  IconTrash,
  IconMapPin,
  IconChevronLeft,
  IconPencil,
  IconTag,
  IconCheck,
  IconCopy,
  IconTruck,
  IconUserCircle,
  IconSparkles,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useBag } from "@/context/BagContext";
import { useSession } from "@/lib/auth-client";
import {
  useDeliveryAddress,
  type DeliveryAddress,
  EMPTY_ADDRESS,
} from "./useDeliveryAddress";
import type { BagStockRow } from "@/lib/validate-order-stock";
import { getStockLevel } from "@/lib/stock";
import type { ApiProductListRow } from "@/lib/api-product-list-row";

export default function BagSlider() {
  const { isBagOpen, closeBag, items, removeItem, updateQty, addItem } =
    useBag();
  const [stockCheck, setStockCheck] = useState<{
    loading: boolean;
    canCheckout: boolean;
    rows: BagStockRow[];
  }>({ loading: false, canCheckout: true, rows: [] });
  const { data: session } = useSession();
  const isSignedIn = Boolean(session?.user);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<null | {
    code: string;
    discountType: "percentage" | "flat";
    discountValue: number;
    description?: string | null;
  }>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // ── Delivery address ──────────────────────────────────────────────────────
  const { address, addresses, setSelectedAddress, addAddress } =
    useDeliveryAddress();
  const [view, setView] = useState<
    "bag" | "address-list" | "address-edit" | "coupons"
  >("bag");
  const [draft, setDraft] = useState<DeliveryAddress>(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<
    Partial<Record<keyof DeliveryAddress, string>>
  >({});

  // ── Available coupons ─────────────────────────────────────────────────────
  const [availableCoupons, setAvailableCoupons] = useState<
    {
      code: string;
      discountType: "percentage" | "flat";
      discountPct: number;
      description: string | null;
      expiresAt: string | null;
      newUsersOnly: boolean;
    }[]
  >([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [recommendedProducts, setRecommendedProducts] = useState<
    {
      id: string;
      slug: string;
      name: string;
      price: number;
      image: string;
      stock: number;
    }[]
  >([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  const fetchAvailableCoupons = async () => {
    if (availableCoupons.length > 0) return; // already loaded
    try {
      setCouponsLoading(true);
      const res = await fetch("/api/coupons");
      const json = await res.json();
      if (json.success) setAvailableCoupons(json.data ?? []);
    } catch {
      // silently fail
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
    if (!isBagOpen) return;
    let cancelled = false;
    setRecommendedLoading(true);
    void (async () => {
      try {
        const res = await fetch("/api/products?limit=20&isBestSeller=true");
        const json = await res.json();
        if (!json.success || cancelled) return;
        const rows = json.data as ApiProductListRow[];
        setRecommendedProducts(
          rows.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            price: Number(p.price),
            image: p.image,
            stock: Number(p.stock ?? 0),
          })),
        );
      } catch {
        if (!cancelled) setRecommendedProducts([]);
      } finally {
        if (!cancelled) setRecommendedLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isBagOpen]);

  const handleApplyCouponFromList = (code: string) => {
    setCouponCode(code);
    setView("bag");
    // small delay so the input updates before applying
    setTimeout(() => {
      void applyCoupon(code);
    }, 50);
  };

  const saveAddress = () => {
    const errs: Partial<Record<keyof DeliveryAddress, string>> = {};
    if (!draft.fullName.trim()) errs.fullName = "Full name is required.";
    if (!draft.phone.trim()) errs.phone = "Phone is required.";
    else if (!/^\d{10}$/.test(draft.phone.trim()))
      errs.phone = "Enter a valid 10-digit number.";
    if (!draft.line1.trim()) errs.line1 = "Address line 1 is required.";
    if (!draft.city.trim()) errs.city = "City is required.";
    if (!draft.state.trim()) errs.state = "State is required.";
    if (!draft.pincode.trim()) errs.pincode = "Pincode is required.";
    else if (!/^\d{6}$/.test(draft.pincode.trim()))
      errs.pincode = "Enter a valid 6-digit pincode.";
    if (Object.keys(errs).length) {
      setAddressErrors(errs);
      return;
    }
    addAddress(draft);
    setView("bag");
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "flat"
      ? Math.min(appliedCoupon.discountValue, subtotal)
      : (subtotal * appliedCoupon.discountValue) / 100
    : 0;
  const taxableAmount = Math.max(subtotal - discountAmount, 0);
  const taxAmount = taxableAmount * 0.18;
  const shippingAmount =
    taxableAmount > 0 ? (taxableAmount >= 999 ? 0 : 79) : 0;
  const finalTotal = taxableAmount + taxAmount + shippingAmount;

  const bagProductIds = new Set(items.map((i) => i.id));
  const recommendedFiltered = recommendedProducts
    .filter((p) => !bagProductIds.has(p.id))
    .slice(0, 10);

  const applyCoupon = async (overrideCode?: string) => {
  if (items.length === 0) {
    setCouponError("Add items to your bag before applying a coupon.");
    setCouponSuccess("");
    return;
  }

  const normalizedCode = (overrideCode ?? couponCode).trim().toUpperCase();

  if (!normalizedCode) {
    setCouponError("Please enter a coupon code.");
    setCouponSuccess("");
    return;
  }

  if (!/^[A-Z0-9]{4,12}$/.test(normalizedCode)) {
    setCouponError("Coupon must be 4-12 letters or numbers.");
    setCouponSuccess("");
    return;
  }

  try {
    setIsApplyingCoupon(true);
    setCouponError("");
    setCouponSuccess("");

    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: normalizedCode }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json?.error || "Failed to validate coupon");
    }

    if (!json.data.valid) {
      setAppliedCoupon(null);
      setCouponError(json.data.reason || "Invalid coupon code.");
      setCouponSuccess("");
      return;
    }

    const { discountType, discountValue, description } = json.data;

    setAppliedCoupon({
      code: normalizedCode,
      discountType,
      discountValue,
      description,
    });

    const discountLabel =
      discountType === "flat" ? `₹${discountValue} off` : `${discountValue}% off`;
    setCouponSuccess(`Coupon ${normalizedCode} applied: ${discountLabel}.`);
  } catch (error) {
    console.error("Coupon apply error:", error);
    setAppliedCoupon(null);
    setCouponError("Something went wrong. Please try again.");
    setCouponSuccess("");
  } finally {
    setIsApplyingCoupon(false);
  }
};

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isBagOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isBagOpen]);

  useEffect(() => {
    if (items.length === 0) {
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("");
      setCouponSuccess("");
      setIsApplyingCoupon(false);
    }
  }, [items.length]);

  useEffect(() => {
    if (!isSignedIn && (view === "address-list" || view === "address-edit")) {
      setView("bag");
    }
  }, [isSignedIn, view]);

  useEffect(() => {
    if (items.length === 0) {
      setStockCheck({ loading: false, canCheckout: true, rows: [] });
      return;
    }
    let cancelled = false;
    const ac = new AbortController();
    setStockCheck((s) => ({ ...s, loading: true }));
    void (async () => {
      try {
        const res = await fetch("/api/products/validate-stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: items.map((i) => ({
              productId: i.id,
              quantity: i.quantity,
            })),
          }),
          signal: ac.signal,
        });
        const json = await res.json();
        if (cancelled) return;
        if (!json.success) {
          setStockCheck({ loading: false, canCheckout: true, rows: [] });
          return;
        }
        setStockCheck({
          loading: false,
          canCheckout: Boolean(json.data?.canCheckout),
          rows: json.data?.rows ?? [],
        });
      } catch {
        if (cancelled) return;
        setStockCheck({ loading: false, canCheckout: true, rows: [] });
      }
    })();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [items]);

  const checkout = async () => {
  if (!isSignedIn) {
    return;
  }
  if (!address) {
    alert("Please add delivery address");
    return;
  }

  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        shippingAddress: address,
        subtotal,
        tax: taxAmount,
        shipping: shippingAmount,
        discount: discountAmount,
        total: finalTotal,
        couponCode: appliedCoupon?.code ?? null,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      alert(
        typeof json.error === "string"
          ? json.error
          : "Checkout failed — check stock and try again."
      );
      return;
    }

    const { paymentSessionId } = json.data;

    const CashfreeCtor = window.Cashfree;
    if (!CashfreeCtor) {
      alert("Payment could not start. Please refresh the page and try again.");
      return;
    }

    const cashfree = new CashfreeCtor({
      mode:
        process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
          ? "production"
          : "sandbox",
    });

    cashfree.checkout({
      paymentSessionId,
    });
  } catch (error) {
    console.error(error);
    alert("Payment initialization failed");
  }
};

  const recommendationsStrip =
    recommendedLoading || recommendedFiltered.length > 0 ? (
      <div className="border-t border-zinc-100 bg-linear-to-b from-primary-50/30 to-transparent px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5">
          <IconSparkles size={13} className="text-primary-600" stroke={1.5} />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            You may also like
          </span>
        </div>
        {recommendedLoading && recommendedFiltered.length === 0 ? (
          <div className="flex gap-2">
            {[0, 1, 2].map((k) => (
              <div
                key={k}
                className="h-[152px] w-[128px] shrink-0 animate-pulse rounded-xl bg-zinc-200/70"
              />
            ))}
          </div>
        ) : (
          <div className="-mx-1 flex gap-2 overflow-x-auto overscroll-x-contain px-1 pb-0.5 [scrollbar-width:thin]">
            {recommendedFiltered.map((p) => (
              <div
                key={p.id}
                className="flex w-[128px] shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-sm"
              >
                <Link
                  href={`/product/${p.slug}`}
                  onClick={closeBag}
                  className="relative aspect-square bg-zinc-50"
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-2">
                  <p className="line-clamp-2 min-h-8 text-[11px] font-semibold leading-tight text-zinc-900">
                    {p.name}
                  </p>
                  <p className="mt-1 font-mono text-xs font-bold text-primary-700">
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        image: p.image,
                        quantity: 1,
                        slug: p.slug,
                        stock: p.stock,
                      })
                    }
                    disabled={p.stock <= 0}
                    className="mt-1.5 w-full rounded-full bg-primary-600 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
                  >
                    {p.stock <= 0 ? "Out of stock" : "Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : null;

  return (
    <AnimatePresence>
      {isBagOpen && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────────────── */}
          <motion.div
            key="bag-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-80 bg-black/40 backdrop-blur-[2px]"
            onClick={closeBag}
            aria-hidden
          />

          {/* ── Slider panel ─────────────────────────────────────────────── */}
          <motion.aside
            key="bag-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="fixed inset-y-0 right-0 z-90 flex max-h-dvh min-h-0 w-[min(440px,94vw)] flex-col bg-white shadow-2xl"
            aria-label="Shopping bag"
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-b border-primary-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <IconShoppingBag
                  size={20}
                  stroke={1.5}
                  className="text-primary-600"
                />
                <span className="font-mono text-base font-bold text-zinc-900">
                  Your Bag
                </span>
                {totalQty > 0 && (
                  <motion.span
                    key={totalQty}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-bold leading-none text-white"
                  >
                    {totalQty}
                  </motion.span>
                )}
              </div>
              <button
                type="button"
                onClick={closeBag}
                className="flex items-center justify-center rounded-full p-2 text-zinc-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
                aria-label="Close bag"
              >
                <IconX size={20} stroke={1.5} />
              </button>
            </div>

            {/* Body: scroll + sticky checkout */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {items.length === 0 ? (
                <>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.1,
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                        }}
                        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-100"
                      >
                        <IconLeaf size={36} className="text-primary-500" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                      >
                        <p className="font-mono text-lg font-bold text-zinc-900">
                          Your bag is empty
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          Looks like you haven&apos;t added any plants yet.
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24 }}
                      >
                        <Link
                          href="/product"
                          onClick={closeBag}
                          className="mt-1 inline-flex items-center rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-colors hover:bg-primary-700 active:bg-primary-800"
                        >
                          Shop Plants
                        </Link>
                      </motion.div>
                    </div>
                    {recommendationsStrip}
                  </div>
                  {isSignedIn && (
                    <div className="shrink-0 border-t border-primary-100 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
                      <Link
                        href="/product"
                        onClick={closeBag}
                        className="flex w-full items-center justify-center rounded-full border border-primary-200 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                      >
                        Browse all plants
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <div className="px-4 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                        In your bag
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {totalQty} {totalQty === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <ul className="divide-y divide-zinc-100 px-4">
                      <AnimatePresence initial={false}>
                        {items.map((item, idx) => {
                          const row = stockCheck.rows[idx];
                          return (
                            <motion.li
                              key={item.id}
                              layout
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{
                                opacity: 0,
                                x: 30,
                                height: 0,
                                marginBlock: 0,
                              }}
                              transition={{
                                layout: {
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 36,
                                },
                                opacity: { duration: 0.18 },
                                delay: idx * 0.04,
                              }}
                              className="flex gap-3 py-3.5 first:pt-2"
                            >
                              <Link
                                href={`/product/${item.slug ?? item.id}`}
                                onClick={closeBag}
                                className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50"
                              >
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="72px"
                                />
                              </Link>

                              <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold leading-tight text-zinc-900">
                                      {item.name}
                                    </p>
                                    {item.variant && (
                                      <p className="mt-0.5 text-[11px] text-zinc-400">
                                        {item.variant}
                                      </p>
                                    )}
                                    {(() => {
                                      if (stockCheck.loading || !row)
                                        return null;
                                      if (!row.canCheckout && row.reason) {
                                        return (
                                          <p className="mt-1 text-[11px] font-medium text-red-600">
                                            {row.reason}
                                          </p>
                                        );
                                      }
                                      if (
                                        row.canCheckout &&
                                        getStockLevel(
                                          row.stock,
                                          row.stockCapacity,
                                        ) === "few"
                                      ) {
                                        return (
                                          <p className="mt-1 text-[11px] font-medium text-amber-700">
                                            Few left ({row.stock} available)
                                          </p>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="shrink-0 rounded-full p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                    aria-label={`Remove ${item.name}`}
                                  >
                                    <IconTrash size={14} stroke={1.5} />
                                  </button>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-1 py-0.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQty(item.id, item.quantity - 1)
                                      }
                                      className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
                                      aria-label="Decrease quantity"
                                    >
                                      <IconMinus size={12} stroke={2} />
                                    </button>
                                    <motion.span
                                      key={item.quantity}
                                      initial={{ scale: 0.7 }}
                                      animate={{ scale: 1 }}
                                      className="w-6 text-center text-sm font-bold text-zinc-800"
                                    >
                                      {item.quantity}
                                    </motion.span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cap =
                                          row && row.stock > 0
                                            ? row.stock
                                            : item.stock && item.stock > 0
                                              ? item.stock
                                              : undefined;
                                        if (cap !== undefined) {
                                          updateQty(
                                            item.id,
                                            Math.min(item.quantity + 1, cap),
                                          );
                                        } else {
                                          updateQty(
                                            item.id,
                                            item.quantity + 1,
                                          );
                                        }
                                      }}
                                      disabled={(() => {
                                        if (stockCheck.loading) return false;
                                        if (!row) return false;
                                        if (row.stock > 0) {
                                          return item.quantity >= row.stock;
                                        }
                                        return true;
                                      })()}
                                      className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-primary-100 hover:text-primary-600 disabled:pointer-events-none disabled:opacity-35"
                                      aria-label="Increase quantity"
                                    >
                                      <IconPlus size={12} stroke={2} />
                                    </button>
                                  </div>

                                  <p className="text-sm font-bold text-zinc-900">
                                    ₹
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString("en-IN")}
                                  </p>
                                </div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </AnimatePresence>
                    </ul>

                    {recommendationsStrip}

                    <div className="space-y-3 border-t border-zinc-100 px-4 py-3">
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          Delivery
                        </p>
                        {isSignedIn ? (
                          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
                            <div className="mb-1.5 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <IconMapPin
                                  size={13}
                                  stroke={1.5}
                                  className="text-primary-600"
                                />
                                <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                                  Delivering to
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setView("address-list")}
                                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-100"
                              >
                                <IconPencil size={11} stroke={2} />
                                {address ? "Change" : "Add"}
                              </button>
                            </div>
                            {address ? (
                              <div className="space-y-0.5">
                                <p className="text-sm font-semibold leading-snug text-zinc-800">
                                  {address.fullName}
                                </p>
                                <p className="text-[11px] leading-relaxed text-zinc-500">
                                  {address.line1}
                                  {address.line2 ? `, ${address.line2}` : ""},{" "}
                                  {address.city}, {address.state}
                                  &nbsp;&ndash;&nbsp;
                                  {address.pincode}
                                </p>
                                <p className="text-[11px] text-zinc-400">
                                  {address.phone}
                                </p>
                                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-primary-600">
                                  <IconTruck size={12} stroke={1.5} />
                                  <span className="font-semibold">
                                    Est. delivery:&nbsp;
                                    {(() => {
                                      const from = new Date();
                                      from.setDate(from.getDate() + 5);
                                      const to = new Date();
                                      to.setDate(to.getDate() + 7);
                                      const fmt = (d: Date) =>
                                        d.toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "short",
                                        });
                                      return `${fmt(from)} – ${fmt(to)}`;
                                    })()}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[11px] italic text-zinc-400">
                                No delivery address added yet.
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-start gap-2.5 rounded-xl border border-primary-200/80 bg-primary-50/50 px-3 py-2.5">
                            <IconUserCircle
                              size={18}
                              stroke={1.5}
                              className="mt-0.5 shrink-0 text-primary-600"
                            />
                            <p className="text-[11px] leading-relaxed text-zinc-600">
                              <span className="font-semibold text-zinc-900">
                                Sign in to continue.
                              </span>{" "}
                              Add a delivery address and complete payment after
                              logging in.
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          Coupon
                        </p>
                        <div className="rounded-2xl border border-zinc-100 bg-white p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <label
                              htmlFor="coupon-code"
                              className="text-[11px] font-semibold text-zinc-600"
                            >
                              Have a code?
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                void fetchAvailableCoupons();
                                setView("coupons");
                              }}
                              className="flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:underline"
                            >
                              <IconTag size={11} stroke={2} />
                              View all
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              id="coupon-code"
                              value={couponCode}
                              onChange={(event) => {
                                setCouponCode(event.target.value);
                                if (couponError) setCouponError("");
                                if (couponSuccess) setCouponSuccess("");
                              }}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  void applyCoupon();
                                }
                              }}
                              placeholder="Enter code"
                              className="h-9 flex-1 rounded-full border border-zinc-200 px-3 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-primary-500"
                              disabled={isApplyingCoupon || items.length === 0}
                              aria-invalid={Boolean(couponError)}
                              aria-describedby="coupon-feedback"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                void applyCoupon();
                              }}
                              disabled={
                                isApplyingCoupon || items.length === 0
                              }
                              className={`h-9 shrink-0 rounded-full px-3 text-xs font-semibold transition-colors ${
                                isApplyingCoupon || items.length === 0
                                  ? "cursor-not-allowed bg-primary-200 text-primary-400"
                                  : "bg-primary-600 text-white hover:bg-primary-700"
                              }`}
                            >
                              {isApplyingCoupon ? "…" : "Apply"}
                            </button>
                          </div>
                          <p
                            id="coupon-feedback"
                            className={`mt-1.5 min-h-4 text-[11px] ${
                              couponError
                                ? "text-red-500"
                                : couponSuccess
                                  ? "text-emerald-600"
                                  : "text-zinc-400"
                            }`}
                          >
                            {couponError ||
                              couponSuccess ||
                              "\u00a0"}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-zinc-100 bg-zinc-50/90 p-3">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          Bill details
                        </p>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Subtotal</span>
                            <motion.span
                              key={subtotal}
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="font-semibold text-zinc-900"
                            >
                              ₹{subtotal.toLocaleString("en-IN")}
                            </motion.span>
                          </div>
                          {appliedCoupon && discountAmount > 0 && (
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center justify-between">
                                <span className="text-zinc-500">
                                  Discount ({appliedCoupon.code})
                                </span>
                                <span className="font-semibold text-emerald-700">
                                  -₹{discountAmount.toLocaleString("en-IN")}
                                </span>
                              </div>
                              {appliedCoupon.description && (
                                <p className="text-xs text-zinc-400">
                                  {appliedCoupon.description}
                                </p>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">GST (18%)</span>
                            <span className="font-semibold text-zinc-900">
                              ₹{taxAmount.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Shipping</span>
                            <span className="font-semibold text-zinc-900">
                              {shippingAmount === 0
                                ? "Free"
                                : `₹${shippingAmount.toLocaleString("en-IN")}`}
                            </span>
                          </div>
                          <div className="border-t border-zinc-200/80 pt-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-zinc-700">
                                Total
                              </span>
                              <motion.span
                                key={finalTotal}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="font-mono text-base font-bold text-zinc-900"
                              >
                                ₹{finalTotal.toLocaleString("en-IN")}
                              </motion.span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-[10px] text-zinc-400">
                          Free shipping on orders above ₹999 (before tax).
                        </p>
                      </div>

                      {items.length > 0 &&
                        !stockCheck.loading &&
                        !stockCheck.canCheckout && (
                          <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-medium leading-relaxed text-red-700">
                            Some items are out of stock or quantities exceed
                            what we have. Adjust quantities or remove lines to
                            check out.
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="shrink-0 border-t border-primary-100 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-6px_24px_rgba(0,0,0,0.06)]">
                    <div className="mb-2 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                          Amount payable
                        </p>
                        <motion.p
                          key={finalTotal}
                          initial={{ opacity: 0.85 }}
                          animate={{ opacity: 1 }}
                          className="font-mono text-xl font-bold text-zinc-900"
                        >
                          ₹{finalTotal.toLocaleString("en-IN")}
                        </motion.p>
                      </div>
                      <p className="max-w-[48%] text-right text-[10px] leading-snug text-zinc-400">
                        Incl. GST ·{" "}
                        {shippingAmount === 0
                          ? "Delivery free"
                          : `+₹${shippingAmount.toLocaleString("en-IN")} delivery`}
                      </p>
                    </div>
                    {isSignedIn ? (
                      <button
                        type="button"
                        onClick={checkout}
                        disabled={
                          items.length === 0 ||
                          stockCheck.loading ||
                          !stockCheck.canCheckout
                        }
                        className={`w-full rounded-full py-3 text-sm font-semibold transition-colors ${
                          items.length > 0 &&
                          !stockCheck.loading &&
                          stockCheck.canCheckout
                            ? "bg-primary-600 text-white shadow-md shadow-primary-600/20 hover:bg-primary-700 active:bg-primary-800"
                            : "cursor-not-allowed bg-primary-200 text-primary-400"
                        }`}
                      >
                        {stockCheck.loading
                          ? "Checking stock…"
                          : "Proceed to Checkout"}
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={closeBag}
                        aria-disabled={items.length === 0}
                        className={`flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold transition-colors ${
                          items.length > 0
                            ? "bg-primary-600 text-white shadow-md shadow-primary-600/20 hover:bg-primary-700 active:bg-primary-800"
                            : "pointer-events-none cursor-not-allowed bg-primary-200 text-primary-400"
                        }`}
                      >
                        Log in to checkout
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ── Address-edit overlay ─────────────────────────────────── */}
            <AnimatePresence>
              {view === "address-edit" && (
                <motion.div
                  key="address-edit-overlay"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 380, damping: 38 }}
                  className="absolute inset-0 z-10 flex flex-col bg-white"
                >
                  {/* Header */}
                  <div className="flex shrink-0 items-center gap-3 border-b border-primary-100 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setView("bag")}
                      className="flex items-center justify-center rounded-full p-2 text-zinc-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
                      aria-label="Back to bag"
                    >
                      <IconChevronLeft size={20} stroke={1.5} />
                    </button>
                    <div className="flex items-center gap-2">
                      <IconMapPin
                        size={18}
                        stroke={1.5}
                        className="text-primary-600"
                      />
                      <span className="font-mono text-base font-bold text-zinc-900">
                        Delivery Address
                      </span>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="flex-1 space-y-3 overflow-y-auto p-5">
                    {/* Full name */}
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        Full name <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={draft.fullName}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, fullName: e.target.value }))
                        }
                        placeholder="Jhon Doe"
                        className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-primary-500 ${
                          addressErrors.fullName
                            ? "border-red-400"
                            : "border-zinc-200"
                        }`}
                      />
                      {addressErrors.fullName && (
                        <p className="mt-0.5 text-[11px] text-red-500">
                          {addressErrors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={draft.phone}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, phone: e.target.value }))
                        }
                        placeholder="9876543210"
                        type="tel"
                        maxLength={10}
                        className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-primary-500 ${
                          addressErrors.phone
                            ? "border-red-400"
                            : "border-zinc-200"
                        }`}
                      />
                      {addressErrors.phone && (
                        <p className="mt-0.5 text-[11px] text-red-500">
                          {addressErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Address line 1 */}
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        Address line 1 <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={draft.line1}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, line1: e.target.value }))
                        }
                        placeholder="House / Flat no., Street"
                        className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-primary-500 ${
                          addressErrors.line1
                            ? "border-red-400"
                            : "border-zinc-200"
                        }`}
                      />
                      {addressErrors.line1 && (
                        <p className="mt-0.5 text-[11px] text-red-500">
                          {addressErrors.line1}
                        </p>
                      )}
                    </div>

                    {/* Address line 2 */}
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        Address line 2{" "}
                        <span className="normal-case text-zinc-300">
                          (optional)
                        </span>
                      </label>
                      <input
                        value={draft.line2}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, line2: e.target.value }))
                        }
                        placeholder="Landmark, Area"
                        className="h-10 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-primary-500"
                      />
                    </div>

                    {/* City + State */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                          City <span className="text-red-400">*</span>
                        </label>
                        <input
                          value={draft.city}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, city: e.target.value }))
                          }
                          placeholder="Mumbai"
                          className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-primary-500 ${
                            addressErrors.city
                              ? "border-red-400"
                              : "border-zinc-200"
                          }`}
                        />
                        {addressErrors.city && (
                          <p className="mt-0.5 text-[11px] text-red-500">
                            {addressErrors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                          State <span className="text-red-400">*</span>
                        </label>
                        <input
                          value={draft.state}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, state: e.target.value }))
                          }
                          placeholder="Maharashtra"
                          className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-primary-500 ${
                            addressErrors.state
                              ? "border-red-400"
                              : "border-zinc-200"
                          }`}
                        />
                        {addressErrors.state && (
                          <p className="mt-0.5 text-[11px] text-red-500">
                            {addressErrors.state}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        Pincode <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={draft.pincode}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, pincode: e.target.value }))
                        }
                        placeholder="400001"
                        type="text"
                        maxLength={6}
                        className={`h-10 w-full rounded-xl border px-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-primary-500 ${
                          addressErrors.pincode
                            ? "border-red-400"
                            : "border-zinc-200"
                        }`}
                      />
                      {addressErrors.pincode && (
                        <p className="mt-0.5 text-[11px] text-red-500">
                          {addressErrors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Save */}
                  <div className="shrink-0 border-t border-primary-100 p-5">
                    <button
                      type="button"
                      onClick={saveAddress}
                      className="w-full rounded-full bg-primary-600 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-colors hover:bg-primary-700 active:bg-primary-800"
                    >
                      Save Address
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Address-list overlay ─────────────────────────────────── */}
            <AnimatePresence>
              {view === "address-list" && (
                <motion.div
                  key="address-list-overlay"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 380, damping: 38 }}
                  className="absolute inset-0 z-10 flex flex-col bg-white"
                >
                  {/* Header */}
                  <div className="flex shrink-0 items-center gap-3 border-b border-primary-100 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setView("bag")}
                      className="flex items-center justify-center rounded-full p-2 text-zinc-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
                      aria-label="Back to bag"
                    >
                      <IconChevronLeft size={20} stroke={1.5} />
                    </button>
                    <div className="flex items-center gap-2">
                      <IconMapPin
                        size={18}
                        stroke={1.5}
                        className="text-primary-600"
                      />
                      <span className="font-mono text-base font-bold text-zinc-900">
                        Select Address
                      </span>
                    </div>
                  </div>

                  {/* Address cards */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {addresses.length === 0 ? (
                      <p className="pt-8 text-center text-sm text-zinc-400 italic">
                        No saved addresses yet.
                      </p>
                    ) : (
                      addresses.map((addr) => {
                        const isSelected = address?.id === addr.id;
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => {
                              setSelectedAddress(addr);
                              setView("bag");
                            }}
                            className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                              isSelected
                                ? "border-primary-500 bg-primary-50"
                                : "border-zinc-200 bg-white hover:border-primary-300 hover:bg-primary-50/40"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 leading-snug">
                                  {addr.fullName}
                                </p>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                                  {addr.line1}
                                  {addr.line2 ? `, ${addr.line2}` : ""},{" "}
                                  {addr.city}, {addr.state}&nbsp;&ndash;&nbsp;
                                  {addr.pincode}
                                </p>
                                <p className="mt-0.5 text-[11px] text-zinc-400">
                                  {addr.phone}
                                </p>
                              </div>
                              {isSelected && (
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600">
                                  <IconCheck
                                    size={12}
                                    stroke={2.5}
                                    className="text-white"
                                  />
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Add new address */}
                  <div className="shrink-0 border-t border-primary-100 p-4">
                    <button
                      type="button"
                      onClick={() => {
                        setDraft(EMPTY_ADDRESS);
                        setAddressErrors({});
                        setView("address-edit");
                      }}
                      className="w-full rounded-full border-2 border-dashed border-primary-300 py-2.5 text-sm font-semibold text-primary-600 transition-colors hover:border-primary-500 hover:bg-primary-50"
                    >
                      + Add New Address
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Coupons overlay ──────────────────────────────────────── */}
            <AnimatePresence>
              {view === "coupons" && (
                <motion.div
                  key="coupons-overlay"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 380, damping: 38 }}
                  className="absolute inset-0 z-10 flex flex-col bg-white"
                >
                  {/* Header */}
                  <div className="flex shrink-0 items-center gap-3 border-b border-primary-100 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setView("bag")}
                      className="flex items-center justify-center rounded-full p-2 text-zinc-500 transition-colors hover:bg-primary-100 hover:text-primary-600"
                      aria-label="Back to bag"
                    >
                      <IconChevronLeft size={20} stroke={1.5} />
                    </button>
                    <div className="flex items-center gap-2">
                      <IconTag
                        size={18}
                        stroke={1.5}
                        className="text-primary-600"
                      />
                      <span className="font-mono text-base font-bold text-zinc-900">
                        Available Coupons
                      </span>
                    </div>
                  </div>

                  {/* Coupon list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {couponsLoading ? (
                      <div className="flex items-center justify-center pt-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
                      </div>
                    ) : availableCoupons.length === 0 ? (
                      <p className="pt-8 text-center text-sm text-zinc-400 italic">
                        No active coupons available right now.
                      </p>
                    ) : (
                      availableCoupons.map((coupon) => {
                        const discountLabel =
                          coupon.discountType === "flat"
                            ? `₹${coupon.discountPct} off`
                            : `${coupon.discountPct}% off`;
                        const isAlreadyApplied =
                          appliedCoupon?.code === coupon.code;
                        return (
                          <div
                            key={coupon.code}
                            className={`rounded-2xl border p-3 transition-colors ${
                              isAlreadyApplied
                                ? "border-emerald-300 bg-emerald-50"
                                : "border-zinc-200 bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="rounded-lg bg-primary-100 px-2.5 py-0.5 font-mono text-xs font-bold tracking-wider text-primary-700">
                                    {coupon.code}
                                  </span>
                                  <span className="text-xs font-semibold text-emerald-700">
                                    {discountLabel}
                                  </span>
                                </div>
                                {coupon.description && (
                                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                                    {coupon.description}
                                  </p>
                                )}
                                {coupon.newUsersOnly && (
                                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                                    New customers only
                                  </p>
                                )}
                                {coupon.expiresAt && (
                                  <p className="mt-0.5 text-[10px] text-zinc-400">
                                    Expires&nbsp;
                                    {new Date(
                                      coupon.expiresAt,
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                )}
                              </div>

                              <div className="flex shrink-0 flex-col items-end gap-1.5">
                                {isAlreadyApplied ? (
                                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                    <IconCheck size={12} stroke={2.5} />
                                    Applied
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleApplyCouponFromList(coupon.code)
                                    }
                                    className="rounded-full bg-primary-600 px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-primary-700"
                                  >
                                    Apply
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(coupon.code)}
                                  className="flex items-center gap-1 text-[11px] text-zinc-400 transition-colors hover:text-zinc-700"
                                  aria-label={`Copy ${coupon.code}`}
                                >
                                  {copiedCode === coupon.code ? (
                                    <>
                                      <IconCheck size={11} stroke={2} />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <IconCopy size={11} stroke={1.5} />
                                      Copy
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

