import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { productIds } = await req.json();

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Invalid product IDs' },
        { status: 400 }
      );
    }

    connectToDB();

    const products = await Product.find({
      _id: { $in: productIds }
    });

    // Convert to plain objects
    const plainProducts = products.map(p => JSON.parse(JSON.stringify(p)));

    return NextResponse.json({ products: plainProducts });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
