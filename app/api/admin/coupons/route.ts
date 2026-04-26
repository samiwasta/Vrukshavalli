import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { coupons } from "@/lib/db/schema/coupons";
import { desc, count } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const createCouponSchema = z.object({
  code: z
    .string()
    .min(2)
    .max(32)
    .regex(/^[a-zA-Z0-9]+$/, "Code must contain only letters and numbers")
    .transform((s) => s.toUpperCase()),
  discountType: z.enum(["percentage", "flat"]).default("percentage"),
  discountPct: z.number().int().min(1),
  description: z.string().max(200).optional().nullable(),
  newUsersOnly: z.boolean().optional().default(false),
  maxUses: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export async function GET(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const offset = (page - 1) * limit;

  const [totalResult, data] = await Promise.all([
    db.select({ total: count() }).from(coupons),
    db.select().from(coupons).orderBy(desc(coupons.createdAt)).limit(limit).offset(offset),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json();
  const parsed = createCouponSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const { expiresAt, ...rest } = parsed.data;

  const [newCoupon] = await db
    .insert(coupons)
    .values({ ...rest, expiresAt: expiresAt ? new Date(expiresAt) : null })
    .returning();

  return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });
}
