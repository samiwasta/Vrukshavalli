import { NextResponse } from "next/server";
import { snapshotBagStockLines } from "@/lib/validate-order-stock";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const raw = body?.lines ?? body?.items;
    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json(
        { success: false, error: "lines or items array required" },
        { status: 400 }
      );
    }

    const lines = raw.map((row: { productId?: string; id?: string; quantity?: number }) => ({
      productId: String(row.productId ?? row.id ?? "").trim(),
      quantity: Math.max(0, Number(row.quantity) || 0),
    })).filter((l: { productId: string; quantity: number }) => l.productId && l.quantity > 0);

    if (!lines.length) {
      return NextResponse.json({
        success: true,
        data: { canCheckout: true, rows: [] },
      });
    }

    const rows = await snapshotBagStockLines(lines);
    const canCheckout = rows.every((r) => r.canCheckout);

    return NextResponse.json({
      success: true,
      data: { canCheckout, rows },
    });
  } catch (e) {
    console.error("validate-stock", e);
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 500 }
    );
  }
}
