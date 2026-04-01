import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";
import { eq, desc, ne, and } from "drizzle-orm";

export async function GET(request: Request) {
  const user = await getCurrentUser(request);

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const userOrders = await db
    .select()
    .from(orders)
    .where(and(eq(orders.userId, user.id), ne(orders.paymentStatus, "pending")))
    .orderBy(desc(orders.createdAt));

  const data = userOrders.map((o) => {
    const items = (o.items as OrderItemRow[]) ?? [];
    const itemCount = items.reduce((s, i) => s + (i.quantity ?? i.qty ?? 1), 0);

    return {
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      total: Number(o.totalAmount),
      itemCount,
      items: items.map((i, idx) => ({
        id: i.productId ?? String(idx),
        name: i.name,
        variant: i.variant ?? "",
        qty: i.quantity ?? i.qty ?? 1,
        price: Number(i.price),
        image: i.image ?? "",
      })),
      date: formatDate(o.createdAt),
      estimatedDelivery: estimatedDeliveryStr(o.createdAt, o.status as string),
      createdAt: o.createdAt.toISOString(),
    };
  });

  return NextResponse.json({ success: true, data });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

interface OrderItemRow {
  productId?: string;
  name: string;
  variant?: string;
  price: number | string;
  quantity?: number;
  qty?: number;
  image?: string;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function estimatedDeliveryStr(createdAt: Date, status: string): string {
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "—";

  const from = new Date(createdAt);
  from.setDate(from.getDate() + 5);
  const to = new Date(createdAt);
  to.setDate(to.getDate() + 7);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return `${fmt(from)} – ${fmt(to)}`;
}
