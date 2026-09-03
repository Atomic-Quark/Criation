"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Flame, Clock, Sparkles, Tag, ArrowRight } from "lucide-react";

export default function DealsPage() {
  const { products } = useStore();

  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 18 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dealProducts = products.filter((p) => (p.compareAtPrice && p.compareAtPrice > p.price) || p.isFlashSale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Flash Sale Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-50/90 via-amber-50/60 to-white dark:from-rose-950/30 dark:via-zinc-900 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 border border-rose-200/80 dark:border-rose-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800/60">
            <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Mega Flash Clearance
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
            Up to 50% OFF Festive & Trending Deals
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
            Limited stock flash discounts on designer clay diyas, crochet charms, and winning dropship tech.
          </p>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2.5">
          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 text-center min-w-[60px] shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Hours</span>
          </div>
          <span className="font-bold text-xl text-rose-400">:</span>
          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 text-center min-w-[60px] shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Mins</span>
          </div>
          <span className="font-bold text-xl text-rose-400">:</span>
          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-rose-100 dark:border-zinc-700 text-center min-w-[60px] shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="block text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Secs</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dealProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
