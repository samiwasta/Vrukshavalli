"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconPlus,
  IconTrash,
  IconEdit,
  IconCheck,
  IconX,
  IconHome,
  IconBriefcase,
  IconLoader2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

// ── Types ────────────────────────────────────────────────────────────────────

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

interface Address {
  id: string;
  alias?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressFormValues {
  recipientType: "self" | "other";
  fullName: string;
  phone: string;
  alias?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

const emptyAddress = (): AddressFormValues => ({
  recipientType: "self",
  fullName: "",
  phone: "",
  alias: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl border-2 border-primary-200 bg-white px-4 py-2.5 text-sm text-primary-800 outline-none placeholder:text-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all disabled:bg-primary-50 disabled:text-primary-400";

const labelClass = "mb-1.5 block text-xs font-semibold text-primary-600 uppercase tracking-wider";

function AliasIcon({ alias }: { alias?: string }) {
  const lower = alias?.toLowerCase() ?? "";
  if (lower === "home") return <IconHome size={14} />;
  if (lower === "work") return <IconBriefcase size={14} />;
  return <IconMapPin size={14} />;
}

interface AddressFormFieldsProps {
  values: AddressFormValues;
  onChange: (field: string, value: string) => void;
  includeRecipientSelector?: boolean;
}

function AddressFormFields({
  values,
  onChange,
  includeRecipientSelector = false,
}: AddressFormFieldsProps) {
  const isHome = values.alias === "Home";
  const isWork = values.alias === "Work";
  const isOther = !isHome && !isWork;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Alias */}
      <div className="sm:col-span-2">
        <label className={labelClass}>Address Label</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {["Home", "Work", "Other"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (opt === "Home") onChange("alias", "Home");
                if (opt === "Work") onChange("alias", "Work");
                if (opt === "Other" && (isHome || isWork)) onChange("alias", "");
              }}
              className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-all ${
                (opt === "Home" && isHome) ||
                (opt === "Work" && isWork) ||
                (opt === "Other" && isOther)
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-primary-200 text-primary-600 hover:border-primary-400"
              }`}
            >
              {opt === "Home" && <IconHome size={12} />}
              {opt === "Work" && <IconBriefcase size={12} />}
              {opt === "Other" && <IconMapPin size={12} />}
              {opt}
            </button>
          ))}
        </div>
        {isOther && (
          <input
            type="text"
            placeholder="Type custom label (e.g. Parents, Office 2)"
            value={values.alias ?? ""}
            onChange={(e) => onChange("alias", e.target.value)}
            className={inputClass}
          />
        )}
      </div>

      {includeRecipientSelector && (
        <>
          <div className="sm:col-span-2">
            <label className={labelClass}>Who is this address for?</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onChange("recipientType", "self")}
                className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-all ${
                  values.recipientType === "self"
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-primary-200 text-primary-600 hover:border-primary-400"
                }`}
              >
                Self
              </button>
              <button
                type="button"
                onClick={() => onChange("recipientType", "other")}
                className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-all ${
                  values.recipientType === "other"
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-primary-200 text-primary-600 hover:border-primary-400"
                }`}
              >
                Other
              </button>
            </div>
          </div>

          {values.recipientType === "other" && (
            <>
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="Recipient name"
                  value={values.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  required
                  type="tel"
                  placeholder="10-digit number"
                  maxLength={10}
                  pattern="\d{10}"
                  value={values.phone}
                  onChange={(e) => onChange("phone", e.target.value.replace(/\D/g, ""))}
                  className={inputClass}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* Address Line 1 */}
      <div className="sm:col-span-2">
        <label className={labelClass}>Address</label>
        <input
          required
          type="text"
          placeholder="House no., Building, Street"
          value={values.line1}
          onChange={(e) => onChange("line1", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Landmark */}
      <div className="sm:col-span-2">
        <label className={labelClass}>Landmark <span className="text-primary-400 normal-case font-normal">(optional)</span></label>
        <input
          type="text"
          placeholder="Near metro station, opposite park…"
          value={values.line2 ?? ""}
          onChange={(e) => onChange("line2", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Pincode */}
      <div>
        <label className={labelClass}>Pincode</label>
        <input
          required
          type="text"
          placeholder="6-digit pincode"
          maxLength={6}
          pattern="\d{6}"
          value={values.pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            onChange("pincode", val);
          }}
          className={inputClass}
        />
      </div>

      {/* City */}
      <div>
        <label className={labelClass}>City / District</label>
        <input
          required
          type="text"
          placeholder="Auto-filled from pincode"
          value={values.city}
          onChange={(e) => onChange("city", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* State */}
      <div className="sm:col-span-2">
        <label className={labelClass}>State</label>
        <input
          required
          type="text"
          placeholder="Auto-filled from pincode"
          value={values.state}
          onChange={(e) => onChange("state", e.target.value)}
          className={inputClass}
        />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  // Profile
  const [profile, setProfile] = useState<ProfileData>({ name: "", email: "", phone: "" });
  const [editProfile, setEditProfile] = useState<ProfileData>({ name: "", email: "", phone: "" });
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState(emptyAddress());
  const [editAddress, setEditAddress] = useState<AddressFormValues>(emptyAddress());
  const [, setPincodeLoading] = useState(false);
  const [, setEditPincodeLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [defaultingId, setDefaultingId] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  // ── Redirect if not logged in ─────────────────────────────────────────────
  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.replace("/login");
    }
  }, [session, sessionLoading, router]);

  // ── Load profile ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const data = {
            name: json.data.name ?? "",
            email: json.data.email ?? "",
            phone: json.data.phone ?? "",
          };
          setProfile(data);
          setEditProfile(data);
        }
      })
      .finally(() => setProfileLoading(false));
  }, [session]);

  // ── Load addresses ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setAddresses(json.data);
      })
      .finally(() => setAddressesLoading(false));
  }, [session]);

  // ── Pincode lookup ────────────────────────────────────────────────────────
  async function lookupPincode(
    pincode: string,
    setter: (city: string, state: string) => void,
    setLoading: (v: boolean) => void
  ) {
    if (pincode.length !== 6) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        setter(po.District ?? po.Name ?? "", po.State ?? "");
      } else {
        toast.error("Invalid pincode. Please check and try again.");
      }
    } catch {
      toast.error("Could not fetch pincode details.");
    } finally {
      setLoading(false);
    }
  }

  // ── Save profile ──────────────────────────────────────────────────────────
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editProfile.name, phone: editProfile.phone || undefined }),
      });
      const json = await res.json();
      if (json.success) {
        setProfile(editProfile);
        setProfileEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setProfileSaving(false);
    }
  }

  // ── Add address ───────────────────────────────────────────────────────────
  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    const isSelf = newAddress.recipientType === "self";
    if (isSelf && (!profile.name || !profile.phone || profile.phone.length !== 10)) {
      toast.error("Please update your profile name and 10-digit phone number first.");
      return;
    }
    if (!isSelf && (!newAddress.fullName || newAddress.phone.length !== 10)) {
      toast.error("Please enter recipient full name and 10-digit phone number.");
      return;
    }
    setSavingAddress(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: isSelf ? profile.name : newAddress.fullName,
          phone: isSelf ? profile.phone : newAddress.phone,
          line1: newAddress.line1,
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode,
          alias: newAddress.alias || undefined,
          line2: newAddress.line2 || undefined,
          isDefault: addresses.length === 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAddresses((prev) => [...prev, json.data]);
        setNewAddress(emptyAddress());
        setShowAddForm(false);
        toast.success("Address added!");
      } else {
        toast.error("Failed to add address.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSavingAddress(false);
    }
  }

  // ── Edit address ──────────────────────────────────────────────────────────
  function startEdit(addr: Address) {
    setEditingId(addr.id);
    setEditAddress({
      recipientType:
        addr.fullName === profile.name && addr.phone === profile.phone
          ? "self"
          : "other",
      fullName: addr.fullName,
      phone: addr.phone,
      alias: addr.alias ?? "",
      line1: addr.line1,
      line2: addr.line2 ?? "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    if (!profile.name || !profile.phone || profile.phone.length !== 10) {
      toast.error("Please update your profile name and 10-digit phone number first.");
      return;
    }
    setSavingAddress(true);
    try {
      const res = await fetch(`/api/addresses/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile.name,
          phone: profile.phone,
          line1: editAddress.line1,
          city: editAddress.city,
          state: editAddress.state,
          pincode: editAddress.pincode,
          alias: editAddress.alias || undefined,
          line2: editAddress.line2 || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingId ? json.data : a))
        );
        setEditingId(null);
        toast.success("Address updated!");
      } else {
        toast.error("Failed to update address.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSavingAddress(false);
    }
  }

  // ── Delete address ────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast.success("Address removed.");
      } else {
        toast.error("Failed to delete address.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(addr: Address) {
    setDefaultingId(addr.id);
    try {
      const res = await fetch(`/api/addresses/${addr.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: addr.fullName,
          phone: addr.phone,
          line1: addr.line1,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          alias: addr.alias || undefined,
          line2: addr.line2 || undefined,
          isDefault: true,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAddresses((prev) =>
          prev.map((a) => ({
            ...a,
            isDefault: a.id === addr.id,
          }))
        );
        toast.success("Default address updated.");
      } else {
        toast.error("Failed to set default address.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDefaultingId(null);
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (sessionLoading || profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <IconLoader2 size={32} className="animate-spin text-primary-500" />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-linear-to-b from-primary-50/40 to-white py-10 px-4">
      <div className="container mx-auto max-w-3xl space-y-8">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="font-mono text-3xl font-semibold text-primary-800">My Profile</h1>
          <p className="mt-1 text-sm text-primary-500">Manage your personal details and saved addresses.</p>
        </motion.div>

        {/* ── Personal Details ─────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-2xl border border-primary-200/80 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <IconUser size={20} stroke={1.5} />
              </div>
              <h2 className="font-mono text-xl font-semibold text-primary-700">Personal Details</h2>
            </div>
            {!profileEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-2 border-primary-300 text-primary-600 hover:bg-primary-50"
                onClick={() => { setEditProfile(profile); setProfileEditing(true); }}
              >
                <IconEdit size={15} />
                Edit
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
          {!profileEditing ? (
            /* ── Read-only view ── */
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {[
                { icon: <IconUser size={16} stroke={1.5} />, label: "Full Name", value: profile.name || "—" },
                { icon: <IconMail size={16} stroke={1.5} />, label: "Email", value: profile.email || "—" },
                { icon: <IconPhone size={16} stroke={1.5} />, label: "Phone Number", value: profile.phone || "Not added" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 rounded-xl border border-primary-100 bg-primary-50/40 px-4 py-3">
                  <span className="text-primary-400">{icon}</span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-400">{label}</p>
                    <p className="text-sm font-medium text-primary-800">{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            /* ── Edit form ── */
            <motion.form
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSaveProfile}
              className="space-y-4"
            >
            {/* Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400" stroke={1.5} />
                <input
                  required
                  type="text"
                  value={editProfile.name}
                  onChange={(e) => setEditProfile((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Email – read only */}
            <div>
              <label className={labelClass}>Email <span className="text-primary-400 normal-case font-normal">(cannot be changed)</span></label>
              <div className="relative">
                <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-300" stroke={1.5} />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <IconPhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400" stroke={1.5} />
                <input
                  type="tel"
                  maxLength={10}
                  pattern="\d{10}"
                  value={editProfile.phone}
                  onChange={(e) => setEditProfile((p) => ({ ...p, phone: e.target.value.replace(/\D/g, "") }))}
                  placeholder="10-digit mobile number"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                disabled={profileSaving}
                className="rounded-xl bg-primary-600 px-6 font-semibold text-white hover:bg-primary-700"
              >
                {profileSaving ? (
                  <span className="flex items-center gap-2"><IconLoader2 size={15} className="animate-spin" /> Saving…</span>
                ) : (
                  <span className="flex items-center gap-2"><IconCheck size={15} /> Save Changes</span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={profileSaving}
                onClick={() => { setProfileEditing(false); setEditProfile(profile); }}
                className="rounded-xl border-2 px-5 font-semibold"
              >
                <span className="flex items-center gap-2"><IconX size={15} /> Cancel</span>
              </Button>
            </div>
            </motion.form>
          )}
          </AnimatePresence>
        </motion.section>

        {/* ── Addresses ────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl border border-primary-200/80 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <IconMapPin size={20} stroke={1.5} />
              </div>
              <h2 className="font-mono text-xl font-semibold text-primary-700">Saved Addresses</h2>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full border-2 border-primary-300 text-primary-600 hover:bg-primary-50"
              onClick={() => { setShowAddForm(true); setEditingId(null); }}
            >
              <IconPlus size={15} />
              Add Address
            </Button>
          </div>

          {/* Existing addresses */}
          {addressesLoading ? (
            <div className="flex justify-center py-8">
              <IconLoader2 size={24} className="animate-spin text-primary-400" />
            </div>
          ) : addresses.length === 0 && !showAddForm ? (
            <div className="flex flex-col items-center gap-2 py-10 text-primary-400">
              <IconMapPin size={32} stroke={1.5} />
              <p className="text-sm font-medium">No addresses saved yet</p>
              <p className="text-xs text-primary-300">Add one to speed up checkout</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {addresses.map((addr) => (
                  <motion.div
                    key={addr.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl border-2 border-primary-100 bg-primary-50/50 p-4"
                  >
                    {editingId === addr.id ? (
                      /* ── Edit form ── */
                      <form onSubmit={handleSaveEdit} className="space-y-4">
                        <AddressFormFields
                          values={editAddress}
                          onChange={(field, val) => {
                            setEditAddress((prev) => ({ ...prev, [field]: val }));
                            if (field === "pincode" && val.length === 6) {
                              lookupPincode(
                                val,
                                (city, state) =>
                                  setEditAddress((prev) => ({ ...prev, city, state })),
                                setEditPincodeLoading
                              );
                            }
                          }}
                        />
                        <div className="flex gap-2 pt-1">
                          <Button
                            type="submit"
                            disabled={savingAddress}
                            size="sm"
                            className="rounded-xl bg-primary-600 text-white hover:bg-primary-700"
                          >
                            {savingAddress ? (
                              <IconLoader2 size={14} className="animate-spin" />
                            ) : (
                              <><IconCheck size={14} /> Save</>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-2"
                            onClick={() => setEditingId(null)}
                          >
                            <IconX size={14} /> Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      /* ── Address card ── */
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            <AliasIcon alias={addr.alias} />
                          </div>
                          <div>
                            {addr.alias && (
                              <span className="mb-1 inline-block rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-semibold text-primary-600 uppercase tracking-wider">
                                {addr.alias}
                              </span>
                            )}
                            {addr.isDefault && (
                              <span className="mb-1 ml-1.5 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700 uppercase tracking-wider">
                                Default
                              </span>
                            )}
                            <p className="text-sm font-semibold text-primary-800">{addr.fullName}</p>
                            <p className="text-xs text-primary-500">{addr.phone}</p>
                            <p className="mt-1 text-sm text-primary-700 leading-relaxed">
                              {addr.line1}
                              {addr.line2 && `, ${addr.line2}`}
                              <br />
                              {addr.city}, {addr.state} – {addr.pincode}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-start gap-1">
                          {!addr.isDefault && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={defaultingId === addr.id}
                              onClick={() => handleSetDefault(addr)}
                              className="h-8 rounded-full border-primary-200 px-3 text-xs text-primary-600 hover:bg-primary-50"
                            >
                              {defaultingId === addr.id ? (
                                <IconLoader2 size={13} className="animate-spin" />
                              ) : (
                                "Set Default"
                              )}
                            </Button>
                          )}
                          <button
                            type="button"
                            onClick={() => startEdit(addr)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-700"
                            aria-label="Edit address"
                          >
                            <IconEdit size={15} stroke={1.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(addr.id)}
                            disabled={deletingId === addr.id}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                            aria-label="Delete address"
                          >
                            {deletingId === addr.id ? (
                              <IconLoader2 size={15} className="animate-spin" />
                            ) : (
                              <IconTrash size={15} stroke={1.5} />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Add new address form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-xl border-2 border-dashed border-primary-300 bg-primary-50/30 p-5">
                  <h3 className="mb-4 font-mono text-sm font-semibold text-primary-700">New Address</h3>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <AddressFormFields
                      values={newAddress}
                      includeRecipientSelector
                      onChange={(field, val) => {
                        setNewAddress((prev) => ({ ...prev, [field]: val }));
                        if (field === "pincode" && val.length === 6) {
                          lookupPincode(
                            val,
                            (city, state) =>
                              setNewAddress((prev) => ({ ...prev, city, state })),
                            setPincodeLoading
                          );
                        }
                      }}
                    />
                    <div className="flex gap-2 pt-1">
                      <Button
                        type="submit"
                        disabled={savingAddress}
                        size="sm"
                        className="rounded-xl bg-primary-600 text-white hover:bg-primary-700"
                      >
                        {savingAddress ? (
                          <IconLoader2 size={14} className="animate-spin" />
                        ) : (
                          <><IconPlus size={14} /> Add Address</>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-2"
                        onClick={() => { setShowAddForm(false); setNewAddress(emptyAddress()); }}
                      >
                        <IconX size={14} /> Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

      </div>
    </div>
  );
}
