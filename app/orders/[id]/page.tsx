"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "motion/react";
import {
  IconArrowLeft,
  IconPackage,
  IconTruck,
  IconCheck,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconMapPin,
  IconHash,
  IconCalendar,
  IconLeaf,
  IconPhone,
  IconClock,
  IconShoppingBag,
  IconHeadset,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { cn } from "@/lib/util";
import { Button } from "@/components/ui/button";

// ── Types ─────────────────────────────────────────────────────────────────────

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled" | "pending";

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
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pin: string;
    phone: string;
  };
  timeline: TrackingEvent[];
}

// ── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_ORDERS: Record<string, Order> = {
  "1": {
    id: "1",
    orderNumber: "VK-2025-00341",
    date: "24 Feb 2025",
    estimatedDelivery: "28 Feb – 2 Mar 2025",
    status: "processing",
    total: 2197,
    items: [
      { id: "1", name: "Monstera Deliciosa", variant: "Medium • Ceramic Pot", qty: 1, price: 999, image: "/feature-1.jpg" },
      { id: "2", name: "Peace Lily", variant: "Small • Nursery Pot", qty: 2, price: 499, image: "/feature-2.jpg" },
      { id: "3", name: "Succulents Trio Set", variant: "", qty: 1, price: 400, image: "/carousel-1.jpg" },
      { id: "4", name: "Golden Pothos", variant: "Hanging Basket", qty: 1, price: 299, image: "/carousel-2.jpg" },
    ],
    shippingAddress: {
      name: "Sami Khan",
      line1: "42, Prestige Falcon City",
      line2: "Konanakunte Cross, Banashankari",
      city: "Bengaluru",
      state: "Karnataka",
      pin: "560 062",
      phone: "+91 98765 43210",
    },
    timeline: [
      { label: "Order Placed", description: "Your order was received successfully.", timestamp: "24 Feb 2025, 10:42 AM", done: true, active: false },
      { label: "Payment Confirmed", description: "Payment of ₹2,197 captured via UPI.", timestamp: "24 Feb 2025, 10:43 AM", done: true, active: false },
      { label: "Processing", description: "Our team is packing your plants with care.", timestamp: "24 Feb 2025, 2:00 PM", done: false, active: true },
      { label: "Shipped", description: "Order dispatched and on its way.", timestamp: "Est. 25 Feb 2025", done: false, active: false },
      { label: "Delivered", description: "Package delivered to your doorstep.", timestamp: "Est. 28 Feb – 2 Mar 2025", done: false, active: false },
    ],
  },
  "3": {
    id: "3",
    orderNumber: "VK-2025-00271",
    date: "28 Jan 2025",
    estimatedDelivery: "2 Feb 2025",
    status: "shipped",
    total: 849,
    items: [
      { id: "1", name: "ZZ Plant", variant: "Small", qty: 1, price: 449, image: "/feature-2.jpg" },
      { id: "2", name: "Plant Food Sachets", variant: "Pack of 5", qty: 2, price: 200, image: "/carousel-1.jpg" },
    ],
    shippingAddress: {
      name: "Sami Khan",
      line1: "42, Prestige Falcon City",
      line2: "Konanakunte Cross, Banashankari",
      city: "Bengaluru",
      state: "Karnataka",
      pin: "560 062",
      phone: "+91 98765 43210",
    },
    timeline: [
      { label: "Order Placed", description: "Your order was received successfully.", timestamp: "28 Jan 2025, 9:15 AM", done: true, active: false },
      { label: "Payment Confirmed", description: "Payment of ₹849 captured via UPI.", timestamp: "28 Jan 2025, 9:16 AM", done: true, active: false },
      { label: "Processing", description: "Plants packed and quality checked.", timestamp: "28 Jan 2025, 3:30 PM", done: true, active: false },
      { label: "Shipped", description: "Order dispatched and on its way.", timestamp: "29 Jan 2025, 11:00 AM", done: true, active: false },
      { label: "Delivered", description: "Package delivered to your doorstep.", timestamp: "Est. 2 Feb 2025", done: false, active: false },
    ],
  },
};

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; pill: string; banner: string }> = {
  pending:    { label: "Pending",    pill: "bg-zinc-100 text-zinc-600",       banner: "from-zinc-50 to-background border-zinc-200" },
  processing: { label: "Processing", pill: "bg-primary-100 text-primary-700", banner: "from-primary-100/30 via-emerald-50/40 to-background border-primary-100" },
  shipped:    { label: "Shipped",    pill: "bg-sky-100 text-sky-700",         banner: "from-sky-50/60 to-background border-sky-100" },
  delivered:  { label: "Delivered",  pill: "bg-emerald-100 text-emerald-700", banner: "from-emerald-50/60 to-background border-emerald-100" },
  cancelled:  { label: "Cancelled",  pill: "bg-red-100 text-red-600",         banner: "from-red-50/60 to-background border-red-100" },
};

// ── Tracking timeline ─────────────────────────────────────────────────────────

function Timeline({ events }: { events: TrackingEvent[] }) {
  return (
    <div className="relative flex flex-col">
      {/* vertical connector */}
      <div className="absolute left-5.25 top-5 bottom-5 w-0.5 bg-zinc-100" />

      {events.map((event, i) => (
        <motion.div
          key={event.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
          className="relative z-10 flex items-start gap-4 pb-6 last:pb-0"
        >
          {/* Step dot */}
          <div
            className={cn(
              "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all",
              event.done
                ? "border-primary-500 bg-primary-500 text-white shadow-sm shadow-primary-500/30"
                : event.active
                ? "border-primary-400 bg-primary-50 text-primary-600 animate-pulse"
                : "border-zinc-200 bg-white text-zinc-300"
            )}
          >
            {event.done ? (
              <IconCircleCheck size={18} strokeWidth={2.5} />
            ) : event.active ? (
              <IconCircleDashed size={18} strokeWidth={2.5} />
            ) : (
              <IconCircleDashed size={18} className="opacity-30" />
            )}
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p
                className={cn(
                  "text-sm font-bold",
                  event.done
                    ? "text-primary-700"
                    : event.active
                    ? "text-zinc-900"
                    : "text-zinc-400"
                )}
              >
                {event.label}
              </p>
              <span
                className={cn(
                  "text-[11px] font-medium",
                  event.done || event.active ? "text-zinc-500" : "text-zinc-300"
                )}
              >
                {event.timestamp}
              </span>
            </div>
            <p
              className={cn(
                "mt-0.5 text-xs leading-relaxed",
                event.done || event.active ? "text-zinc-500" : "text-zinc-300"
              )}
            >
              {event.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Reusable card shells ──────────────────────────────────────────────────────

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-primary-100 bg-white shadow-sm p-6", className)}>
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-100">
        <Icon size={15} className="text-primary-600" />
      </div>
      <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-600">{children}</h2>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const order = DEMO_ORDERS[id];

  if (!order) notFound();

  const [itemsExpanded, setItemsExpanded] = useState(false);
  const ITEMS_LIMIT = 4;
  const visibleItems = itemsExpanded ? order.items : order.items.slice(0, ITEMS_LIMIT);
  const hasMoreItems = order.items.length > ITEMS_LIMIT;

  const statusCfg = STATUS_CONFIG[order.status];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6">

        {/* ── Back + breadcrumb ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex items-center gap-3"
        >
          <Button asChild variant="outline" size="sm" className="rounded-full px-3">
            <Link href="/orders" className="flex items-center gap-1.5">
              <IconArrowLeft size={15} />
              My Orders
            </Link>
          </Button>
          <span className="text-zinc-300">/</span>
          <span className="font-mono text-sm font-semibold text-zinc-500 truncate">
            {order.orderNumber}
          </span>
        </motion.div>

        {/* ── Hero status banner ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={cn(
            "mb-8 rounded-3xl bg-linear-to-br border p-6 sm:p-8 relative overflow-hidden",
            statusCfg.banner
          )}
        >
          <div className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/20 blur-3xl" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest", statusCfg.pill)}>
                {statusCfg.label}
              </span>
              <h1 className="font-mono text-xl font-bold text-zinc-900 mt-2 sm:text-2xl">
                Order Tracking
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <IconHash size={13} />
                  <span className="font-mono font-semibold text-zinc-700">{order.orderNumber}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCalendar size={13} />
                  {order.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconShoppingBag size={13} />
                  {order.items.reduce((s, i) => s + i.qty, 0)} items · ₹{order.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Est. delivery box */}
            <div className="flex flex-col items-start sm:items-end gap-0.5 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Est. Delivery
              </p>
              <p className="font-mono text-base font-bold text-zinc-800">{order.estimatedDelivery}</p>

            </div>
          </div>
        </motion.div>

        {/* ── Main two-column grid ──────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">

          {/* ── Left: Timeline ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
          >
            <Card>
              <SectionTitle icon={IconTruck}>Tracking Timeline</SectionTitle>
              <Timeline events={order.timeline} />
            </Card>
          </motion.div>

          {/* ── Right: Items + Address + Help ────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Items */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
            >
              <Card>
                <SectionTitle icon={IconShoppingBag}>
                  Items ({order.items.reduce((s, i) => s + i.qty, 0)})
                </SectionTitle>
                <div className="flex flex-col divide-y divide-zinc-100">
                  {visibleItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-primary-100 bg-primary-50/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-primary-50">
                          <IconLeaf size={15} className="text-primary-200" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-zinc-800">{item.name}</p>
                        <p className="text-[11px] text-zinc-400">
                          {item.variant ? `${item.variant} · ` : ""}Qty {item.qty}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-zinc-800 shrink-0">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Expand / collapse */}
                {hasMoreItems && (
                  <button
                    onClick={() => setItemsExpanded((v) => !v)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-zinc-200 py-2 text-xs font-semibold text-zinc-500 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {itemsExpanded ? (
                      <><IconChevronUp size={13} /> Show less</>
                    ) : (
                      <><IconChevronDown size={13} /> {order.items.length - ITEMS_LIMIT} more item{order.items.length - ITEMS_LIMIT !== 1 ? "s" : ""}</>
                    )}
                  </button>
                )}

                {/* Total row */}
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary-600 px-4 py-3">
                  <span className="text-sm font-bold text-primary-100">Total Paid</span>
                  <span className="font-extrabold text-white">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </Card>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.32, duration: 0.45 }}
            >
              <Card className="bg-amber-50/30 border-amber-100">
                <SectionTitle icon={IconMapPin}>Delivery Address</SectionTitle>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                    <IconMapPin size={16} className="text-amber-600" />
                  </div>
                  <div className="text-sm leading-relaxed text-zinc-700">
                    <p className="font-bold text-zinc-900">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
                      {order.shippingAddress.pin}
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-100/60 px-2.5 py-1 text-xs font-medium text-amber-700">
                      <IconPhone size={11} />
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Need Help */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.45 }}
            >
              <Card className="bg-sky-50/40 border-sky-100">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-sky-100">
                    <IconHeadset size={16} className="text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800">Need Help?</p>
                    <p className="mt-0.5 text-xs text-zinc-500 leading-relaxed">
                      Questions about this shipment?{" "}
                      <Link href="/contact" className="font-semibold text-primary-600 hover:underline">
                        Contact support
                      </Link>{" "}
                      — Mon–Sat, 9 AM to 6 PM.
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

        {/* ── Bottom back link ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <Button asChild variant="outline" className="rounded-full" size="lg">
            <Link href="/orders" className="flex items-center gap-2">
              <IconArrowLeft size={17} />
              Back to My Orders
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
