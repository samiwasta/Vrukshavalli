"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { colors } from "@/app/constants/colors";

const RIBBON_FEATURES = [
  "Top Plant Seller in Ratnagiri",
  "Free delivery on orders above Rs 999",
  "100% organic and pesticide-free plants",
];

const SLIDE_INTERVAL_MS = 3500;

export default function TopRibbon() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % RIBBON_FEATURES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="px-4 py-2 text-sm font-medium text-white"
      style={{ backgroundColor: colors.freshGreen }}
    >
      <div className="container mx-auto flex items-center justify-center">
        <div className="hidden w-full items-center justify-between px-16 py-1 lg:flex">
          {RIBBON_FEATURES.map((feature) => (
            <span key={feature} className="text-center text-sm font-sans">
              {feature}
            </span>
          ))}
        </div>

        <div className="relative h-6 w-full overflow-hidden lg:hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={RIBBON_FEATURES[index]}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="absolute inset-0 flex items-center justify-center text-center"
            >
              {RIBBON_FEATURES[index]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
