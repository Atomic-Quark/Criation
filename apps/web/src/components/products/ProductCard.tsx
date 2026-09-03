"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { ProductItem } from "@/types/store";
import { Heart, Star, ShoppingBag, Sparkles, Flame, Check } from "lucide-react";

interface ProductCardProps {
  product: ProductItem;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, formatPrice } = useStore();

  const isWished = isInWishlist(product.id);
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800/60 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
        <Link href={`/products/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={product.images[0]?.url || "/products/craft-item-01.jpeg"}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-zinc-900/90 dark:bg-white/95 text-white dark:text-zinc-900 shadow-md backdrop-blur-md">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-bold bg-rose-600 text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-2xl backdrop-blur-md border shadow-md transition-all active:scale-90 ${
            isWished
              ? "bg-rose-50 dark:bg-rose-950/80 border-rose-200 text-rose-600 fill-rose-600"
              : "bg-white/85 dark:bg-zinc-900/85 border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 hover:text-rose-600"
          }`}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWished ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Origin / Artisan Pill */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          {product.isHandcrafted ? (
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-amber-950/80 text-amber-200 border border-amber-500/30 backdrop-blur-md flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-400" /> Handcrafted
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-indigo-950/80 text-indigo-200 border border-indigo-500/30 backdrop-blur-md flex items-center gap-1 shadow-xs">
              <Flame className="w-3 h-3 text-indigo-400" /> Fast Dropship
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="truncate max-w-[150px] font-medium">{product.categoryName}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-zinc-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Artisan Location if available */}
          {product.artisanLocation && (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 truncate">
              By {product.artisanName || "Artisan Guild"} · {product.artisanLocation}
            </p>
          )}
        </div>

        <div>
          {/* Stock Alert */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 mb-2">
              ⚡ Only {product.stock} left in stock - order soon
            </p>
          )}

          {/* Price & CTA Row */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xs line-through text-zinc-400">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => addToCart(product, product.variants[0], 1)}
              className="p-2.5 sm:px-3.5 sm:py-2 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold shadow-md hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-200 flex items-center gap-1.5 shrink-0"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
