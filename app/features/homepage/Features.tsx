"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  IconTruckDelivery,
  IconBook2,
  IconHeartHandshake,
  IconLeaf,
} from "@tabler/icons-react";

const FEATURES = [
  {
    title: "Next Day Shipping",
    icon: IconTruckDelivery,
    iconBg: "bg-[#f5d0c5]",
    iconColor: "text-primary-700",
    cardBg: "bg-[#f5d0c5]/25",
  },
  {
    title: "Expert Care Guidance",
    icon: IconBook2,
    iconBg: "bg-[#c5e0d8]",
    iconColor: "text-primary-700",
    cardBg: "bg-[#c5e0d8]/25",
  },
  {
    title: "Plant Parents Trust Us",
    icon: IconHeartHandshake,
    iconBg: "bg-[#f8e0d5]",
    iconColor: "text-primary-700",
    cardBg: "bg-[#f8e0d5]/25",
  },
  {
    title: "Curated Collection",
    icon: IconLeaf,
    iconBg: "bg-[#d4e8d4]",
    iconColor: "text-primary-700",
    cardBg: "bg-[#d4e8d4]/30",
  },
];

const STAGGER = 0.1;

function FeatureContent({
  feature,
  size = "default",
}: {
  feature: (typeof FEATURES)[0];
  size?: "compact" | "default";
}) {
  const Icon = feature.icon;
  const isCompact = size === "compact";
  return (
    <>
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg ${feature.iconBg} ${feature.iconColor} ${isCompact ? "h-9 w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11" : "h-12 w-12 md:h-14 md:w-14"}`}
      >
        <Icon size={isCompact ? 20 : 24} stroke={1.5} />
      </span>
      <span
        className={`whitespace-nowrap font-mono font-semibold tracking-tight text-foreground ${isCompact ? "text-xs lg:text-sm xl:text-base" : "text-xs md:text-sm"}`}
      >
        {feature.title}
      </span>
    </>
  );
}

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      className="w-full bg-white py-5 sm:py-6 lg:py-8"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden md:hidden">
          <motion.div
            className="flex w-[200%] gap-2"
            animate={{ x: "-50%" }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 26,
              ease: "linear",
            }}
          >
            {[1, 2].map((set) =>
              FEATURES.map((feature) => (
                <div
                  key={`${set}-${feature.title}`}
                  className={`flex min-w-0 flex-[0_0_calc(25%-7px)] items-center justify-start gap-2 rounded-lg py-2.5 pl-3 ${feature.cardBg}`}
                >
                  <FeatureContent feature={feature} size="compact" />
                </div>
              ))
            )}
          </motion.div>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-white to-transparent md:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-white to-transparent md:hidden"
            aria-hidden
          />
        </div>

        <div className="hidden gap-2 md:grid md:grid-cols-2 lg:hidden">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`flex items-center justify-start gap-2 rounded-lg px-3 py-4 ${feature.cardBg}`}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                type: "spring" as const,
                stiffness: 300,
                damping: 28,
                delay: index * STAGGER,
              }}
            >
              <FeatureContent feature={feature} />
            </motion.div>
          ))}
        </div>

        <div className="hidden gap-2 lg:flex lg:flex-nowrap lg:items-stretch">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`flex flex-1 items-center justify-start gap-2 rounded-lg px-3 py-3 ${feature.cardBg}`}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                type: "spring" as const,
                stiffness: 300,
                damping: 28,
                delay: index * STAGGER,
              }}
            >
              <FeatureContent feature={feature} size="compact" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
