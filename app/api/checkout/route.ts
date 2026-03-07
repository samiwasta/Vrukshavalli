import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";

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

  const orderId = crypto.randomUUID();

  const orderNumber =
    "VRK-" +
    new Date().toISOString().slice(0, 10).replace(/-/g, "") +
    "-" +
    Math.floor(Math.random() * 10000);

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
    order_meta: {
      return_url: `${process.env.BETTER_AUTH_URL}/thankyou?order_id=${orderId}`,
    },
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