import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Product } from "@/lib/db/models/Product";
import { initialProducts } from "@/lib/data/mockCatalog";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const isDropship = searchParams.get("isDropship");
    const query = searchParams.get("q");

    try {
      await connectToDatabase();

      const filter: any = {};
      if (category) filter.categoryId = category;
      if (isDropship !== null && isDropship !== undefined) {
        filter.isDropship = isDropship === "true";
      }
      if (query) {
        filter.$or = [
          { name: { $regex: query, $options: "i" } },
          { tags: { $in: [new RegExp(query, "i")] } },
          { categoryName: { $regex: query, $options: "i" } },
        ];
      }

      const products = await Product.find(filter).sort({ createdAt: -1 });

      if (products.length === 0 && !category && !query) {
        return NextResponse.json({ success: true, products: initialProducts });
      }

      return NextResponse.json({
        success: true,
        count: products.length,
        products,
      });
    } catch (dbErr: any) {
      console.warn("[Products API] Fallback to local catalog:", dbErr.message);
      return NextResponse.json({
        success: true,
        products: initialProducts,
        fallback: true,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authorization Check (Must be Seller, Supplier, or Admin)
    const token =
      req.cookies.get(AUTH_COOKIE_NAME)?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please log in to manage products." },
        { status: 401 }
      );
    }

    const session = verifyToken(token);
    if (!session || !["seller", "supplier", "admin"].includes(session.role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Merchant, Supplier, or Admin permissions required to publish products.",
        },
        { status: 403 }
      );
    }

    // 2. Extract and Validate Input (Prevent Mass Assignment)
    const body = await req.json();
    const {
      name,
      tagline,
      description,
      detailedDescription,
      price,
      compareAtPrice,
      currency = "INR",
      categoryId,
      categoryName,
      collectionSlug,
      tags = [],
      badge,
      images = [],
      variants = [],
      specifications = {},
      artisanName,
      artisanLocation,
      artisanStory,
      isHandcrafted = false,
      isDropship = false,
      isWinningProduct = false,
      isFlashSale = false,
      stock = 10,
      supplierCost = 0,
      profitMarginPercent = 0,
    } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Product name is required (min 2 characters)." },
        { status: 400 }
      );
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Product price must be a valid positive number." },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== "string") {
      return NextResponse.json(
        { success: false, error: "Product category is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate clean unique slug
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // Sanitize image URLs
    const sanitizedImages = Array.isArray(images)
      ? images
          .filter((img: any) => img && typeof img.url === "string")
          .map((img: any) => ({
            url: String(img.url).trim(),
            alt: typeof img.alt === "string" ? img.alt.trim() : name.trim(),
            isPrimary: Boolean(img.isPrimary),
          }))
      : [];

    if (sanitizedImages.length === 0) {
      sanitizedImages.push({
        url: "/products/craft-item-01.jpeg",
        alt: name.trim(),
        isPrimary: true,
      });
    }

    // Explicit Document Construction (No raw object spreading)
    const product = await Product.create({
      slug,
      name: name.trim(),
      tagline: tagline ? String(tagline).trim() : undefined,
      description: description ? String(description).trim() : name.trim(),
      detailedDescription: detailedDescription ? String(detailedDescription).trim() : undefined,
      price: numPrice,
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      currency: String(currency).trim() || "INR",
      categoryId: String(categoryId).trim(),
      categoryName: categoryName ? String(categoryName).trim() : "Handcrafted Creations",
      collectionSlug: collectionSlug ? String(collectionSlug).trim() : undefined,
      tags: Array.isArray(tags) ? tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      badge: badge ? String(badge).trim() : undefined,
      images: sanitizedImages,
      variants: Array.isArray(variants) ? variants : [],
      rating: 5.0,
      reviewCount: 1,
      specifications: typeof specifications === "object" ? specifications : {},
      artisanName: artisanName ? String(artisanName).trim() : session.name,
      artisanLocation: artisanLocation ? String(artisanLocation).trim() : "India",
      artisanStory: artisanStory ? String(artisanStory).trim() : undefined,
      isHandcrafted: Boolean(isHandcrafted),
      isDropship: Boolean(isDropship),
      isWinningProduct: session.role === "admin" ? Boolean(isWinningProduct) : false,
      isFlashSale: session.role === "admin" ? Boolean(isFlashSale) : false,
      stock: Math.max(0, Math.floor(Number(stock) || 0)),
      supplierId: session.role === "supplier" ? session.userId : undefined,
      supplierName: session.role === "supplier" ? session.name : undefined,
      supplierCost: Number(supplierCost) || 0,
      profitMarginPercent: Number(profitMarginPercent) || 0,
    });

    return NextResponse.json({
      success: true,
      message: "Product published successfully.",
      product,
    });
  } catch (error: any) {
    console.error("[Products API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product." },
      { status: 500 }
    );
  }
}
