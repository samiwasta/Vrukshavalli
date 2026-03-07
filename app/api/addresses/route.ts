import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema/addresses";
import { eq, desc } from "drizzle-orm";
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

export async function GET(request: Request) {
  const user = await getCurrentUser(request);

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const userAddresses = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, user.id))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));

  return NextResponse.json({
    success: true,
    data: userAddresses,
  });
}
export async function POST(req: Request) {
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

  // If new address is default → unset previous default
  if (data.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, user.id));
  }

  const [newAddress] = await db
    .insert(addresses)
    .values({
      ...data,
      userId: user.id,
    })
    .returning();

  return NextResponse.json({
    success: true,
    data: newAddress,
  });
}