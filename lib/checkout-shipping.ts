import { db, products, categories } from "@/lib/db";
import { inArray } from "drizzle-orm";
import {
  buildCategoryDeliveryMap,
  computeBagShipping,
} from "@/lib/delivery-pricing";

export async function computeCheckoutShipping(
  productIds: string[],
  taxableAmount: number,
): Promise<number> {
  const ids = [...new Set(productIds.filter(Boolean))];
  if (!ids.length || taxableAmount <= 0) return 0;

  const productRows = await db
    .select({ categoryId: products.categoryId })
    .from(products)
    .where(inArray(products.id, ids));

  const categoryIds = productRows.map((r) => r.categoryId);
  const allCategories = await db.select().from(categories);
  const map = buildCategoryDeliveryMap(allCategories);

  return computeBagShipping(taxableAmount, categoryIds, map);
}
