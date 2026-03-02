import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
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
    ? or(ilike(users.name, `%${search}%`), ilike(users.phone, `%${search}%`))
    : undefined;

  const [totalResult, data] = await Promise.all([
    db.select({ total: count() }).from(users).where(where),
    db.select().from(users).where(where).orderBy(desc(users.createdAt)).limit(limit).offset(offset),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
