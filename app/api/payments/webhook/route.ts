import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";
import { and, eq } from "drizzle-orm";
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree-webhook-verify";

const ORDER_ID_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type CashfreeWebhookBody = {
  type?: string;
  event_time?: string;
  data?: {
    order?: { order_id?: string };
    payment?: {
      cf_payment_id?: string | number;
      payment_status?: string;
      payment_time?: string;
      payment_message?: string;
    };
    payment_gateway_details?: { gateway_order_id?: string | number };
    customer_details?: unknown;
    error_details?: unknown;
  };
};

function parsePaymentTime(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  const timestamp = req.headers.get("x-webhook-timestamp");
  const secret = process.env.CASHFREE_SECRET_KEY ?? "";
  const skipVerify = process.env.CASHFREE_SKIP_WEBHOOK_VERIFY === "true";

  if (!skipVerify && secret) {
    if (!signature || !timestamp) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 401 });
    }
    if (!verifyCashfreeWebhookSignature(signature, rawBody, timestamp, secret)) {
      console.error("Cashfree webhook: signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: CashfreeWebhookBody;
  try {
    payload = JSON.parse(rawBody) as CashfreeWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = payload.data?.order?.order_id;
  if (!orderId || !ORDER_ID_UUID.test(orderId)) {
    return NextResponse.json({ ok: true });
  }

  const webhookType = payload.type ?? "";
  const payment = payload.data?.payment;
  const paymentStatus = payment?.payment_status ?? "";
  const cfPaymentId =
    payment?.cf_payment_id != null ? String(payment.cf_payment_id) : undefined;
  const gatewayOrderId =
    payload.data?.payment_gateway_details?.gateway_order_id != null
      ? String(payload.data.payment_gateway_details.gateway_order_id)
      : undefined;
  const paymentTime = parsePaymentTime(payment?.payment_time);

  const gatewaySnapshot = {
    webhookType,
    eventTime: payload.event_time,
    payment,
    order: payload.data?.order,
    payment_gateway_details: payload.data?.payment_gateway_details,
    customer_details: payload.data?.customer_details,
    error_details: payload.data?.error_details,
  };

  try {
    if (
      webhookType === "PAYMENT_SUCCESS_WEBHOOK" ||
      paymentStatus === "SUCCESS"
    ) {
      await db
        .update(orders)
        .set({
          paymentStatus: "paid",
          status: "processing",
          paymentId: cfPaymentId,
          paymentTime: paymentTime ?? new Date(),
          cashfreeOrderId: gatewayOrderId,
          gatewayResponse: gatewaySnapshot,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));
      return NextResponse.json({ ok: true });
    }

    if (
      webhookType === "PAYMENT_FAILED_WEBHOOK" ||
      paymentStatus === "FAILED"
    ) {
      await db
        .update(orders)
        .set({
          paymentStatus: "failed",
          status: "cancelled",
          paymentId: cfPaymentId,
          cashfreeOrderId: gatewayOrderId,
          gatewayResponse: gatewaySnapshot,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));
      return NextResponse.json({ ok: true });
    }

    if (
      webhookType === "PAYMENT_USER_DROPPED_WEBHOOK" ||
      paymentStatus === "USER_DROPPED" ||
      paymentStatus === "CANCELLED" ||
      paymentStatus === "NOT_ATTEMPTED"
    ) {
      await db
        .update(orders)
        .set({
          paymentStatus: "failed",
          status: "cancelled",
          paymentId: cfPaymentId,
          cashfreeOrderId: gatewayOrderId,
          gatewayResponse: gatewaySnapshot,
          updatedAt: new Date(),
        })
        .where(and(eq(orders.id, orderId), eq(orders.paymentStatus, "pending")));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Cashfree webhook DB error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
