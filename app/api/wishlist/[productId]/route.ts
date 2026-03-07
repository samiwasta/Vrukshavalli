import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wishlist } from "@/lib/db/schema/wishlist";
import { getCurrentUser } from "@/lib/current-user";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;

    const user = await getCurrentUser(_request);

    // 🔐 Require auth
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🗑️ Delete only the current user's row
    await db
      .delete(wishlist)
      .where(
        and(
          eq(wishlist.userId, user.id),
          eq(wishlist.productId, productId)
        )
      );

    // ✅ Even if item didn't exist → still 204 (idempotent)
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("DELETE wishlist error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}