"use client";

import { motion } from "motion/react";
import {
  IconFileText,
  IconShoppingBag,
  IconPackage,
  IconCurrencyRupee,
  IconAlertCircle,
  IconScale,
  IconX,
  IconArrowBack,
  IconTruck,
  IconClock,
  IconMapPin,
  IconPhoto,
  IconVideo,
  IconPhone,
  IconMail,
  IconLeaf,
} from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/util";

/* ─── helpers ───────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── clause card ───────────────────────────────────────── */
function Clause({
  number,
  title,
  icon,
  iconClass,
  lineClass,
  children,
  delay = 0,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
  /** Explicit bg + border + text classes for the icon box */
  iconClass: string;
  /** Color of the vertical connector line */
  lineClass: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <FadeUp delay={delay}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center shrink-0">
          <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${iconClass}`}>
            {icon}
          </div>
          <div className={`w-px flex-1 mt-3 ${lineClass}`} />
        </div>
        <div className="pb-8 flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs font-mono font-semibold text-foreground/35">{number}</span>
            <h3 className="font-mono font-semibold text-base text-foreground">{title}</h3>
          </div>
          <div className="text-sm leading-relaxed text-foreground/65 space-y-2.5">{children}</div>
        </div>
      </div>
    </FadeUp>
  );
}

function BulletList({ items, dotClass = "bg-foreground/30" }: { items: string[]; dotClass?: string }) {
  return (
    <ul className="space-y-1.5 ml-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${dotClass}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ─── section header ────────────────────────────────────── */
function SectionHeader({
  id,
  badge,
  title,
  subtitle,
  colorClass,
}: {
  id: string;
  badge: React.ReactNode;
  title: string;
  subtitle: string;
  colorClass: string;
}) {
  return (
    <div id={id} className={cn("rounded-2xl p-8 mb-10 scroll-mt-24", colorClass)}>
      <FadeUp>
        {badge}
        <h2 className="font-mono text-2xl sm:text-3xl font-bold mt-3 mb-2">{title}</h2>
        <p className="text-sm leading-relaxed opacity-75 max-w-xl">{subtitle}</p>
      </FadeUp>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────── */
export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-linear-to-br from-primary-50 via-primary-100/60 to-primary-50 border-b border-primary-200 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-300 bg-white px-4 py-1.5 text-xs font-medium text-primary-700 mb-6">
              <IconFileText size={14} />
              Legal
            </div>
            <h1 className="font-mono text-4xl sm:text-5xl font-bold mb-4 text-primary-900">
              Terms &amp; Conditions
            </h1>
            <p className="text-primary-700/80 text-base max-w-lg leading-relaxed">
              By using our website or purchasing from Vrukshavalli, you agree to the following terms.
              Please read them carefully before placing an order.
            </p>
            <p className="text-primary-500 text-xs mt-5">Effective date: February 2026</p>
          </FadeUp>

          {/* Quick jump links */}
          <FadeUp delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { href: "#terms", label: "Terms & Conditions" },
                { href: "#cancellation", label: "Cancellation Policy" },
                { href: "#shipping", label: "Shipping Policy" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-primary-300 bg-white hover:bg-primary-50 px-4 py-1.5 text-xs font-medium text-primary-700 transition-colors"
                >
                  {link.label} ↓
                </a>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-16">

          {/* ────────────────────────────────────────────────── */}
          {/* TERMS & CONDITIONS */}
          {/* ────────────────────────────────────────────────── */}
          <div>
            <SectionHeader
              id="terms"
              colorClass="bg-primary-50 border border-primary-200 text-primary-900"
              badge={
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-700/10 border border-primary-300 px-3 py-1 text-xs font-semibold text-primary-700">
                  <IconFileText size={12} />
                  Terms &amp; Conditions
                </div>
              }
              title="Terms & Conditions"
              subtitle="All content, products, and services on this website are governed by the following general terms."
            />

            <div>
              <Clause number="1" title="General" icon={<IconFileText size={17} />}
                iconClass="bg-primary-100 border-primary-200 text-primary-700"
                lineClass="bg-primary-100" delay={0.05}>
                <BulletList dotClass="bg-primary-400"
                  items={[
                    "All content on this website is the property of Vrukshavalli.",
                    "Unauthorized reproduction, distribution, or use of any content is strictly prohibited.",
                    "We reserve the right to modify products, prices, and policies at any time without prior notice.",
                  ]}
                />
              </Clause>

              <Clause number="2" title="Products & Services" icon={<IconLeaf size={17} />}
                iconClass="bg-emerald-100 border-emerald-200 text-emerald-700"
                lineClass="bg-emerald-100" delay={0.1}>
                <BulletList dotClass="bg-emerald-400"
                  items={[
                    "Plant growth and survival depends on proper care, climate, watering, and maintenance after delivery.",
                    "We do not guarantee plant survival after delivery — plants are live organisms sensitive to their environment.",
                    "Product images are for representation purposes; minor variations in size, colour, or appearance are natural.",
                  ]}
                />
              </Clause>

              <Clause number="3" title="Orders" icon={<IconShoppingBag size={17} />}
                iconClass="bg-sky-100 border-sky-200 text-sky-700"
                lineClass="bg-sky-100" delay={0.15}>
                <BulletList dotClass="bg-sky-400"
                  items={[
                    "Orders are confirmed only after full payment is received.",
                    "We reserve the right to cancel any order due to stock unavailability or operational issues.",
                    "You will be notified promptly in case of cancellation and a full refund will be issued.",
                  ]}
                />
              </Clause>

              <Clause number="4" title="Pricing" icon={<IconCurrencyRupee size={17} />}
                iconClass="bg-amber-100 border-amber-200 text-amber-700"
                lineClass="bg-amber-100" delay={0.2}>
                <BulletList dotClass="bg-amber-400"
                  items={[
                    "Prices are subject to change without prior notice.",
                    "GST and applicable taxes will be added at checkout.",
                    "Shipping charges (if any) are calculated and shown clearly before order confirmation.",
                  ]}
                />
              </Clause>

              <Clause number="5" title="Limitation of Liability" icon={<IconAlertCircle size={17} />}
                iconClass="bg-orange-100 border-orange-200 text-orange-700"
                lineClass="bg-orange-100" delay={0.25}>
                <p>Vrukshavalli shall not be liable for:</p>
                <BulletList dotClass="bg-orange-400"
                  items={[
                    "Any indirect, incidental, or consequential damages",
                    "Delivery delays caused by courier or logistics partners",
                    "Plant damage resulting from improper care after delivery",
                  ]}
                />
              </Clause>

              <Clause number="6" title="Governing Law" icon={<IconScale size={17} />}
                iconClass="bg-slate-100 border-slate-200 text-slate-600"
                lineClass="bg-slate-100" delay={0.3}>
                <p>
                  These terms and conditions shall be governed by and construed in accordance with the
                  laws of India. Any disputes shall be subject to the jurisdiction of courts in
                  Ratnagiri, Maharashtra.
                </p>
              </Clause>
            </div>
          </div>

          {/* ────────────────────────────────────────────────── */}
          {/* CANCELLATION POLICY */}
          {/* ────────────────────────────────────────────────── */}
          <div>
            <SectionHeader
              id="cancellation"
              colorClass="bg-rose-50 border border-rose-200 text-rose-900"
              badge={
                <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700">
                  <IconX size={12} />
                  Cancellation Policy
                </div>
              }
              title="Cancellation Policy"
              subtitle="Please read our cancellation terms carefully before placing or modifying your order."
            />

            <div>
              <Clause number="1" title="Order Cancellation" icon={<IconX size={17} />}
                iconClass="bg-rose-100 border-rose-200 text-rose-700"
                lineClass="bg-rose-100" delay={0.05}>
                <BulletList dotClass="bg-rose-400"
                  items={[
                    "Orders can be cancelled within 12 hours of placing the order.",
                    "Once the order has been dispatched, cancellation is not possible.",
                    "Customised landscaping projects and bulk orders are non-cancellable once confirmed.",
                  ]}
                />
              </Clause>

              <Clause number="2" title="Refund on Cancellation" icon={<IconArrowBack size={17} />}
                iconClass="bg-rose-100 border-rose-200 text-rose-700"
                lineClass="bg-rose-100" delay={0.1}>
                <BulletList dotClass="bg-rose-400"
                  items={[
                    "Approved cancellations will be refunded within 5–7 working days.",
                    "Refunds are processed to the original payment method used at checkout.",
                    "We will notify you by email once the refund has been initiated.",
                  ]}
                />
              </Clause>

              <Clause number="3" title="How to Request Cancellation" icon={<IconMail size={17} />}
                iconClass="bg-rose-100 border-rose-200 text-rose-700"
                lineClass="bg-rose-100" delay={0.15}>
                <p>To request a cancellation, reach out to us immediately after placing your order:</p>
                <div className="mt-3 space-y-2.5">
                  <a
                    href="mailto:vrukshavalliratnagiri@gmail.com"
                    className="flex items-center gap-2.5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors w-fit"
                  >
                    <IconMail size={15} />
                    vrukshavalliratnagiri@gmail.com
                  </a>
                  <a
                    href="tel:+917719890777"
                    className="flex items-center gap-2.5 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors w-fit"
                  >
                    <IconPhone size={15} />
                    +91 77198 90777
                  </a>
                </div>
              </Clause>
            </div>
          </div>

          {/* ────────────────────────────────────────────────── */}
          {/* SHIPPING POLICY */}
          {/* ────────────────────────────────────────────────── */}
          <div>
            <SectionHeader
              id="shipping"
              colorClass="bg-sky-50 border border-sky-200 text-sky-900"
              badge={
                <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 border border-sky-300 px-3 py-1 text-xs font-semibold text-sky-700">
                  <IconTruck size={12} />
                  Shipping Policy
                </div>
              }
              title="Shipping Policy"
              subtitle="Everything you need to know about delivery timelines, charges, and plant care during transit."
            />

            <div>
              <Clause number="1" title="Order Processing Time" icon={<IconClock size={17} />}
                iconClass="bg-sky-100 border-sky-200 text-sky-700"
                lineClass="bg-sky-100" delay={0.05}>
                <BulletList dotClass="bg-sky-400"
                  items={[
                    "Orders are processed within 2–4 working days after payment confirmation.",
                    "Custom orders, bulk orders, or landscaping projects may take additional time.",
                    "You will receive a confirmation email once your order is dispatched.",
                  ]}
                />
              </Clause>

              <Clause number="2" title="Shipping Timeline" icon={<IconMapPin size={17} />}
                iconClass="bg-sky-100 border-sky-200 text-sky-700"
                lineClass="bg-sky-100" delay={0.1}>
                <p>Estimated delivery times after dispatch:</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { region: "Maharashtra", time: "3–5 working days" },
                    { region: "Rest of India", time: "5–10 working days" },
                  ].map((row) => (
                    <div
                      key={row.region}
                      className="rounded-xl bg-sky-50 border border-sky-200 px-4 py-3"
                    >
                      <p className="font-semibold text-sky-800 text-sm">{row.region}</p>
                      <p className="text-sky-600 text-sm font-mono mt-0.5">{row.time}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-foreground/45 italic">
                  Delivery times may vary depending on your exact location, courier conditions, weather,
                  or public holidays.
                </p>
              </Clause>

              <Clause number="3" title="Shipping Charges" icon={<IconCurrencyRupee size={17} />}
                iconClass="bg-sky-100 border-sky-200 text-sky-700"
                lineClass="bg-sky-100" delay={0.15}>
                <BulletList dotClass="bg-sky-400"
                  items={[
                    "Delivery is free when your bag subtotal (after any coupon, before GST) is ₹999 or more.",
                    "For bag subtotals below ₹999, a flat ₹129 delivery charge applies and is shown in your bag and at checkout before you pay.",
                  ]}
                />
              </Clause>

              <Clause number="4" title="Delivery of Plants" icon={<IconLeaf size={17} />}
                iconClass="bg-emerald-100 border-emerald-200 text-emerald-700"
                lineClass="bg-emerald-100" delay={0.2}>
                <BulletList dotClass="bg-emerald-400"
                  items={[
                    "Plants are live products and may experience minor transit stress — this is normal and they typically recover quickly.",
                    "Slight variations in size, colour, or leaf count compared to product images are natural and expected.",
                    "Please water your plant and place it in indirect light as soon as you receive it.",
                  ]}
                />
              </Clause>

              <Clause number="5" title="Damaged Package" icon={<IconPackage size={17} />}
                iconClass="bg-orange-100 border-orange-200 text-orange-700"
                lineClass="bg-orange-100" delay={0.25}>
                <p>If you receive a damaged parcel, please follow these steps immediately:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  {[
                    { icon: <IconVideo size={18} />, label: "Record unboxing video", desc: "Before opening fully" },
                    { icon: <IconPhoto size={18} />, label: "Take photos", desc: "Of damage and packaging" },
                    { icon: <IconMail size={18} />, label: "Contact within 24 h", desc: "vrukshavalliratnagiri@gmail.com" },
                  ].map((step) => (
                    <div key={step.label} className="rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 flex gap-3 items-start">
                      <div className="mt-0.5 text-orange-600 shrink-0">{step.icon}</div>
                      <div>
                        <p className="font-semibold text-orange-800 text-sm">{step.label}</p>
                        <p className="text-orange-600 text-xs mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4">Claims made after 24 hours of delivery may not be accepted.</p>
              </Clause>
            </div>
          </div>

          {/* ── Footer CTA ── */}
          <FadeUp delay={0.2}>
            <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-mono font-semibold text-foreground mb-1">Have questions?</p>
                <p className="text-sm text-foreground/60">
                  We&apos;re happy to help with anything related to your order or our policies.
                </p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 rounded-full bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium px-5 py-2.5 transition-colors"
              >
                Contact Us →
              </Link>
            </div>
          </FadeUp>

        </div>
      </section>
    </div>
  );
}
