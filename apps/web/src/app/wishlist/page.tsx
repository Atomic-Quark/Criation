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
  Sparkles,
  Star,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Saved artisan crafts & dropship favorites. Get notified of price drops.
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWishlist}
              className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 flex items-center gap-1.5 shadow-xs"
            >
              <Share2 className="w-4 h-4" /> Share Wishlist
            </button>
            <button
              onClick={handleMoveAllToBag}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" /> Move All to Bag
            </button>
          </div>
        )}
      </div>

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Your wishlist is empty</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Click the heart icon on any handcrafted charm or dropship winner to save items for later.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-md"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={product.images[0]?.url || "/products/craft-item-01.jpeg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 p-2.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-rose-500 hover:text-rose-600 shadow-md"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                    <span>{product.categoryName}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 line-clamp-2"
                  >
                    {product.name}
                  </Link>
                </div>

                <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">In Stock</span>
                  </div>

                  <button
                    onClick={() => addToCart(product, product.variants[0], 1)}
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
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
