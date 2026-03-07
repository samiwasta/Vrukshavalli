import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema/coupons";
import { and, eq, or, isNull, gt, sql } from "drizzle-orm";

/**
 * Public endpoint – returns active, non-expired, non-exhausted coupons.
 * newUsersOnly coupons are included but flagged so the UI can annotate them.
 * Sensitive fields (maxUses, usedCount) are omitted.
 */
export async function GET() {
  try {
    const now = new Date();

    const list = await db
      .select({
        code: coupons.code,
        discountType: coupons.discountType,
        discountPct: coupons.discountPct,
        description: coupons.description,
        expiresAt: coupons.expiresAt,
        newUsersOnly: coupons.newUsersOnly,
      })
      .from(coupons)
      .where(
        and(
          eq(coupons.isActive, true),
          or(isNull(coupons.expiresAt), gt(coupons.expiresAt, now)),
          or(
            isNull(coupons.maxUses),
            sql`${coupons.usedCount} < ${coupons.maxUses}`,
          ),
        ),
      );

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error("Coupons list error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load coupons" },
      { status: 500 },
    );
  }
}
