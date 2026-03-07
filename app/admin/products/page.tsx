"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  IconLoader2,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconCheck,
  IconLeaf,
  IconPlus,
  IconUpload,
  IconPhoto,
  IconPencil,
  IconBan,
  IconTag,
  IconAlertTriangle,
  IconPackage,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing-react";

interface Category { id: string; name: string; slug: string; }
interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  originalPrice: string | null;
  stock: number;
  isActive: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isHandPicked: boolean;
  description: string | null;
  image: string;
  images: string[] | null;
  categoryId: string | null;
  category: Category | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [editing, setEditing] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string; description: string; price: string; originalPrice: string;
    categoryId: string; stock: number;
    isActive: boolean; isNew: boolean; isBestSeller: boolean; isHandPicked: boolean;
  }>({ name: "", description: "", price: "", originalPrice: "", categoryId: "", stock: 0, isActive: true, isNew: false, isBestSeller: false, isHandPicked: false });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editMainImg, setEditMainImg] = useState("");
  const [editMainUploading, setEditMainUploading] = useState(false);
  const [editExtraImgs, setEditExtraImgs] = useState<string[]>([]);
  const [editExtraUploading, setEditExtraUploading] = useState(false);
  const editMainInputRef = useRef<HTMLInputElement>(null);
  const editExtraInputRef = useRef<HTMLInputElement>(null);

  const blankForm = { name: "", description: "", price: "", originalPrice: "", categoryId: "", stock: 0, isNew: false, isBestSeller: false, isHandPicked: false, isActive: true };
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(blankForm);
  const [createSaving, setCreateSaving] = useState(false);
  const [mainImgUrl, setMainImgUrl] = useState("");
  const [mainImgUploading, setMainImgUploading] = useState(false);
  const [extraImgs, setExtraImgs] = useState<string[]>([]);
  const [extraUploading, setExtraUploading] = useState(false);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const extraInputRef = useRef<HTMLInputElement>(null);

  const { startUpload: startMainUpload } = useUploadThing("productImages", {
    onUploadBegin: () => setMainImgUploading(true),
    onClientUploadComplete: (res) => { if (res[0]) setMainImgUrl(res[0].url); setMainImgUploading(false); },
    onUploadError: (err) => { toast.error(err.message); setMainImgUploading(false); },
  });

  const { startUpload: startExtraUpload } = useUploadThing("productImages", {
    onUploadBegin: () => setExtraUploading(true),
    onClientUploadComplete: (res) => { setExtraImgs(prev => [...prev, ...res.map(r => r.url)]); setExtraUploading(false); },
    onUploadError: (err) => { toast.error(err.message); setExtraUploading(false); },
  });

  const { startUpload: startEditMainUpload } = useUploadThing("productImages", {
    onUploadBegin: () => setEditMainUploading(true),
    onClientUploadComplete: (res) => { if (res[0]) setEditMainImg(res[0].url); setEditMainUploading(false); },
    onUploadError: (err) => { toast.error(err.message); setEditMainUploading(false); },
  });

  const { startUpload: startEditExtraUpload } = useUploadThing("productImages", {
    onUploadBegin: () => setEditExtraUploading(true),
    onClientUploadComplete: (res) => { setEditExtraImgs(prev => [...prev, ...res.map(r => r.url)]); setEditExtraUploading(false); },
    onUploadError: (err) => { toast.error(err.message); setEditExtraUploading(false); },
  });

  const closeCreate = () => { setCreating(false); setCreateForm(blankForm); setMainImgUrl(""); setExtraImgs([]); };

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.data ?? []));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (activeFilter) params.set("isActive", activeFilter);

    const r = await fetch(`/api/admin/products?${params}`);
    const d = await r.json();
    if (d.success) {
      setProducts(d.data);
      setPagination(d.pagination);
    }
    setLoading(false);
  }, [page, search, categoryId, activeFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [search, categoryId, activeFilter]);

  useEffect(() => {
    document.body.style.overflow = creating || !!editing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [creating, editing]);

  const openEdit = (p: Product) => {
    setEditing(p);
    setEditForm({
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      originalPrice: p.originalPrice ?? "",
      categoryId: p.categoryId ?? "",
      stock: p.stock,
      isActive: p.isActive,
      isNew: p.isNew,
      isBestSeller: p.isBestSeller,
      isHandPicked: p.isHandPicked,
    });
    setEditMainImg(p.image);
    setEditExtraImgs(p.images ?? []);
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!editForm.name.trim()) return toast.error("Name is required");
    if (!editForm.price) return toast.error("Price is required");
    if (!editMainImg) return toast.error("Cover photo is required");
    setSaving(true);
    const r = await fetch(`/api/admin/products/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name.trim(),
        description: editForm.description.trim() || null,
        price: Number(editForm.price),
        originalPrice: editForm.originalPrice ? Number(editForm.originalPrice) : null,
        image: editMainImg,
        images: editExtraImgs.length ? editExtraImgs : null,
        categoryId: editForm.categoryId || null,
        stock: Number(editForm.stock),
        isActive: editForm.isActive,
        isNew: editForm.isNew,
        isBestSeller: editForm.isBestSeller,
        isHandPicked: editForm.isHandPicked,
      }),
    });
    const d = await r.json();
    if (d.success) {
      toast.success("Product updated");
      setEditing(null);
      fetchProducts();
    } else {
      toast.error(d.error?.fieldErrors ? Object.values(d.error.fieldErrors).flat().join(", ") : "Failed to update product");
    }
    setSaving(false);
  };

  const createProduct = async () => {
    if (!createForm.name.trim()) return toast.error("Name is required");
    if (!createForm.price) return toast.error("Price is required");
    if (!mainImgUrl) return toast.error("Please upload a cover photo");
    setCreateSaving(true);
    const body: Record<string, unknown> = {
      name: createForm.name.trim(),
      description: createForm.description.trim() || null,
      price: Number(createForm.price),
      originalPrice: createForm.originalPrice ? Number(createForm.originalPrice) : null,
      image: mainImgUrl,
      images: extraImgs.length ? extraImgs : null,
      categoryId: createForm.categoryId || null,
      stock: Number(createForm.stock),
      isNew: createForm.isNew,
      isBestSeller: createForm.isBestSeller,
      isHandPicked: createForm.isHandPicked,
      isActive: createForm.isActive,
    };
    const r = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await r.json();
    if (d.success) {
      toast.success("Product created");
      closeCreate();
      fetchProducts();
    } else {
      const msg = d.error?.fieldErrors ? Object.values(d.error.fieldErrors).flat().join(", ") : "Failed to create product";
      toast.error(msg);
    }
    setCreateSaving(false);
  };

  const softDelete = async (id: string) => {
    if (!confirm("Deactivate this product?")) return;
    setDeleting(id);
    const r = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const d = await r.json();
    if (d.success) {
      toast.success("Product deactivated");
      fetchProducts();
    } else {
      toast.error("Failed to deactivate");
    }
    setDeleting(null);
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <IconLeaf className="w-6 h-6 text-primary-600" /> Products
        </h1>
        <button
          onClick={() => { setCreateForm(blankForm); setCreating(true); }}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <IconPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-50 max-w-xs">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="text-sm border border-stone-200 rounded-xl py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          className="text-sm border border-stone-200 rounded-xl py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <p className="ml-auto text-xs text-stone-400">{pagination.total} products</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <IconLoader2 className="w-7 h-7 text-primary-500 animate-spin" />
            <p className="text-sm text-stone-400">Loading products…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center">
              <IconPackage className="w-7 h-7 text-stone-300" />
            </div>
            <p className="text-sm font-medium text-stone-500">No products found</p>
            <p className="text-xs text-stone-400">Try adjusting your filters or add a new product</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="px-5 py-3.5 font-semibold text-xs uppercase tracking-wide text-stone-400 text-left">Product</th>
                  <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-stone-400 text-left">Category</th>
                  <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-stone-400 text-left">Pricing</th>
                  <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-stone-400 text-left">Stock</th>
                  <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-stone-400 text-left">Tags</th>
                  <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-stone-400 text-left">Status</th>
                  <th className="px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {products.map((prod) => {
                  const hasDiscount = prod.originalPrice && Number(prod.originalPrice) > Number(prod.price);
                  const discountPct = hasDiscount ? Math.round((1 - Number(prod.price) / Number(prod.originalPrice!)) * 100) : 0;
                  const stockLow = prod.stock > 0 && prod.stock <= 10;
                  const stockOut = prod.stock === 0;
                  return (
                    <tr key={prod.id} className={`hover:bg-stone-50/60 transition-colors group ${!prod.isActive ? "opacity-60" : ""}`}>

                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={prod.image} alt={prod.name}
                              className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-stone-100" />
                            {!prod.isActive && (
                              <div className="absolute inset-0 rounded-xl bg-stone-200/60 flex items-center justify-center">
                                <IconBan className="w-5 h-5 text-stone-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-800 leading-snug line-clamp-1">{prod.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        {prod.category ? (
                          <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-600 text-xs font-medium px-2.5 py-1 rounded-full">
                            <IconTag className="w-3 h-3" />
                            {prod.category.name}
                          </span>
                        ) : (
                          <span className="text-stone-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Pricing */}
                      <td className="px-4 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-stone-800 text-base">₹{Number(prod.price).toLocaleString("en-IN")}</p>
                          {hasDiscount && (
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs text-stone-400 line-through">₹{Number(prod.originalPrice).toLocaleString("en-IN")}</p>
                              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{discountPct}% off</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            {stockOut && <IconAlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                            {stockLow && <IconAlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                            <span className={`font-semibold text-sm ${
                              stockOut ? "text-red-600" : stockLow ? "text-amber-600" : "text-stone-700"
                            }`}>{prod.stock}</span>
                            <span className="text-xs text-stone-400">units</span>
                          </div>
                          <div className="w-20 h-1 bg-stone-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${
                              stockOut ? "bg-red-400" : stockLow ? "bg-amber-400" : "bg-emerald-400"
                            }`} style={{ width: `${Math.min(100, (prod.stock / 200) * 100)}%` }} />
                          </div>
                          {stockOut && <p className="text-xs font-medium text-red-500">Out of stock</p>}
                          {stockLow && <p className="text-xs font-medium text-amber-500">Low stock</p>}
                        </div>
                      </td>

                      {/* Tags */}
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {prod.isNew && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">New</span>
                          )}
                          {prod.isBestSeller && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full">Best Seller</span>
                          )}
                          {prod.isHandPicked && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-pink-50 text-pink-600 border border-pink-100 px-2 py-0.5 rounded-full">Hand Picked</span>
                          )}
                          {!prod.isNew && !prod.isBestSeller && !prod.isHandPicked && (
                            <span className="text-xs text-stone-300">—</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        {prod.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-stone-100 text-stone-500 border border-stone-200 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-stone-400 rounded-full" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(prod)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
                          >
                            <IconPencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => softDelete(prod.id)}
                            disabled={deleting === prod.id || !prod.isActive}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-30"
                          >
                            {deleting === prod.id
                              ? <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                              : <IconBan className="w-3.5 h-3.5" />}
                            {deleting === prod.id ? "…" : "Deactivate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-stone-500">Page {page} of {pagination.totalPages} &middot; {pagination.total} products</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="p-2 rounded-xl border border-stone-200 disabled:opacity-40 hover:bg-stone-50 transition-colors">
              <IconChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pg = page <= 3 ? i + 1 : page + i - 2;
              if (pg < 1 || pg > pagination.totalPages) return null;
              return (
                <button key={pg} onClick={() => setPage(pg)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                    pg === page ? "bg-primary-600 text-white" : "border border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}>
                  {pg}
                </button>
              );
            })}
            <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages} className="p-2 rounded-xl border border-stone-200 disabled:opacity-40 hover:bg-stone-50 transition-colors">
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 shrink-0">
              <div>
                <h2 className="font-bold text-stone-900 text-lg">Add New Product</h2>
                <p className="text-xs text-stone-400 mt-0.5">Fill in the details to list a new plant or product</p>
              </div>
              <button onClick={closeCreate} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-5 min-h-full divide-x divide-stone-100">

                {/* Left — Images */}
                <div className="col-span-2 p-5 space-y-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Images</p>

                  {/* Cover photo */}
                  <div>
                    <p className="text-xs font-medium text-stone-600 mb-2">Cover Photo <span className="text-red-400">*</span></p>
                    <input ref={mainInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) startMainUpload([f]); if (mainInputRef.current) mainInputRef.current.value = ""; }} />
                    {mainImgUrl ? (
                      <div className="relative group rounded-xl overflow-hidden aspect-square border border-stone-200 bg-stone-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={mainImgUrl} alt="cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button type="button" onClick={() => mainInputRef.current?.click()}
                            className="bg-white text-stone-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow hover:bg-stone-50 transition-colors">
                            Change
                          </button>
                          <button type="button" onClick={() => setMainImgUrl("")}
                            className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow hover:bg-red-600 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => mainInputRef.current?.click()}
                        className={`w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all ${
                          mainImgUploading ? "border-primary-300 bg-primary-50/60" : "border-stone-200 bg-stone-50 hover:border-primary-400 hover:bg-primary-50/40"
                        }`}>
                        {mainImgUploading ? (
                          <>
                            <IconLoader2 className="w-8 h-8 text-primary-500 animate-spin" />
                            <span className="text-xs text-primary-500 font-medium">Uploading…</span>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                              <IconUpload className="w-5 h-5 text-stone-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-stone-600">Click to upload</p>
                              <p className="text-xs text-stone-400 mt-0.5">PNG, JPG, WebP · max 4 MB</p>
                            </div>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Extra photos */}
                  <div>
                    <p className="text-xs font-medium text-stone-600 mb-2">Extra Photos <span className="text-stone-400">(up to 4)</span></p>
                    <input ref={extraInputRef} type="file" accept="image/*" multiple className="hidden"
                      onChange={(e) => { const files = Array.from(e.target.files ?? []); if (files.length) startExtraUpload(files.slice(0, 4 - extraImgs.length)); if (extraInputRef.current) extraInputRef.current.value = ""; }} />
                    <div className="grid grid-cols-2 gap-2">
                      {extraImgs.map((url, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`extra-${i}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setExtraImgs(imgs => imgs.filter((_, idx) => idx !== i))}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                            <IconX className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                      {extraImgs.length < 4 && (
                        <button type="button" onClick={() => extraInputRef.current?.click()}
                          className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all ${
                            extraUploading ? "border-primary-300 bg-primary-50/60" : "border-stone-200 bg-stone-50 hover:border-primary-400 hover:bg-primary-50/40"
                          }`}>
                          {extraUploading
                            ? <IconLoader2 className="w-5 h-5 text-primary-500 animate-spin" />
                            : <>
                                <IconPlus className="w-5 h-5 text-stone-400" />
                                <span className="text-xs text-stone-400">Add more</span>
                              </>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right — Form fields */}
                <div className="col-span-3 p-5 space-y-5">

                  {/* Basic Info */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Basic Info</p>
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1.5">Product Name <span className="text-red-400">*</span></label>
                      <input
                        className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50 focus:bg-white transition-colors"
                        placeholder="e.g. Monstera Deliciosa"
                        value={createForm.name}
                        onChange={(e) => setCreateForm(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1.5">Description</label>
                      <textarea
                        className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none bg-stone-50 focus:bg-white transition-colors"
                        rows={3}
                        placeholder="Brief product description…"
                        value={createForm.description}
                        onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="border-t border-stone-100" />

                  {/* Pricing */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Pricing</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-stone-600 block mb-1.5">Selling Price (₹) <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400 font-medium">₹</span>
                          <input type="number" min="0"
                            className="w-full text-sm border border-stone-200 rounded-xl pl-7 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50 focus:bg-white transition-colors"
                            placeholder="299"
                            value={createForm.price}
                            onChange={(e) => setCreateForm(f => ({ ...f, price: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-600 block mb-1.5">Original Price (₹) <span className="text-stone-400">(optional)</span></label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400 font-medium">₹</span>
                          <input type="number" min="0"
                            className="w-full text-sm border border-stone-200 rounded-xl pl-7 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50 focus:bg-white transition-colors"
                            placeholder="399"
                            value={createForm.originalPrice}
                            onChange={(e) => setCreateForm(f => ({ ...f, originalPrice: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-100" />

                  {/* Inventory */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Inventory</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-stone-600 block mb-1.5">Stock Quantity</label>
                        <input type="number" min="0"
                          className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50 focus:bg-white transition-colors"
                          value={createForm.stock}
                          onChange={(e) => setCreateForm(f => ({ ...f, stock: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-600 block mb-1.5">Category</label>
                        <select
                          className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50 focus:bg-white transition-colors"
                          value={createForm.categoryId}
                          onChange={(e) => setCreateForm(f => ({ ...f, categoryId: e.target.value }))}
                        >
                          <option value="">No category</option>
                          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-100" />

                  {/* Tags */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Tags &amp; Visibility</p>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { key: "isActive" as const, label: "Active", desc: "Visible on store" },
                        { key: "isNew" as const, label: "New Arrival", desc: "New arrivals section" },
                        { key: "isBestSeller" as const, label: "Best Seller", desc: "Best sellers section" },
                        { key: "isHandPicked" as const, label: "Hand Picked", desc: "Curated selection" },
                      ]).map(({ key, label, desc }) => (
                        <button type="button" key={key}
                          onClick={() => setCreateForm(f => ({ ...f, [key]: !f[key] }))}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                            createForm[key] ? "border-primary-400 bg-primary-50 shadow-sm" : "border-stone-200 bg-stone-50 hover:border-stone-300"
                          }`}>
                          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            createForm[key] ? "border-primary-600 bg-primary-600" : "border-stone-300"
                          }`}>
                            {createForm[key] && <IconCheck className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <div>
                            <p className={`text-xs font-semibold transition-colors ${createForm[key] ? "text-primary-700" : "text-stone-700"}`}>{label}</p>
                            <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-stone-100 px-6 py-4 flex gap-3 shrink-0 bg-stone-50/60">
              <button onClick={closeCreate} className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors">
                Cancel
              </button>
              <button
                onClick={createProduct}
                disabled={createSaving || mainImgUploading || extraUploading}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {createSaving ? <IconLoader2 className="w-4 h-4 animate-spin" /> : <IconPhoto className="w-4 h-4" />}
                {createSaving ? "Creating…" : "Create Product"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 shrink-0">
              <div>
                <h2 className="font-bold text-stone-900 text-lg">Edit Product</h2>
                <p className="text-xs text-stone-400 mt-0.5 truncate max-w-sm">{editing.slug}</p>
              </div>
              <button onClick={() => setEditing(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-5 min-h-full divide-x divide-stone-100">

                {/* Left — Images */}
                <div className="col-span-2 p-5 space-y-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Images</p>

                  {/* Cover photo */}
                  <div>
                    <p className="text-xs font-medium text-stone-600 mb-2">Cover Photo <span className="text-red-400">*</span></p>
                    <input ref={editMainInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) startEditMainUpload([f]); if (editMainInputRef.current) editMainInputRef.current.value = ""; }} />
                    {editMainImg ? (
                      <div className="relative group rounded-xl overflow-hidden aspect-square border border-stone-200 bg-stone-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={editMainImg} alt="cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button type="button" onClick={() => editMainInputRef.current?.click()}
                            className="bg-white text-stone-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow hover:bg-stone-50 transition-colors">
                            Change
                          </button>
                          <button type="button" onClick={() => setEditMainImg("")}
                            className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow hover:bg-red-600 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => editMainInputRef.current?.click()}
                        className={`w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 transition-all ${
                          editMainUploading ? "border-primary-300 bg-primary-50/60" : "border-stone-200 bg-stone-50 hover:border-primary-400 hover:bg-primary-50/40"
                        }`}>
                        {editMainUploading ? (
                          <>
                            <IconLoader2 className="w-8 h-8 text-primary-500 animate-spin" />
                            <span className="text-xs text-primary-500 font-medium">Uploading…</span>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                              <IconUpload className="w-5 h-5 text-stone-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-stone-600">Click to upload</p>
                              <p className="text-xs text-stone-400 mt-0.5">PNG, JPG, WebP · max 4 MB</p>
                            </div>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Extra photos */}
                  <div>
                    <p className="text-xs font-medium text-stone-600 mb-2">Extra Photos <span className="text-stone-400">(up to 4)</span></p>
                    <input ref={editExtraInputRef} type="file" accept="image/*" multiple className="hidden"
                      onChange={(e) => { const files = Array.from(e.target.files ?? []); if (files.length) startEditExtraUpload(files.slice(0, 4 - editExtraImgs.length)); if (editExtraInputRef.current) editExtraInputRef.current.value = ""; }} />
                    <div className="grid grid-cols-2 gap-2">
                      {editExtraImgs.map((url, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`extra-${i}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setEditExtraImgs(imgs => imgs.filter((_, idx) => idx !== i))}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                            <IconX className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                      {editExtraImgs.length < 4 && (
                        <button type="button" onClick={() => editExtraInputRef.current?.click()}
                          className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all ${
                            editExtraUploading ? "border-primary-300 bg-primary-50/60" : "border-stone-200 bg-stone-50 hover:border-primary-400 hover:bg-primary-50/40"
                          }`}>
                          {editExtraUploading
                            ? <IconLoader2 className="w-5 h-5 text-primary-500 animate-spin" />
                            : <>
                                <IconPlus className="w-5 h-5 text-stone-400" />
                                <span className="text-xs text-stone-400">Add more</span>
                              </>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right — Form fields */}
                <div className="col-span-3 p-5 space-y-5">

                  {/* Basic Info */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Basic Info</p>
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1.5">Product Name <span className="text-red-400">*</span></label>
                      <input
                        className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50 focus:bg-white transition-colors"
                        value={editForm.name}
                        onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-stone-600 block mb-1.5">Description</label>
                      <textarea
                        className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none bg-stone-50 focus:bg-white transition-colors"
                        rows={3}
                        value={editForm.description}
                        onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="border-t border-stone-100" />

                  {/* Pricing */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Pricing</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-stone-600 block mb-1.5">Selling Price (₹) <span className="text-red-400">*</span></label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400 font-medium">₹</span>
                          <input type="number" min="0"
                            className="w-full text-sm border border-stone-200 rounded-xl pl-7 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50 focus:bg-white transition-colors"
                            value={editForm.price}
                            onChange={(e) => setEditForm(f => ({ ...f, price: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-600 block mb-1.5">Original Price (₹) <span className="text-stone-400">(optional)</span></label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400 font-medium">₹</span>
                          <input type="number" min="0"
                            className="w-full text-sm border border-stone-200 rounded-xl pl-7 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50 focus:bg-white transition-colors"
                            value={editForm.originalPrice}
                            onChange={(e) => setEditForm(f => ({ ...f, originalPrice: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-100" />

                  {/* Inventory */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Inventory</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-stone-600 block mb-1.5">Stock Quantity</label>
                        <input type="number" min="0"
                          className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50 focus:bg-white transition-colors"
                          value={editForm.stock}
                          onChange={(e) => setEditForm(f => ({ ...f, stock: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-600 block mb-1.5">Category</label>
                        <select
                          className="w-full text-sm border border-stone-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50 focus:bg-white transition-colors"
                          value={editForm.categoryId}
                          onChange={(e) => setEditForm(f => ({ ...f, categoryId: e.target.value }))}
                        >
                          <option value="">No category</option>
                          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-100" />

                  {/* Tags */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Tags &amp; Visibility</p>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { key: "isActive" as const, label: "Active", desc: "Visible on store" },
                        { key: "isNew" as const, label: "New Arrival", desc: "New arrivals section" },
                        { key: "isBestSeller" as const, label: "Best Seller", desc: "Best sellers section" },
                        { key: "isHandPicked" as const, label: "Hand Picked", desc: "Curated selection" },
                      ]).map(({ key, label, desc }) => (
                        <button type="button" key={key}
                          onClick={() => setEditForm(f => ({ ...f, [key]: !f[key] }))}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                            editForm[key] ? "border-primary-400 bg-primary-50 shadow-sm" : "border-stone-200 bg-stone-50 hover:border-stone-300"
                          }`}>
                          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            editForm[key] ? "border-primary-600 bg-primary-600" : "border-stone-300"
                          }`}>
                            {editForm[key] && <IconCheck className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <div>
                            <p className={`text-xs font-semibold transition-colors ${editForm[key] ? "text-primary-700" : "text-stone-700"}`}>{label}</p>
                            <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-stone-100 px-6 py-4 flex gap-3 shrink-0 bg-stone-50/60">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving || editMainUploading || editExtraUploading}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <IconLoader2 className="w-4 h-4 animate-spin" /> : <IconCheck className="w-4 h-4" />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
