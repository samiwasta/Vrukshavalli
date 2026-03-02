import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema/contact-submissions";
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
        ilike(contactSubmissions.name, `%${search}%`),
        ilike(contactSubmissions.email, `%${search}%`),
        ilike(contactSubmissions.subject, `%${search}%`)
      )
    : undefined;

  const [totalResult, data] = await Promise.all([
    db.select({ total: count() }).from(contactSubmissions).where(where),
    db
      .select()
      .from(contactSubmissions)
      .where(where)
      .orderBy(desc(contactSubmissions.createdAt))
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
