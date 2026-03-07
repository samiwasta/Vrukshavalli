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

interface Order {
  orderNumber: string;
  date: string;
  estimatedDelivery: string;
  paymentMethod: string;
  paymentStatus: "paid" | "pending";
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pin: string;
    phone: string;
  };
  items: OrderItem[];
}

// ── Demo data (replace with real API fetch once orders API is ready) ──────────

const DEMO_ORDER: Order = {
  orderNumber: "VK-2025-00341",
  date: "24 Feb 2025",
  estimatedDelivery: "28 Feb – 2 Mar 2025",
  paymentMethod: "UPI / Razorpay",
  paymentStatus: "paid",
  subtotal: 2397,
  shipping: 0,
  discount: 200,
  total: 2197,
  shippingAddress: {
    name: "Sami Khan",
    line1: "42, Prestige Falcon City",
    line2: "Konanakunte Cross, Banashankari",
    city: "Bengaluru",
    state: "Karnataka",
    pin: "560 062",
    phone: "+91 98765 43210",
  },
  items: [
    {
      id: "1",
      name: "Monstera Deliciosa",
      variant: "Medium • Ceramic Pot",
      qty: 1,
      price: 999,
      image: "/feature-1.jpg",
    },
    {
      id: "2",
      name: "Peace Lily",
      variant: "Small • Nursery Pot",
      qty: 2,
      price: 499,
      image: "/feature-2.jpg",
    },
    {
      id: "3",
      name: "Succulents Trio Set",
      variant: "",
      qty: 1,
      price: 400,
      image: "/carousel-1.jpg",
    },
  ],
};

// ── Order-tracker steps ───────────────────────────────────────────────────────

const STEPS = [
  { icon: IconCheck, label: "Order Placed", sub: "Just now" },
  { icon: IconCreditCard, label: "Payment Confirmed", sub: "Just now" },
  { icon: IconPackage, label: "Processing", sub: "Within 24 hrs" },
  { icon: IconTruck, label: "Shipped", sub: "28 Feb est." },
  { icon: IconMapPin, label: "Delivered", sub: "2 Mar est." },
];

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
  const [order] = useState<Order>(DEMO_ORDER); // TODO: fetch by searchParams.get("orderId")
  const [confettiDone, setConfettiDone] = useState(false);

  useEffect(() => {
    // Surface the orderId from URL if present (ready for API wiring)
    // const orderId = searchParams.get("orderId");
    // if (orderId) fetchOrder(orderId).then(setOrder);
    const t = setTimeout(() => setConfettiDone(true), 2400);
    return () => clearTimeout(t);
  }, [searchParams]);

  const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

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

              {STEPS.map((step, i) => {
                const completed = i <= 1; // placed + paid
                const active = i === 2;   // processing
                return (
                  <div
                    key={step.label}
                    className="relative z-10 flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2.5 py-1.5 sm:py-0 sm:flex-1"
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-all",
                        completed
                          ? "border-primary-500 bg-primary-500 text-white shadow-primary-500/25"
                          : active
                          ? "border-primary-400 bg-primary-50 text-primary-600 animate-pulse shadow-primary-400/20"
                          : "border-zinc-200 bg-white text-zinc-300"
                      )}
                    >
                      {completed ? (
                        <IconCircleCheck size={19} strokeWidth={2.5} />
                      ) : active ? (
                        <IconCircleDashed size={19} strokeWidth={2.5} />
                      ) : (
                        <step.icon size={16} />
                      )}
                    </div>
                    <div className="sm:text-center">
                      <p
                        className={cn(
                          "text-xs font-semibold",
                          completed
                            ? "text-primary-600"
                            : active
                            ? "text-primary-700"
                            : "text-zinc-400"
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{step.sub}</p>
                    </div>
                  </div>
                );
              })}
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-primary-50">
                          <IconLeaf size={20} className="text-primary-300" />
                        </div>
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
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
            >
              <Card className="bg-amber-50/30 border-amber-100">
                <SectionTitle icon={IconMapPin}>Delivery Address</SectionTitle>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                    <IconMapPin size={17} className="text-amber-600" />
                  </div>
                  <div className="text-sm leading-relaxed text-zinc-700">
                    <p className="font-bold text-zinc-900 mb-0.5">
                      {order.shippingAddress.name}
                    </p>
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && (
                      <p>{order.shippingAddress.line2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} –{" "}
                      {order.shippingAddress.pin}
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-100/60 px-2.5 py-1 text-xs font-medium text-amber-700">
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
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
                      <span className="font-medium text-zinc-700">
                        {order.paymentMethod}
                      </span>
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

                  {/* Divider */}
                  <div className="my-1 border-t border-dashed border-zinc-200" />

                  {/* Price breakdown */}
                  <div className="flex justify-between text-zinc-500 text-[13px]">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-zinc-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-primary-500">
                      {order.shipping === 0 ? "Free ✦" : `₹${order.shipping}`}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-[13px] text-zinc-500">
                      <span>Discount</span>
                      <span className="font-semibold" style={{ color: "var(--errorDark)" }}>
                        −₹{order.discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

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
                      — available Mon–Sat, 9 AM to 6 PM.
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
            <Link href="/orders" className="flex items-center gap-2">
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
    const { clearBag } = useBag()

  useEffect(() => {
    clearBag()
  }, [])
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
