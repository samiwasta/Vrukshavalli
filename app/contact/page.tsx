"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandYoutube,
  IconSend,
  IconCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util";
import { useSession } from "@/lib/auth-client";

// ── Contact Info ─────────────────────────────────────────────────────────────
const CONTACT_DETAILS = [
  {
    icon: IconMapPin,
    label: "Address",
    value: "12, Green Grove Lane, Koramangala\nBengaluru, Karnataka – 560034",
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
  },
  {
    icon: IconPhone,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    icon: IconMail,
    label: "Email",
    value: "hello@vrikshavalli.com",
    href: "mailto:hello@vrikshavalli.com",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

const SOCIALS = [
  {
    icon: IconBrandInstagram,
    label: "Instagram",
    href: "https://instagram.com",
    hoverColor: "hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600",
  },
  {
    icon: IconBrandFacebook,
    label: "Facebook",
    href: "https://facebook.com",
    hoverColor: "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600",
  },
  {
    icon: IconBrandTwitter,
    label: "Twitter / X",
    href: "https://twitter.com",
    hoverColor: "hover:bg-sky-50 hover:border-sky-200 hover:text-sky-500",
  },
  {
    icon: IconBrandYoutube,
    label: "YouTube",
    href: "https://youtube.com",
    hoverColor: "hover:bg-red-50 hover:border-red-200 hover:text-red-600",
  },
];

// ── Input Field ──────────────────────────────────────────────────────────────
function Field({
  label,
  id,
  type = "text",
  placeholder,
  required,
  textarea,
  grow,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  grow?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const base =
    "w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100";
  return (
    <div className={cn("flex flex-col gap-1.5", grow && "flex-1 flex", grow && "[&>textarea]:flex-1")}>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {label}
        {required && <span className="ml-0.5 text-errorDark">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={5}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(base, "resize-none", grow && "flex-1 min-h-30")}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Wire up to real API endpoint
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6">

        {/* ── Two-column layout ──────────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12 lg:items-stretch">

          {/* ── Left — Info Panel ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-6 h-full order-2 lg:order-1"
          >
            {/* Contact details */}
            <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm flex flex-col gap-5">
              <h2 className="font-mono text-lg font-bold text-zinc-900">Contact Details</h2>
              {CONTACT_DETAILS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-4"
                >
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", item.iconBg)}>
                    <item.icon size={18} className={item.iconColor} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm font-medium text-zinc-700 hover:text-primary-600 transition-colors whitespace-pre-line"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-zinc-700 whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social links */}
            <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm">
              <h2 className="font-mono text-lg font-bold text-zinc-900 mb-4">Follow Us</h2>
              <div className="flex flex-wrap gap-3">
                {SOCIALS.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white text-zinc-500 transition-all duration-200",
                      social.hoverColor
                    )}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
              <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
                Stay updated with new arrivals, plant care tips, and seasonal offers.
              </p>
            </div>

            {/* Hours */}
            <div className="rounded-3xl border border-primary-100 bg-primary-50/50 p-6 flex-1">
              <h2 className="font-mono text-sm font-bold text-zinc-900 mb-3">Business Hours</h2>
              <div className="flex flex-col gap-1.5 text-sm">
                {[
                  { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
                  { day: "Saturday", time: "10:00 AM – 4:00 PM" },
                  { day: "Sunday", time: "Closed" },
                ].map((row) => (
                  <div key={row.day} className="flex justify-between text-zinc-600">
                    <span className="font-medium">{row.day}</span>
                    <span className={row.time === "Closed" ? "text-errorDark font-semibold" : "text-zinc-500"}>
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right — Form ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="rounded-3xl border border-primary-100 bg-white p-6 shadow-sm sm:p-8 h-full flex flex-col order-1 lg:order-2"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 py-16 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-successLight">
                  <IconCheck size={30} className="text-successDark" />
                </div>
                <h3 className="font-mono text-xl font-bold text-zinc-900">Message Sent!</h3>
                <p className="text-sm text-zinc-500 max-w-xs">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <Button
                  variant="outline"
                  className="mt-2 rounded-full"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ fullName: "", email: "", phone: "", subject: "", message: "" });
                  }}
                >
                  Send Another
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="font-mono text-xl font-bold text-zinc-900">Send a Message</h2>
                  {isLoggedIn ? (
                    <p className="mt-1 text-sm text-zinc-500">
                      Logged in as{" "}
                      <span className="font-semibold text-primary-600">{session?.user?.name ?? session?.user?.email}</span>.
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-zinc-500">
                      Fill in your details and we&apos;ll be in touch.
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                  {/* Guest-only fields */}
                  {!isLoggedIn && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4"
                    >
                      <Field
                        id="fullName"
                        label="Full Name"
                        placeholder="Jane Doe"
                        required
                        value={form.fullName}
                        onChange={set("fullName")}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          id="email"
                          label="Email"
                          type="email"
                          placeholder="jane@example.com"
                          required
                          value={form.email}
                          onChange={set("email")}
                        />
                        <Field
                          id="phone"
                          label="Phone Number"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={set("phone")}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Common fields */}
                  <Field
                    id="subject"
                    label="Subject"
                    placeholder="E.g. Order query, Plant care advice…"
                    required
                    value={form.subject}
                    onChange={set("subject")}
                  />
                  <Field
                    id="message"
                    label="Message"
                    placeholder="Tell us how we can help…"
                    required
                    textarea
                    grow
                    value={form.message}
                    onChange={set("message")}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="mt-2 w-full rounded-full font-semibold shadow-md shadow-primary-600/20"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <IconSend size={18} />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
