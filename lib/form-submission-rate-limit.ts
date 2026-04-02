import { db } from "@/lib/db";
import {
  contactSubmissions,
  giftingEnquiries,
} from "@/lib/db/schema";
import { gardenServiceEnquiries } from "@/lib/db/schema/garden-service-enquiries";
import { and, count, eq, gte } from "drizzle-orm";

export const FORM_RATE_LIMIT_PER_HOUR = 5;
export const FORM_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

type FormRateLimitTable =
  | typeof contactSubmissions
  | typeof giftingEnquiries
  | typeof gardenServiceEnquiries;

export async function formSubmissionCountInWindow(
  table: FormRateLimitTable,
  ip: string
): Promise<number> {
  const since = new Date(Date.now() - FORM_RATE_LIMIT_WINDOW_MS);
  const [{ value }] = await db
    .select({ value: count() })
    .from(table)
    .where(and(gte(table.createdAt, since), eq(table.ip, ip)));
  return value;
}

export function isFormRateLimited(count: number): boolean {
  return count >= FORM_RATE_LIMIT_PER_HOUR;
}
