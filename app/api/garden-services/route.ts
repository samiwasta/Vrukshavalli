import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gardenServiceEnquiries } from "@/lib/db/schema/garden-service-enquiries";
import { z } from "zod";
import { and, count, eq, gte } from "drizzle-orm";

const serviceIdSchema = z.enum([
  "landscaping",
  "vertical-gardening",
  "farm-development",
]);

const bodySchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/),
  address: z.string().min(5),
  message: z.string().optional(),
  services: z.array(serviceIdSchema).min(1),
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

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const [{ value }] = await db
      .select({ value: count() })
      .from(gardenServiceEnquiries)
      .where(
        and(
          gte(gardenServiceEnquiries.createdAt, oneHourAgo),
          eq(gardenServiceEnquiries.ip, ip)
        )
      );

    if (value >= 5) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    await db.insert(gardenServiceEnquiries).values({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address,
      services: parsed.data.services,
      message: parsed.data.message?.trim() || null,
      ip,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Garden services enquiry error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
