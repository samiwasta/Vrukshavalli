"use client";

import { motion } from "motion/react";
import {
  IconShieldLock,
  IconUserCheck,
  IconShare,
  IconLock,
  IconCookie,
  IconAdjustments,
  IconRefresh,
  IconInfoCircle,
} from "@tabler/icons-react";
import Link from "next/link";

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
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── section block ─────────────────────────────────────── */
interface Section {
  number: string;
  title: string;
  icon: React.ReactNode;
  /** Classes for the icon box  e.g. "bg-sky-100 border-sky-200 text-sky-700" */
  iconClass: string;
  /** Classes for the vertical connector line */
  lineClass: string;
  /** Subtle left-border accent on the content area */
  borderClass: string;
  content: React.ReactNode;
}

function PolicySection({ section, delay }: { section: Section; delay: number }) {
  return (
    <FadeUp delay={delay}>
      <div className="flex gap-5">
        {/* icon + connector */}
        <div className="flex flex-col items-center pt-1 shrink-0">
          <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${section.iconClass}`}>
            {section.icon}
          </div>
          <div className={`w-px flex-1 mt-3 ${section.lineClass}`} />
        </div>

        {/* content */}
        <div className={`pb-10 flex-1 min-w-0 pl-4 border-l-2 ${section.borderClass}`}>
          <div className="flex items-baseline gap-2.5 mb-3">
            <span className="text-xs font-mono text-foreground/35 font-semibold">{section.number}</span>
            <h2 className="font-mono text-lg font-semibold text-foreground">{section.title}</h2>
          </div>
          <div className="text-foreground/65 text-sm leading-relaxed space-y-3">
            {section.content}
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

/* ─── bullet list helper ─────────────────────────────────── */
function Dot({ color }: { color: string }) {
  return <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${color}`} />;
}

/* ─── data ───────────────────────────────────────────────── */
const sections: Section[] = [
  {
    number: "01",
    title: "Information We Collect",
    icon: <IconUserCheck size={20} />,
    iconClass: "bg-sky-100 border-sky-200 text-sky-700",
    lineClass: "bg-sky-100",
    borderClass: "border-sky-100",
    content: (
      <>
        <p className="font-medium text-foreground/80">Personal Information</p>
        <ul className="space-y-1.5 ml-2">
          {[
            "Full name",
            "Phone number",
            "Email address",
            "Shipping and billing address",
            "Payment details (processed via secure third-party gateways — we never store raw card data)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Dot color="bg-sky-400" />
              {item}
            </li>
          ))}
        </ul>
        <p className="font-medium text-foreground/80 mt-4">Non-Personal Information</p>
        <ul className="space-y-1.5 ml-2">
          {["Browser type", "IP address", "Pages visited", "Device information"].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Dot color="bg-sky-300" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: "02",
    title: "How We Use Your Information",
    icon: <IconInfoCircle size={20} />,
    iconClass: "bg-emerald-100 border-emerald-200 text-emerald-700",
    lineClass: "bg-emerald-100",
    borderClass: "border-emerald-100",
    content: (
      <ul className="space-y-1.5 ml-2">
        {[
          "Process orders and payments",
          "Deliver products and services to your address",
          "Improve customer experience and our website",
          "Send order updates and promotional messages (with your consent)",
          "Respond to customer queries and support requests",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Dot color="bg-emerald-400" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    number: "03",
    title: "Sharing of Information",
    icon: <IconShare size={20} />,
    iconClass: "bg-violet-100 border-violet-200 text-violet-700",
    lineClass: "bg-violet-100",
    borderClass: "border-violet-100",
    content: (
      <>
        <p>We do <strong className="text-foreground/80">not</strong> sell your personal data.</p>
        <p>We may share information only with:</p>
        <ul className="space-y-1.5 ml-2">
          {[
            "Payment gateway providers (for secure transaction processing)",
            "Shipping and logistics partners (for order fulfilment)",
            "Legal authorities (if required by applicable law)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Dot color="bg-violet-400" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: "04",
    title: "Data Security",
    icon: <IconLock size={20} />,
    iconClass: "bg-amber-100 border-amber-200 text-amber-700",
    lineClass: "bg-amber-100",
    borderClass: "border-amber-100",
    content: (
      <p>
        We implement reasonable security measures — including SSL encryption — to protect your
        information from unauthorised access, disclosure, or misuse. However, no online transmission
        or storage system is 100% secure, and we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    number: "05",
    title: "Cookies",
    icon: <IconCookie size={20} />,
    iconClass: "bg-orange-100 border-orange-200 text-orange-700",
    lineClass: "bg-orange-100",
    borderClass: "border-orange-100",
    content: (
      <>
        <p>
          Our website may use cookies to improve your browsing experience, remember preferences, and
          analyse traffic patterns.
        </p>
        <p>
          You can disable cookies at any time through your browser settings. Note that disabling
          cookies may affect certain features of the website.
        </p>
      </>
    ),
  },
  {
    number: "06",
    title: "Your Rights",
    icon: <IconAdjustments size={20} />,
    iconClass: "bg-primary-100 border-primary-200 text-primary-700",
    lineClass: "bg-primary-100",
    borderClass: "border-primary-100",
    content: (
      <>
        <p>You may, at any time:</p>
        <ul className="space-y-1.5 ml-2">
          {[
            "Request access to the personal data we hold about you",
            "Request correction of inaccurate or incomplete data",
            "Request deletion of your data",
            "Opt out of marketing and promotional communications",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Dot color="bg-primary-400" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-primary-50 border border-primary-200 px-4 py-2.5 text-sm text-primary-700">
          <span className="font-medium">To exercise any right, contact us at</span>
          <a
            href="mailto:vrukshavalliratnagiri@gmail.com"
            className="font-semibold underline underline-offset-2 hover:text-primary-900 transition-colors"
          >
            vrukshavalliratnagiri@gmail.com
          </a>
        </div>
      </>
    ),
  },
  {
    number: "07",
    title: "Updates to This Policy",
    icon: <IconRefresh size={20} />,
    iconClass: "bg-slate-100 border-slate-200 text-slate-600",
    lineClass: "bg-slate-100",
    borderClass: "border-slate-100",
    content: (
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our practices or
        for legal, operational, or regulatory reasons. Any changes will be posted on this page with
        an updated effective date. We encourage you to review this page periodically.
      </p>
    ),
  },
];

/* ─── page ───────────────────────────────────────────────── */
export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-linear-to-br from-primary-50 via-primary-100/60 to-primary-50 border-b border-primary-200 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-300 bg-white px-4 py-1.5 text-xs font-medium text-primary-700 mb-6">
              <IconShieldLock size={14} />
              Legal
            </div>
            <h1 className="font-mono text-4xl sm:text-5xl font-bold mb-4 text-primary-900">Privacy Policy</h1>
            <p className="text-primary-700/80 text-base max-w-lg leading-relaxed">
              Vrukshavalli is committed to protecting your privacy. Here&apos;s how we collect, use,
              and safeguard your information.
            </p>
            <p className="text-primary-500 text-xs mt-5">Effective date: February 2026</p>
          </FadeUp>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <div>
            {sections.map((section, i) => (
              <PolicySection key={section.number} section={section} delay={i * 0.06} />
            ))}
          </div>

          {/* Related links */}
          <FadeUp delay={0.4}>
            <div className="mt-4 rounded-2xl border border-primary-200 bg-primary-50/40 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-mono font-semibold text-foreground mb-1">Also see our Terms</p>
                <p className="text-sm text-foreground/60">
                  Our Terms &amp; Conditions, Cancellation Policy, and Shipping Policy are also available.
                </p>
              </div>
              <Link
                href="/terms"
                className="shrink-0 rounded-full bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium px-5 py-2.5 transition-colors"
              >
                View Terms &amp; Conditions →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
