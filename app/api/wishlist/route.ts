import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wishlist } from "@/lib/db/schema/wishlist";
import { getCurrentUser } from "@/lib/current-user";
import { products } from "@/lib/db/schema/products";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
export async function GET(request:Request) {
  try {
    const user = await getCurrentUser(request);

    // 🔐 Require auth
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📦 Fetch wishlist with product data
    const items = await db.query.wishlist.findMany({
      where: eq(wishlist.userId, user.id),
      with: {
        product: {
          with: {
            category: true,
          },
        },
      },
      orderBy: (wishlist, { desc }) => [desc(wishlist.createdAt)],
    });

    // 🎯 Transform to match WishlistContext UI model
    const formatted = items.map((item) => {
      const p = item.product;

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
        image: p.image,
        rating: p.rating ? Number(p.rating) : undefined,
        reviewCount: p.reviewCount ?? 0,
        category: p.category?.name,
        stock: p.stock ?? 0,
        stockCapacity: p.stockCapacity ?? null,
        isNew: p.isNew,
        isBestSeller: p.isBestSeller,
        isHandPicked: p.isHandPicked,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("GET wishlist error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}
const bodySchema = z.object({
  productId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);

    // 🔐 Require auth
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📥 Parse body
    const json = await request.json();

    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid productId" },
        { status: 400 }
      );
    }

    const { productId } = parsed.data;

    // 🔎 Ensure product exists & is active
    const product = await db.query.products.findFirst({
      where: and(eq(products.id, productId), eq(products.isActive, true)),
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // ➕ Insert (ignore duplicates)
    await db
      .insert(wishlist)
      .values({
        userId: user.id,
        productId,
      })
      .onConflictDoNothing();

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST wishlist error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
} 