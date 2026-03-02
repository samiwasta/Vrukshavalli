import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema/coupons";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const updateCouponSchema = z.object({
  code: z.string().min(2).max(32).transform((s) => s.toUpperCase()).optional(),
  discountType: z.enum(["percentage", "flat"]).optional(),
  discountPct: z.number().int().min(1).optional(),
  description: z.string().max(200).nullable().optional(),
  newUsersOnly: z.boolean().optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id));

  if (!coupon) {
    return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: coupon });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateCouponSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const { expiresAt, ...rest } = parsed.data;
  const updates: Record<string, unknown> = { ...rest };
  if (expiresAt !== undefined) {
    updates.expiresAt = expiresAt ? new Date(expiresAt) : null;
  }

  const [updated] = await db.update(coupons).set(updates).where(eq(coupons.id, id)).returning();

  if (!updated) {
    return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const [deleted] = await db.delete(coupons).where(eq(coupons.id, id)).returning();

  if (!deleted) {
    return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Coupon deleted" });
}
