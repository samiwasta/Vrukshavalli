import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";
import { products } from "@/lib/db/schema/products";
import { users } from "@/lib/db/schema/users";
import { coupons } from "@/lib/db/schema/coupons";
import { contactSubmissions } from "@/lib/db/schema/contact-submissions";
import { giftingEnquiries } from "@/lib/db/schema/gifting-enquiries";
import { gardenServiceEnquiries } from "@/lib/db/schema/garden-service-enquiries";
import { count, sum, eq, desc, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const [
    [{ totalOrders }],
    [{ totalRevenue }],
    [{ totalProducts }],
    [{ outOfStock }],
    [{ totalUsers }],
    [{ pendingOrders }],
    [{ processingOrders }],
    [{ totalContacts }],
    [{ totalGifting }],
    [{ totalGardenServices }],
    [{ activeCoupons }],
    statusBreakdown,
  ] = await Promise.all([
    db.select({ totalOrders: count() }).from(orders),
    db.select({ totalRevenue: sum(orders.totalAmount) }).from(orders).where(eq(orders.paymentStatus, "paid")),
    db.select({ totalProducts: count() }).from(products).where(eq(products.isActive, true)),
    db.select({ outOfStock: count() }).from(products).where(and(eq(products.isActive, true), eq(products.stock, 0))),
    db.select({ totalUsers: count() }).from(users),
    db.select({ pendingOrders: count() }).from(orders).where(eq(orders.status, "pending")),
    db.select({ processingOrders: count() }).from(orders).where(eq(orders.status, "processing")),
    db.select({ totalContacts: count() }).from(contactSubmissions),
    db.select({ totalGifting: count() }).from(giftingEnquiries),
    db
      .select({ totalGardenServices: count() })
      .from(gardenServiceEnquiries),
    db.select({ activeCoupons: count() }).from(coupons).where(eq(coupons.isActive, true)),
    db.select({ status: orders.status, cnt: count() }).from(orders).groupBy(orders.status),
  ]);

  // Recent orders with user name
  const recentOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      totalAmount: orders.totalAmount,
      createdAt: orders.createdAt,
      userName: users.name,
      userPhone: users.phone,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(6);

  return NextResponse.json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: Number(totalRevenue ?? 0),
      totalProducts,
      outOfStock,
      totalUsers,
      pendingOrders,
      processingOrders,
      totalContacts,
      totalGifting,
      totalGardenServices,
      activeCoupons,
      statusBreakdown,
      recentOrders,
    },
  });
}
