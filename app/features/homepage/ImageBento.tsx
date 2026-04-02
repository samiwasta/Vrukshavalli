"use client";

import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useMemo, useRef } from "react";

type BentoImage = {
  id: number;
  src: string;
  span: string;
};

const bentoImages: BentoImage[] = [
    {
        id: 1,
        src: "/slider-1.webp",
        span: "col-span-2 row-span-2",
    },
    {
        id: 2,
        src: "/slider-6.webp",
        span: "col-span-1 row-span-1",
    },
    {
        id: 3,
        src: "/slider-3.webp",
        span: "col-span-1 row-span-1",
    },
    {
        id: 4,
        src: "/slider-4.png",
        span: "col-span-1 row-span-2",
    },
    {
        id: 5,
        src: "/slider-2.webp",
        span: "col-span-1 row-span-1",
    },
    {
        id: 6,
        src: "/slider-5.webp",
        span: "col-span-2 row-span-1",
    },
];

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  return Math.abs(h) || 1;
}

function seededShuffle<T>(items: readonly T[], seedKey: string): T[] {
  const rand = mulberry32(hashSeed(seedKey));
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function marqueeSequence(items: readonly BentoImage[], rowKey: string): BentoImage[] {
  return [
    ...seededShuffle(items, `${rowKey}-s0`),
    ...seededShuffle(items, `${rowKey}-s1`),
    ...seededShuffle(items, `${rowKey}-s2`),
  ];
}

export default function ImageBento() {
        const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"], 
    });

    // Move left as user scrolls down
    const x1 = useTransform(scrollYProgress, [0, 1], [0, -1000]);

    // Opposite direction for second row
    const x2 = useTransform(scrollYProgress, [0, 1], [-1000, 0]);


    const smoothX1 = useSpring(x1, { stiffness: 100, damping: 30 });
    const smoothX2 = useSpring(x2, { stiffness: 100, damping: 30 });

    const row1Sequence = useMemo(() => marqueeSequence(bentoImages, "r1"), []);
    const row2Sequence = useMemo(() => marqueeSequence(bentoImages, "r2"), []);

    return (
        <section ref={sectionRef} className="w-full bg-background py-10 sm:py-12 lg:py-14 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 mb-8">
                <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary-600 font-mono leading-tight tracking-tight text-center">
                    The Green Edit
                </h2>
                <p className="text-center text-gray-600 mt-2 text-sm sm:text-base">
                    Curated selection of premium plants, seeds, and gardening essentials
                </p>
            </div>

            {/* Marquee Container */}
            <div 
                className="relative"
                style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                }}
            >
                {/* First Row - Scrolling Left */}
                <div className="mb-4 sm:mb-6">
                    <motion.div
                        className="flex gap-4 sm:gap-6"
                        style={{ x: smoothX1 }}
                    >
                        {row1Sequence.map((image, index) => (
                            <motion.div
                                key={`row1-${image.id}-${index}`}
                                className="relative shrink-0 w-70 sm:w-[320px] md:w-95 h-50 sm:h-60 md:h-70 rounded-3xl overflow-hidden group cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={image.src}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Third Row - Scrolling Left (Faster) */}
                <div>
                    <motion.div
                        className="flex gap-4 sm:gap-6"
                        style={{ x: smoothX2 }}
                    >
                        {row2Sequence.map((image, index) => (
                            <motion.div
                                key={`row2-${image.id}-${index}`}
                                className="relative shrink-0 w-75 sm:w-85 md:w-100 h-55 sm:h-65 md:h-75 rounded-3xl overflow-hidden group cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={image.src}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}