import { NextResponse } from "next/server";
import { db, products } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/current-user";
import { insertProductSchema } from "@/lib/db/schema/products";
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ unwrap params (Next.js 16)
    const { id: idOrSlug } = await context.params;

    // ✅ detect UUID properly
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
        idOrSlug
      );

    // ✅ query
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.isActive, true),
        isUUID
          ? eq(products.id, idOrSlug)
          : eq(products.slug, idOrSlug)
      ),
      with: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
        details: String(error), // keep for debugging
      },
      { status: 500 }
    );
  }
}
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // ✅ admin check
    const user = await getCurrentUser(request);

    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // ❗ partial validation
    const partialSchema = insertProductSchema.partial();

    const parsed = partialSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid product data",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedData = {
      ...parsed.data,
      updatedAt: new Date(),
    };

    const [updatedProduct] = await db
      .update(products)
      .set(updatedData)
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct) {
      return Response.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("PATCH product error:", error);

    return Response.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // ✅ admin check
    const user = await getCurrentUser(_request);

    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const [deletedProduct] = await db
      .update(products)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    if (!deletedProduct) {
      return Response.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE product error:", error);

    return Response.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}