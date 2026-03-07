import { getCurrentUser } from "@/lib/current-user";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  return NextResponse.json(user);
}