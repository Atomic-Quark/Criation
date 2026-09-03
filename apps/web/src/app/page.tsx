"use client";

import React from "react";
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
  ChevronRight,
  Compass,
  Award,
} from "lucide-react";

export default function Home() {
  const { products, categories, formatPrice } = useStore();

  const handcraftedProducts = products.filter((p) => p.isHandcrafted);
  const flashSaleProducts = products.filter((p) => p.isFlashSale);
  const winningDropshipProducts = products.filter((p) => p.isDropship);
  const featuredCategories = categories.slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f3ece0]/90 via-[#f7f3eb]/60 to-[#faf7f2] dark:from-[#1b1714] dark:via-[#161311] dark:to-[#141210] text-[#241f1c] dark:text-[#f4ece1] pt-10 pb-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#e8e0d4] dark:border-[#2e2822]">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#c25e3f]/10 dark:bg-[#c25e3f]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#b58334]/10 dark:bg-[#b58334]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-[#231f1b]/80 border border-[#e8e0d4] dark:border-[#3a332c] text-[#c25e3f] dark:text-[#d97757] text-xs font-semibold shadow-2xs backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#b58334]" />
              <span>India's Handcrafted Heritage & Global Dropship Platform</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#241f1c] dark:text-[#f4ece1] leading-[1.08]">
              Artisan Crafts. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c25e3f] via-[#b58334] to-[#a84d31] dark:from-[#d97757] dark:via-[#e2b96f] dark:to-[#d97757]">
                Direct to the World.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#756c63] dark:text-[#a59b90] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover authentic handmade crochet charms, royal pearl vases, auspicious designer diyas, and deity poshaks woven by rural craftswomen, alongside viral high-margin dropshipping winners.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/products"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#c25e3f] via-[#b85336] to-[#a84d31] hover:from-[#b85336] hover:to-[#9e3f26] text-white font-semibold text-sm shadow-lg shadow-[#c25e3f]/25 hover:shadow-[#c25e3f]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
              >
                <span>Explore Handcrafted</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dropship"
                className="px-7 py-3.5 rounded-2xl bg-white/90 dark:bg-[#231f1b] hover:bg-[#f0eae0] dark:hover:bg-[#2c2621] text-[#241f1c] dark:text-[#f4ece1] font-semibold text-sm border border-[#e8e0d4] dark:border-[#352f29] shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-[#56745f] dark:text-[#779b81]" />
                <span>Dropship Hub</span>
              </Link>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#e8e0d4] dark:border-[#2e2822] max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <span className="font-serif text-2xl font-bold text-[#241f1c] dark:text-[#f4ece1]">250+</span>
                <p className="text-[11px] text-[#756c63] dark:text-[#a59b90] font-medium">Master Artisans</p>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#b58334] dark:text-[#d49f48]">4.9★</span>
                <p className="text-[11px] text-[#756c63] dark:text-[#a59b90] font-medium">Customer Rating</p>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-[#56745f] dark:text-[#779b81]">1-Day</span>
                <p className="text-[11px] text-[#756c63] dark:text-[#a59b90] font-medium">Express Dispatch</p>
              </div>
            </div>
          </div>

          {/* Hero Showcase Frame with Studio Stage & Luxury Aura */}
          <div className="lg:col-span-5 relative">
            {/* Ambient luxury light aura */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#c25e3f]/25 via-[#b58334]/20 to-transparent rounded-[40px] blur-2xl pointer-events-none" />

            <div className="product-stage-backdrop relative mx-auto max-w-sm sm:max-w-md lg:max-w-[380px] xl:max-w-[420px] aspect-4/5 rounded-3xl overflow-hidden border border-[#e8e0d4] dark:border-[#352f29] shadow-2xl group">
              <Image
                src="/products/craft-item-01.jpeg"
                alt="Sunflower and Smiley Handmade Crochet Keychains"
                fill
                loading="eager"
                preload={true}
                className="product-image-aesthetic object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 420px"
              />
              {/* Studio lighting sheen & dark bottom gradient */}
              <div className="product-sheen-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-1" />

              {/* Floating Highlight Card */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-2xl bg-[#181512]/95 backdrop-blur-md border border-white/15 text-[#f4ece1] flex items-center justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-1.5 text-[#d49f48] text-xs font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Featured Handcrafted
                  </div>
                  <h4 className="font-serif font-bold text-sm truncate max-w-[170px] sm:max-w-[200px]">Sunflower Joy Crochet Keychain</h4>
                  <p className="text-xs text-[#dcd4c7] font-semibold mt-0.5">
                    ₹199 <span className="text-[10px] line-through text-[#8a8075]">₹399</span>
                  </p>
                </div>
                <Link
                  href="/products/sunflower-joy-crochet-keychain"
                  className="px-3.5 py-2 rounded-xl bg-[#c25e3f] hover:bg-[#a84d31] text-white text-xs font-semibold transition-colors shrink-0"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241f1c] dark:text-[#f4ece1] tracking-tight">
              Explore Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#756c63] dark:text-[#a59b90] mt-1">
              Curated by craft heritage and high-demand product categories
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-[#c25e3f] dark:text-[#d97757] hover:underline flex items-center gap-1"
          >
            <span>All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center text-center p-4 rounded-3xl bg-white dark:bg-[#1c1916] border border-[#e8e0d4] dark:border-[#352f29] hover:border-[#c25e3f] dark:hover:border-[#d97757] hover:shadow-lg transition-all duration-300"
            >
              <div className="product-stage-backdrop relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="product-image-aesthetic object-cover"
                  sizes="96px"
                />
                <div className="product-sheen-overlay" />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-[#241f1c] dark:text-[#f4ece1] group-hover:text-[#c25e3f] dark:group-hover:text-[#d97757] transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-[#756c63] dark:text-[#a59b90] mt-0.5">
                {cat.productCount}+ items
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Festive Promotion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#2c1d18] via-[#241916] to-[#1c1f28] border border-[#523329] text-[#f4ece1] shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c25e3f]/25 border border-[#c25e3f]/40 text-[#e68b6c] text-xs font-semibold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#e68b6c]" /> Festive Artisan Spotlight
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
                Special Collection Deals · Up to 50% OFF
              </h2>
              <p className="text-xs sm:text-sm text-[#d6cfc4] max-w-lg leading-relaxed">
                Exclusive handcrafted crystal diyas, sunflower crochet charms, and sunset ambient lamps with free shipping on orders above ₹499.
              </p>
            </div>

            {/* Authentic Promo Code & Trust Capsule */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#d49f48] block">Use Code at Checkout</span>
                <span className="text-lg sm:text-xl font-bold text-white font-mono tracking-wider bg-white/10 px-3 py-1 rounded-xl block">
                  CRAFT10
                </span>
                <span className="text-[10px] text-[#d6cfc4]">Extra 10% OFF artisan goods</span>
              </div>
              <Link
                href="/deals"
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#d49f48] to-[#c25e3f] hover:from-[#e2b96f] hover:to-[#d97757] text-[#141210] font-bold text-xs uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-transform"
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
            <div className="flex items-center gap-2 text-[#b58334] dark:text-[#d49f48] font-semibold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> 100% Artisan Made
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241f1c] dark:text-[#f4ece1] tracking-tight">
              Handcrafted Treasures
            </h2>
          </div>
          <Link
            href="/products?type=handcrafted"
            className="text-xs sm:text-sm font-semibold text-[#c25e3f] dark:text-[#d97757] hover:underline flex items-center gap-1"
          >
            <span>View All Crafts</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {handcraftedProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Dropshipping High-Profit Winners Section */}
      <section className="bg-[#f5f0e6]/70 dark:bg-[#110f0d] py-16 px-4 sm:px-6 lg:px-8 border-y border-[#e8e0d4] dark:border-[#2e2822]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#56745f] dark:text-[#779b81] font-semibold text-xs uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" /> Vetted Dropshipping Winners
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241f1c] dark:text-[#f4ece1] tracking-tight">
                High-Margin Trending Tech & Home
              </h2>
              <p className="text-xs sm:text-sm text-[#756c63] dark:text-[#a59b90] mt-1">
                Pre-negotiated wholesale costs, verified suppliers, and automated express fulfillment.
              </p>
            </div>

            <Link
              href="/dropship"
              className="px-5 py-2.5 rounded-xl bg-[#c25e3f] hover:bg-[#a84d31] text-white font-semibold text-xs shadow-md shadow-[#c25e3f]/20 transition-all flex items-center gap-1.5 self-start md:self-auto hover:-translate-y-0.5"
            >
              <span>Open Dropship Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {winningDropshipProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-[#1c1916] rounded-3xl p-5 border border-[#e8e0d4] dark:border-[#352f29] shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-xl hover:border-[#c25e3f]/50 dark:hover:border-[#d97757]/50 transition-all"
              >
                <div className="product-stage-backdrop relative aspect-video w-full rounded-2xl overflow-hidden">
                  <Image
                    src={product.images[0]?.url || "/products/craft-item-10.jpeg"}
                    alt={product.name}
                    fill
                    className="product-image-aesthetic object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                  <div className="product-sheen-overlay" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-[#56745f] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs z-3">
                    {product.profitMarginPercent}% Margin
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-[#241f1c] dark:text-[#f4ece1] line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#756c63] dark:text-[#a59b90] pt-1 border-t border-[#e8e0d4] dark:border-[#352f29]">
                    <span>Wholesale: <strong className="text-[#241f1c] dark:text-[#f4ece1]">{formatPrice(product.supplierCost || 0)}</strong></span>
                    <span>Retail: <strong className="text-[#56745f] dark:text-[#779b81] font-bold">{formatPrice(product.price)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex-1 py-2.5 rounded-xl border border-[#e8e0d4] dark:border-[#352f29] text-center text-xs font-semibold text-[#241f1c] dark:text-[#f4ece1] hover:bg-[#faf7f2] dark:hover:bg-[#231f1b] transition-colors"
                  >
                    View Product
                  </Link>
                  <Link
                    href="/dropship"
                    className="flex-1 py-2.5 rounded-xl bg-[#c25e3f] hover:bg-[#a84d31] text-white text-center text-xs font-semibold transition-colors"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-tr from-[#fbf4ea] to-[#f7eee1] dark:from-[#1a1714] dark:to-[#1e1a17] p-8 sm:p-12 rounded-3xl border border-[#eddac2] dark:border-[#352f29]">
          <div className="lg:col-span-6 space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#b58334]/20 text-[#8f6420] dark:text-[#e2b96f] text-xs font-semibold">
              Our Social Mission
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#241f1c] dark:text-[#f4ece1] tracking-tight">
              Weaving Hope, One Stitch at a Time.
            </h2>
            <p className="text-xs sm:text-sm text-[#756c63] dark:text-[#a59b90] leading-relaxed">
              Behind every sunflower keychain, scalloped thalposh, and pearl flower vase is a story of economic empowerment. Over 250 craftswomen from Rajasthan, Uttar Pradesh, and Bihar earn dignified, sustainable livelihoods creating exquisite handcrafted pieces for Criation.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/products?type=handcrafted"
                className="px-6 py-3 rounded-2xl bg-[#241f1c] dark:bg-[#f4ece1] text-[#faf7f2] dark:text-[#141210] font-semibold text-xs shadow-md hover:opacity-90 transition-opacity"
              >
                Support Artisans Today
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="product-stage-backdrop relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-[#eddac2] dark:border-[#352f29] group">
              <Image
                src="/products/craft-item-12.jpeg"
                alt="Pearl vase craft"
                fill
                className="product-image-aesthetic object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="250px"
              />
              <div className="product-sheen-overlay" />
            </div>
            <div className="product-stage-backdrop relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-[#eddac2] dark:border-[#352f29] mt-6 group">
              <Image
                src="/products/craft-item-26.jpeg"
                alt="Diya craft"
                fill
                className="product-image-aesthetic object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="250px"
              />
              <div className="product-sheen-overlay" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
