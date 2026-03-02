import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";
import { users } from "@/lib/db/schema/users";
import { desc, eq, ilike, or, count, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

export async function GET(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const offset = (page - 1) * limit;
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim();

  const conditions: ReturnType<typeof eq>[] = [];
  if (status && status !== "all") {
    conditions.push(eq(orders.status, status as any));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult, data] = await Promise.all([
    db.select({ total: count() }).from(orders).where(whereClause),
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

  // client-side search on order number / user name (already limited set)
  const filtered = search
    ? data.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          o.userName?.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  return NextResponse.json({
    success: true,
    data: filtered,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
