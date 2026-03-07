import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { giftingEnquiries } from "@/lib/db/schema/gifting-enquiries";
import { desc, count, ilike, or } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const offset = (page - 1) * limit;
  const search = searchParams.get("search")?.trim() ?? "";

  const where = search
    ? or(
        ilike(giftingEnquiries.fullName, `%${search}%`),
        ilike(giftingEnquiries.email, `%${search}%`),
        ilike(giftingEnquiries.company, `%${search}%`)
      )
    : undefined;

  const [totalResult, data] = await Promise.all([
    db.select({ total: count() }).from(giftingEnquiries).where(where),
    db
      .select()
      .from(giftingEnquiries)
      .where(where)
      .orderBy(desc(giftingEnquiries.createdAt))
      .limit(limit)
      .offset(offset),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
