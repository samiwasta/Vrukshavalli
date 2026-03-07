"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  IconLeaf,
  IconSeedling,
  IconPlant,
  IconBuildingStore,
  IconTruck,
  IconStarFilled,
  IconMapPin,
  IconPhone,
  IconBrandInstagram,
  IconArrowRight,
  IconAward,
  IconHeart,
  IconUsers,
  IconCertificate,
  IconNavigation,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util";

// ── Helpers ───────────────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 mb-4">
      <IconLeaf size={13} className="text-primary-500" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-primary-600">
        {children}
      </span>
    </div>
  );
}

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-mono text-2xl font-bold leading-snug text-zinc-900 sm:text-3xl",
        className
      )}
    >
      {children}
    </h2>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "2017", label: "Founded" },
  { value: "10,000+", label: "Happy customers" },
  { value: "33,000+", label: "Online community" },
  { value: "1993", label: "Nursery legacy since" },
];

const FOUNDERS = [
  {
    name: "Madhuri",
    role: "Co-founder & CEO",
    qual: "B.Tech — Agricultural Engineering",
    bio: "Madhuri left a well-paying corporate career in Mumbai to follow a deeper calling. With a background in agricultural engineering and a passion for sustainable living, she leads Vrikshavalli's vision, operations, and digital presence.",
    tags: ["Agri-tech", "Sustainability", "Rural Empowerment"],
    accent: "border-primary-100 bg-primary-50/40",
    tagAccent: "bg-primary-100 text-primary-700",
    emoji: "🌿",
  },
  {
    name: "Pratik",
    role: "Co-founder & Head Horticulturist",
    qual: "B.Sc — Horticulture",
    bio: "Pratik grew up in a family nursery rooted since 1993. His deep, hands-on knowledge of plants, soil, and seasons is the backbone of every product and service at Vrikshavalli. For him, plants have always been living relationships.",
    tags: ["Horticulture", "Landscaping", "Nursery"],
    accent: "border-emerald-100 bg-emerald-50/40",
    tagAccent: "bg-emerald-100 text-emerald-700",
    emoji: "🌱",
  },
];

const OFFERINGS = [
  {
    icon: IconPlant,
    title: "Plants & Saplings",
    desc: "Indoor, outdoor, rare, and seasonal — hand-picked from our own nursery for health and quality.",
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
    border: "border-primary-100",
    bg: "bg-primary-50/40",
  },
  {
    icon: IconBuildingStore,
    title: "Plant Boutique",
    desc: "Curated ceramics, planters, and décor that complement every green corner of your home.",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    border: "border-amber-100",
    bg: "bg-amber-50/40",
  },
  {
    icon: IconSeedling,
    title: "Garden Services",
    desc: "Landscaping, vertical gardens, terrace gardens, and consultation — end to end.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    border: "border-emerald-100",
    bg: "bg-emerald-50/40",
  },
  {
    icon: IconHeart,
    title: "Gifting",
    desc: "Thoughtful plant gifting collections for every occasion — birthdays, festivals, and corporate events.",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    border: "border-rose-100",
    bg: "bg-rose-50/40",
  },
  {
    icon: IconTruck,
    title: "Pan-India Delivery",
    desc: "Carefully packed and shipped across India — your plants arrive healthy, every time.",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    border: "border-sky-100",
    bg: "bg-sky-50/40",
  },
  {
    icon: IconCertificate,
    title: "Workshops & Training",
    desc: "Hands-on gardening workshops, online sessions, and beginner courses to grow your green confidence.",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    border: "border-violet-100",
    bg: "bg-violet-50/40",
  },
];

const WHY_US = [
  {
    icon: IconAward,
    title: "State-Level Award Winner",
    desc: "Best Start-Up Award at Maharashtra Start Up Yatra 2022 — recognised for impact in the agri-green sector.",
  },
  {
    icon: IconStarFilled,
    title: "Quality You Can Trust",
    desc: "Every plant is nurtured in our own nursery with decades of horticultural expertise behind it.",
  },
  {
    icon: IconUsers,
    title: "Community First",
    desc: "A thriving community of 33,000+ plant lovers across India who share, inspire, and grow together.",
  },
  {
    icon: IconHeart,
    title: "Rooted in Purpose",
    desc: "We don't just sell plants. We restore nature connections, empower rural livelihoods, and inspire sustainable living.",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 py-24 sm:py-32">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />

        <div className="container relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-6 backdrop-blur-sm">
              <IconLeaf size={13} className="text-primary-100" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-100">
                About Us
              </span>
            </div>

            <h1 className="font-mono text-3xl font-bold text-white sm:text-5xl leading-tight">
              We Are Vrikshavalli
            </h1>

            <p className="mt-6 text-base sm:text-lg text-primary-100/85 max-w-2xl mx-auto leading-relaxed">
              India's first-of-its-kind plant boutique from the Konkan coast — built on decades of
              horticultural expertise, a passion for sustainable living, and an unwavering belief
              that every home deserves a touch of green.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/our-story">
                <Button className="rounded-full bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-none">
                  Read Our Story
                  <IconArrowRight size={15} className="ml-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm shadow-none"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-primary-700 py-10">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <p className="font-mono text-3xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-primary-300">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MEET THE FOUNDERS ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <SectionLabel>The People Behind It</SectionLabel>
            <SectionHeading>Meet the Founders</SectionHeading>
            <p className="mt-4 text-zinc-500 max-w-xl mx-auto text-sm leading-7">
              Two graduates, one shared love for plants, and a bold decision to bring nature back
              into Indian homes.
            </p>
          </FadeUp>

          <div className="grid gap-8 sm:grid-cols-2">
            {FOUNDERS.map((f, i) => (
              <FadeUp key={f.name} delay={i * 0.1}>
                <div
                  className={cn(
                    "rounded-3xl border p-8 h-full flex flex-col gap-5",
                    f.accent
                  )}
                >
                  {/* Avatar placeholder */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-zinc-100 shadow-sm text-3xl shrink-0">
                      {f.emoji}
                    </div>
                    <div>
                      <p className="font-mono text-xl font-bold text-zinc-900">{f.name}</p>
                      <p className="text-sm font-semibold text-zinc-500">{f.role}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{f.qual}</p>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-zinc-600">{f.bio}</p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {f.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-bold",
                          f.tagAccent
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWARD CALLOUT ────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-background">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-center gap-5 rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 to-yellow-50 px-8 py-7">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                <span className="text-3xl">🏆</span>
              </div>
              <div className="text-center sm:text-left flex-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-1">
                  Maharashtra Start Up Yatra 2022
                </p>
                <p className="font-mono text-lg font-bold text-zinc-900">
                  Best Start-Up Award — State Level Winner
                </p>
                <p className="mt-1 text-sm text-zinc-500 leading-relaxed">
                  Recognised out of thousands of start-ups across Maharashtra for our impact in the
                  agri-green sector.
                </p>
              </div>
              <Link href="/our-story#achievement" className="shrink-0">
                <Button
                  variant="outline"
                  className="rounded-full border-amber-200 text-amber-700 hover:bg-amber-100 shadow-none text-sm"
                >
                  Learn More
                  <IconArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── WHAT WE OFFER ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <SectionLabel>What We Do</SectionLabel>
            <SectionHeading>Everything Green, Under One Roof</SectionHeading>
            <p className="mt-4 text-zinc-500 max-w-xl mx-auto text-sm leading-7">
              From a single sapling to a full garden transformation — Vrikshavalli is your
              complete plant destination.
            </p>
          </FadeUp>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERINGS.map((o, i) => (
              <FadeUp key={o.title} delay={i * 0.07}>
                <div
                  className={cn(
                    "rounded-2xl border p-5 h-full flex flex-col gap-3",
                    o.border,
                    o.bg
                  )}
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl",
                      o.iconBg
                    )}
                  >
                    <o.icon size={20} className={o.iconColor} />
                  </div>
                  <p className="font-mono text-sm font-bold text-zinc-900">{o.title}</p>
                  <p className="text-xs leading-6 text-zinc-500">{o.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY VRIKSHAVALLI ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-primary-600">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-4">
              <IconStarFilled size={12} className="text-amber-300" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-200">
                Why Us
              </span>
            </div>
            <SectionHeading className="text-white">Why Vrikshavalli?</SectionHeading>
          </FadeUp>

          <div className="grid gap-5 sm:grid-cols-2">
            {WHY_US.map((w, i) => (
              <FadeUp key={w.title} delay={i * 0.08}>
                <div className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-5 h-full">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <w.icon size={20} className="text-primary-100" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold text-white">{w.title}</p>
                    <p className="mt-1.5 text-xs leading-6 text-primary-200/85">{w.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHERE WE ARE ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <SectionLabel>Find Us</SectionLabel>
            <SectionHeading>Where We Are</SectionHeading>
          </FadeUp>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Info cards */}
            <FadeUp className="flex flex-col gap-4">
              {[
                {
                  icon: IconMapPin,
                  label: "Visit Us",
                  value: "Chinmayanand Plaza\nNear Agashe Departmental Stores\nSalvi Stop – Nachane, Link Road\nRatnagiri, Maharashtra 415639",
                  iconBg: "bg-primary-100",
                  iconColor: "text-primary-600",
                  border: "border-primary-100",
                  bg: "bg-primary-50/40",
                  mapsHref: "https://maps.app.goo.gl/e4GabUgLdoUhABPz6?g_st=aw",
                },
                {
                  icon: IconPhone,
                  label: "Call Us",
                  value: "+91 77198 90777",
                  href: "tel:+917719890777",
                  iconBg: "bg-sky-100",
                  iconColor: "text-sky-600",
                  border: "border-sky-100",
                  bg: "bg-sky-50/40",
                },
                {
                  icon: IconBrandInstagram,
                  label: "Follow Us",
                  value: "@vrukshavalli_ratnagiri",
                  href: "https://www.instagram.com/vrukshavalli_ratnagiri?igsh=MndvMzQ2eDljNzN4",
                  iconBg: "bg-rose-100",
                  iconColor: "text-rose-500",
                  border: "border-rose-100",
                  bg: "bg-rose-50/40",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={(item as any).href ?? "#"}
                  target={(item as any).href?.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border p-5 transition-opacity hover:opacity-80",
                    item.border,
                    item.bg
                  )}
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl mt-0.5",
                      item.iconBg
                    )}
                  >
                    <item.icon size={20} className={item.iconColor} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-zinc-800 whitespace-pre-line">
                      {item.value}
                    </p>
                    {(item as any).mapsHref && (
                      <a
                        href={(item as any).mapsHref}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-white px-3 py-1 text-[11px] font-bold text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        <IconNavigation size={12} />
                        Get Directions
                      </a>
                    )}
                  </div>
                </a>
              ))}
            </FadeUp>

            {/* Pan-India reach card */}
            <FadeUp delay={0.12}>
              <div className="rounded-3xl border border-primary-100 bg-primary-50/40 p-8 sm:p-10 h-full flex flex-col justify-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
                  <IconTruck size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-zinc-900">Pan-India Reach</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    While our roots are in Ratnagiri, our plants travel across the country. With
                    carefully packaged shipments and a trusted delivery network, we bring healthy,
                    thriving plants to your doorstep — wherever you are in India.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Maharashtra", "Mumbai", "Pune", "Bengaluru", "Delhi", "+More"].map((city) => (
                    <span
                      key={city}
                      className="rounded-full border border-primary-200 bg-primary-100/60 px-3 py-1 text-[11px] font-bold text-primary-700"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-700 via-primary-600 to-primary-500 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
          <IconPlant size={380} className="text-white" />
        </div>
        <div className="container relative mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <FadeUp>
            <p className="font-mono text-2xl font-extrabold text-white sm:text-3xl">
              Ready to start your green journey?
            </p>
            <p className="mt-3 text-sm text-primary-200 leading-7 max-w-md mx-auto">
              Explore our collection, book a garden service, or just say hello — we'd love to hear
              from you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/">
                <Button className="rounded-full bg-white text-primary-700 hover:bg-primary-50 font-semibold shadow-none">
                  Shop Plants
                  <IconArrowRight size={15} className="ml-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm shadow-none"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}
