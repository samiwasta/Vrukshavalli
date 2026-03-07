import { requireAdmin } from "@/lib/admin-auth";
import { db, orders, users } from "@/lib/db";
import { eq, or, ilike, and, count, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const offset = (page - 1) * limit;

  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim();

  const conditions = [];

  if (status && status !== "all") {
    conditions.push(eq(orders.status, status as any));
  }

  if (search) {
    conditions.push(
      or(
        ilike(orders.orderNumber, `%${search}%`),
        ilike(users.name, `%${search}%`)
      )
    );
  }

  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult, data] = await Promise.all([
    db.select({ total: count() }).from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(whereClause),

    db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        totalAmount: orders.totalAmount,
        paymentStatus: orders.paymentStatus,
        paymentMethod: orders.paymentMethod,
        createdAt: orders.createdAt,
        items: orders.items,
        shippingAddress: orders.shippingAddress,
        userId: orders.userId,
        userName: users.name,
        userPhone: users.phone,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return NextResponse.json({
  success: true,
  data: data.map((o: any) => ({
    ...o,
    totalAmount: Number(o.totalAmount),
    createdAt: o.createdAt?.toISOString?.() ?? null,
  })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}