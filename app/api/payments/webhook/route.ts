import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema/orders";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    console.log("Cashfree webhook:", payload);

    const orderId = payload?.data?.order?.order_id;
    const paymentStatus = payload?.data?.payment?.payment_status;
    const paymentId = payload?.data?.payment?.cf_payment_id

    if (!orderId) {
      return NextResponse.json({ ok: true });
    }

    if (paymentStatus === "SUCCESS") {
      await db
      .update(orders)
      .set({
        paymentStatus: "paid",
        status: "processing",
        paymentId
    })
    .where(eq(orders.id, orderId))
    }

    if (paymentStatus === "FAILED") {
      await db
        .update(orders)
        .set({
          paymentStatus: "failed",
        })
        .where(eq(orders.id, orderId));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error", err);
    return NextResponse.json({ ok: true });
  }
}