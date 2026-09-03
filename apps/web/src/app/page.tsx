"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  TrendingUp,
  ShoppingBag,
  Heart,
  Layers,
  ChevronRight,
  Clock,
  Award,
  Store,
} from "lucide-react";

export default function Home() {
  const { products, categories, formatPrice } = useStore();

  const handcraftedProducts = products.filter((p) => p.isHandcrafted);
  const flashSaleProducts = products.filter((p) => p.isFlashSale);
  const winningDropshipProducts = products.filter((p) => p.isDropship);
  const featuredCategories = categories.slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-purple-50/40 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100 pt-10 pb-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-indigo-100/80 dark:border-zinc-800">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-200/25 dark:bg-amber-900/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-800/90 border border-indigo-100 dark:border-zinc-700 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>India's Handcrafted Heritage & Global Dropship Hub</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight sm:leading-none">
              Artisan Crafts. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 dark:from-indigo-400 dark:via-purple-300 dark:to-amber-400">
                Direct to the World.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover authentic handmade crochet charms, royal pearl vases, auspicious designer diyas, and deity poshaks woven by rural craftswomen, alongside viral high-margin dropshipping winners.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/products"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                Explore Handcrafted <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dropship"
                className="px-7 py-3.5 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-sm border border-zinc-200 dark:border-zinc-700 shadow-sm transition-all flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Dropship Hub
              </Link>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-200/80 dark:border-zinc-800 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <span className="text-2xl font-black text-zinc-900 dark:text-white">250+</span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Master Artisans</p>
              </div>
              <div>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">4.9★</span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Customer Rating</p>
              </div>
              <div>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">1-Day</span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Express Dispatch</p>
              </div>
            </div>
          </div>

          {/* Hero Interactive Collage / Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-[380px] xl:max-w-[420px] aspect-4/5 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-zinc-900 group">
              <Image
                src="/products/craft-item-01.jpeg"
                alt="Sunflower and Smiley Handmade Crochet Keychains"
                fill
                loading="eager"
                preload={true}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Highlight Card */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-2xl bg-zinc-900/95 backdrop-blur-md border border-white/20 text-white flex items-center justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Featured Handcrafted
                  </div>
                  <h4 className="font-bold text-sm truncate max-w-[170px] sm:max-w-[200px]">Sunflower Joy Crochet Keychain</h4>
                  <p className="text-xs text-zinc-300 font-bold mt-0.5">
                    ₹199 <span className="text-[10px] line-through text-zinc-400">₹399</span>
                  </p>
                </div>
                <Link
                  href="/products/sunflower-joy-crochet-keychain"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black transition-colors shrink-0"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Explore Collections
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Curated by craft heritage and high-demand product categories
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center text-center p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3 group-hover:scale-108 transition-transform duration-300">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                {cat.productCount}+ items
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Festive Promotion Banner (UX-23 Resolution) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-800/40 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-extrabold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-rose-400" /> Festive Artisan Spotlight
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Special Collection Deals · Up to 50% OFF
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg">
                Exclusive handcrafted crystal diyas, sunflower crochet charms, and sunset ambient lamps with free shipping on orders above ₹499.
              </p>
            </div>

            {/* Authentic Promo Code & Trust Capsule */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Use Code at Checkout</span>
                <span className="text-lg sm:text-xl font-black text-white font-mono tracking-wider bg-white/10 px-3 py-1 rounded-xl block">
                  CRAFT10
                </span>
                <span className="text-[10px] text-zinc-300">Extra 10% OFF artisan goods</span>
              </div>
              <Link
                href="/deals"
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
              >
                Shop All Deals
              </Link>
            </div>
          </div>
        </div>

        {/* Flash Sale Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {flashSaleProducts.slice(0, 4).map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      </section>

      {/* Handcrafted Masterpieces Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> 100% Artisan Made
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Handcrafted Treasures
            </h2>
          </div>
          <Link
            href="/products?type=handcrafted"
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All Crafts <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {handcraftedProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Dropshipping High-Profit Winners Section */}
      <section className="bg-zinc-100 dark:bg-zinc-900/60 py-16 px-4 sm:px-6 lg:px-8 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" /> Vetted Dropshipping Winners
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                High-Margin Trending Tech & Home
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Pre-negotiated wholesale costs, verified suppliers, and automated express fulfillment.
              </p>
            </div>

            <Link
              href="/dropship"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start md:self-auto"
            >
              Open Dropship Platform <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {winningDropshipProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-xl transition-all"
              >
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={product.images[0]?.url || "/products/craft-item-10.jpeg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider">
                    {product.profitMarginPercent}% Margin
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                    <span>Wholesale Cost: <strong className="text-zinc-900 dark:text-zinc-100">{formatPrice(product.supplierCost || 0)}</strong></span>
                    <span>Retail: <strong className="text-emerald-600 font-bold">{formatPrice(product.price)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    View Product
                  </Link>
                  <Link
                    href="/dropship"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-center text-xs font-bold hover:bg-indigo-500"
                  >
                    Calculate Profit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan Story Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-tr from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-900 p-8 sm:p-12 rounded-3xl border border-amber-200/70 dark:border-zinc-800">
          <div className="lg:col-span-6 space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold">
              Our Social Mission
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Weaving Hope, One Stitch at a Time.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Behind every sunflower keychain, scalloped thalposh, and pearl flower vase is a story of economic empowerment. Over 250 craftswomen from Rajasthan, Uttar Pradesh, and Bihar earn dignified, sustainable livelihoods creating exquisite handcrafted pieces for Criation.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/products?type=handcrafted"
                className="px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
              >
                Support Artisans Today
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-amber-200/50">
              <Image
                src="/products/craft-item-12.jpeg"
                alt="Pearl vase craft"
                fill
                className="object-cover"
                sizes="250px"
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-amber-200/50 mt-6">
              <Image
                src="/products/craft-item-26.jpeg"
                alt="Diya craft"
                fill
                className="object-cover"
                sizes="250px"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
