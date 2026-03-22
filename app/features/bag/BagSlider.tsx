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

export default function BagSlider() {
  const { isBagOpen, closeBag, items, removeItem, updateQty } = useBag();
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
            className="fixed inset-y-0 right-0 z-90 flex w-[min(420px,92vw)] flex-col bg-white shadow-2xl"
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

            {/* ── Body ─────────────────────────────────────────────────── */}
            {items.length === 0 ? (
              /* Empty state */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
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
                    className="mt-2 inline-flex items-center rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-colors hover:bg-primary-700 active:bg-primary-800"
                  >
                    Shop Plants
                  </Link>
                </motion.div>
              </div>
            ) : (
              /* Product list */
              <ul className="flex-1 overflow-y-auto divide-y divide-zinc-100 px-4 py-2">
                <AnimatePresence initial={false}>
                  {items.map((item, idx) => {
                    const row = stockCheck.rows[idx];
                    return (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBlock: 0 }}
                      transition={{
                        layout: { type: "spring", stiffness: 380, damping: 36 },
                        opacity: { duration: 0.18 },
                        delay: idx * 0.04,
                      }}
                      className="flex gap-3 py-4"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/product/${item.slug ?? item.id}`}
                        onClick={closeBag}
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between gap-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-zinc-900 leading-tight">
                              {item.name}
                            </p>
                            {item.variant && (
                              <p className="mt-0.5 text-[11px] text-zinc-400">
                                {item.variant}
                              </p>
                            )}
                            {(() => {
                              if (stockCheck.loading || !row) return null;
                              if (!row.canCheckout && row.reason) {
                                return (
                                  <p className="mt-1 text-[11px] font-medium text-red-600">
                                    {row.reason}
                                  </p>
                                );
                              }
                              if (
                                row.canCheckout &&
                                getStockLevel(row.stock, row.stockCapacity) ===
                                  "few"
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
                          {/* Remove */}
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
                          {/* Qty stepper */}
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
                                    Math.min(item.quantity + 1, cap)
                                  );
                                } else {
                                  updateQty(item.id, item.quantity + 1);
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

                          {/* Line total */}
                          <p className="text-sm font-bold text-zinc-900">
                            ₹
                            {(item.price * item.quantity).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                        </div>
                    </motion.li>
                  );
                  })}
                </AnimatePresence>
              </ul>
            )}

            {/* ── Footer (hidden for signed-out empty bag) ─────────────── */}
            {!(!isSignedIn && items.length === 0) && (
            <div className="border-t border-primary-100 p-5">
              {isSignedIn ? (
                <div className="mb-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setView("address-list")}
                        className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-100"
                      >
                        <IconPencil size={11} stroke={2} />
                        {address ? "Change" : "Add"}
                      </button>
                    </div>
                  </div>
                  {address ? (
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold leading-snug text-zinc-800">
                        {address.fullName}
                      </p>
                      <p className="text-[11px] leading-relaxed text-zinc-500">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ""},{" "}
                        {address.city}, {address.state}&nbsp;&ndash;&nbsp;
                        {address.pincode}
                      </p>
                      <p className="text-[11px] text-zinc-400">{address.phone}</p>
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
                <div className="mb-3 flex items-start gap-2.5 rounded-xl border border-primary-200/80 bg-primary-50/50 px-3 py-2.5">
                  <IconUserCircle
                    size={18}
                    stroke={1.5}
                    className="mt-0.5 shrink-0 text-primary-600"
                  />
                  <p className="text-[11px] leading-relaxed text-zinc-600">
                    <span className="font-semibold text-zinc-900">
                      Sign in to continue.
                    </span>{" "}
                    You can review your bag below; log in to add a delivery
                    address and pay.
                  </p>
                </div>
              )}

              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <label
                    htmlFor="coupon-code"
                    className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
                  >
                    Coupon code
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
                    View Coupons
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
                    className="h-10 flex-1 rounded-full border border-zinc-200 px-4 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-primary-500"
                    disabled={isApplyingCoupon || items.length === 0}
                    aria-invalid={Boolean(couponError)}
                    aria-describedby="coupon-feedback"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      void applyCoupon();
                    }}
                    disabled={isApplyingCoupon || items.length === 0}
                    className={`h-10 rounded-full px-4 text-xs font-semibold transition-colors ${
                      isApplyingCoupon || items.length === 0
                        ? "cursor-not-allowed bg-primary-200 text-primary-400"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    }`}
                  >
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>
                <p
                  id="coupon-feedback"
                  className={`mt-1 min-h-4 text-[11px] ${
                    couponError
                      ? "text-red-500"
                      : couponSuccess
                        ? "text-emerald-600"
                        : "text-zinc-400"
                  }`}
                >
                </p>
              </div>

              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-500 font-medium">Subtotal</span>
                <motion.span
                  key={subtotal}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-bold text-zinc-900"
                >
                  ₹{subtotal.toLocaleString("en-IN")}
                </motion.span>
              </div>
              {appliedCoupon && discountAmount > 0 && (
                <div className="mb-1 flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 font-medium">
                      Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-bold text-emerald-700">
                      -₹{discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {appliedCoupon.description && (
                    <p className="text-xs text-zinc-400 pl-0.5">{appliedCoupon.description}</p>
                  )}
                </div>
              )}
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-500 font-medium">
                  Taxes (GST 18%)
                </span>
                <span className="font-bold text-zinc-900">
                  ₹{taxAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-500 font-medium">Shipping</span>
                <span className="font-bold text-zinc-900">
                  {shippingAmount === 0
                    ? "Free"
                    : `₹${shippingAmount.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-500 font-medium">Total</span>
                <motion.span
                  key={finalTotal}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-bold text-zinc-900"
                >
                  ₹{finalTotal.toLocaleString("en-IN")}
                </motion.span>
              </div>
              <p className="mb-3 text-[11px] text-zinc-400">
                Shipping is free on orders above ₹999
              </p>
              {items.length > 0 &&
                !stockCheck.loading &&
                !stockCheck.canCheckout && (
                  <p className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-medium leading-relaxed text-red-700">
                    Some items are out of stock or quantities exceed what we have.
                    Reduce quantities or remove those lines to check out. You can
                    keep them in your bag until they are back.
                  </p>
                )}
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
            )}

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

