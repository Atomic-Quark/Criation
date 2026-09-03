import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Product } from "@/lib/db/models/Product";
import { initialProducts } from "@/lib/data/mockCatalog";

export async function POST(req: NextRequest) {
  try {
    // 1. Authorization: Verify Admin Seed Secret header or bearer token
    const seedSecret =
      req.headers.get("x-seed-secret") ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    const expectedSecret = process.env.ADMIN_SEED_SECRET;

    if (!expectedSecret || seedSecret !== expectedSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or missing administrative seed secret header (x-seed-secret).",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // 2. Seed Initial Product Catalog if collection is empty
    const productCount = await Product.countDocuments();
    let seededProducts = 0;

    if (productCount === 0) {
      const formattedProducts = initialProducts.map((p) => ({
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        detailedDescription: p.detailedDescription,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        currency: p.currency || "INR",
        categoryId: p.categoryId,
        categoryName: p.categoryName,
        collectionSlug: p.collectionSlug,
        tags: p.tags,
        badge: p.badge,
        images: p.images,
        variants: p.variants,
        rating: p.rating,
        reviewCount: p.reviewCount,
        specifications: p.specifications,
        artisanName: p.artisanName,
        artisanLocation: p.artisanLocation,
        artisanStory: p.artisanStory,
        isHandcrafted: p.isHandcrafted,
        isDropship: p.isDropship,
        isWinningProduct: p.isWinningProduct,
        isFlashSale: p.isFlashSale,
        stock: p.stock,
        supplierId: p.supplierId,
        supplierName: p.supplierName,
        supplierCost: p.supplierCost,
        profitMarginPercent: p.profitMarginPercent,
      }));

      await Product.insertMany(formattedProducts);
      seededProducts = formattedProducts.length;
    }

    return NextResponse.json({
      success: true,
      message: `Database seeded successfully. ${seededProducts} products initialized.`,
      productCount: seededProducts > 0 ? seededProducts : productCount,
    });
  } catch (error: any) {
    console.error("[Seed API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed database." },
      { status: 500 }
    );
  }
}
