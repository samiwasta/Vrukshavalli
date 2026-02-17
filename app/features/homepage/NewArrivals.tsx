"use client";

import { Button } from "@/components/ui/button"
import { IconArrowRight } from "@tabler/icons-react"
import { motion } from "motion/react"
import ProductCard from "@/components/ProductCard"

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
        isNew: true,
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
        isNew: true,
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
        isNew: true,
    },
    {
        id: 5,
        name: "Peace Lily - Elegant Flowering Plant",
        price: 799,
        image: "/category-plant.webp",
        rating: 4.5,
        reviewCount: 98,
        category: "Flowering Plants",
        isNew: true,
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


export default function NewArrivals() {
    return (
        <section className="container mx-auto px-4 w-full bg-background py-10 sm:py-12 lg:py-14">
            {/* Header with container padding */}
            <div className="px-4 sm:px-6 mb-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary-600 font-mono leading-tight tracking-tight">Fresh to the Garden</h2>
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
                    {handPickedProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            className="w-65 sm:w-70 md:w-75 lg:w-80 shrink-0 snap-start"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
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