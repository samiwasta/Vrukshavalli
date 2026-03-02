import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";
import { z } from "zod";

const addressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().regex(/^\d{10}$/),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^\d{6}$/),
});

const updateProfileSchema = z
  .object({
    name: z.string().min(1).optional(),
    phone: z.string().regex(/^\d{10}$/).optional(),
    shippingAddress: addressSchema.optional(),
  })
  .strict();

export async function GET(req: Request) {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      shippingAddress: user.shippingAddress ?? null,
    },
  });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(users)
    .set(parsed.data)
    .where(eq(users.id, user.id))
    .returning();

  return NextResponse.json({
    success: true,
    data: {
      ...updated,
      email: user.email,
    },
  });
}