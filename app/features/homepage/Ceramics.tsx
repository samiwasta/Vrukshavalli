"use client";

import { Button } from "@/components/ui/button"
import { IconArrowRight } from "@tabler/icons-react"
import { motion } from "motion/react"
import ProductCard from "@/components/ProductCard"

const ceramicProducts = [
    {
        id: 1,
        name: "Terracotta Cylinder Planter - Handmade",
        price: 899,
        originalPrice: 1199,
        image: "/category-ceramics.webp",
        rating: 4.8,
        reviewCount: 156,
        category: "Ceramic Planters",
        isBestSeller: true,
        isNew: true,
    },
    {
        id: 2,
        name: "Glazed Ceramic Pot - Emerald Green",
        price: 1299,
        originalPrice: 1599,
        image: "/category-ceramics.webp",
        rating: 4.9,
        reviewCount: 203,
        category: "Ceramic Planters",
        isBestSeller: true,
        isHandPicked: true,
        isNew: true,
    },
    {
        id: 3,
        name: "Minimalist White Ceramic Planter",
        price: 799,
        image: "/category-ceramics.webp",
        rating: 4.7,
        reviewCount: 128,
        category: "Ceramic Planters",
        isNew: true,
    },
    {
        id: 4,
        name: "Artisan Blue Pottery Bowl",
        price: 1499,
        originalPrice: 1899,
        image: "/category-ceramics.webp",
        rating: 4.9,
        reviewCount: 187,
        category: "Ceramic Planters",
        isBestSeller: true,
        isNew: true,
    },
    {
        id: 5,
        name: "Rustic Terracotta Hanging Planter",
        price: 699,
        image: "/category-ceramics.webp",
        rating: 4.6,
        reviewCount: 94,
        category: "Hanging Planters",
        isNew: true,
        isHandPicked: true,
    },
    {
        id: 6,
        name: "Geometric Ceramic Planter - Set of 3",
        price: 2199,
        originalPrice: 2799,
        image: "/category-ceramics.webp",
        rating: 4.8,
        reviewCount: 241,
        category: "Ceramic Sets",
        isNew: true,
        isBestSeller: true,
        isHandPicked: true,
    },
];


export default function Ceramics() {
    return (
        <section className="container mx-auto px-4 w-full bg-background py-10 sm:py-12 lg:py-14">
            {/* Header with container padding */}
            <div className="px-4 sm:px-6 mb-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary-600 font-mono leading-tight tracking-tight">Handcrafted Ceramic Planters</h2>
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
            </div>

            {/* Scrollable Product Grid - Full width */}
            <div 
                className="overflow-x-auto overflow-y-visible pb-4 px-4 sm:px-6 snap-x snap-mandatory scroll-smooth hide-scrollbar"
                style={{ 
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <div className="flex gap-4 sm:gap-6">
                    {ceramicProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            className="w-65 sm:w-70 md:w-75 lg:w-80 shrink-0 snap-start"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                        >
                            <ProductCard {...product} />
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    )
}