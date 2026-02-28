import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { giftingEnquiries } from "@/lib/db/schema";
import { z } from "zod";

const bodySchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().min(2),
  moq: z.string().min(1),
  deliveryType: z.enum(["single", "multiple"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten() },
        { status: 422 }
      );
    }

    await db.insert(giftingEnquiries).values(parsed.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gifting error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}