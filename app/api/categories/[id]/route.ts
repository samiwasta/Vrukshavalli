import { NextResponse } from "next/server";
import { db, categories, products } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { insertCategorySchema } from "@/lib/db/schema/categories";
import { eq, count } from "drizzle-orm";

// ✏️ PATCH — update category
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const partialSchema = insertCategorySchema.partial();

    const parsed = partialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid category data",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedData = {
      ...parsed.data,
      updatedAt: new Date(),
    };

    const [updatedCategory] = await db
      .update(categories)
      .set(updatedData)
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error("PATCH category error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// 🗑 DELETE — delete category (only if no products linked)
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const user = await getCurrentUser(_request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // ❗ check if category has products
    const [{ total }] = await db
      .select({ total: count() })
      .from(products)
      .where(eq(products.categoryId, id));

    if (total > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete category with linked products",
        },
        { status: 400 }
      );
    }

    const [deletedCategory] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE category error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}