import Link from "next/link";
import Image from "next/image";
import { IconBrandInstagram, IconBrandFacebook, IconBrandYoutube, IconBrandTwitter, IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";

const footerLinks = {
  shop: [
    { label: "Plants", href: "/plants" },
    { label: "Seeds", href: "/seeds" },
    { label: "Pots & Planters", href: "/pots-and-planters" },
    { label: "Plant Care", href: "/plant-care" },
    { label: "Gifting", href: "/gifting" },
    { label: "New Arrivals", href: "/new-arrivals" },
  ],
  company: [
    { label: "About Us", href: "/about-us" },
    { label: "Our Story", href: "/our-story" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Garden Services", href: "/garden-services" },
    { label: "Courses", href: "/courses" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Track Order", href: "/track-order" },
    { label: "Plant Care Guide", href: "/plant-care-guide" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Cancellation Policy", href: "/cancellation" },
    { label: "Shipping Policy", href: "/shipping-policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary-50/30 border-t border-primary-200">
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block mb-5">
              <Image src="/vrukshavalli-logo.svg" alt="Vrukshavalli Logo" width={180} height={50} className="h-12 w-auto" />
            </Link>
            <p className="text-foreground/70 mb-6 text-sm leading-relaxed max-w-xs">
              Curating premium plants and gardening essentials for urban spaces. Transform your home into a thriving green sanctuary with our expert guidance and quality products.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2.5">
                <IconMapPin size={17} className="text-primary-500 mt-0.5 shrink-0" />
                <p className="text-sm text-foreground/65 leading-relaxed">
                  123 Garden Street, Green Valley<br />
                  Mumbai, Maharashtra 400001
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <IconPhone size={17} className="text-primary-500 shrink-0" />
                <a href="tel:+919876543210" className="text-sm text-foreground/65 hover:text-primary-600 transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <IconMail size={17} className="text-primary-500 shrink-0" />
                <a href="mailto:hello@vrukshavalli.com" className="text-sm text-foreground/65 hover:text-primary-600 transition-colors">
                  hello@vrukshavalli.com
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-all hover:scale-105"
                aria-label="Instagram"
              >
                <IconBrandInstagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-all hover:scale-105"
                aria-label="Facebook"
              >
                <IconBrandFacebook size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-all hover:scale-105"
                aria-label="YouTube"
              >
                <IconBrandYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/65 hover:text-primary-600 inline-block hover:translate-x-0.5 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/65 hover:text-primary-600 inline-block hover:translate-x-0.5 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/65 hover:text-primary-600 inline-block hover:translate-x-0.5 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-primary-200 pt-10 pb-8">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-semibold text-foreground mb-2 text-base">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-foreground/65 mb-5">
              Get gardening tips, exclusive offers, and updates on new arrivals.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-primary-200 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all"
              />
              <button className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all hover:shadow-md text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Payment & Trust Badges */}
        <div className="border-t border-primary-200 pt-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6 sm:gap-12">
            <div className="flex items-center gap-3">
              <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">We Accept</p>
              <div className="flex gap-2">
                <div className="h-8 px-3.5 bg-white border border-primary-200 rounded-md flex items-center justify-center text-xs font-bold text-foreground shadow-sm">
                  UPI
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">Secure Shopping</p>
              <div className="flex gap-2 items-center">
                <div className="h-8 px-3 bg-primary-600/10 rounded-md flex items-center justify-center text-xs font-medium text-primary-700 border border-primary-300/50">
                  🔒 SSL Secure
                </div>
                <div className="h-8 px-3 bg-primary-600/10 rounded-md flex items-center justify-center text-xs font-medium text-primary-700 border border-primary-300/50">
                  ✓ 100% Safe
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-200 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-foreground/60 text-center md:text-left">
            © {new Date().getFullYear()} Vrukshavalli. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2">
            {footerLinks.policies.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/60 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}