"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  IconX,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconSpray,
  IconPlant,
  IconBuildingWarehouse,
  IconTools,
  IconClock,
  IconAward,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

// ── Service definitions ───────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "landscaping",
    label: "Landscaping",
    icon: IconSpray,
    tagline: "Transform your outdoor space",
    description:
      "End-to-end outdoor landscaping — from concept and plant selection to installation and ongoing maintenance. We design gardens that complement your architecture and thrive in your climate.",
    highlights: [
      "Custom garden design & 3D visualisation",
      "Native and exotic plant curation",
      "Irrigation and drainage planning",
      "Hardscaping: pathways, raised beds, rock gardens",
      "Seasonal maintenance contracts available",
    ],
    slides: [
      { src: "/carousel-1.jpg", caption: "Residential Garden, Bengaluru" },
      { src: "/carousel-2.jpg", caption: "Terrace Landscape, Mumbai" },
      { src: "/carousel-3.jpg", caption: "Courtyard Redesign, Pune" },
    ],
    accent: "from-emerald-50 to-green-50",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "vertical-gardening",
    label: "Vertical Gardening",
    icon: IconPlant,
    tagline: "Bring walls to life",
    description:
      "Space-efficient living walls and vertical installations for homes, offices, hotels, and retail. Our modular systems are easy to maintain and make a striking visual statement indoors and out.",
    highlights: [
      "Indoor and outdoor living wall systems",
      "Custom panel sizes and plant mixes",
      "Low-maintenance self-watering modules",
      "Moss walls and preserved plant art",
      "Corporate and hospitality installations",
    ],
    slides: [
      { src: "/feature-1.jpg", caption: "Office Living Wall, Hyderabad" },
      { src: "/feature-2.jpg", caption: "Hotel Lobby Installation, Chennai" },
      { src: "/carousel-2.jpg", caption: "Balcony Vertical Garden, Bengaluru" },
    ],
    accent: "from-lime-50 to-teal-50",
    badge: "bg-lime-100 text-lime-700",
  },
  {
    id: "farm-development",
    label: "Farm Development",
    icon: IconBuildingWarehouse,
    tagline: "Build your dream farm",
    description:
      "Full-service farm setup from a blank plot to a thriving production unit. We handle soil analysis, layout planning, crop selection, water management, and a training programme for your team.",
    highlights: [
      "Soil testing and soil-health improvement",
      "Drip irrigation and rainwater harvesting",
      "Polyhouse / greenhouse construction",
      "Organic and integrated pest management",
      "Staff training and quarterly review visits",
    ],
    slides: [
      { src: "/feature-3.jpeg", caption: "Polyhouse Farm, Karnataka" },
      { src: "/carousel-3.jpg", caption: "Organic Plot, Tamil Nadu" },
      { src: "/feature-1.jpg", caption: "Terrace Farm, Mumbai" },
    ],
    accent: "from-amber-50 to-yellow-50",
    badge: "bg-amber-100 text-amber-700",
  },
] as const;

type ServiceId = "landscaping" | "vertical-gardening" | "farm-development";

const WHY_US = [
  { icon: IconAward, title: "10+ Years Experience", desc: "Over a decade designing and executing green spaces across India." },
  { icon: IconTools, title: "In-House Experts", desc: "Horticulturists, landscape architects, and irrigation engineers on staff." },
  { icon: IconClock, title: "On-Time Delivery", desc: "Project timelines agreed upfront with milestone-based updates." },
  { icon: IconMapPin, title: "Pan-India Service", desc: "Active projects across 12 cities; remote consultation available nationwide." },
];

// ── Image Slider ──────────────────────────────────────────────────────────────

function ServiceSlider({
  slides,
}: {
  slides: readonly { src: string; caption: string }[];
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((p) => (p + 1) % slides.length),
      3500,
    );
    return () => clearInterval(id);
  }, [slides.length]);

  const prev = () => setActive((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setActive((p) => (p + 1) % slides.length);

  return (
    <div className="group relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-md">
      {/* Sliding strip — all slides side-by-side, translate by active index */}
      <motion.div
        className="flex h-full"
        animate={{ x: `-${active * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ width: `${slides.length * 100}%` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="relative h-full"
            style={{ width: `${100 / slides.length}%` }}
          >
            <Image
              src={slide.src}
              alt={slide.caption}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/50 to-transparent" />
            <p className="absolute bottom-3 left-4 text-[11px] font-medium text-white/90">
              {slide.caption}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Nav arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/50"
      >
        <IconChevronLeft size={16} stroke={2} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/50"
      >
        <IconChevronRight size={16} stroke={2} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 right-4 z-10 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-5 bg-white" : "w-1.5 bg-white/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ── Enquiry Modal ─────────────────────────────────────────────────────────────

interface GuestForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}

function EnquiryModal({
  onClose,
  preSelected,
}: {
  onClose: () => void;
  preSelected: ServiceId | null;
}) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);

  const [selectedServices, setSelectedServices] = useState<ServiceId[]>(
    preSelected ? [preSelected] : [],
  );
  const [guestForm, setGuestForm] = useState<GuestForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loggedInPhone, setLoggedInPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    void fetch("/api/profile", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.phone && /^\d{10}$/.test(String(d.data.phone))) {
          setLoggedInPhone(String(d.data.phone));
        }
      })
      .catch(() => {});
  }, [isLoggedIn]);

  const toggleService = (id: ServiceId) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const validate = (): boolean => {
    const errs: Partial<Record<string, string>> = {};
    if (selectedServices.length === 0)
      errs.services = "Please select at least one service.";
    if (!isLoggedIn) {
      if (!guestForm.fullName.trim()) errs.fullName = "Full name is required.";
      if (!guestForm.email.trim()) errs.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestForm.email))
        errs.email = "Enter a valid email address.";
      if (!guestForm.phone.trim()) errs.phone = "Phone number is required.";
      else if (!/^\d{10}$/.test(guestForm.phone.trim()))
        errs.phone = "Enter a valid 10-digit number.";
      if (!guestForm.address.trim()) errs.address = "Address is required.";
    } else {
      if (!loggedInPhone.trim()) errs.phone = "Phone number is required.";
      else if (!/^\d{10}$/.test(loggedInPhone.trim()))
        errs.phone = "Enter a valid 10-digit number.";
      if (!address.trim()) errs.address = "Address is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const fullName = isLoggedIn
      ? (session?.user?.name?.trim() || "Customer")
      : guestForm.fullName.trim();
    const email = isLoggedIn
      ? (session?.user?.email ?? "")
      : guestForm.email.trim();
    const phone = isLoggedIn
      ? loggedInPhone.trim()
      : guestForm.phone.trim();
    const addr = isLoggedIn ? address.trim() : guestForm.address.trim();
    const msg = isLoggedIn ? message.trim() : guestForm.message.trim();

    try {
      const res = await fetch("/api/garden-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          address: addr,
          message: msg || undefined,
          services: selectedServices,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Too many submissions. Please try again later.");
        } else if (data?.errors) {
          toast.error("Please check the form and try again.");
        } else {
          toast.error(data?.error ?? "Something went wrong. Please try again.");
        }
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = isLoggedIn
    ? (session?.user?.name ?? "")
    : guestForm.fullName;

  return (
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
              <IconSpray size={20} />
            </div>
            <div>
              <h2 className="font-mono text-lg font-semibold">
                Garden Services Enquiry
              </h2>
              <p className="text-xs text-primary-100">
                Tell us what you need — we&rsquo;ll get back within 24 hours
              </p>
            </div>
          </div>
          <button
            type="button"
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
                  Thank you
                  {displayName ? (
                    <>
                      ,{" "}
                      <span className="font-medium text-zinc-700">
                        {displayName}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                  ! Our team will reach out within 24 hours to discuss your
                  requirements.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {selectedServices.map((id) => {
                    const s = SERVICES.find((x) => x.id === id)!;
                    return (
                      <span
                        key={id}
                        className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
                      >
                        {s.label}
                      </span>
                    );
                  })}
                </div>
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
                {/* ── Service selection (always shown) ─────────────── */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Services Needed{" "}
                    <span className="text-red-400">*</span>
                    <span className="ml-1 normal-case text-zinc-400">
                      (select all that apply)
                    </span>
                  </label>
                  <div className="space-y-2">
                    {SERVICES.map((s) => {
                      const selected = selectedServices.includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all duration-150",
                            selected
                              ? "border-primary-600 bg-primary-50"
                              : "border-zinc-200 hover:border-primary-300",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="accent-primary-600"
                            checked={selected}
                            onChange={() => toggleService(s.id)}
                          />
                          <s.icon
                            size={17}
                            stroke={1.5}
                            className={
                              selected ? "text-primary-600" : "text-zinc-400"
                            }
                          />
                          <span className="text-sm font-medium text-zinc-900">
                            {s.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.services && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {errors.services}
                    </p>
                  )}
                </div>

                {/* ── Guest fields ────────────────────────────────────── */}
                {!isLoggedIn && (
                  <>
                    {/* Full Name */}
                    <div className="relative">
                      <IconUser
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={guestForm.fullName}
                        onChange={(e) =>
                          setGuestForm((p) => ({
                            ...p,
                            fullName: e.target.value,
                          }))
                        }
                        className={cn(
                          "h-11 w-full rounded-xl border bg-zinc-50 pl-9 pr-4 text-sm placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                          errors.fullName
                            ? "border-red-400"
                            : "border-zinc-200",
                        )}
                      />
                      {errors.fullName && (
                        <p className="mt-0.5 text-[11px] text-red-500">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <IconMail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={guestForm.email}
                        onChange={(e) =>
                          setGuestForm((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        className={cn(
                          "h-11 w-full rounded-xl border bg-zinc-50 pl-9 pr-4 text-sm placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                          errors.email ? "border-red-400" : "border-zinc-200",
                        )}
                      />
                      {errors.email && (
                        <p className="mt-0.5 text-[11px] text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <IconPhone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number (10 digits)"
                        maxLength={10}
                        value={guestForm.phone}
                        onChange={(e) =>
                          setGuestForm((p) => ({
                            ...p,
                            phone: e.target.value,
                          }))
                        }
                        className={cn(
                          "h-11 w-full rounded-xl border bg-zinc-50 pl-9 pr-4 text-sm placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                          errors.phone ? "border-red-400" : "border-zinc-200",
                        )}
                      />
                      {errors.phone && (
                        <p className="mt-0.5 text-[11px] text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* ── Logged-in greeting ──────────────────────────── */}
                {isLoggedIn && (
                  <>
                    <div className="flex items-center gap-2.5 rounded-xl bg-primary-50 px-4 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-200 text-primary-700 text-sm font-bold">
                        {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-800">
                          {session?.user?.name}
                        </p>
                        <p className="text-[11px] text-primary-500">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <IconPhone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number (10 digits)"
                        maxLength={10}
                        value={loggedInPhone}
                        onChange={(e) =>
                          setLoggedInPhone(e.target.value.replace(/\D/g, ""))
                        }
                        className={cn(
                          "h-11 w-full rounded-xl border bg-zinc-50 pl-9 pr-4 text-sm placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                          errors.phone ? "border-red-400" : "border-zinc-200",
                        )}
                      />
                      {errors.phone && (
                        <p className="mt-0.5 text-[11px] text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* ── Address (always shown) ───────────────────────── */}
                <div className="relative">
                  <IconMapPin
                    size={16}
                    className="absolute left-3.5 top-3.5 text-zinc-400"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Site / Project Address"
                    value={isLoggedIn ? address : guestForm.address}
                    onChange={(e) =>
                      isLoggedIn
                        ? setAddress(e.target.value)
                        : setGuestForm((p) => ({
                            ...p,
                            address: e.target.value,
                          }))
                    }
                    className={cn(
                      "w-full resize-none rounded-xl border bg-zinc-50 pb-3 pl-9 pr-4 pt-3 text-sm placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                      errors.address ? "border-red-400" : "border-zinc-200",
                    )}
                  />
                  {errors.address && (
                    <p className="mt-0.5 text-[11px] text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* ── Message (optional) ──────────────────────────── */}
                <textarea
                  rows={3}
                  placeholder="Additional requirements or notes (optional)"
                  value={isLoggedIn ? message : guestForm.message}
                  onChange={(e) =>
                    isLoggedIn
                      ? setMessage(e.target.value)
                      : setGuestForm((p) => ({
                          ...p,
                          message: e.target.value,
                        }))
                  }
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
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
                    "Submit Enquiry"
                  )}
                </Button>

                {!isLoggedIn && (
                  <p className="text-center text-[11px] text-zinc-400">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="font-medium text-primary-600 underline-offset-2 hover:underline"
                    >
                      Sign in
                    </a>{" "}
                    for a pre-filled experience.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GardenServicesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [preSelected, setPreSelected] = useState<ServiceId | null>(null);

  const openModal = (id?: ServiceId) => {
    setPreSelected(id ?? null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-50 via-white to-primary-100/40 px-4 py-20 text-center sm:py-28">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-lime-100/60 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-10 mx-auto max-w-2xl"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-600">
            <IconSpray size={16} /> Professional Garden Services
          </span>
          <h1 className="font-mono text-4xl font-bold leading-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            We Build &amp;{" "}
            <span className="text-primary-600">Maintain</span> Green Spaces
          </h1>
          <p className="mt-5 text-base text-zinc-500 sm:text-lg">
            From lush residential landscapes to commercial vertical gardens and
            full-scale farm development — our experts turn every blank space into
            something extraordinary.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => openModal()}
              className="rounded-full px-10 text-base shadow-lg shadow-primary-600/20"
            >
              <IconSpray size={20} />
              Get a Free Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full px-8 text-base"
            >
              Explore Services
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── Why Us strip ─────────────────────────────────────────────────── */}
      <section className="border-y border-primary-100 bg-primary-50/40 px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-start gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100">
                <item.icon size={20} className="text-primary-600" />
              </div>
              <p className="font-mono text-sm font-semibold text-zinc-900">
                {item.title}
              </p>
              <p className="text-[13px] leading-relaxed text-zinc-500">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Service Sections ─────────────────────────────────────────────── */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="space-y-24">
          {SERVICES.map((service, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2",
                  !isEven && "lg:[&>*:first-child]:order-2",
                )}
              >
                {/* Slider */}
                <ServiceSlider slides={service.slides} />

                {/* Copy */}
                <div>
                  <span
                    className={cn(
                      "mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                      service.badge,
                    )}
                  >
                    <service.icon size={14} stroke={1.5} />
                    {service.label}
                  </span>
                  <h2 className="font-mono text-3xl font-bold text-zinc-900 sm:text-4xl">
                    {service.tagline}
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-zinc-500">
                    {service.description}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {service.highlights.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-zinc-700"
                      >
                        <IconCheck
                          size={16}
                          stroke={2.5}
                          className="mt-0.5 shrink-0 text-primary-600"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => openModal(service.id)}
                    className="mt-8 rounded-full px-8 shadow-md shadow-primary-600/20"
                  >
                    Enquire about {service.label}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────────────── */}
      <section className="bg-primary-600 px-4 py-16 text-center text-white sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="font-mono text-3xl font-bold sm:text-4xl">
            Ready to start your project?
          </h2>
          <p className="mt-4 text-primary-100">
            Share your requirements with us — we&rsquo;ll send a detailed
            proposal within 24 hours, completely free of charge.
          </p>
          <Button
            onClick={() => openModal()}
            size="lg"
            className="mt-8 rounded-full bg-white px-10 text-base text-primary-700 shadow-lg hover:bg-primary-50"
          >
            Request Free Consultation
          </Button>
        </motion.div>
      </section>

      {/* ── Floating enquiry button ───────────────────────────────────────── */}
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
              onClick={() => openModal()}
              size="lg"
              className="group flex items-center gap-2 rounded-full pl-5 pr-6 shadow-xl shadow-primary-600/30 hover:shadow-primary-600/40"
            >
              <motion.span
                animate={{ rotate: [0, -10, 10, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 3.5,
                  duration: 0.5,
                }}
              >
                <IconSpray size={20} />
              </motion.span>
              <span className="text-sm font-semibold">Get Consultation</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <EnquiryModal
            onClose={() => setModalOpen(false)}
            preSelected={preSelected}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
