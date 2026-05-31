import { db } from "@/lib/db";
import { coupons, orders } from "@/lib/db/schema";
import type { Coupon } from "@/lib/db/schema/coupons";
import { eq, sql, count } from "drizzle-orm";

export type CouponInvalid = { valid: false; reason: string };

export type CouponValid = {
  valid: true;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  description: string | null;
};

export type CouponValidationResult = CouponInvalid | CouponValid;

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

function roundMoney(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function computeCouponDiscountAmount(
  subtotal: number,
  discountType: "percentage" | "flat",
  discountValue: number,
): number {
  if (subtotal <= 0) return 0;
  if (discountType === "flat") {
    return roundMoney(Math.min(discountValue, subtotal));
  }
  return roundMoney((subtotal * discountValue) / 100);
}

export function validateCouponRecord(
  coupon: Coupon | null | undefined,
  options?: {
    existingOrderCount?: number;
    isAuthenticated?: boolean;
  },
): CouponValidationResult {
  if (!coupon) {
    return { valid: false, reason: "Invalid coupon code" };
  }

  if (!coupon.isActive) {
    return { valid: false, reason: "Coupon is inactive" };
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, reason: "Coupon has expired" };
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, reason: "Coupon usage limit reached" };
  }

  if (coupon.newUsersOnly) {
    if (!options?.isAuthenticated) {
      return {
        valid: false,
        reason: "Please log in to use this coupon.",
      };
    }
    if ((options.existingOrderCount ?? 0) > 0) {
      return {
        valid: false,
        reason: "This coupon is for new customers only.",
      };
    }
  }

  return {
    valid: true,
    code: normalizeCouponCode(coupon.code),
    discountType: coupon.discountType as "percentage" | "flat",
    discountValue: coupon.discountPct,
    description: coupon.description,
  };
}

export async function findCouponByCode(
  normalizedCode: string,
): Promise<Coupon | undefined> {
  const row = await db.query.coupons.findFirst({
    where: sql`upper(${coupons.code}) = ${normalizedCode}`,
  });
  return row;
}

export async function countOrdersForUser(userId: string): Promise<number> {
  const [{ total }] = await db
    .select({ total: count() })
    .from(orders)
    .where(eq(orders.userId, userId));
  return total;
}

export async function validateCouponByCode(
  rawCode: string,
  options?: { userId?: string | null },
): Promise<CouponValidationResult> {
  const normalizedCode = normalizeCouponCode(rawCode);
  const coupon = await findCouponByCode(normalizedCode);

  let existingOrderCount = 0;
  if (coupon?.newUsersOnly && options?.userId) {
    existingOrderCount = await countOrdersForUser(options.userId);
  }

  return validateCouponRecord(coupon, {
    existingOrderCount,
    isAuthenticated: Boolean(options?.userId),
  });
}
