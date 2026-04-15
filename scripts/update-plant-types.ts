import "dotenv/config";
import { db, products, categories } from "../lib/db";
import { eq, isNull, and } from "drizzle-orm";

async function updatePlantTypes() {
  console.log("🔄 Updating existing plant products with plantType...");

  try {
    // Find the plants category
    const plantsCategory = await db.query.categories.findFirst({
      where: eq(categories.slug, "plants"),
    });

    if (!plantsCategory) {
      console.log("❌ Plants category not found");
      return;
    }

    // Update specific existing products with plantType
    const updates = [
      { slug: "monstera-deliciosa", plantType: "indoor" },
      { slug: "snake-plant", plantType: "indoor" },
      // Add more existing products as needed
    ];

    let updatedCount = 0;

    for (const update of updates) {
      const result = await db
        .update(products)
        .set({ plantType: update.plantType })
        .where(eq(products.slug, update.slug));

      if (result.rowCount && result.rowCount > 0) {
        console.log(`✅ Updated ${update.slug} to ${update.plantType}`);
        updatedCount++;
      }
    }

    // Also update any products in plants category that don't have plantType set
    // Set them to "indoor" by default (you can change this logic as needed)
    const defaultUpdate = await db
      .update(products)
      .set({ plantType: "indoor" })
      .where(
        and(
          eq(products.categoryId, plantsCategory.id),
          isNull(products.plantType)
        )
      );

    console.log(`✅ Updated ${updatedCount} specific products`);
    console.log(`✅ Set default plantType for ${defaultUpdate.rowCount || 0} other products`);
    console.log("🎉 Plant type update completed!");

  } catch (error) {
    console.error("❌ Error updating plant types:", error);
  }
}

updatePlantTypes();