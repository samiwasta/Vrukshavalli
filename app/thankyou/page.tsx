"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  IconCheck,
  IconPackage,
  IconTruck,
  IconMapPin,
  IconCreditCard,
  IconCalendar,
  IconHash,
  IconArrowRight,
  IconShoppingBag,
  IconHeadset,
  IconLeaf,
  IconClock,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconLoader2,
  IconPhone,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util";
import { useBag } from "@/context/BagContext"

// ── Types ─────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  name: string;
  variant?: string;
  qty: number;
  price: number;
  image: string;
}

interface TrackingEvent {
  label: string;
  description: string;
  timestamp: string;
  done: boolean;
  active: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  estimatedDelivery: string;
  paymentMethod: string | null;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  total: number;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pin: string;
    phone: string;
  } | null;
  items: OrderItem[];
  timeline: TrackingEvent[];
}

// ── Small reusable card ───────────────────────────────────────────────────────

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-primary-100 bg-white shadow-sm p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-100">
        <Icon size={16} className="text-primary-600" />
      </div>
      <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-zinc-700">
        {children}
      </h2>
    </div>
  );
}

// ── Main content (needs Suspense for useSearchParams) ─────────────────────────

function ThankYouContent() {
  const searchParams = useSearchParams();
  const { clearBag } = useBag();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bagCleared, setBagCleared] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    if (!orderId) {
      setError("No order ID found in the URL.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    let attempt = 0;
    const MAX_POLLS = 8;
    const POLL_INTERVAL = 2500;

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.status === 401) throw new Error("Please log in to view this order.");
        if (res.status === 404) throw new Error("Order not found.");
        if (!res.ok) throw new Error("Failed to load order details.");
        const json = await res.json();
        if (!json.success) throw new Error("Failed to load order details.");
        return json.data as Order;
      } catch (err: unknown) {
        throw err instanceof Error ? err : new Error("Something went wrong.");
      }
    }

    async function poll() {
      try {
        const data = await fetchOrder();
        if (cancelled) return;
        setOrder(data);

        if (data.paymentStatus === "paid") {
          setLoading(false);
          return;
        }

        if (data.paymentStatus === "failed" || data.paymentStatus === "refunded") {
          setLoading(false);
          return;
        }

        attempt++;
        if (attempt >= MAX_POLLS) {
          setLoading(false);
          return;
        }

        setTimeout(() => { if (!cancelled) poll(); }, POLL_INTERVAL);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setLoading(false);
      }
    }

    poll();
    return () => { cancelled = true; };
  }, [searchParams]);

  useEffect(() => {
    if (order?.paymentStatus === "paid" && !bagCleared) {
      clearBag();
      setBagCleared(true);
    }
  }, [order?.paymentStatus, bagCleared, clearBag]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <IconLoader2 size={32} className="animate-spin text-primary-400" />
        <p className="text-sm text-zinc-500">Loading your order…</p>
      </div>
    );
  }

  // ── Error ──
  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
          <IconCircleX size={26} className="text-red-400" />
        </div>
        <p className="font-mono text-sm font-bold text-zinc-700">{error ?? "Order not found."}</p>
        <Button asChild size="sm" className="rounded-full">
          <Link href="/orders">View My Orders</Link>
        </Button>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "paid";
  const isFailed = order.paymentStatus === "failed" || order.paymentStatus === "refunded";
  const isPending = order.paymentStatus === "pending";
  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

  if (isFailed) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto mb-6 flex h-22 w-22 items-center justify-center rounded-full bg-white shadow-xl shadow-red-500/15 ring-4 ring-red-100"
          >
            <IconCircleX size={40} className="text-red-400" strokeWidth={2} />
          </motion.div>
          <h1 className="font-mono text-2xl font-bold text-zinc-900 sm:text-3xl">
            Payment Failed
          </h1>
          <p className="mt-3 text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Your payment was not completed. No amount has been charged.
            You can try placing the order again from your bag.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-4 py-2">
            <IconHash size={14} className="text-red-400" />
            <span className="font-mono text-sm font-semibold text-zinc-700 tracking-wide">
              {order.orderNumber}
            </span>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-600">
              {order.paymentStatus}
            </span>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full rounded-full font-semibold sm:w-auto">
              <Link href="/" className="flex items-center gap-2">
                <IconShoppingBag size={18} />
                Continue Shopping
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full rounded-full sm:w-auto">
              <Link href="/orders" className="flex items-center gap-2">
                <IconPackage size={18} />
                My Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <IconLoader2 size={32} className="animate-spin text-primary-400" />
        <p className="font-mono text-sm font-bold text-zinc-700">Confirming your payment...</p>
        <p className="text-xs text-zinc-500 max-w-xs">
          We are verifying your payment with the bank. This can take a few moments.
          Please do not close this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* ── Hero confirmation banner ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-3xl bg-linear-to-br from-primary-100/30 via-emerald-50/60 to-background border border-primary-100 p-8 sm:p-10 text-center relative overflow-hidden"
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary-200/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary-100/10 blur-3xl" />

          {/* Animated check */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
            className="mx-auto mb-5 flex h-22 w-22 items-center justify-center rounded-full bg-white shadow-xl shadow-primary-500/20 ring-4 ring-primary-100"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 20 }}
            >
              <IconCheck size={40} className="text-primary-500" strokeWidth={2.5} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-1.5">
              Order Confirmed
            </p>
            <h1 className="font-mono text-2xl font-bold text-zinc-900 sm:text-3xl">
              Thank You for Your Order!
            </h1>
            <p className="mt-2.5 text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Your green companions are being lovingly packed and will be on their
              way to you soon.
            </p>

            {/* Order number pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-primary-200 px-4 py-2 shadow-sm"
            >
              <IconHash size={14} className="text-primary-500" />
              <span className="font-mono text-sm font-semibold text-zinc-800 tracking-wide">
                {order.orderNumber}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Order tracker ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mb-6"
        >
          <Card>
            <SectionTitle icon={IconTruck}>Order Tracker</SectionTitle>
            <div className="relative flex flex-col gap-0 sm:flex-row sm:justify-between">
              {/* connector line (desktop) */}
              <div className="pointer-events-none absolute top-5 left-5 right-5 hidden h-0.5 bg-linear-to-r from-emerald-400 via-emerald-300 to-zinc-200 sm:block" />

              {order.timeline.map((step) => (
                <div
                  key={step.label}
                  className="relative z-10 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2.5 py-1.5 sm:py-0 sm:flex-1"
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-all",
                      step.done
                        ? "border-primary-500 bg-primary-500 text-white shadow-primary-500/25"
                        : step.active
                        ? "border-primary-400 bg-primary-50 text-primary-600 animate-pulse shadow-primary-400/20"
                        : "border-zinc-200 bg-white text-zinc-300"
                    )}
                  >
                    {step.done ? (
                      <IconCircleCheck size={19} strokeWidth={2.5} />
                    ) : step.active ? (
                      <IconCircleDashed size={19} strokeWidth={2.5} />
                    ) : (
                      <IconCircleDashed size={16} className="opacity-30" />
                    )}
                  </div>
                  <div className="sm:text-center">
                    <p
                      className={cn(
                        "text-xs font-semibold",
                        step.done
                          ? "text-primary-600"
                          : step.active
                          ? "text-primary-700"
                          : "text-zinc-400"
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{step.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ── Main two-column grid ──────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">

          {/* ── Left column ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Items */}
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
            >
              <Card>
                <SectionTitle icon={IconShoppingBag}>
                  Items Ordered ({itemCount})
                </SectionTitle>
                <div className="flex flex-col divide-y divide-zinc-100">
                  {order.items.slice(0, 3).map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      {/* Image */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-primary-100 bg-primary-50/40">
                        <div className="absolute inset-0 flex items-center justify-center bg-primary-50">
                          <IconLeaf size={20} className="text-primary-300" />
                        </div>
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="absolute inset-0 z-10 h-full w-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-800 truncate">
                          {item.name}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-zinc-400 mt-0.5">{item.variant}</p>
                        )}
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Qty: {item.qty}
                        </p>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-bold text-zinc-800 shrink-0">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* View All — only shown when there are more than 3 items */}
                {order.items.length > 3 && (
                  <div className="mt-4 pt-4 border-t border-dashed border-zinc-200">
                    <Link
                      href="/orders"
                      className="flex items-center justify-between rounded-2xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                    >
                      <span>
                        View all {order.items.length} items
                      </span>
                      <span className="flex items-center gap-1 text-primary-600">
                        Go to Order
                        <IconArrowRight size={15} />
                      </span>
                    </Link>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Delivery Address */}
            {order.shippingAddress && (
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
            >
              <Card className="p-0 overflow-hidden border-zinc-200">
                {/* Header strip */}
                <div className="flex items-center gap-2 bg-zinc-50 border-b border-zinc-100 px-5 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary-100">
                    <IconMapPin size={14} className="text-primary-600" />
                  </div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-600">
                    Delivery Address
                  </span>
                </div>

                {/* Body */}
                <div className="px-5 py-4 flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-zinc-900">
                      {order.shippingAddress.name}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-zinc-500">
                      {order.shippingAddress.line1}
                      {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
                    </p>
                    <p className="text-[13px] leading-snug text-zinc-500">
                      {order.shippingAddress.city}, {order.shippingAddress.state}&nbsp;&ndash;&nbsp;{order.shippingAddress.pin}
                    </p>
                    <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                      <IconPhone size={11} />
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
            )}
          </div>

          {/* ── Right column ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.45 }}
            >
              <Card>
                <SectionTitle icon={IconPackage}>Order Summary</SectionTitle>
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <IconHash size={13} />
                      Order No.
                    </span>
                    <span className="font-mono font-semibold text-zinc-800">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <IconCalendar size={13} />
                      Date
                    </span>
                    <span className="font-medium text-zinc-700">{order.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <IconClock size={13} />
                      Est. Delivery
                    </span>
                    <span className="font-medium text-zinc-700">
                      {order.estimatedDelivery}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <IconCreditCard size={13} />
                      Payment
                    </span>
                    <div className="flex items-center gap-1.5">
                      {order.paymentMethod && (
                        <span className="font-medium text-zinc-700">
                          {order.paymentMethod}
                        </span>
                      )}
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                          order.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        )}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between rounded-2xl bg-primary-600 px-4 py-3.5">
                    <span className="font-bold text-primary-100">Total Paid</span>
                    <span className="text-xl font-extrabold text-white tracking-tight">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Need Help */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.45 }}
            >
              <Card className="bg-sky-50/40 border-sky-100">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100">
                    <IconHeadset size={17} className="text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">Need Help?</p>
                    <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                      Have a question about your order?{" "}
                      <Link
                        href="/contact"
                        className="font-semibold text-primary-600 hover:underline"
                      >
                        Contact our support team
                      </Link>{" "}
                      — available all days, 9 AM to 8 PM.
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sky-100/70 px-2.5 py-1 text-[11px] font-mono font-semibold text-sky-700">
                      <IconHash size={11} />
                      {order.orderNumber}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* ── Bottom CTAs ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.45 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button
            asChild
            size="lg"
            className="w-full rounded-full font-semibold shadow-md shadow-primary-600/20 sm:w-auto"
          >
            <Link href={`/orders/${order.id}`} className="flex items-center gap-2">
              <IconPackage size={18} />
              Track My Order
              <IconArrowRight size={16} />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full rounded-full sm:w-auto"
          >
            <Link href="/" className="flex items-center gap-2">
              <IconShoppingBag size={18} />
              Continue Shopping
            </Link>
          </Button>
        </motion.div>

        {/* ── Footer note ───────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-xs text-zinc-400"
        >
          A confirmation email has been sent to your registered email address.
          <br />
          Order confirmation is also saved in your{" "}
          <Link href="/orders" className="text-primary-500 hover:underline">
            Orders
          </Link>{" "}
          page.
        </motion.p>
      </div>
    </div>
  );
}

// ── Page export wrapped in Suspense (required for useSearchParams) ─────────────

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-zinc-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            <p className="text-sm">Loading your order…</p>
          </div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
