"use client";

import { useEffect, useState, useCallback } from "react";
import {
  IconLoader2,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconFilter,
  IconX,
  IconCheck,
  IconListDetails,
  IconUser,
  IconMapPin,
  IconCreditCard,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface OrderLineItem {
  productId?: string;
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
  variant?: string;
}

interface OrderAddress {
  fullName?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  totalAmount: number;
  createdAt: string;
  userName: string | null;
  userPhone: string | null;
  userEmail: string | null;
  itemCount: number;
  items: OrderLineItem[] | null;
  shippingAddress: OrderAddress | null;
  billingAddress: OrderAddress | null;
}

function formatAddress(addr: OrderAddress | null | undefined): string[] {
  if (!addr || typeof addr !== "object") return [];
  const lines: string[] = [];
  if (addr.fullName) lines.push(addr.fullName);
  const street = [addr.line1, addr.line2].filter(Boolean).join(", ");
  if (street) lines.push(street);
  const cityState = [addr.city, addr.state].filter(Boolean).join(", ");
  const locality = [cityState, addr.pincode].filter(Boolean).join(" - ");
  if (locality) lines.push(locality);
  if (addr.phone) lines.push(`Phone: ${addr.phone}`);
  return lines;
}

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_OPTIONS = ["pending", "paid", "failed", "refunded"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: "bg-stone-100 text-stone-600",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [editing, setEditing] = useState<Order | null>(null);
  const [editForm, setEditForm] = useState({
    status: "",
    paymentStatus: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    const r = await fetch(`/api/admin/orders?${params}`);
    const d = await r.json();
    if (d.success) {
      const normalized: Order[] = (d.data as Record<string, unknown>[]).map(
        (o) => {
          let items = o.items;
          if (typeof items === "string") {
            try {
              items = JSON.parse(items as string);
            } catch {
              items = [];
            }
          }
          return {
            id: String(o.id),
            orderNumber: String(o.orderNumber ?? ""),
            status: String(o.status ?? ""),
            paymentStatus: String(o.paymentStatus ?? ""),
            paymentMethod:
              o.paymentMethod != null ? String(o.paymentMethod) : null,
            totalAmount: Number(o.totalAmount ?? 0),
            createdAt: String(o.createdAt ?? ""),
            userName: o.userName != null ? String(o.userName) : null,
            userPhone: o.userPhone != null ? String(o.userPhone) : null,
            userEmail: o.userEmail != null ? String(o.userEmail) : null,
            itemCount: Number(o.itemCount ?? 0),
            items: Array.isArray(items) ? (items as OrderLineItem[]) : [],
            shippingAddress:
              o.shippingAddress && typeof o.shippingAddress === "object"
                ? (o.shippingAddress as OrderAddress)
                : null,
            billingAddress:
              o.billingAddress && typeof o.billingAddress === "object"
                ? (o.billingAddress as OrderAddress)
                : null,
          };
        },
      );
      setOrders(normalized);
      setPagination(d.pagination);
    }
    setLoading(false);
  }, [page, search, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Debounce search
  useEffect(() => {
    setPage(1);
  }, [search, status]);

  useEffect(() => {
    document.body.style.overflow = editing || detailOrder ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [editing, detailOrder]);

  const openEdit = (order: Order) => {
    setEditing(order);
    setEditForm({
      status: order.status,
      paymentStatus: order.paymentStatus,
      notes: "",
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    const r = await fetch(`/api/admin/orders/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const d = await r.json();
    if (d.success) {
      toast.success("Order updated");
      setEditing(null);
      fetchOrders();
    } else {
      toast.error("Failed to update order");
    }
    setSaving(false);
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 w-56"
            placeholder="Search order, name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <IconFilter className="w-4 h-4 text-stone-400" />
          <select
            className="text-sm border border-stone-200 rounded-lg py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <IconLoader2 className="w-6 h-6 text-primary-500 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center py-16 text-stone-400">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-left">
                  <th className="px-4 py-3 font-medium text-stone-600">
                    Order
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600">
                    Customer
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600">
                    Products
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600">
                    Payment
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-600">Date</th>
                  <th className="px-4 py-3 font-medium text-stone-600"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-medium text-stone-800">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-700">
                        {order.userName ?? "—"}
                      </p>
                      <p className="text-xs text-stone-500 truncate max-w-[140px]">
                        {order.userEmail ?? "—"}
                      </p>
                      <p className="text-xs text-stone-400">
                        {order.userPhone ?? ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="text-sm font-semibold text-stone-800">
                          {order.itemCount ?? 0}{" "}
                          {(order.itemCount ?? 0) === 1 ? "item" : "items"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDetailOrder(order)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <IconListDetails className="w-3.5 h-3.5" />
                          View details
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? "bg-stone-100 text-stone-600"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${PAYMENT_COLORS[order.paymentStatus] ?? "bg-stone-100 text-stone-600"}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-stone-700">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEdit(order)}
                        className="text-xs text-primary-600 hover:underline font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-stone-500">
            {pagination.total} total orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50 transition-colors"
            >
              <IconChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-stone-600">
              {page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pagination.totalPages}
              className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50 transition-colors"
            >
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Order detail: products + user + addresses + payment */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[min(90vh,900px)] flex flex-col my-4">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 shrink-0">
              <div>
                <h2 className="font-bold text-stone-900 text-lg font-mono">
                  {detailOrder.orderNumber}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {detailOrder.createdAt
                    ? new Date(detailOrder.createdAt).toLocaleString("en-IN")
                    : "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailOrder(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
                aria-label="Close"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">
              <section className="rounded-xl border border-stone-200 bg-stone-50/80 p-4">
                <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
                  <IconCreditCard className="w-4 h-4" />
                  Payment
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide">
                      Status
                    </p>
                    <span
                      className={`inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${PAYMENT_COLORS[detailOrder.paymentStatus] ?? "bg-stone-100 text-stone-600"}`}
                    >
                      {detailOrder.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide">
                      Method
                    </p>
                    <p className="mt-1 font-medium text-stone-800">
                      {detailOrder.paymentMethod ?? "—"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-stone-500 uppercase tracking-wide">
                      Order total
                    </p>
                    <p className="mt-1 text-lg font-bold text-stone-900">
                      ₹{Number(detailOrder.totalAmount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-stone-200 p-4">
                <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
                  <IconUser className="w-4 h-4" />
                  Customer
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-stone-500">Name</dt>
                    <dd className="font-medium text-stone-900 mt-0.5">
                      {detailOrder.userName ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-stone-500">Email</dt>
                    <dd className="font-medium text-stone-900 mt-0.5 break-all">
                      {detailOrder.userEmail ?? "—"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-stone-500">Phone</dt>
                    <dd className="font-medium text-stone-900 mt-0.5">
                      {detailOrder.userPhone ?? "—"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-xl border border-stone-200 p-4">
                <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
                  <IconMapPin className="w-4 h-4" />
                  Delivery address
                </div>
                {formatAddress(detailOrder.shippingAddress as OrderAddress).length ? (
                  <ul className="text-sm text-stone-700 space-y-1">
                    {formatAddress(
                      detailOrder.shippingAddress as OrderAddress,
                    ).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-stone-400">No address on file</p>
                )}
              </section>

              {detailOrder.billingAddress &&
                formatAddress(detailOrder.billingAddress as OrderAddress).length >
                  0 && (
                  <section className="rounded-xl border border-stone-200 p-4">
                    <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
                      <IconMapPin className="w-4 h-4" />
                      Billing address
                    </div>
                    <ul className="text-sm text-stone-700 space-y-1">
                      {formatAddress(
                        detailOrder.billingAddress as OrderAddress,
                      ).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </section>
                )}

              <section>
                <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm mb-3">
                  <IconListDetails className="w-4 h-4" />
                  Product list ({detailOrder.itemCount ?? 0} units)
                </div>
                {Array.isArray(detailOrder.items) && detailOrder.items.length > 0 ? (
                  <div className="rounded-xl border border-stone-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 text-left">
                          <th className="px-3 py-2 font-medium text-stone-600">
                            Product
                          </th>
                          <th className="px-3 py-2 font-medium text-stone-600 w-20">
                            Qty
                          </th>
                          <th className="px-3 py-2 font-medium text-stone-600 text-right">
                            Line total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailOrder.items.map((line: OrderLineItem, idx: number) => {
                          const qty = Number(line.quantity) || 1;
                          const price = Number(line.price) || 0;
                          return (
                            <tr
                              key={line.productId ?? line.id ?? idx}
                              className="border-b border-stone-100 last:border-0"
                            >
                              <td className="px-3 py-2.5">
                                <p className="font-medium text-stone-800">
                                  {line.name ?? "Product"}
                                </p>
                                {line.variant && (
                                  <p className="text-xs text-stone-500">
                                    {line.variant}
                                  </p>
                                )}
                              </td>
                              <td className="px-3 py-2.5 text-stone-700">{qty}</td>
                              <td className="px-3 py-2.5 text-right font-medium text-stone-800">
                                ₹{(price * qty).toLocaleString("en-IN")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-stone-400">No line items</p>
                )}
              </section>
            </div>

            <div className="px-5 py-3 border-t border-stone-200 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  openEdit(detailOrder);
                  setDetailOrder(null);
                }}
                className="flex-1 py-2.5 text-sm rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium"
              >
                Edit order status
              </button>
              <button
                type="button"
                onClick={() => setDetailOrder(null)}
                className="flex-1 py-2.5 text-sm rounded-xl bg-primary-600 text-white hover:bg-primary-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-stone-900 text-lg">
                Edit Order — {editing.orderNumber}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">
                  Order Status
                </label>
                <select
                  className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, status: e.target.value }))
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">
                  Payment Status
                </label>
                <select
                  className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  value={editForm.paymentStatus}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      paymentStatus: e.target.value,
                    }))
                  }
                >
                  {PAYMENT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">
                  Notes (optional)
                </label>
                <textarea
                  className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                  rows={3}
                  placeholder="Add a note…"
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-2.5 text-sm rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex-1 py-2.5 text-sm rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <IconCheck className="w-4 h-4" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
