"use client";

import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";

const bentoImages = [
    {
        id: 1,
        src: "/category-seeds.avif",
        alt: "Premium Seeds Collection",
        span: "col-span-2 row-span-2",
    },
    {
        id: 2,
        src: "/category-seeds.avif",
        alt: "Indoor Plants",
        span: "col-span-1 row-span-1",
    },
    {
        id: 3,
        src: "/category-seeds.avif",
        alt: "Planters & Pots",
        span: "col-span-1 row-span-1",
    },
    {
        id: 4,
        src: "/category-seeds.avif",
        alt: "Garden Tools",
        span: "col-span-1 row-span-2",
    },
    {
        id: 5,
        src: "/category-seeds.avif",
        alt: "Organic Fertilizers",
        span: "col-span-1 row-span-1",
    },
    {
        id: 6,
        src: "/category-seeds.avif",
        alt: "Succulents",
        span: "col-span-2 row-span-1",
    },
];

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
                        {[...bentoImages, ...bentoImages, ...bentoImages].map((image, index) => (
                            <motion.div
                                key={`row1-${index}`}
                                className="relative shrink-0 w-70 sm:w-[320px] md:w-95 h-50 sm:h-60 md:h-70 rounded-3xl overflow-hidden group cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white font-semibold text-lg">{image.alt}</h3>
                                    </div>
                                </div>
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
                        {[...bentoImages, ...bentoImages, ...bentoImages].map((image, index) => (
                            <motion.div
                                key={`row3-${index}`}
                                className="relative shrink-0 w-75 sm:w-85 md:w-100 h-55 sm:h-65 md:h-75 rounded-3xl overflow-hidden group cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white font-semibold text-lg">{image.alt}</h3>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}