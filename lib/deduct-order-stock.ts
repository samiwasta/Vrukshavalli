import { db } from "@/lib/db";
import { products } from "@/lib/db/schema/products";
import { eq, sql } from "drizzle-orm";

interface OrderItem {
  id?: string;
  productId?: string;
  quantity?: number;
  qty?: number;
}

/**
 * Deducts stock for every item in an order.
 * Stock is floored at 0 to prevent negative values.
 * Safe to call after verifying the order was previously "pending" to avoid double-deduction.
 */
export async function deductOrderStock(items: unknown): Promise<void> {
  if (!Array.isArray(items) || items.length === 0) return;

  for (const item of items as OrderItem[]) {
    const productId = item.productId ?? item.id;
    const quantity = Math.max(0, Math.floor(Number(item.quantity ?? item.qty ?? 1)));

    if (!productId || quantity <= 0) continue;

    await db
      .update(products)
      .set({
        stock: sql`GREATEST(${products.stock} - ${quantity}, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));
  }
}
