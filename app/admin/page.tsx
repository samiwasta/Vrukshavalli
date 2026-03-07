"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  IconShoppingBag,
  IconCurrencyRupee,
  IconLeaf,
  IconUsers,
  IconLoader2,
  IconArrowUpRight,
  IconTag,
  IconAlertCircle,
  IconCircleCheck,
  IconTruck,
  IconX,
  IconChevronRight,
  IconPackage,
  IconMessage,
  IconGift,
} from "@tabler/icons-react";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  outOfStock: number;
  totalUsers: number;
  pendingOrders: number;
  processingOrders: number;
  totalContacts: number;
  totalGifting: number;
  activeCoupons: number;
  statusBreakdown: { status: string; cnt: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    createdAt: string;
    userName: string | null;
    userPhone: string | null;
  }[];
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; chartColor: string; icon: React.ElementType }> = {
  pending:    { label: "Pending",    color: "text-amber-600",   bg: "bg-amber-50",   chartColor: "#f59e0b", icon: IconPackage },
  processing: { label: "Processing", color: "text-blue-600",    bg: "bg-blue-50",    chartColor: "#3b82f6", icon: IconPackage },
  shipped:    { label: "Shipped",    color: "text-indigo-600",  bg: "bg-indigo-50",  chartColor: "#6366f1", icon: IconTruck },
  delivered:  { label: "Delivered",  color: "text-emerald-600", bg: "bg-emerald-50", chartColor: "#10b981", icon: IconCircleCheck },
  cancelled:  { label: "Cancelled",  color: "text-red-500",     bg: "bg-red-50",     chartColor: "#ef4444", icon: IconX },
};

function fmt(n: number) { return n.toLocaleString("en-IN"); }

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.data))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-sm text-stone-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const pieData = stats.statusBreakdown
    .filter((s) => s.cnt > 0)
    .map((s) => ({
      name: STATUS_META[s.status]?.label ?? s.status,
      value: s.cnt,
      color: STATUS_META[s.status]?.chartColor ?? "#a8a29e",
    }));

  const barData = [
    { name: "Products", value: stats.totalProducts, fill: "#10b981" },
    { name: "Users",    value: stats.totalUsers,    fill: "#8b5cf6" },
    { name: "Contacts", value: stats.totalContacts, fill: "#f43f5e" },
    { name: "Gifting",  value: stats.totalGifting,  fill: "#ec4899" },
    { name: "Coupons",  value: stats.activeCoupons ?? 0, fill: "#14b8a6" },
  ];

  return (
    <div className="min-h-full bg-stone-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-stone-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-900">Dashboard</h1>
            <p className="text-xs text-stone-400 mt-0.5">{today}</p>
          </div>
          {(stats.pendingOrders > 0 || stats.outOfStock > 0) && (
            <div className="flex items-center gap-2">
              {stats.pendingOrders > 0 && (
                <Link href="/admin/orders" className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">
                  <IconAlertCircle className="w-3.5 h-3.5" />
                  {stats.pendingOrders} pending {stats.pendingOrders === 1 ? "order" : "orders"}
                </Link>
              )}
              {stats.outOfStock > 0 && (
                <Link href="/admin/products" className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">
                  <IconAlertCircle className="w-3.5 h-3.5" />
                  {stats.outOfStock} out of stock
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* ── Primary KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `₹${fmt(stats.totalRevenue)}`, sub: "from paid orders", icon: IconCurrencyRupee, accent: "border-l-emerald-500", iconBg: "bg-emerald-50", iconColor: "text-emerald-600", href: "/admin/orders" },
            { label: "Total Orders",  value: fmt(stats.totalOrders), sub: `${stats.pendingOrders} pending`, icon: IconShoppingBag, accent: "border-l-blue-500", iconBg: "bg-blue-50", iconColor: "text-blue-600", href: "/admin/orders" },
            { label: "Registered Users", value: fmt(stats.totalUsers), sub: "all time", icon: IconUsers, accent: "border-l-violet-500", iconBg: "bg-violet-50", iconColor: "text-violet-600", href: "/admin/users" },
            { label: "Active Products", value: fmt(stats.totalProducts), sub: stats.outOfStock > 0 ? `${stats.outOfStock} out of stock` : "all in stock", icon: IconLeaf, accent: "border-l-primary-500", iconBg: "bg-primary-50", iconColor: "text-primary-600", href: "/admin/products" },
          ].map((card) => (
            <Link key={card.label} href={card.href} className={`bg-white rounded-xl border border-stone-200 border-l-4 ${card.accent} p-5 hover:shadow-md transition-all group`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <IconArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-stone-900 tracking-tight">{card.value}</p>
              <p className="text-sm font-medium text-stone-600 mt-0.5">{card.label}</p>
              <p className="text-xs text-stone-400 mt-1">{card.sub}</p>
            </Link>
          ))}
        </div>

        {/* ── Secondary metric cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Processing",       value: stats.processingOrders ?? 0, icon: IconPackage, color: "text-blue-500",   bg: "bg-blue-50",   href: "/admin/orders" },
            { label: "Active Coupons",   value: stats.activeCoupons ?? 0,    icon: IconTag,     color: "text-teal-600",   bg: "bg-teal-50",   href: "/admin/coupons" },
            { label: "Contact Messages", value: stats.totalContacts ?? 0,    icon: IconMessage, color: "text-rose-500",   bg: "bg-rose-50",   href: "/admin/contact" },
            { label: "Gifting Enquiries",value: stats.totalGifting ?? 0,     icon: IconGift,    color: "text-pink-500",   bg: "bg-pink-50",   href: "/admin/gifting" },
          ].map((card) => (
            <Link key={card.label} href={card.href} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-3 hover:shadow-sm transition-all group">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-stone-900">{String(card.value)}</p>
                <p className="text-xs text-stone-500 truncate">{card.label}</p>
              </div>
              <IconChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 transition-colors ml-auto shrink-0" />
            </Link>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Order status donut — 1/3 */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col">
            <div className="mb-4">
              <h2 className="font-semibold text-stone-900">Order Status</h2>
              <p className="text-xs text-stone-400 mt-0.5">{stats.totalOrders} total orders</p>
            </div>

            {pieData.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-8">
                <p className="text-sm text-stone-400">No orders yet.</p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={3}
                        dataKey="value"
                        labelLine={false}
                        stroke="none"
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: unknown) => [String(value), "orders"]}
                        contentStyle={{ borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-stone-900 leading-none">{stats.totalOrders}</span>
                    <span className="text-xs text-stone-400 mt-1">orders</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-3 space-y-2">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                        <span className="text-stone-600 capitalize">{d.name}</span>
                      </div>
                      <span className="font-semibold text-stone-800">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Overview bar chart — 2/3 */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5">
            <div className="mb-5">
              <h2 className="font-semibold text-stone-900">Store Overview</h2>
              <p className="text-xs text-stone-400 mt-0.5">Key metrics at a glance</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={36} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f0ef" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#78716c" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "#fafaf9" }}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 12 }}
                  formatter={(val: unknown) => [String(val), ""]}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Recent Orders ── */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <div>
              <h2 className="font-semibold text-stone-900">Recent Orders</h2>
              <p className="text-xs text-stone-400 mt-0.5">Last 6 orders placed</p>
            </div>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
              View all <IconArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="py-12 text-center">
              <IconShoppingBag className="w-10 h-10 text-stone-200 mx-auto mb-2" />
              <p className="text-sm text-stone-400">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              {stats.recentOrders.map((order) => {
                const meta = STATUS_META[order.status];
                const StatusIcon = meta?.icon ?? IconPackage;
                return (
                  <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${meta?.bg ?? "bg-stone-50"} flex items-center justify-center shrink-0`}>
                      <StatusIcon className={`w-4 h-4 ${meta?.color ?? "text-stone-500"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-stone-800">{order.orderNumber}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${meta?.bg ?? "bg-stone-100"} ${meta?.color ?? "text-stone-600"}`}>
                          {order.status}
                        </span>
                        {order.paymentStatus === "paid" && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">paid</span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5 truncate">
                        {order.userName ?? "Unknown"}{order.userPhone ? ` · ${order.userPhone}` : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-stone-800">₹{fmt(Number(order.totalAmount))}</p>
                      <p className="text-xs text-stone-400">{relativeTime(order.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

