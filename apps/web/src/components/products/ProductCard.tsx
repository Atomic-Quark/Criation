"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { ProductItem } from "@/types/store";
import { Heart, Star, ShoppingBag, Sparkles, Flame } from "lucide-react";

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
    <div className="product-card-luxury group flex flex-col bg-white dark:bg-[#1c1916] rounded-3xl border border-[#e8e0d4] dark:border-[#352f29] overflow-hidden shadow-2xs hover:border-[#c25e3f]/50 dark:hover:border-[#d97757]/50 transition-all duration-300">
      {/* Image Container with Studio Stage & Ambient Lighting */}
      <div className="product-stage-backdrop relative aspect-square w-full overflow-hidden">
        <Link href={`/products/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={product.images[0]?.url || "/products/craft-item-01.jpeg"}
            alt={product.name}
            fill
            priority={priority}
            className="product-image-aesthetic object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* Studio Lighting Sheen & Luxury Bevel Ring */}
        <div className="product-sheen-overlay" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#241f1c]/90 dark:bg-[#f4ece1]/95 text-[#f4ece1] dark:text-[#241f1c] shadow-xs backdrop-blur-md">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-bold bg-[#c25e3f] text-white shadow-xs">
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
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-2xl backdrop-blur-md border shadow-xs transition-all active:scale-90 cursor-pointer ${
            isWished
              ? "bg-[#fdf0ed] dark:bg-[#2d1b1a] border-[#f5d5cc] dark:border-[#452620] text-[#b75258]"
              : "bg-white/85 dark:bg-[#1c1916]/85 border-[#e8e0d4] dark:border-[#352f29] text-[#756c63] dark:text-[#a59b90] hover:text-[#b75258]"
          }`}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWished ? "fill-[#b75258] text-[#b75258]" : ""}`} />
        </button>

        {/* Origin / Artisan Pill */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          {product.isHandcrafted ? (
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-[#2b1f14]/90 text-[#f2ce93] border border-[#b58334]/40 backdrop-blur-md flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#d49f48]" /> Handcrafted
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-[#162319]/90 text-[#9ac2a3] border border-[#56745f]/40 backdrop-blur-md flex items-center gap-1 shadow-xs">
              <Flame className="w-3 h-3 text-[#779b81]" /> Fast Dropship
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#756c63] dark:text-[#a59b90] mb-1">
            <span className="truncate max-w-[150px] font-medium">{product.categoryName}</span>
            <div className="flex items-center gap-1 text-[#b58334] dark:text-[#d49f48] font-bold bg-[#faf2e6] dark:bg-[#2b2214] px-2 py-0.5 rounded-lg border border-[#f2dfbf]/50 dark:border-[#45371f]/50">
              <Star className="w-3 h-3 fill-[#b58334] dark:fill-[#d49f48]" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-[#9c9184]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="font-medium text-sm text-[#241f1c] dark:text-[#f4ece1] hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Artisan Location if available */}
          {product.artisanLocation && (
            <p className="text-[11px] text-[#8a8075] dark:text-[#9e9489] mt-1 truncate">
              By {product.artisanName || "Artisan Guild"} · {product.artisanLocation}
            </p>
          )}
        </div>

        <div>
          {/* Stock Alert */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-[10px] font-semibold text-[#c25e3f] dark:text-[#d97757] mb-2">
              ⚡ Only {product.stock} left in stock - order soon
            </p>
          )}

          {/* Price & CTA Row */}
          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#e8e0d4] dark:border-[#352f29]">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-bold text-lg text-[#241f1c] dark:text-[#f4ece1]">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xs line-through text-[#8a8075] dark:text-[#9e9489]">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => addToCart(product, product.variants[0], 1)}
              className="p-2.5 sm:px-3.5 sm:py-2 rounded-2xl bg-[#c25e3f] hover:bg-[#a84d31] text-white text-xs font-semibold shadow-md shadow-[#c25e3f]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
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
