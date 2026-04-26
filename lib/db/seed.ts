import "dotenv/config";
import { db } from "./index";
import { categories } from "./schema/categories";
import { products } from "./schema/products";

async function seed() {
  console.log("🌱 Seeding...");

  // -----------------------
  // 1️⃣ Seed categories
  // -----------------------
  await db
    .insert(categories)
    .values([
      { name: "Plants", slug: "plants", image: "/category-plant.webp" },
      { name: "Seeds", slug: "seeds", image: "/category-seeds.avif" },
      { name: "Pots & Planters", slug: "pots-planters", image: "/category-ceramics.webp" },
      { name: "Plant Care", slug: "plant-care", image: "/category-care.webp" },
      { name: "Gifting", slug: "gifting", image: "/category-plant.webp" },
      { name: "Farm Fresh", slug: "farm-fresh", image: "/category-plant.webp" },
    ])
    .onConflictDoNothing();

  console.log("✅ Categories seeded");

  // -----------------------
  // 2️⃣ Get category IDs
  // -----------------------
  const allCategories = await db.select().from(categories);

  const categoryMap = Object.fromEntries(
    allCategories.map((c) => [c.slug, c.id])
  );

  // -----------------------
  // 3️⃣ Seed products
  // -----------------------
  await db.insert(products).values([
    // 🌿 PLANTS
    {
      name: "Monstera Deliciosa",
      slug: "monstera-deliciosa",
      price: "799",
      originalPrice: "999",
      image: "/plants/monstera.webp",
      images: ["/plants/monstera.webp"],
      categoryId: categoryMap["plants"],
      stock: 50,
      rating: "4.80",
      reviewCount: 120,
      isBestSeller: true,
      isHandPicked: true,
      isActive: true,
      plantType: "indoor",
      description: "A stunning indoor plant with beautiful split leaves that adds tropical vibes to any space.",
    },
    {
      name: "Snake Plant",
      slug: "snake-plant",
      price: "499",
      image: "/plants/snake.webp",
      images: ["/plants/snake.webp"],
      categoryId: categoryMap["plants"],
      stock: 80,
      rating: "4.60",
      reviewCount: 90,
      isNew: true,
      isActive: true,
      plantType: "indoor",
      description: "Low-maintenance indoor plant perfect for beginners. Thrives in low light conditions.",
    },
    {
      name: "Bougainvillea",
      slug: "bougainvillea",
      price: "899",
      originalPrice: "1099",
      image: "/plants/bougainvillea.webp",
      images: ["/plants/bougainvillea.webp"],
      categoryId: categoryMap["plants"],
      stock: 35,
      rating: "4.70",
      reviewCount: 85,
      isBestSeller: true,
      isActive: true,
      plantType: "outdoor",
      description: "Vibrant flowering plant perfect for gardens and balconies. Blooms in stunning colors.",
    },
    {
      name: "Hibiscus",
      slug: "hibiscus",
      price: "699",
      image: "/plants/hibiscus.webp", 
      images: ["/plants/hibiscus.webp"],
      categoryId: categoryMap["plants"],
      stock: 45,
      rating: "4.50",
      reviewCount: 65,
      isActive: true,
      plantType: "outdoor",
      description: "Beautiful flowering outdoor plant with large, colorful blooms. Great for garden landscapes.",
    },

    // 🌱 SEEDS
    {
      name: "Basil Seeds",
      slug: "basil-seeds",
      price: "199",
      image: "/seeds/basil.webp",
      images: ["/seeds/basil.webp"],
      categoryId: categoryMap["seeds"],
      stock: 150,
      isBestSeller: true,
      isActive: true,
    },

    // 🪴 POTS
    {
      name: "Ceramic White Planter",
      slug: "ceramic-white-planter",
      price: "699",
      image: "/pots/white-ceramic.webp",
      images: ["/pots/white-ceramic.webp"],
      categoryId: categoryMap["pots-planters"],
      stock: 40,
      isHandPicked: true,
      isCeramicFeatured: true,
      isActive: true,
    },

    // 🌾 PLANT CARE
    {
      name: "Organic Fertilizer",
      slug: "organic-fertilizer",
      price: "299",
      image: "/care/fertilizer.webp",
      images: ["/care/fertilizer.webp"],
      categoryId: categoryMap["plant-care"],
      stock: 100,
      isActive: true,
    },

    // 🎁 GIFTING
    {
      name: "Plant Gift Hamper",
      slug: "plant-gift-hamper",
      price: "1299",
      image: "/gifting/hamper.webp",
      images: ["/gifting/hamper.webp"],
      categoryId: categoryMap["gifting"],
      stock: 25,
      isNew: true,
      isActive: true,
    },
  ])
  .onConflictDoNothing();

  console.log("✅ Products seeded");

  process.exit(0);
}

seed();