"use client";

import { Button } from "@/components/ui/button"
import { IconArrowRight } from "@tabler/icons-react"
import { motion } from "motion/react"
import ProductCard from "@/components/ProductCard"

const bestSellingProducts = [
    {
        id: 1,
        name: "Organic Neem Seeds Premium Quality",
        price: 349,
        originalPrice: 499,
        image: "/category-seeds.avif",
        rating: 4.8,
        reviewCount: 156,
        category: "Seeds",
        isBestSeller: true,
    },
    {
        id: 2,
        name: "Heritage Tomato Seeds Collection",
        price: 299,
        originalPrice: 399,
        image: "/category-seeds.avif",
        rating: 4.6,
        reviewCount: 89,
        category: "Seeds",
        isBestSeller: true,
    },
    {
        id: 3,
        name: "Rare Basil Variety Seeds Pack",
        price: 249,
        image: "/category-seeds.avif",
        rating: 4.9,
        reviewCount: 234,
        category: "Herbs",
        isNew: true,
        isBestSeller: true,
    },
    {
        id: 4,
        name: "Rainbow Chard Seeds Organic",
        price: 199,
        originalPrice: 299,
        image: "/category-seeds.avif",
        rating: 4.7,
        reviewCount: 178,
        category: "Vegetables",
        isBestSeller: true,
    },
    {
        id: 5,
        name: "Sunflower Giant Seeds",
        price: 149,
        image: "/category-seeds.avif",
        rating: 4.5,
        reviewCount: 92,
        category: "Flowers",
        isBestSeller: true,
    },
    {
        id: 6,
        name: "Exotic Pepper Seeds Mix",
        price: 399,
        originalPrice: 549,
        image: "/category-seeds.avif",
        rating: 4.8,
        reviewCount: 145,
        category: "Vegetables",
        isNew: true,
        isBestSeller: true,
    },
]

export default function BestSellers() {
    return (
        <section className="container mx-auto px-4 w-full bg-background py-10 sm:py-12 lg:py-14">
            {/* Header with container padding */}
            <div className="px-4 sm:px-6 mb-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary-600 font-mono leading-tight tracking-tight">Flying Off the Shelves</h2>
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
                    {bestSellingProducts.map((product, index) => (
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