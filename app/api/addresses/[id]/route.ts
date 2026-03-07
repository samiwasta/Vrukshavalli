import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema/addresses";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const addressSchema = z.object({
  alias: z.string().optional(),
  fullName: z.string().min(1),
  phone: z.string().regex(/^\d{10}$/),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/),
  isDefault: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json();
  const parsed = addressSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // If setting this as default → unset others
  if (data.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, user.id));
  }

  const [updated] = await db
    .update(addresses)
    .set(data)
    .where(
      and(
        eq(addresses.id, id),
        eq(addresses.userId, user.id)
      )
    )
    .returning();

  return NextResponse.json({
    success: true,
    data: updated,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  await db
    .delete(addresses)
    .where(
      and(
        eq(addresses.id, id),
        eq(addresses.userId, user.id)
      )
    );

  return NextResponse.json({ success: true });
}