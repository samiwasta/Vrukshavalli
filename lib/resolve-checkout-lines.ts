import { db, products } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import type { OrderLineInput, StockLineIssue } from "@/lib/validate-order-stock";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(s: string): boolean {
  return UUID_RE.test(String(s).trim());
}

function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export type ResolvedCheckoutLine = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  categoryId: string | null;
};

export type ResolveCheckoutResult =
  | { ok: false; error: string; issues?: StockLineIssue[] }
  | { ok: true; lines: ResolvedCheckoutLine[]; subtotal: number };

export function formatLinesForOrderStorage(lines: ResolvedCheckoutLine[]) {
  return lines.map((l) => ({
    id: l.productId,
    productId: l.productId,
    name: l.name,
    slug: l.slug,
    image: l.image,
    price: l.price,
    quantity: l.quantity,
  }));
}

export async function resolveCheckoutLines(
  lines: OrderLineInput[],
): Promise<ResolveCheckoutResult> {
  if (!lines.length) {
    return { ok: false, error: "Cart empty" };
  }

  const issues: StockLineIssue[] = [];
  const resolved: ResolvedCheckoutLine[] = [];
  let subtotal = 0;

  for (const line of lines) {
    const q = Math.max(0, Math.floor(Number(line.quantity)));
    if (q <= 0) continue;

    const key = String(line.productId).trim();
    const product = await db.query.products.findFirst({
      where: and(
        isUuid(key) ? eq(products.id, key) : eq(products.slug, key),
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
      continue;
    }

    const price = roundMoney(Number(product.price));
    subtotal += price * q;
    resolved.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price,
      quantity: q,
      categoryId: product.categoryId ?? null,
    });
  }

  if (issues.length > 0) {
    const first = issues[0];
    const msg =
      first.code === "out_of_stock"
        ? `${first.name} is out of stock. Remove it or reduce quantity to continue.`
        : first.code === "insufficient"
          ? `${first.name}: only ${first.available} available (you have ${first.requested}).`
          : `${first.name} is no longer available.`;
    return { ok: false, error: msg, issues };
  }

  if (!resolved.length) {
    return { ok: false, error: "Invalid cart lines" };
  }

  return { ok: true, lines: resolved, subtotal: roundMoney(subtotal) };
}
