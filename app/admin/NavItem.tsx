"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentType } from "react";

interface NavItemProps {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
}

export function NavItem({ href, label, icon: Icon, exact }: NavItemProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary-50 text-primary-700"
          : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary-600" : "text-stone-400"}`} />
      {label}
    </Link>
  );
}
