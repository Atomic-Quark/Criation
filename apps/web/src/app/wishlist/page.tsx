"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import {
  Heart,
  ShoppingBag,
  Trash2,
  Share2,
  ArrowRight,
  Star,
  Compass,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, formatPrice, showToast } = useStore();

  const handleShareWishlist = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Wishlist Link Copied 🎁", "You can share your wishlist with friends & family.", "info");
    }
  };

  const handleMoveAllToBag = () => {
    wishlist.forEach((product) => {
      addToCart(product, product.variants[0], 1);
    });
    showToast("Moved to Bag! 🎉", `All ${wishlist.length} saved item(s) added to your cart.`, "success");
  };

  const popularSuggestions = [
    { label: "Handcrafted Decor", slug: "home-living" },
    { label: "Crochet & Charms", slug: "fashion-accessories" },
    { label: "Blue Pottery", slug: "traditional-art" },
    { label: "Pashmina & Shawls", slug: "fashion-accessories" },
    { label: "Brass Sculptures", slug: "traditional-art" },
  ];

  return (
    <div className="min-h-[calc(100vh-240px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 flex flex-col justify-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e0d4] dark:border-[#2e2822]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#fdf2ef] dark:bg-[#251915] border border-[#f5d5cc] dark:border-[#452620] flex items-center justify-center text-[#c25e3f] dark:text-[#d97757] shadow-2xs shrink-0">
            <Heart className="w-6 h-6 fill-[#b75258] text-[#b75258]" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#241f1c] dark:text-[#f4ece1] tracking-tight flex items-center gap-2.5">
              <span>My Wishlist</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f0eae0] dark:bg-[#231f1b] text-[#c25e3f] dark:text-[#d97757] border border-[#e8e0d4] dark:border-[#352f29]">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#756c63] dark:text-[#a59b90] mt-0.5">
              Saved artisan crafts & dropship favorites. Real-time stock & price drop tracking.
            </p>
          </div>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleShareWishlist}
              className="px-4 py-2.5 rounded-2xl border border-[#e8e0d4] dark:border-[#352f29] bg-white dark:bg-[#1c1916] text-xs font-semibold text-[#241f1c] dark:text-[#f4ece1] hover:bg-[#faf7f2] dark:hover:bg-[#231f1b] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#8a8075]" /> Share Wishlist
            </button>
            <button
              onClick={handleMoveAllToBag}
              className="px-5 py-2.5 rounded-2xl bg-[#c25e3f] hover:bg-[#a84d31] text-white text-xs font-semibold shadow-md shadow-[#c25e3f]/20 transition-all flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4" /> Move All to Bag
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="relative overflow-hidden py-16 sm:py-24 text-center rounded-[32px] bg-white dark:bg-[#1c1916] border border-[#e8e0d4] dark:border-[#352f29] shadow-sm dark:shadow-2xl p-8 my-auto space-y-6">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#c25e3f]/10 dark:bg-[#c25e3f]/12 blur-3xl pointer-events-none rounded-full" />

          {/* Icon Badge */}
          <div className="relative w-20 h-20 rounded-3xl bg-[#fdf2ef] dark:bg-[#251915] border border-[#f5d5cc] dark:border-[#452620] text-[#b75258] flex items-center justify-center mx-auto shadow-md shadow-[#c25e3f]/10">
            <Heart className="w-9 h-9 stroke-[1.6]" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#c25e3f] text-white flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-[#1c1916]">
              0
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#241f1c] dark:text-[#f4ece1] tracking-tight">
              Your wishlist is empty
            </h2>
            <p className="text-xs sm:text-sm text-[#756c63] dark:text-[#a59b90] leading-relaxed">
              Explore authentic handcrafted charm collections and trending dropship products. Click the heart icon on any item to save it here for later.
            </p>
          </div>

          {/* CTA Button */}
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#c25e3f] via-[#b85336] to-[#a84d31] hover:from-[#b85336] hover:to-[#9e3f26] text-white font-semibold text-xs shadow-lg shadow-[#c25e3f]/25 hover:shadow-[#c25e3f]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Marketplace Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Discovery Suggestions */}
          <div className="pt-4 border-t border-[#e8e0d4] dark:border-[#2e2822] max-w-lg mx-auto">
            <p className="text-[11px] font-semibold text-[#8a8075] dark:text-[#9e9489] uppercase tracking-wider mb-3">
              Explore popular craft categories:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularSuggestions.map((item) => (
                <Link
                  key={item.label}
                  href={`/products?category=${item.slug}`}
                  className="px-3.5 py-1.5 rounded-xl bg-[#faf7f2] dark:bg-[#24201c] hover:bg-[#f0eae0] dark:hover:bg-[#2b2520] text-[#241f1c] dark:text-[#f4ece1] text-xs font-medium border border-[#e8e0d4] dark:border-[#352f29] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="product-card-luxury bg-white dark:bg-[#1c1916] rounded-3xl border border-[#e8e0d4] dark:border-[#352f29] overflow-hidden shadow-2xs hover:border-[#c25e3f]/50 dark:hover:border-[#d97757]/50 transition-all flex flex-col justify-between group"
            >
              <div className="product-stage-backdrop relative aspect-square w-full overflow-hidden">
                <Image
                  src={product.images[0]?.url || "/products/craft-item-01.jpeg"}
                  alt={product.name}
                  fill
                  className="product-image-aesthetic object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="product-sheen-overlay" />
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 p-2.5 rounded-2xl bg-white/90 dark:bg-[#1c1916]/90 backdrop-blur-md text-[#b75258] hover:text-[#9e3f45] border border-[#e8e0d4] dark:border-[#352f29] shadow-xs transition-transform hover:scale-105 cursor-pointer z-3"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#756c63] dark:text-[#a59b90] mb-1.5">
                    <span className="font-medium text-[11px]">{product.categoryName}</span>
                    <div className="flex items-center gap-1 text-[#b58334] dark:text-[#d49f48] font-bold text-[11px] bg-[#faf2e6] dark:bg-[#2b2214] px-2 py-0.5 rounded-md border border-[#f2dfbf]/50 dark:border-[#45371f]/50">
                      <Star className="w-3 h-3 fill-[#b58334] dark:fill-[#d49f48]" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-medium text-sm text-[#241f1c] dark:text-[#f4ece1] hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors line-clamp-2"
                  >
                    {product.name}
                  </Link>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#e8e0d4] dark:border-[#2e2822]">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif font-bold text-lg text-[#241f1c] dark:text-[#f4ece1]">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[11px] font-semibold text-[#56745f] dark:text-[#779b81] bg-[#f0f4f1] dark:bg-[#18231b] px-2 py-0.5 rounded-md border border-[#d8e4db] dark:border-[#2b3c2f]">
                      In Stock
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product, product.variants[0], 1)}
                    className="w-full py-3 rounded-2xl bg-[#c25e3f] hover:bg-[#a84d31] text-white font-semibold text-xs shadow-md shadow-[#c25e3f]/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <ShoppingBag className="w-4 h-4" /> Move to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
