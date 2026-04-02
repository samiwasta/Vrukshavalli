import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import {
  formSubmissionCountInWindow,
  getClientIp,
  isFormRateLimited,
} from "@/lib/form-submission-rate-limit";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(20),
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

    const ip = getClientIp(request);

    const recent = await formSubmissionCountInWindow(contactSubmissions, ip);
    if (isFormRateLimited(recent)) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    await db.insert(contactSubmissions).values({
      ...parsed.data,
      ip,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to submit form" },
      { status: 500 }
    );
  }
}