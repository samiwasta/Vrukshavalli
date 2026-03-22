import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";
import { validateOrderStock } from "@/lib/validate-order-stock";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CASHFREE_ENV =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders";

export async function POST(req: Request) {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json();

  const {
    items,
    shippingAddress,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    couponCode,
  } = body;

  if (!items?.length) {
    return NextResponse.json(
      { success: false, error: "Cart empty" },
      { status: 400 }
    );
  }

  const stockLines = items.map(
    (row: { id?: string; quantity?: number }) => ({
      productId: String(row.id ?? "").trim(),
      quantity: Math.max(0, Math.floor(Number(row.quantity) || 0)),
    })
  ).filter((l: { productId: string; quantity: number }) => l.productId && l.quantity > 0);

  if (!stockLines.length) {
    return NextResponse.json(
      { success: false, error: "Invalid cart lines" },
      { status: 400 }
    );
  }

  const stockCheck = await validateOrderStock(stockLines);
  if (!stockCheck.ok) {
    const first = stockCheck.issues[0];
    const msg =
      first.code === "out_of_stock"
        ? `${first.name} is out of stock. Remove it or reduce quantity to continue.`
        : first.code === "insufficient"
          ? `${first.name}: only ${first.available} available (you have ${first.requested}).`
          : `${first.name} is no longer available.`;
    return NextResponse.json(
      {
        success: false,
        error: msg,
        issues: stockCheck.issues,
      },
      { status: 409 }
    );
  }

  const orderId = crypto.randomUUID();

  const orderNumber =
    "VRK-" +
    new Date().toISOString().slice(0, 10).replace(/-/g, "") +
    "-" +
    Math.floor(Math.random() * 10000);

  const baseUrl = process.env.BETTER_AUTH_URL?.replace(/\/$/, "");
  const orderMeta: Record<string, string> = {
    return_url: `${process.env.BETTER_AUTH_URL}/thankyou?order_id=${orderId}`,
  };
  const notifyUrl =
    process.env.CASHFREE_NOTIFY_URL ??
    (baseUrl ? `${baseUrl}/api/payments/webhook` : "");
  if (notifyUrl) {
    orderMeta.notify_url = notifyUrl;
  }

  const payload = {
    order_id: orderId,
    order_amount: parseFloat(Number(total).toFixed(2)),
    order_currency: "INR",
    customer_details: {
      customer_id: user.id,
      customer_email: user.email,
      customer_phone: shippingAddress.phone,
      customer_name: shippingAddress.fullName,
    },
    order_meta: orderMeta,
  };

  const cfRes = await fetch(CASHFREE_ENV, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": CASHFREE_APP_ID,
      "x-client-secret": CASHFREE_SECRET_KEY,
      "x-api-version": "2022-09-01",
    },
    body: JSON.stringify(payload),
  });

  const cfJson = await cfRes.json();

  if (!cfRes.ok) {
    console.error("Cashfree error:", cfJson);

    return NextResponse.json(
      { success: false, error: "Payment initialization failed" },
      { status: 500 }
    );
  }

  const paymentSessionId = cfJson.payment_session_id;

  await db.insert(orders).values({
    id: orderId,
    userId: user.id,
    orderNumber,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "cashfree",
    totalAmount: total.toString(),
    shippingAddress,
    items,
    paymentSessionId,
  });

  return NextResponse.json({
    success: true,
    data: {
      paymentSessionId,
      orderId,
    },
  });
}