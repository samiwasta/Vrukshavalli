import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyCashfreeWebhookSignature(
  signature: string | null | undefined,
  rawBody: string,
  timestamp: string | null | undefined,
  secretKey: string,
): boolean {
  if (!signature || !timestamp || !secretKey) return false;
  const signedPayload = timestamp + rawBody;
  const generated = createHmac("sha256", secretKey)
    .update(signedPayload)
    .digest("base64");
  try {
    const a = Buffer.from(generated, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
