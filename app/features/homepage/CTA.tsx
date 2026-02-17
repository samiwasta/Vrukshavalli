"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export default function CommunityCTA() {
  return (
    <section className="w-full bg-linear-to-br from-primary-600 to-primary-700 py-16 sm:py-20 lg:py-24 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-white blur-3xl" />
      </div>

      {/* Floating leaf and flower decorations */}
      {/* Left side decorations */}
      <motion.div
        className="absolute top-[15%] left-[8%] text-5xl opacity-15 hidden lg:block"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌿
      </motion.div>

      <motion.div
        className="absolute top-[55%] left-[5%] text-3xl opacity-20 hidden md:block"
        animate={{
          y: [0, 12, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌺
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] left-[12%] text-4xl opacity-18"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🍃
      </motion.div>

      {/* Right side decorations */}
      <motion.div
        className="absolute top-[20%] right-[6%] text-4xl opacity-20"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -12, 0],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌸
      </motion.div>

      <motion.div
        className="absolute top-[50%] right-[10%] text-5xl opacity-15 hidden lg:block"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌱
      </motion.div>

      <motion.div
        className="absolute bottom-[25%] right-[8%] text-3xl opacity-22 hidden md:block"
        animate={{
          y: [0, 8, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌼
      </motion.div>

      {/* Center subtle accent */}
      <motion.div
        className="absolute top-[12%] left-1/2 -translate-x-1/2 text-2xl opacity-12 hidden xl:block"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌻
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white font-mono leading-tight tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join Our Growing Community
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with fellow plant enthusiasts, share tips, and get expert advice on your gardening journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/community">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-base sm:text-lg font-semibold bg-white text-primary-700 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
              >
                Join the Community
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  <IconArrowRight size={20} stroke={2.5} />
                </motion.span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}