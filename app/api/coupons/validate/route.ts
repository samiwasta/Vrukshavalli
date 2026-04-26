import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons, orders } from "@/lib/db/schema";
import { eq, sql, count } from "drizzle-orm";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";

const bodySchema = z.object({
  code: z.string().min(2).max(32),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const normalizedCode = parsed.data.code.trim().toUpperCase();

    // 🔍 case-insensitive lookup
    const coupon = await db.query.coupons.findFirst({
      where: sql`upper(${coupons.code}) = ${normalizedCode}`,
    });

    if (!coupon) {
      return NextResponse.json({
        success: true,
        data: { valid: false, reason: "Invalid coupon code" },
      });
    }

    if (!coupon.isActive) {
      return NextResponse.json({
        success: true,
        data: { valid: false, reason: "Coupon is inactive" },
      });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({
        success: true,
        data: { valid: false, reason: "Coupon has expired" },
      });
    }

    if (
      coupon.maxUses !== null &&
      coupon.usedCount >= coupon.maxUses
    ) {
      return NextResponse.json({
        success: true,
        data: { valid: false, reason: "Coupon usage limit reached" },
      });
    }

    if (coupon.newUsersOnly) {
      const user = await getCurrentUser(request);
      if (!user) {
        return NextResponse.json({
          success: true,
          data: { valid: false, reason: "Please log in to use this coupon." },
        });
      }
      const [{ total }] = await db
        .select({ total: count() })
        .from(orders)
        .where(eq(orders.userId, user.id));
      if (total > 0) {
        return NextResponse.json({
          success: true,
          data: { valid: false, reason: "This coupon is for new customers only." },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        discountType: coupon.discountType as "percentage" | "flat",
        discountValue: coupon.discountPct,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}