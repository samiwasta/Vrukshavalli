"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconGift,
  IconX,
  IconUser,
  IconMail,
  IconPhone,
  IconBuilding,
  IconPackage,
  IconMapPin,
  IconCheck,
  IconLeaf,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util";
import { IconChevronDown } from "@tabler/icons-react";

const GIFTING_FEATURES = [
  {
    icon: IconLeaf,
    title: "Hand-Curated Plants",
    description:
      "Every gift is assembled by our plant experts to delight your loved ones.",
  },
  {
    icon: IconPackage,
    title: "Premium Packaging",
    description:
      "Eco-friendly gift boxes with personalised message cards included.",
  },
  {
    icon: IconTruckDelivery,
    title: "Same-Day Delivery",
    description:
      "Express gifting options available for same-day and scheduled delivery.",
  },
];

const GIFT_OPTIONS = [
  { id: "starter", label: "Starter Gift", price: "₹499" },
  { id: "luxe", label: "Luxe Bundle", price: "₹999" },
  { id: "corporate", label: "Corporate Gift", price: "Custom" },
  { id: "custom", label: "Build My Own", price: "Custom" },
];

const MOQ_OPTIONS = [
  "10 – 25 units",
  "26 – 50 units",
  "51 – 100 units",
  "101 – 250 units",
  "251 – 500 units",
  "500+ units",
];

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  moq: string;
  deliveryType: "single" | "multiple" | "";
}

function GiftFormModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    company: "",
    moq: "",
    deliveryType: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Wire up to a real gifting enquiry API endpoint
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    // Backdrop
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 p-4 backdrop-blur-sm sm:items-center sm:justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal panel */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <IconGift size={20} />
            </div>
            <div>
              <h2 className="font-mono text-lg font-semibold">Corporate Gifting / Bulk Order</h2>
              <p className="text-xs text-primary-100">
                Fill in your requirements and we&rsquo;ll get back to you with a quotation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                  <IconCheck size={32} className="text-primary-600" />
                </div>
                <h3 className="font-mono text-xl font-semibold text-zinc-900">
                  Enquiry Submitted!
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Thank you,{" "}
                  <span className="font-medium text-zinc-700">
                    {formData.fullName}
                  </span>
                  ! Our gifting team will contact you at{" "}
                  <span className="font-medium text-zinc-700">
                    {formData.email}
                  </span>{" "}
                  shortly.
                </p>
                <Button onClick={onClose} className="mt-6 rounded-full px-8">
                  Close
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* 1. Full Name */}
                <div className="relative">
                  <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type="text" name="fullName" required placeholder="Full Name"
                    value={formData.fullName} onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>

                {/* 2. Phone Number */}
                <div className="relative">
                  <IconPhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type="tel" name="phone" required placeholder="Phone Number"
                    value={formData.phone} onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>

                {/* 3. Email */}
                <div className="relative">
                  <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type="email" name="email" required placeholder="Email Address"
                    value={formData.email} onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>

                {/* 4. Company Name */}
                <div className="relative">
                  <IconBuilding size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type="text" name="company" required placeholder="Company Name"
                    value={formData.company} onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                </div>

                {/* 5. Minimum Order Quantity */}
                <div className="relative">
                  <IconPackage size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <select name="moq" required value={formData.moq} onChange={handleChange}
                    className={cn(
                      "h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-8 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                      formData.moq === "" ? "text-zinc-400" : "text-zinc-900"
                    )}>
                    <option value="" disabled>Minimum Order Quantity</option>
                    {MOQ_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <IconChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>

                {/* 6. Delivery Locations */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    <IconMapPin size={14} /> Delivery Location
                  </label>
                  <div className="flex gap-3">
                    {(["single", "multiple"] as const).map((type) => (
                      <label key={type}
                        className={cn(
                          "flex flex-1 cursor-pointer items-center gap-2.5 rounded-xl border-2 px-4 py-3 transition-all duration-150",
                          formData.deliveryType === type
                            ? "border-primary-600 bg-primary-50"
                            : "border-zinc-200 hover:border-primary-300"
                        )}>
                        <input type="radio" name="deliveryType" value={type}
                          checked={formData.deliveryType === type}
                          onChange={handleChange} className="accent-primary-600" />
                        <span className="text-sm font-medium text-zinc-900 capitalize">
                          {type === "single" ? "Single Location" : "Multiple Locations"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.moq || !formData.deliveryType}
                  className="h-11 w-full rounded-xl text-sm font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    "Submit Gift Enquiry"
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GiftingPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-50 via-white to-primary-100/40 px-4 py-20 text-center sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mx-auto max-w-2xl"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-600">
            <IconGift size={16} /> Plant Gifting
          </span>
          <h1 className="font-mono text-4xl font-bold leading-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Give the Gift of{" "}
            <span className="text-primary-600">Green</span>
          </h1>
          <p className="mt-5 text-base text-zinc-500 sm:text-lg">
            Send beautifully curated plant gifts for birthdays, anniversaries,
            housewarmings, and corporate occasions — delivered with love.
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            size="lg"
            className="mt-8 rounded-full px-10 text-base shadow-lg shadow-primary-600/20"
          >
            <IconGift size={20} />
            Start Gifting
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {GIFTING_FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-start rounded-2xl border border-primary-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100">
                <feat.icon size={24} className="text-primary-600" />
              </div>
              <h3 className="font-mono font-semibold text-zinc-900">
                {feat.title}
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gift Packages Preview */}
      <section className="bg-primary-50/60 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center font-mono text-2xl font-bold text-zinc-900 sm:text-3xl">
            Popular Gift Options
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GIFT_OPTIONS.map((opt, i) => (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="group cursor-pointer rounded-2xl border-2 border-primary-100 bg-white p-5 text-center transition-all duration-200 hover:border-primary-400 hover:shadow-md"
                onClick={() => setModalOpen(true)}
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 transition-colors group-hover:bg-primary-200">
                  <IconGift size={22} className="text-primary-600" />
                </div>
                <h4 className="font-mono font-semibold text-zinc-900">
                  {opt.label}
                </h4>
                <p className="mt-1 text-sm font-medium text-primary-600">
                  {opt.price}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fixed bottom-right enquiry button ─────────────────────────── */}
      <AnimatePresence>
        {!modalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={() => setModalOpen(true)}
              size="lg"
              className="group flex items-center gap-2 rounded-full pl-5 pr-6 shadow-xl shadow-primary-600/30 hover:shadow-primary-600/40"
            >
              <motion.span
                animate={{ rotate: [0, -12, 12, -8, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.6 }}
              >
                <IconGift size={20} />
              </motion.span>
              <span className="text-sm font-semibold">Gift Enquiry</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && <GiftFormModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
