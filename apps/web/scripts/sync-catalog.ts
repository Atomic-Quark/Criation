import mongoose from "mongoose";
import { initialProducts } from "../src/lib/data/mockCatalog";
import { Product } from "../src/lib/db/models/Product";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/criation";

async function syncCatalog() {
  console.log(`[Catalog Sync] Connecting to MongoDB: ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);

  console.log(`[Catalog Sync] Syncing ${initialProducts.length} handcrafted products into MongoDB...`);

  // Map legacy slugs to new slugs to cleanly update existing documents
  const legacySlugMap: Record<string, string> = {
    "auraglow-16-color-rgb-sunset-projection-lamp": "happy-smile-sunshine-woolen-tassel-keychain",
    "cinemate-hd-1080p-smart-pocket-projector": "handcrafted-wooden-fence-planter-flower-pot",
    "divine-emerald-crystal-studded-clay-diya": "quilled-floral-tealight-diya-candle-stand",
    "happy-smile-woolen-tassel-charm-keychain": "miniature-crochet-sunhat-bonnet-bag-charm",
  };

  let updatedCount = 0;
  let insertedCount = 0;

  for (const p of initialProducts) {
    const formatted = {
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
    };

    // Check if matching old legacy slug exists
    const legacySlug = Object.keys(legacySlugMap).find(k => legacySlugMap[k] === p.slug);
    const filter = legacySlug ? { $or: [{ slug: p.slug }, { slug: legacySlug }] } : { slug: p.slug };

    const result = await Product.findOneAndUpdate(
      filter,
      { $set: formatted },
      { upsert: true, new: true, rawResult: true }
    );

    if ((result as any)?.lastErrorObject?.updatedExisting) {
      updatedCount++;
    } else {
      insertedCount++;
    }
    console.log(`✓ Synced: [${p.slug}] -> "${p.name}"`);
  }

  const total = await Product.countDocuments();
  console.log(`\n[Catalog Sync Complete] Updated: ${updatedCount}, Inserted: ${insertedCount}. Total in DB: ${total}`);
  await mongoose.disconnect();
}

syncCatalog().catch((err) => {
  console.error("[Catalog Sync Error]:", err);
  process.exit(1);
});
