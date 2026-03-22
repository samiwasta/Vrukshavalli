"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconLayoutDashboard,
  IconShoppingBag,
  IconUsers,
  IconTag,
  IconMessage,
  IconGift,
  IconLeaf,
  IconSpray,
  IconLogout,
} from "@tabler/icons-react";
import { signOut } from "@/lib/auth-client";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: IconLayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: IconShoppingBag },
  { href: "/admin/products", label: "Products", icon: IconLeaf },
  { href: "/admin/users", label: "Users", icon: IconUsers },
  { href: "/admin/coupons", label: "Coupons", icon: IconTag },
  { href: "/admin/contact", label: "Contact", icon: IconMessage },
  { href: "/admin/gifting", label: "Gifting", icon: IconGift },
  { href: "/admin/garden-services", label: "Garden Services", icon: IconSpray },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-stone-200/80 shadow-sm">
        <div className="px-5 border-b border-stone-100">
          <div className="flex items-center justify-center px-3 py-3">
            <Image
              src="/vrukshavalli-logo.svg"
              alt="Vrukshavalli"
              width={160}
              height={28}
              className="h-auto w-30"
              priority
            />
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4 grow">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary-50 text-primary-700 border border-primary-100"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900 border border-transparent"
                }`}
              >
                <span className={`h-5 w-1 rounded-full ${isActive ? "bg-primary-500" : "bg-transparent group-hover:bg-stone-200"}`} />
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary-600" : "text-stone-400"}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl border border-stone-200 bg-stone-50/60 px-4 py-3 text-xs text-stone-500">
          <div>
            Logged in as <span className="font-semibold text-stone-700">{userName}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <IconLogout className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-10 bg-white/95 backdrop-blur border-b border-stone-200 flex items-center gap-3 px-4 py-3">
        <Image
          src="/vrukshavalli-logo.svg"
          alt="Vrukshavalli"
          width={110}
          height={20}
          className="h-5 w-auto"
          priority
        />
        <nav className="ml-auto flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-2 py-1 rounded text-xs font-medium text-stone-600 hover:bg-primary-50 hover:text-primary-700 transition-colors whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="px-2 py-1 rounded text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors whitespace-nowrap inline-flex items-center gap-1"
          >
            <IconLogout className="w-3.5 h-3.5" />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}
