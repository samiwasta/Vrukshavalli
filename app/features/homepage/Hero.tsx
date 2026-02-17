"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const CAROUSEL_ITEMS = [
  {
    title: "Where green meets grace.",
    description:
      "Curated plants and planters for a calm, elevated space. Quality, care, and a touch of luxury delivered to your door.",
    image: "/carousel-2.jpg",
    cta: { label: "Explore products", href: "/products" },
  },
  {
    title: "Create your ideal workspace.",
    description:
      "Bring nature into your home with our carefully selected indoor plants. Easy care, unique beauty, and a productive calm.",
    image: "/carousel-1.jpg",
    cta: { label: "Shop now", href: "/products" },
  },
  {
    title: "Nurture your space.",
    description:
      "Expert plant care guides and premium planters. Elevate every corner with rare greens and thoughtful design.",
    image: "/carousel-3.jpg",
    cta: { label: "Get in touch", href: "/contact" },
  },
];

export default function Hero() {
  const [ctaHovered, setCtaHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative min-h-[calc(100vh-190px)] w-full overflow-hidden bg-zinc-900">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
          bulletClass: 'custom-bullet',
          bulletActiveClass: 'custom-bullet-active',
        }}
        loop={true}
        speed={800}
        onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full min-h-[calc(100vh-190px)]"
      >
        {CAROUSEL_ITEMS.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-full w-full min-h-[calc(100vh-190px)]">
              <div className="absolute inset-0 z-1 bg-black/30" />
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={idx === 0}
              />
              <div className="absolute inset-0 z-2 flex flex-col items-center justify-center px-4 text-center text-white">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 28 }}
                  className="flex flex-col items-center gap-6 sm:gap-8"
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05, duration: 0.35 }}
                    className="inline-block rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur-sm"
                  >
                    Curated for you
                  </motion.span>

                  <motion.div className="relative">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 26 }}
                      className="font-mono text-3xl font-semibold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-4xl md:text-5xl lg:text-6xl"
                    >
                      {item.title}
                    </motion.h1>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      className="absolute -bottom-2 left-1/2 h-0.5 w-16 -translate-x-1/2 rounded-full bg-white/80 origin-center"
                    />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 24 }}
                    className="mt-2 max-w-lg text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:text-base md:text-lg"
                  >
                    {item.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 26 }}
                    className="mt-4"
                  >
                    <Link href={item.cta.href} className="group/cta relative inline-block">
                      <motion.span
                        className="absolute inset-0 rounded-full bg-white/40 blur-xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={ctaHovered ? { scale: 1.4, opacity: 0.6 } : { scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                      <motion.span
                        className="relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-zinc-900"
                        onHoverStart={() => setCtaHovered(true)}
                        onHoverEnd={() => setCtaHovered(false)}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 20px 40px -12px rgba(0,0,0,0.4)",
                        }}
                        whileTap={{
                          scale: 0.95,
                          transition: { duration: 0.1 },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 22,
                        }}
                      >
                        {item.cta.label}
                        <motion.span
                          className="inline-block"
                          variants={{
                            rest: { x: 0 },
                            hover: { x: [0, 6, 0] },
                          }}
                          initial="rest"
                          animate={ctaHovered ? "hover" : "rest"}
                          transition={{
                            x: {
                              duration: 0.5,
                              repeat: ctaHovered ? Infinity : 0,
                              repeatDelay: 0.4,
                            },
                          }}
                        >
                          <IconArrowRight size={18} stroke={2.5} />
                        </motion.span>
                      </motion.span>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="custom-pagination absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2 px-4" />

      <style jsx global>{`
        .custom-bullet {
          display: block;
          height: 4px;
          width: 8px;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease-out;
          cursor: pointer;
        }
        .custom-bullet:hover {
          background-color: rgba(255, 255, 255, 0.7);
        }
        .custom-bullet-active {
          width: 32px;
          background-color: rgba(255, 255, 255, 1);
        }
      `}</style>
    </section>
  );
}
