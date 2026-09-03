"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Filter,
  SlidersHorizontal,
  Search,
  X,
  Star,
  Sparkles,
  Flame,
  ArrowUpDown,
  Grid3X3,
  LayoutList,
  RotateCcw,
} from "lucide-react";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialType = searchParams.get("type") || "all";
  const initialQuery = searchParams.get("q") || "";

  const { products, categories, formatPrice } = useStore();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "rating" | "newest">("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state whenever URL searchParams change (UX-3 Resolution)
  React.useEffect(() => {
    const cat = searchParams.get("category") || "all";
    const typ = searchParams.get("type") || "all";
    const q = searchParams.get("q") || "";
    setSelectedCategory(cat);
    setSelectedType(typ);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const handleCategorySelect = (catSlug: string) => {
    setSelectedCategory(catSlug);
    const params = new URLSearchParams(searchParams.toString());
    if (catSlug === "all") {
      params.delete("category");
    } else {
      params.set("category", catSlug);
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 12);
  }, [products]);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== "all" && p.categoryId !== selectedCategory && p.collectionSlug !== selectedCategory) {
          return false;
        }
        // Type
        if (selectedType === "handcrafted" && !p.isHandcrafted) return false;
        if (selectedType === "dropship" && !p.isDropship) return false;
        // Search
        if (
          searchQuery.trim() &&
          !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          return false;
        }
        // Price
        if (p.price > maxPrice) return false;
        // Rating
        if (minRating > 0 && p.rating < minRating) return false;
        // In stock
        if (inStockOnly && p.stock <= 0) return false;
        // Tag
        if (selectedTag && !p.tags.includes(selectedTag)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [products, selectedCategory, selectedType, searchQuery, maxPrice, minRating, inStockOnly, selectedTag, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedType("all");
    setSearchQuery("");
    setMaxPrice(6000);
    setMinRating(0);
    setInStockOnly(false);
    setSelectedTag(null);
    setSortBy("featured");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedType !== "all" ||
    searchQuery.trim() !== "" ||
    maxPrice < 6000 ||
    minRating > 0 ||
    inStockOnly ||
    selectedTag !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          All Products & Catalog
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Browse {products.length} authentic handcrafted items & winning dropship products with instant dispatch.
        </p>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Product Origin
            </label>
            <div className="flex flex-col gap-1.5 text-xs">
              {[
                { id: "all", label: "All Items" },
                { id: "handcrafted", label: "✨ Handcrafted Only" },
                { id: "dropship", label: "⚡ Dropshipping Winners" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`text-left px-3 py-2 rounded-xl font-medium transition-colors ${
                    selectedType === type.id
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Categories
            </label>
            <div className="flex flex-col gap-1 text-xs max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => handleCategorySelect("all")}
                className={`text-left px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`text-left px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === cat.slug || selectedCategory === cat.id
                      ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] opacity-60">
                    {products.filter((p) => p.categoryId === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <label className="text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Max Price
              </label>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                {formatPrice(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="6000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>{formatPrice(150)}</span>
              <span>{formatPrice(6000)}</span>
            </div>
          </div>

          {/* Minimum Rating Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Rating
            </label>
            <div className="flex flex-col gap-1 text-xs">
              {[
                { val: 0, label: "All Ratings" },
                { val: 4.5, label: "4.5★ & above" },
                { val: 4.8, label: "4.8★ & above" },
              ].map((r) => (
                <button
                  key={r.val}
                  onClick={() => setMinRating(r.val)}
                  className={`text-left px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
                    minRating === r.val
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags Pills */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Popular Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-indigo-600 text-white font-bold"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Product Grid Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            {/* Search within catalog */}
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Filter by name, color, material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300"
            >
              <Filter className="w-4 h-4 text-indigo-500" /> Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-900 dark:text-zinc-100 cursor-pointer focus:ring-2 focus:ring-indigo-500"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 font-medium">Active:</span>
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                  Category: {selectedCategory}
                  <button type="button" onClick={() => handleCategorySelect("all")} className="cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedType !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                  Type: {selectedType}
                  <button onClick={() => setSelectedType("all")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedTag && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                  #{selectedTag}
                  <button onClick={() => setSelectedTag(null)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 text-xs font-semibold">
                  Rating: {minRating}★+
                  <button onClick={() => setMinRating(0)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
              <div className="w-16 h-16 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <Search className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No matching products found</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                Try adjusting your search terms, price slider, or category filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 6} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-medium">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
