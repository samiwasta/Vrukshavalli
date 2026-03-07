import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";
import { eq, and } from "drizzle-orm";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CASHFREE_BASE =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

async function verifyCashfreePayment(orderId: string) {
  try {
    const res = await fetch(`${CASHFREE_BASE}/orders/${orderId}/payments`, {
      headers: {
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const payments = await res.json();
    if (!Array.isArray(payments) || payments.length === 0) return null;
    // Return the latest payment
    return payments[payments.length - 1] as { payment_status: string; cf_payment_id: string };
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  let [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userId, user.id)))
    .limit(1);

  if (!order) {
    return NextResponse.json(
      { success: false, error: "Order not found" },
      { status: 404 }
    );
  }

  // If payment is still pending, check Cashfree in real-time and sync
  if (order.paymentStatus === "pending") {
    const payment = await verifyCashfreePayment(id);
    if (payment?.payment_status === "SUCCESS") {
      const [updated] = await db
        .update(orders)
        .set({ paymentStatus: "paid", status: "processing", paymentId: payment.cf_payment_id })
        .where(eq(orders.id, id))
        .returning();
      if (updated) order = updated;
    } else if (payment?.payment_status === "FAILED") {
      const [updated] = await db
        .update(orders)
        .set({ paymentStatus: "failed" })
        .where(eq(orders.id, id))
        .returning();
      if (updated) order = updated;
    }
  }

  const items = (order.items as OrderItemRow[]) ?? [];

  const shippingAddress = order.shippingAddress as ShippingAddressRow | null;

  const data = {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: Number(order.totalAmount),
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    items: items.map((i, idx) => ({
      id: i.productId ?? String(idx),
      name: i.name,
      variant: i.variant ?? "",
      qty: i.quantity ?? i.qty ?? 1,
      price: Number(i.price),
      image: i.image ?? "",
    })),
    shippingAddress: shippingAddress
      ? {
          name: shippingAddress.fullName ?? shippingAddress.name ?? "",
          line1: shippingAddress.line1 ?? "",
          line2: shippingAddress.line2 ?? "",
          city: shippingAddress.city ?? "",
          state: shippingAddress.state ?? "",
          pin: shippingAddress.pincode ?? shippingAddress.pin ?? "",
          phone: shippingAddress.phone ?? "",
        }
      : null,
    date: formatDate(order.createdAt),
    estimatedDelivery: estimatedDeliveryStr(order.createdAt, order.status),
    timeline: buildTimeline(order),
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };

  return NextResponse.json({ success: true, data });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface OrderItemRow {
  productId?: string;
  name: string;
  variant?: string;
  price: number | string;
  quantity?: number;
  qty?: number;
  image?: string;
}

interface ShippingAddressRow {
  fullName?: string;
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  pin?: string;
  phone?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimestamp(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) +
    ", " +
    d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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

/** Generate a timeline from order status + timestamps. */
function buildTimeline(order: {
  status: string;
  totalAmount: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  const STATUS_ORDER = ["pending", "processing", "shipped", "delivered"] as const;

  const steps = [
    {
      label: "Order Placed",
      description: "Your order was received successfully.",
    },
    {
      label: "Payment Confirmed",
      description: `Payment of ₹${Number(order.totalAmount).toLocaleString("en-IN")} captured${order.paymentStatus === "paid" ? "." : " (pending)."}`,
    },
    {
      label: "Processing",
      description: "Our team is packing your plants with care.",
    },
    {
      label: "Shipped",
      description: "Order dispatched and on its way.",
    },
    {
      label: "Delivered",
      description: "Package delivered to your doorstep.",
    },
  ];

  if (order.status === "cancelled") {
    return [
      {
        label: "Order Placed",
        description: "Your order was received.",
        timestamp: formatTimestamp(order.createdAt),
        done: true,
        active: false,
      },
      {
        label: "Cancelled",
        description: "This order was cancelled.",
        timestamp: formatTimestamp(order.updatedAt),
        done: true,
        active: false,
      },
    ];
  }

  const currentIdx = STATUS_ORDER.indexOf(
    order.status as (typeof STATUS_ORDER)[number]
  );

  // Map steps: 0=pending→step0,1; 1=processing→step2; 2=shipped→step3; 3=delivered→step4
  const stepStatusMap = [0, 0, 1, 2, 3]; // which STATUS_ORDER index each step corresponds to

  return steps.map((step, i) => {
    const stepLevel = stepStatusMap[i];
    const done = stepLevel < currentIdx || (stepLevel === currentIdx && i <= currentIdx + 1);
    const active = stepLevel === currentIdx && !done;

    let timestamp: string;
    if (done || active) {
      // For completed/active steps, show the order timestamps
      if (i <= 1) {
        timestamp = formatTimestamp(order.createdAt);
      } else {
        timestamp = formatTimestamp(order.updatedAt);
      }
    } else {
      timestamp = "Pending";
    }

    return {
      label: step.label,
      description: step.description,
      timestamp,
      done,
      active: active && !done,
    };
  });
}
