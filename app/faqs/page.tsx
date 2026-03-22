"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  IconLeaf,
  IconChevronDown,
  IconPlant2,
  IconTruck,
  IconCreditCard,
  IconArrowBack,
  IconPhone,
  IconMail,
  IconSearch,
  IconX,
  IconMessageCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/util";
import { Button } from "@/components/ui/button";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FAQ {
  q: string;
  a: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  iconBg: string;
  iconColor: string;
  faqs: FAQ[];
}

// ── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: "orders",
    label: "Orders & Payments",
    icon: IconCreditCard,
    color: "bg-sky-50 border-sky-200 text-sky-700",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    faqs: [
      {
        q: "How do I place an order?",
        a: "Browse our collection, add items to your bag, proceed to checkout, enter your delivery details, and complete payment. You'll receive an order confirmation email immediately after.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major UPI apps (GPay, PhonePe, Paytm), credit/debit cards, net banking, and Cash on Delivery (COD) for eligible pin codes.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Orders can be modified or cancelled within 12 hours of placement. Please contact us at vrukshavalliratnagiri@gmail.com or call +91 77198 90777 as soon as possible. Once dispatched, cancellations are not possible.",
      },
      {
        q: "Will I get an invoice for my order?",
        a: "Yes — a digital invoice is emailed to you after your order is confirmed. You can also find it under your order history in your account.",
      },
      {
        q: "Is it safe to pay online on your website?",
        a: "Absolutely. We use industry-standard SSL encryption and trusted payment gateways. We never store your card details.",
      },
    ],
  },
  {
    id: "delivery",
    label: "Shipping & Delivery",
    icon: IconTruck,
    color: "bg-amber-50 border-amber-200 text-amber-700",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    faqs: [
      {
        q: "Do you deliver pan-India?",
        a: "Yes, we deliver across India. Delivery availability and timelines may vary by location. Enter your pin code at checkout to confirm serviceability.",
      },
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 4–7 working days depending on your location. Metro cities are typically faster. You'll receive tracking updates via email/SMS.",
      },
      {
        q: "How are plants packaged for shipping?",
        a: "We use specially designed protective packaging with eco-friendly cushioning to ensure your plants travel safely and arrive healthy. Pots and ceramics are bubble-wrapped individually.",
      },
      {
        q: "What are the shipping charges?",
        a: "Shipping is free on orders above ₹999. A flat shipping fee is applied to smaller orders and shown clearly at checkout before payment.",
      },
      {
        q: "My plant arrived damaged — what should I do?",
        a: "We're sorry to hear that! Please take photos of the damaged plant and packaging and email us at vrukshavalliratnagiri@gmail.com within 48 hours of delivery. We'll arrange a replacement or refund promptly.",
      },
    ],
  },
  {
    id: "plants",
    label: "Plants & Products",
    icon: IconPlant2,
    color: "bg-primary-50 border-primary-200 text-primary-700",
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
    faqs: [
      {
        q: "Are your plants healthy and pest-free?",
        a: "Yes. All plants are nurtured in our own nursery in Ratnagiri with decades of horticultural expertise. They are carefully inspected and treated before dispatch.",
      },
      {
        q: "Do you provide care instructions with the plants?",
        a: "Yes, every order includes care cards with watering, light, and soil tips for the specific plants you've ordered. You can also find detailed guides on our website.",
      },
      {
        q: "Can I visit your nursery and shop in person?",
        a: "Yes! Our store is at Chinmayanand Plaza, Near Agashe Departmental Stores, Salvi Stop – Nachane, Link Road, Ratnagiri, Maharashtra 415639. You're welcome to visit us.",
      },
      {
        q: "Do you offer rare or exotic plants?",
        a: "Yes, we regularly stock rare and hard-to-find varieties. Follow us on Instagram for new arrivals, or check our New Arrivals section on the website.",
      },
      {
        q: "Are your pots and planters sold separately?",
        a: "Yes. Our pots, ceramic planters, and décor items are available as standalone products in the Pots & Planters category.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns & Refunds",
    icon: IconArrowBack,
    color: "bg-rose-50 border-rose-200 text-rose-700",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    faqs: [
      {
        q: "What is your return policy?",
        a: "We accept returns on non-perishable items (pots, accessories, tools) within 7 days of delivery if the product is unused and in original condition. Plants are non-returnable unless damaged in transit.",
      },
      {
        q: "How do I initiate a return?",
        a: "Email us at vrukshavalliratnagiri@gmail.com with your order number and reason for return. Our team will guide you through the process within 24 hours.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount is credited back to your original payment method.",
      },
      {
        q: "What if I received the wrong item?",
        a: "We apologise for the inconvenience. Email us with your order number and a photo of the item received. We'll dispatch the correct item or issue a full refund within 2 business days.",
      },
    ],
  },
  {
    id: "services",
    label: "Garden Services",
    icon: IconLeaf,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    faqs: [
      {
        q: "What garden services do you offer?",
        a: "We offer landscaping, vertical gardens, terrace garden design, balcony gardens, indoor garden consultation, and maintenance services. Visit our Garden Services page for full details.",
      },
      {
        q: "Do you take up projects outside Ratnagiri?",
        a: "Yes, we take up projects across Maharashtra and can discuss logistics for other regions. Contact us with your requirements and location for a custom quote.",
      },
      {
        q: "How do I book a consultation or service?",
        a: "Fill in the enquiry form on our Garden Services page or call us at +91 77198 90777. Our team will get back within 24 hours to schedule a site visit.",
      },
      {
        q: "Do you offer maintenance contracts after installation?",
        a: "Yes, we offer seasonal and annual maintenance contracts for gardens we install. Details are discussed during the project planning phase.",
      },
    ],
  },
];

// ── Accordion item ────────────────────────────────────────────────────────────

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-colors duration-200",
        isOpen
          ? "border-primary-200 bg-primary-50/40"
          : "border-zinc-100 bg-white hover:border-zinc-200"
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span
          className={cn(
            "text-sm font-semibold leading-relaxed",
            isOpen ? "text-primary-700" : "text-zinc-800"
          )}
        >
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="shrink-0 mt-0.5"
        >
          <IconChevronDown
            size={17}
            className={isOpen ? "text-primary-500" : "text-zinc-400"}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 pt-3 text-sm leading-7 text-zinc-500 border-t border-primary-100">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const searchQuery = search.trim().toLowerCase();

  const searchResults = searchQuery
    ? CATEGORIES.flatMap((cat) =>
        cat.faqs
          .filter(
            (f) =>
              f.q.toLowerCase().includes(searchQuery) ||
              f.a.toLowerCase().includes(searchQuery)
          )
          .map((f) => ({ ...f, catId: cat.id, catLabel: cat.label }))
      )
    : null;

  const visibleCategories =
    activeCategory === "all"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 py-20 sm:py-28">
        <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-primary-300/20 blur-3xl" />

        <div className="container relative mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-5 backdrop-blur-sm">
              <IconMessageCircle size={13} className="text-primary-100" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-100">
                Help Centre
              </span>
            </div>
            <h1 className="font-mono text-3xl font-bold text-white sm:text-4xl leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-sm text-primary-100/80 max-w-md mx-auto leading-relaxed">
              Find answers about ordering, delivery, plants, returns, and more.
            </p>

            {/* Search bar */}
            <div className="mt-7 relative max-w-md mx-auto">
              <IconSearch
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions…"
                className="w-full rounded-full border-0 bg-white py-3 pl-10 pr-10 text-sm text-zinc-800 placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <IconX size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">

          {/* ── Search results ── */}
          {searchResults ? (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-zinc-400 mb-5">
                {searchResults.length === 0
                  ? `No results for "${search}"`
                  : `${searchResults.length} result${searchResults.length > 1 ? "s" : ""} for "${search}"`}
              </p>
              {searchResults.length > 0 && (
                <div className="flex flex-col gap-3">
                  {searchResults.map((f, i) => {
                    const cat = CATEGORIES.find((c) => c.id === f.catId)!;
                    return (
                      <div key={i}>
                        {(i === 0 || searchResults[i - 1].catId !== f.catId) && (
                          <div
                            className={cn(
                              "mb-3 mt-4 first:mt-0 inline-flex items-center gap-2 rounded-full border px-3 py-1",
                              cat.color
                            )}
                          >
                            <cat.icon size={12} />
                            <span className="text-[11px] font-bold">{cat.label}</span>
                          </div>
                        )}
                        <AccordionItem
                          faq={f}
                          isOpen={openId === `s-${i}`}
                          onToggle={() => setOpenId(openId === `s-${i}` ? null : `s-${i}`)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            /* ── Browse by category ── */
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* Filter chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => { setActiveCategory("all"); setOpenId(null); }}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-bold transition-all",
                    activeCategory === "all"
                      ? "bg-primary-600 border-primary-600 text-white"
                      : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
                  )}
                >
                  All Topics
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setOpenId(null); }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold transition-all",
                      activeCategory === cat.id
                        ? cn("border-transparent", cat.color)
                        : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300"
                    )}
                  >
                    <cat.icon size={12} />
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* FAQ sections */}
              <div className="flex flex-col gap-10">
                <AnimatePresence mode="popLayout">
                  {visibleCategories.map((cat) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28 }}
                    >
                      {/* Section header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            cat.iconBg
                          )}
                        >
                          <cat.icon size={18} className={cat.iconColor} />
                        </div>
                        <h2 className="font-mono text-base font-bold text-zinc-900">
                          {cat.label}
                        </h2>
                        <span className="ml-auto rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-bold text-zinc-400">
                          {cat.faqs.length}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {cat.faqs.map((faq, i) => {
                          const id = `${cat.id}-${i}`;
                          return (
                            <AccordionItem
                              key={id}
                              faq={faq}
                              isOpen={openId === id}
                              onToggle={() => setOpenId(openId === id ? null : id)}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── STILL NEED HELP ──────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-primary-100 bg-primary-50/50 p-8 sm:p-10"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-100">
                <IconMessageCircle size={24} className="text-primary-600" />
              </div>
              <div>
                <h2 className="font-mono text-lg font-bold text-zinc-900">
                  Can&apos;t find your answer?
                </h2>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Our team is happy to help — reach out and we&apos;ll get back to you quickly.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="tel:+917719890777">
                <Button
                  variant="outline"
                  className="rounded-full border-primary-200 text-primary-700 hover:bg-primary-100 shadow-none"
                >
                  <IconPhone size={14} className="mr-2" />
                  +91 77198 90777
                </Button>
              </a>
              <a href="mailto:vrukshavalliratnagiri@gmail.com">
                <Button className="rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-none">
                  <IconMail size={14} className="mr-2" />
                  Email Us
                </Button>
              </a>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="rounded-full border-zinc-200 text-zinc-600 hover:bg-zinc-50 shadow-none"
                >
                  Contact Form
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
