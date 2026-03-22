import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { user as baUser } from "@/lib/db/schema/auth";
import { addresses } from "@/lib/db/schema/addresses";
import { and, count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-auth";

type SavedAddressRow = typeof addresses.$inferSelect;

type DisplayAddressPayload = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  alias: string | null;
};

function rowToPayload(row: SavedAddressRow): DisplayAddressPayload {
  return {
    fullName: row.fullName,
    phone: row.phone,
    line1: row.line1,
    line2: row.line2,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    alias: row.alias,
  };
}

function pickSavedAddress(rows: SavedAddressRow[]): SavedAddressRow | null {
  if (rows.length === 0) return null;
  const primary = rows.find((r) => r.isDefault === true);
  if (primary) return primary;
  const sorted = [...rows].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return sorted[0] ?? null;
}

function displayFromProfileJson(
  raw: unknown
): DisplayAddressPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const line1 = String(o.line1 ?? "");
  const city = String(o.city ?? "");
  const fullName = String(o.fullName ?? o.name ?? "");
  if (!line1.trim() && !city.trim() && !fullName.trim()) return null;
  return {
    fullName,
    phone: String(o.phone ?? ""),
    line1,
    line2: o.line2 != null ? String(o.line2) : null,
    city,
    state: String(o.state ?? ""),
    pincode: String(o.pincode ?? o.pin ?? ""),
    alias: null,
  };
}

export async function GET(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const offset = (page - 1) * limit;
  const search = searchParams.get("search")?.trim() ?? "";

  const customerOnly = eq(users.role, "customer");

  const whereClause = search
    ? and(
        customerOnly,
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.phone, `%${search}%`),
          ilike(baUser.email, `%${search}%`)
        )
      )
    : customerOnly;

  const [totalResult, data] = await Promise.all([
    db
      .select({ total: count() })
      .from(users)
      .leftJoin(baUser, eq(users.authId, baUser.id))
      .where(whereClause),
    db
      .select({
        id: users.id,
        authId: users.authId,
        name: users.name,
        phone: users.phone,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        profileShippingAddress: users.shippingAddress,
        email: baUser.email,
      })
      .from(users)
      .leftJoin(baUser, eq(users.authId, baUser.id))
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset),
  ]);

  const total = totalResult[0]?.total ?? 0;

  const userIds = data.map((u) => u.id);
  const savedRows =
    userIds.length > 0
      ? await db
          .select()
          .from(addresses)
          .where(inArray(addresses.userId, userIds))
      : [];

  const byUser = new Map<string, SavedAddressRow[]>();
  for (const row of savedRows) {
    const list = byUser.get(row.userId) ?? [];
    list.push(row);
    byUser.set(row.userId, list);
  }

  const payload = data.map((u) => {
    const picked = pickSavedAddress(byUser.get(u.id) ?? []);
    const displayAddress: DisplayAddressPayload | null = picked
      ? rowToPayload(picked)
      : displayFromProfileJson(u.profileShippingAddress);
    const { profileShippingAddress: _p, ...rest } = u;
    return { ...rest, displayAddress };
  });

  return NextResponse.json({
    success: true,
    data: payload,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
