"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Flame, Clock, Sparkles, Tag, ArrowRight, MessageSquare } from "lucide-react";

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
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#2c1d18] via-[#241916] to-[#1c1f28] text-[#f4ece1] border border-[#523329] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c25e3f]/25 text-[#e68b6c] text-xs font-bold border border-[#c25e3f]/40 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-[#e68b6c]" /> Mega Flash Clearance
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#f4ece1]">
            Up to 50% OFF Festive & Trending Deals
          </h1>
          <p className="text-xs sm:text-sm text-[#d6cfc4] max-w-xl leading-relaxed">
            Limited stock flash discounts on designer clay diyas, crochet charms, and winning dropship tech. Direct from verified artisan guilds.
          </p>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2.5">
          <div className="p-3 sm:p-4 rounded-2xl bg-[#181512]/90 border border-[#352f29] text-center min-w-[64px] shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-[#d49f48] font-mono">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="block text-[9px] uppercase font-bold text-[#8a8075]">Hours</span>
          </div>
          <span className="font-bold text-xl text-[#d49f48]">:</span>
          <div className="p-3 sm:p-4 rounded-2xl bg-[#181512]/90 border border-[#352f29] text-center min-w-[64px] shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-[#d49f48] font-mono">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="block text-[9px] uppercase font-bold text-[#8a8075]">Mins</span>
          </div>
          <span className="font-bold text-xl text-[#d49f48]">:</span>
          <div className="p-3 sm:p-4 rounded-2xl bg-[#181512]/90 border border-[#352f29] text-center min-w-[64px] shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-[#d49f48] font-mono">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="block text-[9px] uppercase font-bold text-[#8a8075]">Secs</span>
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
