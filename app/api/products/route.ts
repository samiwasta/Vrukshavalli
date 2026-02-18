import { NextResponse } from "next/server";
import { db, products } from "@/lib/db";
import { ilike, or } from "drizzle-orm";

/**
 * TODO BACKEND DEVELOPER - Products API
 *
 * TASK:
 * - Harden GET: add query params for category (slug), pagination (page, limit), sort, and filters
 *   (priceMin, priceMax, ratingMin, isNew, isBestSeller, isHandPicked) so ProductGallery can use
 *   real data instead of mock. Map category slug from URL to categoryId.
 * - Add GET by id/slug: e.g. GET /api/products/[id] or ?slug= for single product (product detail page).
 * - Harden POST: require auth (admin only), validate body with insertProductSchema (or similar),
 *   sanitize inputs; do not insert raw body. Consider rate limiting for create/update.
 *
 * EDGE CASES:
 * - Empty category: return [] and 200, not 404.
 * - Invalid category slug: return 400 with clear message or fallback to all products.
 * - Pagination: validate page/limit (max limit cap), default values.
 * - Product not found (single): return 404 with consistent JSON shape.
 * - DB errors: already returning 500; ensure no sensitive details in response.
 *
 * NICE TO HAVE:
 * - Search (full-text or name/description) query param.
 * - Stock level checks before allowing add-to-cart in future cart API.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    let query = db.select().from(products);

    if (search && search.trim().length > 0) {
      const searchTerm = `%${search.trim()}%`;
      query = query.where(
        or(
          ilike(products.name, searchTerm),
          ilike(products.description, searchTerm)
        )
      ) as typeof query;
    }

    const allProducts = await query.limit(limit);

    return NextResponse.json({
      success: true,
      data: allProducts,
      count: allProducts.length,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * TODO BACKEND DEVELOPER - Create product (see GET TODO above for auth/validation).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newProduct = await db.insert(products).values(body).returning();
    
    return NextResponse.json({
      success: true,
      data: newProduct[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
