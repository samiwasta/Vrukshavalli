import { getSession } from "@/lib/session";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  return NextResponse.json(session);
}