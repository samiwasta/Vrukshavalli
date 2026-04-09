import { NextResponse } from "next/server";
import { db, products, categories } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-user";
import { insertProductSchema } from "@/lib/db/schema/products";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  lte,
  or,
  count,
} from "drizzle-orm";

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

    // ✅ pagination
    const page = Number(searchParams.get("page") || "1");
    if (page < 1) {
      return NextResponse.json(
        { success: false, error: "Page must be >= 1" },
        { status: 400 }
      );
    }

    const limit = Math.min(Number(searchParams.get("limit") || "20"), 100);
    const offset = (page - 1) * limit;

    // ✅ filters
    const search = searchParams.get("search")?.trim();
    const categorySlug = searchParams.get("category");
    const sort = searchParams.get("sort");

    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");

    const isNew = searchParams.get("isNew");
    const isBestSeller = searchParams.get("isBestSeller");
    const isHandPicked = searchParams.get("isHandPicked");
    const isCeramicFeatured = searchParams.get("isCeramicFeatured");
    const plantTypeParam = searchParams.get("plantType");

    const conditions = [];

    // only active products
    conditions.push(eq(products.isActive, true));

    // search
    if (search) {
      const term = `%${search}%`;
      conditions.push(
        or(
          ilike(products.name, term),
          ilike(products.description, term)
        )
      );
    }

    // category slug → id
    if (categorySlug) {
      const category = await db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
      });

      if (!category) {
        return NextResponse.json(
          { success: false, error: "Invalid category slug" },
          { status: 400 }
        );
      }

      conditions.push(eq(products.categoryId, category.id));
    }

    // flags
    if (isNew === "true") conditions.push(eq(products.isNew, true));
    if (isBestSeller === "true")
      conditions.push(eq(products.isBestSeller, true));
    if (isHandPicked === "true")
      conditions.push(eq(products.isHandPicked, true));
    if (isCeramicFeatured === "true")
      conditions.push(eq(products.isCeramicFeatured, true));

    if (plantTypeParam === "indoor" || plantTypeParam === "outdoor") {
      conditions.push(eq(products.plantType, plantTypeParam));
    }

    // price range
    if (priceMin) conditions.push(gte(products.price, priceMin));
    if (priceMax) conditions.push(lte(products.price, priceMax));

    // sorting
    let orderBy = desc(products.createdAt);

    if (sort === "price_asc") orderBy = asc(products.price);
    if (sort === "price_desc") orderBy = desc(products.price);
    if (sort === "rating") orderBy = desc(products.rating);
    if (sort === "newest") orderBy = desc(products.createdAt);

    const whereClause = and(...conditions);

    // total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(products)
      .where(whereClause);

    // data
    // If search param exists and limit <= 5 → lightweight search mode
let data;

if (search && limit <= 5) {
  data = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      image: products.image,
      price: products.price,
      stock: products.stock,
      stockCapacity: products.stockCapacity,
    })
    .from(products)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);
} else {
  data = await db.query.products.findMany({
    where: whereClause,
    orderBy,
    limit,
    offset,
  });
}

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
    // ✅ 1. Auth check
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

    // ✅ 2. Read body
    const body = await request.json();

    // // ✅ 3. Validate with Zod
    // const body = await request.json();

// ✅ generate slug BEFORE validation
const generatedSlug =
  body.slug ??
  body.name
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

// attach slug to body
const payload = {
  ...body,
  slug: generatedSlug,
};

// ✅ now validate
const parsed = insertProductSchema.safeParse(payload);

if (!parsed.success) {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid product data",
      details: parsed.error.flatten(),
    },
    { status: 400 }
  );
}

const data = parsed.data;

    // ✅ 4. Auto-generate slug if missing
    const slug =
      data.slug ??
      data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    // ✅ 5. Insert into DB
    const [newProduct] = await db
      .insert(products)
      .values({
        ...data,
        slug,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}