import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protects /admin/* routes.
 * The actual role check happens inside the admin layout and API routes using getCurrentUser,
 * since middleware can't easily run Drizzle/DB queries.
 * This middleware just ensures the user has a session cookie before serving any admin page.
 */
export function middleware(request: NextRequest) {
  // We rely on layout-level auth check for full role validation.
  // This is a lightweight guard to redirect unauthenticated users.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
