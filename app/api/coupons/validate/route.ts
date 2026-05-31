import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { validateCouponByCode } from "@/lib/coupon-validate";

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
        { status: 400 },
      );
    }

    const user = await getCurrentUser(request);
    const result = await validateCouponByCode(parsed.data.code, {
      userId: user?.id ?? null,
    });

    if (!result.valid) {
      return NextResponse.json({
        success: true,
        data: { valid: false, reason: result.reason },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        discountType: result.discountType,
        discountValue: result.discountValue,
        description: result.description,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to validate coupon" },
      { status: 500 },
    );
  }
}
