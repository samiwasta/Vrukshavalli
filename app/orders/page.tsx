"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  IconPackage,
  IconTruck,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconChevronDown,
  IconChevronUp,
  IconArrowRight,
  IconLeaf,
  IconHash,
  IconCalendar,
  IconShoppingBag,
  IconInbox,
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

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  estimatedDelivery: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  items: OrderItem[];
}

// ── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "VK-2025-00341",
    date: "24 Feb 2025",
    estimatedDelivery: "28 Feb – 2 Mar 2025",
    status: "processing",
    total: 2197,
    itemCount: 4,
    items: [
      { id: "1", name: "Monstera Deliciosa", variant: "Medium • Ceramic Pot", qty: 1, price: 999, image: "/feature-1.jpg" },
      { id: "2", name: "Peace Lily", variant: "Small • Nursery Pot", qty: 2, price: 499, image: "/feature-2.jpg" },
      { id: "3", name: "Succulents Trio Set", variant: "", qty: 1, price: 400, image: "/carousel-1.jpg" },
      { id: "4", name: "Golden Pothos", variant: "Hanging Basket", qty: 1, price: 299, image: "/carousel-2.jpg" },
    ],
  },
  {
    id: "2",
    orderNumber: "VK-2025-00298",
    date: "10 Feb 2025",
    estimatedDelivery: "14 Feb 2025",
    status: "delivered",
    total: 1499,
    itemCount: 2,
    items: [
      { id: "1", name: "Fiddle Leaf Fig", variant: "Large • Terracotta Pot", qty: 1, price: 1199, image: "/carousel-3.jpg" },
      { id: "2", name: "Pebble Tray", variant: "", qty: 1, price: 300, image: "/feature-1.jpg" },
    ],
  },
  {
    id: "3",
    orderNumber: "VK-2025-00271",
    date: "28 Jan 2025",
    estimatedDelivery: "2 Feb 2025",
    status: "shipped",
    total: 849,
    itemCount: 3,
    items: [
      { id: "1", name: "ZZ Plant", variant: "Small", qty: 1, price: 449, image: "/feature-2.jpg" },
      { id: "2", name: "Plant Food Sachets", variant: "Pack of 5", qty: 2, price: 200, image: "/carousel-1.jpg" },
    ],
  },
  {
    id: "4",
    orderNumber: "VK-2025-00243",
    date: "15 Jan 2025",
    estimatedDelivery: "19 Jan 2025",
    status: "cancelled",
    total: 599,
    itemCount: 1,
    items: [
      { id: "1", name: "Bird of Paradise", variant: "Medium", qty: 1, price: 599, image: "/carousel-2.jpg" },
    ],
  },
  {
    id: "5",
    orderNumber: "VK-2024-00189",
    date: "5 Dec 2024",
    estimatedDelivery: "9 Dec 2024",
    status: "delivered",
    total: 3249,
    itemCount: 5,
    items: [
      { id: "1", name: "Snake Plant", variant: "Large • White Pot", qty: 1, price: 799, image: "/feature-1.jpg" },
      { id: "2", name: "Rubber Plant", variant: "Medium", qty: 1, price: 649, image: "/carousel-3.jpg" },
      { id: "3", name: "Alocasia Polly", variant: "Small", qty: 2, price: 549, image: "/feature-2.jpg" },
      { id: "4", name: "Liquid Fertiliser", variant: "500ml", qty: 2, price: 349, image: "/carousel-1.jpg" },
    ],
  },
];

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; pill: string; iconColor: string; cardBorder: string }
> = {
  pending: {
    label: "Pending",
    icon: IconClock,
    pill: "bg-zinc-100 text-zinc-600",
    iconColor: "text-zinc-500",
    cardBorder: "border-zinc-200",
  },
  processing: {
    label: "Processing",
    icon: IconPackage,
    pill: "bg-primary-100 text-primary-700",
    iconColor: "text-primary-500",
    cardBorder: "border-primary-100",
  },
  shipped: {
    label: "Shipped",
    icon: IconTruck,
    pill: "bg-sky-100 text-sky-700",
    iconColor: "text-sky-500",
    cardBorder: "border-sky-100",
  },
  delivered: {
    label: "Delivered",
    icon: IconCircleCheck,
    pill: "bg-emerald-100 text-emerald-700",
    iconColor: "text-emerald-500",
    cardBorder: "border-emerald-100",
  },
  cancelled: {
    label: "Cancelled",
    icon: IconCircleX,
    pill: "bg-red-100 text-red-600",
    iconColor: "text-red-400",
    cardBorder: "border-red-100",
  },
};

const FILTER_TABS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "All Orders" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

// ── Order Card ────────────────────────────────────────────────────────────────

function OrderCard({ order, index }: { order: Order; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status];
  const StatusIcon = status.icon;
  const visibleItems = expanded ? order.items : order.items.slice(0, 2);
  const hasMore = order.items.length > 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={cn(
        "rounded-3xl border-2 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md",
        status.cardBorder
      )}
    >
      {/* ── Card Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {/* Status icon circle */}
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
              order.status === "processing"
                ? "bg-primary-100"
                : order.status === "shipped"
                ? "bg-sky-100"
                : order.status === "delivered"
                ? "bg-emerald-100"
                : order.status === "cancelled"
                ? "bg-red-100"
                : "bg-zinc-100"
            )}
          >
            <StatusIcon size={18} className={status.iconColor} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-zinc-900 tracking-wide">
                {order.orderNumber}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  status.pill
                )}
              >
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <IconCalendar size={11} />
                {order.date}
              </span>
              <span className="flex items-center gap-1">
                <IconShoppingBag size={11} />
                {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Total + CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Total
            </p>
            <p className="text-base font-extrabold text-zinc-900">
              ₹{order.total.toLocaleString("en-IN")}
            </p>
          </div>
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <Link
              href={`/orders/${order.id}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm shadow-primary-600/30 hover:bg-primary-700 transition-colors"
            >
              <IconArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 border-t border-dashed border-zinc-100 sm:mx-6" />

      {/* ── Items preview ── */}
      <div className="px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-2.5">
          {visibleItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {/* Thumbnail */}
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-primary-50/50">
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
                  <IconLeaf size={16} className="text-primary-200" />
                </div>
              </div>
              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-800">{item.name}</p>
                <p className="text-[11px] text-zinc-400">
                  {item.variant ? `${item.variant} · ` : ""}Qty {item.qty}
                </p>
              </div>
              {/* Price */}
              <p className="text-sm font-semibold text-zinc-700 shrink-0">
                ₹{(item.price * item.qty).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        {/* Expand / collapse */}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-zinc-200 py-2 text-xs font-semibold text-zinc-500 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {expanded ? (
              <>
                <IconChevronUp size={13} /> Show less
              </>
            ) : (
              <>
                <IconChevronDown size={13} />
                {order.items.length - 2} more item{order.items.length - 2 !== 1 ? "s" : ""}
              </>
            )}
          </button>
        )}
      </div>

      {/* ── Est. delivery footer (not for cancelled/delivered) ── */}
      {(order.status === "processing" || order.status === "shipped") && (
        <div
          className={cn(
            "flex items-center gap-2 px-5 py-3 sm:px-6 border-t",
            order.status === "shipped"
              ? "bg-sky-50/60 border-sky-100"
              : "bg-primary-50/40 border-primary-100"
          )}
        >
          <IconClock
            size={13}
            className={order.status === "shipped" ? "text-sky-500" : "text-primary-400"}
          />
          <p className="text-xs text-zinc-500">
            Est. delivery:{" "}
            <span className="font-semibold text-zinc-700">{order.estimatedDelivery}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | OrderStatus>("all");

  const filtered =
    activeFilter === "all"
      ? DEMO_ORDERS
      : DEMO_ORDERS.filter((o) => o.status === activeFilter);

  const counts: Record<string, number> = { all: DEMO_ORDERS.length };
  DEMO_ORDERS.forEach((o) => {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100">
              <IconPackage size={18} className="text-primary-600" />
            </div>
            <h1 className="font-mono text-2xl font-bold text-zinc-900">My Orders</h1>
          </div>
          <p className="ml-13 text-sm text-zinc-500 pl-0.5">
            {DEMO_ORDERS.length} order{DEMO_ORDERS.length !== 1 ? "s" : ""} placed so far
          </p>
        </motion.div>

        {/* ── Filter tabs ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        >
          {FILTER_TABS.map(({ key, label }) => {
            const count = counts[key];
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all",
                  isActive
                    ? "border-primary-500 bg-primary-600 text-white shadow-sm shadow-primary-600/20"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-primary-300 hover:text-primary-700"
                )}
              >
                {label}
                {count !== undefined && (
                  <span
                    className={cn(
                      "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                      isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Order list ───────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {filtered.map((order, i) => (
                <OrderCard key={order.id} order={order} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-zinc-200 bg-white py-20 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
                <IconInbox size={26} className="text-zinc-300" />
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-zinc-700">No orders here</p>
                <p className="mt-1 text-xs text-zinc-400">
                  No {activeFilter === "all" ? "" : activeFilter + " "}orders found.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-1 rounded-full"
              >
                <Link href="/">Start Shopping</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center"
          >
            <Button asChild variant="outline" className="rounded-full" size="lg">
              <Link href="/" className="flex items-center gap-2">
                <IconShoppingBag size={17} />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
