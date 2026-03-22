import { db, products } from "@/lib/db";
import { and, eq } from "drizzle-orm";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(s: string): boolean {
  return UUID_RE.test(String(s).trim());
}

export type OrderLineInput = { productId: string; quantity: number };

export type StockLineIssue = {
  productId: string;
  name: string;
  code: "inactive" | "out_of_stock" | "insufficient";
  available: number;
  requested: number;
};

export async function validateOrderStock(
  lines: OrderLineInput[]
): Promise<{ ok: true } | { ok: false; issues: StockLineIssue[] }> {
  if (!lines.length) {
    return { ok: false, issues: [] };
  }

  const issues: StockLineIssue[] = [];

  for (const line of lines) {
    const q = Math.max(0, Math.floor(Number(line.quantity)));
    if (q <= 0) continue;

    const key = String(line.productId).trim();
    const product = await db.query.products.findFirst({
      where: and(
        isUuid(key) ? eq(products.id, key) : eq(products.slug, key)
      ),
    });

    if (!product) {
      issues.push({
        productId: key,
        name: "Unknown product",
        code: "inactive",
        available: 0,
        requested: q,
      });
      continue;
    }

    if (!product.isActive) {
      issues.push({
        productId: product.id,
        name: product.name,
        code: "inactive",
        available: 0,
        requested: q,
      });
      continue;
    }

    const stock = product.stock ?? 0;
    if (stock <= 0) {
      issues.push({
        productId: product.id,
        name: product.name,
        code: "out_of_stock",
        available: 0,
        requested: q,
      });
      continue;
    }

    if (q > stock) {
      issues.push({
        productId: product.id,
        name: product.name,
        code: "insufficient",
        available: stock,
        requested: q,
      });
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }
  return { ok: true };
}

export type BagStockRow = {
  inputId: string;
  productId: string | null;
  name: string;
  stock: number;
  stockCapacity: number | null;
  isActive: boolean;
  quantity: number;
  canCheckout: boolean;
  reason?: string;
};

export async function snapshotBagStockLines(
  lines: OrderLineInput[]
): Promise<BagStockRow[]> {
  const out: BagStockRow[] = [];
  for (const line of lines) {
    const q = Math.max(0, Math.floor(Number(line.quantity)));
    const key = String(line.productId).trim();
    const product = await db.query.products.findFirst({
      where: and(
        isUuid(key) ? eq(products.id, key) : eq(products.slug, key)
      ),
    });

    if (!product) {
      out.push({
        inputId: key,
        productId: null,
        name: "",
        stock: 0,
        stockCapacity: null,
        isActive: false,
        quantity: q,
        canCheckout: false,
        reason: "Product unavailable",
      });
      continue;
    }

    const stock = product.stock ?? 0;
    let canCheckout = product.isActive && stock > 0 && q <= stock;
    let reason: string | undefined;
    if (!product.isActive) {
      canCheckout = false;
      reason = "No longer available";
    } else if (stock <= 0) {
      canCheckout = false;
      reason = "Out of stock";
    } else if (q > stock) {
      canCheckout = false;
      reason = `Only ${stock} in stock`;
    }

    out.push({
      inputId: key,
      productId: product.id,
      name: product.name,
      stock,
      stockCapacity: product.stockCapacity ?? null,
      isActive: product.isActive,
      quantity: q,
      canCheckout,
      reason,
    });
  }
  return out;
}
