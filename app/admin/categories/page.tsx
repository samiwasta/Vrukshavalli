"use client";

import { useCallback, useEffect, useState } from "react";
import {
  IconLoader2,
  IconPlus,
  IconX,
  IconPencil,
  IconTrash,
  IconCategory,
  IconTruck,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { FLAT_DELIVERY_CHARGE_INR } from "@/lib/delivery-pricing";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  applyDeliveryCharge?: boolean;
  deliveryFee: string | null;
  createdAt: string;
}

type CategoryForm = {
  name: string;
  description: string;
  image: string;
  applyDeliveryCharge: boolean;
  deliveryFee: string;
  useCustomDeliveryFee: boolean;
};

const EMPTY_FORM: CategoryForm = {
  name: "",
  description: "",
  image: "",
  applyDeliveryCharge: true,
  deliveryFee: String(FLAT_DELIVERY_CHARGE_INR),
  useCustomDeliveryFee: false,
};

function formToBody(form: CategoryForm) {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
    image: form.image.trim() || null,
    applyDeliveryCharge: form.applyDeliveryCharge,
    deliveryFee:
      form.applyDeliveryCharge && form.useCustomDeliveryFee
        ? Number(form.deliveryFee)
        : null,
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/categories");
    const d = await r.json();
    if (d.success) setCategories(d.data ?? []);
    else toast.error("Failed to load categories");
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    document.body.style.overflow = showCreate || editing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCreate, editing]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setShowCreate(true);
  };

  const openEdit = (cat: Category) => {
    const fee = cat.deliveryFee != null ? Number(cat.deliveryFee) : null;
    setForm({
      name: cat.name,
      description: cat.description ?? "",
      image: cat.image ?? "",
      applyDeliveryCharge: cat.applyDeliveryCharge !== false,
      deliveryFee:
        fee != null && !Number.isNaN(fee)
          ? String(fee)
          : String(FLAT_DELIVERY_CHARGE_INR),
      useCustomDeliveryFee: fee != null && !Number.isNaN(fee),
    });
    setEditing(cat);
  };

  const closeModals = () => {
    setShowCreate(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const saveCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    const r = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formToBody(form)),
    });
    const d = await r.json();
    if (d.success) {
      toast.success("Category created");
      closeModals();
      void fetchCategories();
    } else {
      toast.error(d.error ?? "Failed to create category");
    }
    setSaving(false);
  };

  const saveEdit = async () => {
    if (!editing || !form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    const r = await fetch(`/api/categories/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formToBody(form)),
    });
    const d = await r.json();
    if (d.success) {
      toast.success("Category updated");
      closeModals();
      void fetchCategories();
    } else {
      toast.error(d.error ?? "Failed to update category");
    }
    setSaving(false);
  };

  const remove = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"? Only works if no products are linked.`))
      return;
    setDeleting(cat.id);
    const r = await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
    const d = await r.json();
    if (d.success) {
      toast.success("Category deleted");
      void fetchCategories();
    } else {
      toast.error(d.error ?? "Failed to delete category");
    }
    setDeleting(null);
  };

  const deliveryLabel = (cat: Category) => {
    if (cat.applyDeliveryCharge === false) return "No delivery charge";
    if (cat.deliveryFee != null) {
      return `₹${Number(cat.deliveryFee).toLocaleString("en-IN")} delivery`;
    }
    return `Default (₹${FLAT_DELIVERY_CHARGE_INR})`;
  };

  const formFields = (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-stone-700 block mb-1">
          Name
        </label>
        <input
          className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Farm Fresh"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-stone-700 block mb-1">
          Description
        </label>
        <textarea
          rows={2}
          className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Optional"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-stone-700 block mb-1">
          Image URL
        </label>
        <input
          className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
          value={form.image}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          placeholder="/category-plant.webp"
        />
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <IconTruck className="w-4 h-4 text-primary-600" />
              Apply delivery charges
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              When off, products in this category have no delivery fee at checkout.
            </p>
          </div>
          <Switch
            checked={form.applyDeliveryCharge}
            onCheckedChange={(checked) =>
              setForm((f) => ({ ...f, applyDeliveryCharge: checked }))
            }
          />
        </div>

        {form.applyDeliveryCharge && (
          <div className="space-y-3 pt-1 border-t border-stone-200">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-stone-700">
                  Custom delivery fee
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Leave off to use the site default (₹
                  {FLAT_DELIVERY_CHARGE_INR}).
                </p>
              </div>
              <Switch
                checked={form.useCustomDeliveryFee}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, useCustomDeliveryFee: checked }))
                }
              />
            </div>
            {form.useCustomDeliveryFee && (
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">
                  Delivery fee (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="w-full text-sm border border-stone-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  value={form.deliveryFee}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, deliveryFee: e.target.value }))
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <IconCategory className="w-6 h-6 text-primary-600" />
          Categories
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <IconPlus className="w-4 h-4" />
          Add category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <IconLoader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-stone-500 py-16 text-sm">
            No categories yet. Create one to get started.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/80">
                <th className="text-left px-4 py-3 font-semibold text-stone-500">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500">
                  Slug
                </th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500">
                  Delivery
                </th>
                <th className="text-right px-4 py-3 font-semibold text-stone-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-stone-50 hover:bg-stone-50/50"
                >
                  <td className="px-4 py-3 font-medium text-stone-800">
                    {cat.name}
                  </td>
                  <td className="px-4 py-3 text-stone-500 font-mono text-xs">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3 text-stone-600 text-xs">
                    {deliveryLabel(cat)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(cat)}
                        className="p-2 rounded-lg text-stone-500 hover:bg-primary-50 hover:text-primary-700"
                        aria-label={`Edit ${cat.name}`}
                      >
                        <IconPencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(cat)}
                        disabled={deleting === cat.id}
                        className="p-2 rounded-lg text-stone-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${cat.name}`}
                      >
                        {deleting === cat.id ? (
                          <IconLoader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <IconTrash className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(showCreate || editing) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-stone-900 text-lg">
                {editing ? "Edit category" : "Create category"}
              </h2>
              <button
                type="button"
                onClick={closeModals}
                className="text-stone-400 hover:text-stone-600"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>
            {formFields}
            <button
              type="button"
              disabled={saving}
              onClick={() => void (editing ? saveEdit() : saveCreate())}
              className="mt-6 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {saving
                ? "Saving…"
                : editing
                  ? "Save changes"
                  : "Create category"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
