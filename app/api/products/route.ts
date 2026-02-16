import { NextResponse } from "next/server";
import { db, products } from "@/lib/db";

// Example API route to fetch all products
export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    
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

// Example API route to create a product
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
