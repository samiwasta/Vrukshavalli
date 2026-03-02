import { getCurrentUser } from "@/lib/current-user";
import { NextResponse } from "next/server";

/** Returns the admin user or a 401/403 JSON response. */
export async function requireAdmin(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (user.role !== "admin") {
    return {
      user: null,
      error: NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }),
    };
  }
  return { user, error: null };
}
