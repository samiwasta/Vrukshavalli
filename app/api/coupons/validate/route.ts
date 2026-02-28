import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const bodySchema = z.object({
  code: z.string().min(4).max(12),
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

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        discountPct: coupon.discountPct,
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