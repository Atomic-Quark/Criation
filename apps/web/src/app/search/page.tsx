"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, ArrowRight } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { products } = useStore();

  const results = products.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Search Results for <span className="text-indigo-600 dark:text-indigo-400">"{query}"</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Found {results.length} matching product(s)</p>
      </div>

      {results.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
          <Search className="w-12 h-12 text-zinc-400 mx-auto" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No matching products found</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try searching for "sunflower", "diya", "poshak", "vase", or "lamp".
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-md"
          >
            Explore All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-medium">Searching products...</div>}>
      <SearchContent />
    </Suspense>
  );
}
