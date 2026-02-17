"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { IconArrowRight } from "@tabler/icons-react";

const CATEGORIES = [
  {
    title: "Plants",
    image: "/category-plant.webp",
    offer: "upto 50% off",
    href: "/product?category=plants",
    bgColor: "bg-[#e8f4f0]",
    accentColor: "bg-primary-500",
    textColor: "text-primary-800",
    badgeBg: "bg-white",
    badgeText: "text-primary-700",
  },
  {
    title: "Seeds",
    image: "/category-seeds.avif",
    offer: "Starting at Rs.99",
    href: "/product?category=seeds",
    bgColor: "bg-[#fef4e8]",
    accentColor: "bg-[#d4a574]",
    textColor: "text-[#7a5a3a]",
    badgeBg: "bg-white",
    badgeText: "text-[#7a5a3a]",
  },
  {
    title: "Pots & Planters",
    image: "/category-ceramics.webp",
    offer: "upto 40% off",
    href: "/product?category=pots-planters",
    bgColor: "bg-[#e8f0f4]",
    accentColor: "bg-[#6B9486]",
    textColor: "text-primary-800",
    badgeBg: "bg-white",
    badgeText: "text-primary-700",
  },
  {
    title: "Plant Care",
    image: "/category-care.webp",
    offer: "upto 65% off",
    href: "/product?category=plant-care",
    bgColor: "bg-[#fce8e8]",
    accentColor: "bg-[#e89b9b]",
    textColor: "text-[#8b3a3a]",
    badgeBg: "bg-white",
    badgeText: "text-[#8b3a3a]",
  },
];

export default function CategoryBanners() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="w-full bg-background py-10 sm:py-12 lg:py-14"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{
                type: "spring" as const,
                stiffness: 260,
                damping: 24,
                delay: index * 0.08,
              }}
            >
              <Link
                href={category.href}
                className={`group relative block overflow-hidden rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] outline-none transition-all duration-300 hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.2)] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${category.bgColor}`}
              >
                <motion.div
                  className={`absolute left-0 right-0 top-0 z-20 h-1.5 ${category.accentColor}`}
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ delay: index * 0.08 + 0.3, duration: 0.5 }}
                  style={{ originX: 0 }}
                />

                <div className="relative aspect-3/4 overflow-hidden sm:aspect-4/5">
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div
                    className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/20"
                    aria-hidden
                  />
                  
                  <motion.div
                    className="absolute left-4 top-5 sm:left-5 sm:top-6"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.08 + 0.2, duration: 0.4 }}
                  >
                    <h3 className="font-mono text-xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-2xl md:text-3xl xl:text-4xl">
                      {category.title}
                    </h3>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.08 + 0.25, duration: 0.4 }}
                  >
                    <motion.span
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-mono text-xs font-bold tracking-wide shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl sm:text-sm md:text-base xl:text-lg ${category.badgeBg} ${category.badgeText}`}
                      whileHover={{ x: 2 }}
                    >
                      {category.offer}
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut",
                        }}
                        className="inline-block"
                      >
                        <IconArrowRight size={14} stroke={2.5} />
                      </motion.span>
                    </motion.span>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
