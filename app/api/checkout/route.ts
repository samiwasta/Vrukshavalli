import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";
import {
  resolveCheckoutLines,
  formatLinesForOrderStorage,
} from "@/lib/resolve-checkout-lines";
import { computeCheckoutShipping } from "@/lib/checkout-shipping";
import {
  validateCouponByCode,
  computeCouponDiscountAmount,
  normalizeCouponCode,
} from "@/lib/coupon-validate";

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CASHFREE_ORDERS_URL =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders";

const isCashfreeProduction = process.env.CASHFREE_ENV === "production";

function getAppBaseUrl(req: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  try {
    return new URL(req.url).origin;
  } catch {
    return "http://localhost:3000";
  }
}

function httpsBaseForCashfree(baseUrl: string): string {
  if (!isCashfreeProduction || !baseUrl.startsWith("http://")) {
    return baseUrl;
  }
  return `https://${baseUrl.slice("http://".length)}`;
}

export async function POST(req: Request) {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json();

  const {
    items,
    shippingAddress,
    total: clientTotal,
    couponCode: rawCouponCode,
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

  const resolved = await resolveCheckoutLines(stockLines);
  if (!resolved.ok) {
    return NextResponse.json(
      {
        success: false,
        error: resolved.error,
        issues: resolved.issues,
      },
      { status: 409 },
    );
  }

  const subtotal = resolved.subtotal;
  const orderItems = formatLinesForOrderStorage(resolved.lines);

  let validatedCouponCode: string | null = null;
  let discount = 0;

  if (rawCouponCode && typeof rawCouponCode === "string") {
    const couponResult = await validateCouponByCode(rawCouponCode, {
      userId: user.id,
    });

    if (!couponResult.valid) {
      return NextResponse.json(
        { success: false, error: couponResult.reason },
        { status: 400 },
      );
    }

    validatedCouponCode = normalizeCouponCode(couponResult.code);
    discount = computeCouponDiscountAmount(
      subtotal,
      couponResult.discountType,
      couponResult.discountValue,
    );
  }
  const taxableAmount = Math.max(subtotal - discount, 0);
  const productIds = resolved.lines.map((l) => l.productId);
  const shippingAmount = await computeCheckoutShipping(productIds, taxableAmount);
  const taxAmount = taxableAmount * 0.18;
  const serverTotal = parseFloat(
    (taxableAmount + taxAmount + shippingAmount).toFixed(2),
  );

  const clientTotalNum = parseFloat(Number(clientTotal).toFixed(2));
  if (Math.abs(serverTotal - clientTotalNum) > 0.02) {
    return NextResponse.json(
      { success: false, error: "Order total changed. Refresh your bag and try again." },
      { status: 409 },
    );
  }

  const orderId = crypto.randomUUID();

  const orderNumber =
    "VRK-" +
    new Date().toISOString().slice(0, 10).replace(/-/g, "") +
    "-" +
    Math.floor(Math.random() * 10000);

  const baseUrl = httpsBaseForCashfree(getAppBaseUrl(req));

  const orderMeta: Record<string, string> = {
    return_url: `${baseUrl}/thankyou?order_id=${orderId}`,
    notify_url: `${baseUrl}/api/payments/webhook`,
  };

  const payload = {
    order_id: orderId,
    order_amount: serverTotal,
    order_currency: "INR",
    customer_details: {
      customer_id: user.id,
      customer_email: user.email,
      customer_phone: shippingAddress.phone,
      customer_name: shippingAddress.fullName,
    },
    order_meta: orderMeta,
  };

  const cfRes = await fetch(CASHFREE_ORDERS_URL, {
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
    totalAmount: serverTotal.toFixed(2),
    shippingAddress,
    items: orderItems,
    paymentSessionId,
    couponCode: validatedCouponCode,
    discountAmount: discount > 0 ? discount.toFixed(2) : null,
  });

  return NextResponse.json({
    success: true,
    data: {
      paymentSessionId,
      orderId,
    },
  });
}