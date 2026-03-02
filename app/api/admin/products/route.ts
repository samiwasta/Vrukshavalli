import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema/products";
import { desc, count, eq, and, ilike, or } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";
import { insertProductSchema } from "@/lib/db/schema/products";

export async function GET(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const offset = (page - 1) * limit;
  const search = searchParams.get("search")?.trim();
  const categoryId = searchParams.get("categoryId");
  const isActiveParam = searchParams.get("isActive");

  const conditions: any[] = [];

  if (search) {
    const term = `%${search}%`;
    conditions.push(or(ilike(products.name, term), ilike(products.description ?? "", term)));
  }

  if (categoryId) {
    conditions.push(eq(products.categoryId, categoryId));
  }

  if (isActiveParam !== null && isActiveParam !== "") {
    conditions.push(eq(products.isActive, isActiveParam === "true"));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult, data] = await Promise.all([
    db.select({ total: count() }).from(products).where(whereClause),
    db.query.products.findMany({
      where: whereClause,
      orderBy: desc(products.createdAt),
      limit,
      offset,
      with: { category: true },
    }),
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
  const generatedSlug =
    body.slug ??
    body.name
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const parsed = insertProductSchema.safeParse({ ...body, slug: generatedSlug });
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const [newProduct] = await db.insert(products).values(parsed.data).returning();
  return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
}
