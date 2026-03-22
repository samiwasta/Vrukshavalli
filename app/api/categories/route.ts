import { NextResponse } from "next/server";
import { db, categories } from "@/lib/db";
import { insertCategorySchema } from "@/lib/db/schema/categories";
import { getCurrentUser } from "@/lib/current-user";

// 🌐 GET all categories (public)
export async function GET() {
  try {
    const data = await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET categories error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// 🔐 POST create category (admin only)
export async function POST(request: Request) {
  try {
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

    // ✅ auto-generate slug
    const generatedSlug =
      body.slug ??
      body.name
        ?.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    const payload = {
      ...body,
      slug: generatedSlug,
    };

    const parsed = insertCategorySchema.safeParse(payload);

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

    const [newCategory] = await db
      .insert(categories)
      .values(parsed.data)
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST category error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}