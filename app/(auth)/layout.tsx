"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8faf8]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--primary-100)_0%,transparent_50%,var(--primary-100)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(157,183,175,0.3)_0%,transparent_60%)]" />
      <div className="relative flex min-h-screen flex-col">
        <header className="flex shrink-0 items-center justify-center px-6 py-5 sm:px-8">
          <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg">
            <Image src="/vrukshavalli-logo.svg" alt="Vrukshavalli" width={140} height={36} className="h-18 w-auto" />
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: pathname === "/register" ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: pathname === "/register" ? -24 : 24 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-md"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
