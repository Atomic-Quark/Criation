"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Share2,
  Check,
  Plus,
  Minus,
  MapPin,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  Flame,
  ArrowRight,
} from "lucide-react";
import { ProductVariant } from "@/types/store";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    products,
    getProductById,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    showToast,
  } = useStore();

  const product = getProductById(rawId as string);

  // States
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews" | "faqs">("desc");

  // Reset product state when navigating between products (UX-4 Resolution)
  React.useEffect(() => {
    setSelectedImageIdx(0);
    setSelectedVariant(product?.variants[0]);
    setQuantity(1);
    setPincodeStatus(null);
  }, [product?.id]);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Product Not Found</h1>
        <p className="text-xs text-zinc-500 mt-2">The product you are looking for does not exist or has been archived.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-md"
        >
          Return to Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentCompareAt = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const discountPercent =
    currentCompareAt && currentCompareAt > currentPrice
      ? Math.round(((currentCompareAt - currentPrice) / currentCompareAt) * 100)
      : null;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode.trim())) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      setPincodeStatus(`Express Delivery to ${pincode} by ${formattedDate} · FREE on orders > ₹499`);
      showToast("Pincode Serviced", `Express courier delivery available for ${pincode}.`, "success");
    } else {
      setPincodeStatus("Please enter a valid 6-digit Indian PIN Code.");
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link Copied!", "Product URL copied to clipboard.", "info");
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    router.push("/checkout");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;
    showToast("Review Submitted ⭐", "Thank you for supporting our handcrafted artisans!", "success");
    setIsReviewModalOpen(false);
    setNewReviewName("");
    setNewReviewComment("");
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.isHandcrafted === product.isHandcrafted))
    .slice(0, 4);

  // Bundle product for "Frequently Bought Together"
  const bundleProduct = products.find((p) => p.id !== product.id && p.isHandcrafted);
  const bundleTotal = bundleProduct ? product.price + bundleProduct.price : product.price;
  const bundleDiscounted = Math.round(bundleTotal * 0.85); // 15% bundle discount

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-zinc-900 dark:hover:text-zinc-100">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/products?category=${product.categoryId}`} className="hover:text-zinc-900 dark:hover:text-zinc-100">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-900 dark:text-zinc-100 font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Stage: Gallery + Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
        {/* Left Gallery Column */}
        <div className="lg:col-span-7 space-y-4 sticky top-24">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg group">
            <Image
              src={product.images[selectedImageIdx]?.url || product.images[0]?.url || "/products/craft-item-01.jpeg"}
              alt={product.images[selectedImageIdx]?.alt || product.name}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 600px"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.badge && (
                <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md">
                  {product.badge}
                </span>
              )}
              {discountPercent && (
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-rose-600 text-white shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Top Right Action Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={handleShare}
                className="p-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 shadow-md transition-colors"
                title="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-2xl backdrop-blur-md border shadow-md transition-all active:scale-90 ${
                  isWished
                    ? "bg-rose-50 dark:bg-rose-950/80 border-rose-200 text-rose-600"
                    : "bg-white/80 dark:bg-zinc-900/80 border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 hover:text-rose-600"
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWished ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border-2 transition-all ${
                    selectedImageIdx === idx
                      ? "border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20 scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info & Purchasing Box */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {product.isHandcrafted ? (
                <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Artisan Handcrafted
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-indigo-500" /> Viral Dropship Winner
                </span>
              )}
              <span className="text-xs text-zinc-400">SKU: {selectedVariant?.sku || "CR-CRAFT-01"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                {product.tagline}
              </p>
            )}

            {/* Rating Bar */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-xl font-bold text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating} / 5.0</span>
              </div>
              <span className="text-xs text-zinc-500">
                Based on <strong className="text-zinc-800 dark:text-zinc-200">{product.reviewCount}</strong> verified buyer reviews
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
                {formatPrice(currentPrice)}
              </span>
              {currentCompareAt && currentCompareAt > currentPrice && (
                <span className="text-base line-through text-zinc-400">
                  {formatPrice(currentCompareAt)}
                </span>
              )}
              {discountPercent && (
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Inclusive of all taxes. Free shipping applied on orders above ₹499.
            </p>
          </div>

          {/* Artisan Origin Story Pill (If Handcrafted) */}
          {product.artisanName && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-amber-950 dark:text-amber-200">
                  Handcrafted by {product.artisanName} ({product.artisanLocation})
                </p>
                <p className="text-amber-900/80 dark:text-amber-300/80 text-[11px] mt-0.5 leading-relaxed">
                  {product.artisanStory}
                </p>
              </div>
            </div>
          )}

          {/* Variant Selector */}
          {product.variants.length > 1 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Select Option / Pack: <span className="text-indigo-600 dark:text-indigo-400 font-normal">{selectedVariant?.name}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-2xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                      selectedVariant?.id === v.id
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                    }`}
                  >
                    <div>
                      <p className="font-bold">{v.name}</p>
                      <p className="text-[11px] text-zinc-400 font-normal">{formatPrice(v.price)}</p>
                    </div>
                    {selectedVariant?.id === v.id && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Stock Urgency */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Quantity
              </label>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                In Stock ({product.stock} units)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-zinc-900 dark:text-zinc-100 min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Total Calculation */}
              <div className="text-xs text-zinc-500">
                Total: <strong className="text-zinc-900 dark:text-zinc-100 text-sm font-black">{formatPrice(currentPrice * quantity)}</strong>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => addToCart(product, selectedVariant, quantity)}
              className="w-full py-4 rounded-2xl border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-extrabold text-xs tracking-wide uppercase shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Bag
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs tracking-wide uppercase shadow-xl shadow-indigo-600/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Buy Now
            </button>
          </div>

          {/* Pincode Estimator */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-500" /> Check Delivery to Pincode
            </label>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit PIN code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                ✓ {pincodeStatus}
              </p>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-500" />
              <span>Express Inspected Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-500" />
              <span>7-Day Return Window</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Genuine Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Direct Artisan Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleProduct && (
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-900 border border-purple-200/60 dark:border-zinc-800 shadow-md">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                15% Bundle Discount
              </span>
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Frequently Bought Together
              </h3>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Item 1 */}
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-200">
                    <Image
                      src={product.images[0]?.url || "/products/craft-item-01.jpeg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[140px]">{product.name}</p>
                    <p className="text-xs text-indigo-600 font-bold">{formatPrice(product.price)}</p>
                  </div>
                </div>

                <span className="text-xl font-bold text-zinc-400">+</span>

                {/* Item 2 */}
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-200">
                    <Image
                      src={bundleProduct.images[0]?.url || "/products/craft-item-26.jpeg"}
                      alt={bundleProduct.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[140px]">{bundleProduct.name}</p>
                    <p className="text-xs text-indigo-600 font-bold">{formatPrice(bundleProduct.price)}</p>
                  </div>
                </div>
              </div>

              {/* Bundle CTA */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-zinc-400 line-through">{formatPrice(bundleTotal)}</span>
                  <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{formatPrice(bundleDiscounted)}</p>
                </div>
                <button
                  onClick={() => {
                    addToCart(product, product.variants[0], 1);
                    addToCart(bundleProduct, bundleProduct.variants[0], 1);
                    showToast("Bundle Added!", "Both items added to cart with 15% discount.", "success");
                  }}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Both to Bag
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabbed In-Depth Information */}
      <section className="space-y-6">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar">
          {[
            { id: "desc", label: "Artisan Description & Story" },
            { id: "specs", label: "Specifications & Dimensions" },
            { id: "reviews", label: `Verified Reviews (${product.reviews?.length || 0})` },
            { id: "faqs", label: "FAQs & Care Guide" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Description */}
        {activeTab === "desc" && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">About This Craft</h3>
            <p>{product.description}</p>
            {product.detailedDescription && <p>{product.detailedDescription}</p>}
          </div>
        )}

        {/* Tab 2: Specs */}
        {activeTab === "specs" && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex justify-between text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">{key}</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === "reviews" && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="text-4xl font-black text-zinc-900 dark:text-zinc-100">{product.rating}</span>
                  <div className="flex text-amber-400 justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400">{product.reviewCount} ratings</span>
                </div>
                <div className="text-xs text-zinc-500">
                  <p>98% of customers recommend this item</p>
                  <p className="text-[11px] text-emerald-600 font-medium">✓ Verified Artisan Purchase Badge</p>
                </div>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-sm"
              >
                Write a Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400">{rev.date}</span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{rev.title}</p>
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 text-center py-6">No customer reviews yet. Be the first to leave a review!</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: FAQs */}
        {activeTab === "faqs" && (
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {(product.faqs || [
                { question: "How long does shipping take?", answer: "We dispatch within 24 hours. Metro deliveries arrive in 2-3 business days." },
                { question: "What is your return policy?", answer: "We offer 7-day doorstep return pickup if you're not 100% delighted." }
              ]).map((faq, i) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-1 text-xs">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.question}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400 pl-6 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Related Products Carousel */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            You May Also Love
          </h2>
          <Link href="/products" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Write a Review</h3>
            <p className="text-xs text-zinc-500">Share your experience with {product.name}</p>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1"
                    >
                      <Star className={`w-6 h-6 ${star <= newReviewRating ? "fill-amber-400 text-amber-400" : "text-zinc-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Review Comments</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How is the craft quality, packaging, and feel?"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
