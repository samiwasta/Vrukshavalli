"use client";

import { Button } from "@/components/ui/button"
import { IconArrowRight } from "@tabler/icons-react"
import { motion } from "motion/react"
import ProductCard from "@/components/ProductCard"
import { useRef } from "react"

const handPickedProducts = [
    {
        id: 1,
        name: "Fiddle Leaf Fig - Indoor Air Purifier",
        price: 1299,
        originalPrice: 1599,
        image: "/category-plant.webp",
        rating: 4.7,
        reviewCount: 214,
        category: "Indoor Plants",
        isBestSeller: true,
        isHandPicked: true,
    },
    {
        id: 2,
        name: "Monstera Deliciosa - Swiss Cheese Plant",
        price: 999,
        originalPrice: 1299,
        image: "/category-plant.webp",
        rating: 4.8,
        reviewCount: 186,
        category: "Indoor Plants",
        isBestSeller: true,
        isHandPicked: true,
    },
    {
        id: 3,
        name: "Areca Palm - Natural Air Purifier",
        price: 899,
        image: "/category-plant.webp",
        rating: 4.6,
        reviewCount: 143,
        category: "Indoor Plants",
        isNew: true,
        isBestSeller: true,
        isHandPicked: true,
    },
    {
        id: 4,
        name: "Snake Plant - Low Maintenance Green",
        price: 699,
        originalPrice: 899,
        image: "/category-plant.webp",
        rating: 4.9,
        reviewCount: 312,
        category: "Indoor Plants",
        isBestSeller: true,
        isHandPicked: true,
    },
    {
        id: 5,
        name: "Peace Lily - Elegant Flowering Plant",
        price: 799,
        image: "/category-plant.webp",
        rating: 4.5,
        reviewCount: 98,
        category: "Flowering Plants",
        isBestSeller: true,
        isHandPicked: true,
    },
    {
        id: 6,
        name: "Jade Plant - Lucky Succulent",
        price: 499,
        originalPrice: 649,
        image: "/category-plant.webp",
        rating: 4.7,
        reviewCount: 167,
        category: "Succulents",
        isNew: true,
        isBestSeller: true,
        isHandPicked: true,
    },
];


export default function HandPicked() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    return (
        <section className="w-full bg-background py-10 sm:py-12 lg:py-14">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary-600 font-mono leading-tight tracking-tight">Handpicked, Just For You!</h2>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                        >
                            View All
                            <motion.span
                                animate={{ x: [0, 3, 0] }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 1.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <IconArrowRight size={16} />
                            </motion.span>
                        </Button>
                    </motion.div>
                </div>

                {/* Scrollable Product Grid */}
                <div className="relative">
                    {/* Left fade mask */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-linear-to-r from-background via-background/50 to-transparent z-10 pointer-events-none" />
                    
                    {/* Right fade mask */}
                    <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-linear-to-l from-background via-background/50 to-transparent z-10 pointer-events-none" />
                    
                    <motion.div
                        ref={scrollContainerRef}
                        className="overflow-x-auto overflow-y-visible pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
                        whileTap={{ cursor: "grabbing" }}
                    >
                        <motion.div
                            drag="x"
                            dragConstraints={scrollContainerRef}
                            dragElastic={0.1}
                            className="flex gap-4 sm:gap-6 px-4 sm:px-6"
                        >
                            {handPickedProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    className="w-65 sm:w-70 md:w-75 lg:w-[320px] shrink-0"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                >
                                    <ProductCard {...product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    )
}