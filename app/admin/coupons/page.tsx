"use client";

import { useEffect, useState, useCallback } from "react";
import {
  IconLoader2,
  IconTag,
  IconPlus,
  IconX,
  IconCheck,
  IconToggleLeft,
  IconToggleRight,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconPercentage,
  IconCurrencyRupee,
  IconUserCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountPct: number;
  description: string | null;
  newUsersOnly: boolean;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  code: "",
  discountType: "percentage" as "percentage" | "flat",
  discountPct: 10,
  description: "",
  newUsersOnly: false,
  maxUses: "",
  expiresAt: "",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    const r = await fetch(`/api/admin/coupons?page=${page}&limit=20`);
    const d = await r.json();
    if (d.success) {
      setCoupons(d.data);
      setPagination(d.pagination);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  useEffect(() => {
    document.body.style.overflow = showCreate ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCreate]);

  const createCoupon = async () => {
    if (!form.code || !form.discountPct) return toast.error("Code and discount are required");
    setCreating(true);
    const r = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        discountType: form.discountType,
        discountPct: Number(form.discountPct),
        description: form.description || null,
        newUsersOnly: form.newUsersOnly,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      }),
    });
    const d = await r.json();
    if (d.success) {
      toast.success("Coupon created");
      setShowCreate(false);
      setForm(EMPTY_FORM);
      fetchCoupons();
    } else {
      toast.error("Failed to create coupon");
    }
    setCreating(false);
  };

  const toggleActive = async (coupon: Coupon) => {
    setToggling(coupon.id);
    const r = await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });
    const d = await r.json();
    if (d.success) {
      toast.success(coupon.isActive ? "Coupon deactivated" : "Coupon activated");
      fetchCoupons();
    } else {
      toast.error("Failed to update coupon");
    }
    setToggling(null);
  };

  const deleteCoupon = async (coupon: Coupon) => {
    if (!confirm(`Delete coupon ${coupon.code}? This cannot be undone.`)) return;
    setDeleting(coupon.id);
    const r = await fetch(`/api/admin/coupons/${coupon.id}`, { method: "DELETE" });
    const d = await r.json();
    if (d.success) {
      toast.success("Coupon deleted");
      fetchCoupons();
    } else {
      toast.error("Failed to delete coupon");
    }
    setDeleting(null);
  };

  const formatDiscount = (coupon: Coupon) =>
    coupon.discountType === "flat"
      ? `₹${coupon.discountPct} off`
      : `${coupon.discountPct}% off`;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <IconTag className="w-6 h-6 text-emerald-600" /> Coupons
        </h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
        >
          <IconPlus className="w-4 h-4" /> New Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <IconLoader2 className="w-6 h-6 text-primary-500 animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <p className="text-center py-16 text-stone-400">No coupons yet. Create one!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-left">
                  <th className="px-4 py-3 font-medium text-stone-600">Code</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Discount</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Description</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Uses</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Expires</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Status</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Created</th>
                  <th className="px-4 py-3 font-medium text-stone-600"></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${!coupon.isActive ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-stone-800 bg-stone-100 px-2 py-1 rounded inline-block w-fit">{coupon.code}</span>
                        {coupon.newUsersOnly && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5 w-fit">
                            <IconUserCheck className="w-3 h-3" /> New users only
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${coupon.discountType === "flat" ? "text-blue-700" : "text-emerald-700"}`}>
                        {formatDiscount(coupon)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs max-w-45 truncate">
                      {coupon.description ?? <span className="italic text-stone-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {coupon.usedCount}{coupon.maxUses != null ? ` / ${coupon.maxUses}` : ""}
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("en-IN") : "Never"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(coupon)}
                        disabled={toggling === coupon.id}
                        className={`transition-colors ${coupon.isActive ? "text-primary-600" : "text-stone-300"}`}
                      >
                        {toggling === coupon.id
                          ? <IconLoader2 className="w-5 h-5 animate-spin" />
                          : coupon.isActive
                          ? <IconToggleRight className="w-7 h-7" />
                          : <IconToggleLeft className="w-7 h-7" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{new Date(coupon.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteCoupon(coupon)}
                        disabled={deleting === coupon.id}
                        className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                      >
                        {deleting === coupon.id ? <IconLoader2 className="w-4 h-4 animate-spin" /> : <IconTrash className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-stone-500">{pagination.total} coupons</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50">
              <IconChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-stone-600">{page} / {pagination.totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages} className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50">
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-stone-900 text-lg">Create Coupon</h2>
              <button onClick={() => setShowCreate(false)} className="text-stone-400 hover:text-stone-600"><IconX className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Coupon Code</label>
                <input
                  className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 uppercase"
                  placeholder="SAVE10"
                  value={form.code}
                  onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                />
              </div>

              {/* Discount type toggle */}
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1.5">Discount Type</label>
                <div className="flex rounded-lg border border-stone-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, discountType: "percentage" }))}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors ${form.discountType === "percentage" ? "bg-primary-600 text-white" : "bg-white text-stone-600 hover:bg-stone-50"}`}
                  >
                    <IconPercentage className="w-4 h-4" /> Percentage
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, discountType: "flat" }))}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors border-l border-stone-200 ${form.discountType === "flat" ? "bg-primary-600 text-white" : "bg-white text-stone-600 hover:bg-stone-50"}`}
                  >
                    <IconCurrencyRupee className="w-4 h-4" /> Flat ₹
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">
                    {form.discountType === "percentage" ? "Discount %" : "Discount ₹"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={form.discountType === "percentage" ? 100 : undefined}
                    className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    value={form.discountPct}
                    onChange={(e) => setForm(f => ({ ...f, discountPct: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Max Uses</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    placeholder="Unlimited"
                    value={form.maxUses}
                    onChange={(e) => setForm(f => ({ ...f, maxUses: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Description <span className="text-stone-400 font-normal">(optional)</span></label>
                <textarea
                  rows={2}
                  className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                  placeholder="e.g. Welcome discount for new customers"
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              {/* New users only toggle */}
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, newUsersOnly: !f.newUsersOnly }))}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl border transition-colors ${
                  form.newUsersOnly
                    ? "border-violet-300 bg-violet-50 text-violet-800"
                    : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <IconUserCheck className="w-4 h-4" />
                  New customers only
                  <span className="text-xs font-normal opacity-70">— restrict to first-time buyers</span>
                </span>
                {form.newUsersOnly
                  ? <IconToggleRight className="w-6 h-6 text-violet-600" />
                  : <IconToggleLeft className="w-6 h-6 text-stone-300" />}
              </button>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Expires At <span className="text-stone-400 font-normal">(optional)</span></label>
                <input
                  type="datetime-local"
                  className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  value={form.expiresAt}
                  onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 text-sm rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={createCoupon}
                disabled={creating}
                className="flex-1 py-2.5 text-sm rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {creating ? <IconLoader2 className="w-4 h-4 animate-spin" /> : <IconCheck className="w-4 h-4" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

