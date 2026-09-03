"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Heart } from "lucide-react";

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Handcrafting your experience...",
    "Curating authentic artisan treasures...",
    "Connecting to rural craft cooperatives...",
    "Loading real-time inventory & dropship pricing...",
    "Almost ready for you...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950 transition-colors">
      {/* Ambient Pulsing Background Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow delay-700" />

      {/* Main Animated Loader Core */}
      <div className="relative flex flex-col items-center space-y-6 z-10">
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer Rotating Gradient Ring */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-1 animate-spin-slow shadow-xl shadow-indigo-500/20">
            <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[22px]" />
          </div>

          {/* Secondary Spinning Dashed Ring */}
          <div className="absolute inset-1.5 rounded-2xl border-2 border-dashed border-indigo-400/50 animate-spin" style={{ animationDuration: "12s" }} />

          {/* Central Pulsing Brand Emblem */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-700 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 transform hover:scale-105 transition-transform animate-pulse">
            C
          </div>

          {/* Floating Craft Icons */}
          <div className="absolute -top-2 -right-2 p-1.5 rounded-xl bg-amber-500 text-white shadow-md animate-float">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute -bottom-2 -left-2 p-1.5 rounded-xl bg-rose-500 text-white shadow-md animate-float" style={{ animationDelay: "1.5s" }}>
            <Heart className="w-4 h-4" />
          </div>
        </div>

        {/* Dynamic Loading Text */}
        <div className="text-center space-y-2 max-w-sm mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            <span>Criation Artisan Gateway</span>
          </div>

          <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight transition-all duration-300 min-h-[28px] flex items-center justify-center gap-1">
            {messages[messageIndex]}
          </h3>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Empowering 200+ master craftswomen across India with fair trade logistics
          </p>
        </div>

        {/* Shimmer Skeleton Grid Preview */}
        <div className="w-full max-w-2xl pt-6 space-y-4 opacity-70">
          <div className="h-4 w-48 rounded-lg animate-shimmer mx-auto" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-2.5">
                <div className="aspect-square w-full rounded-xl animate-shimmer" />
                <div className="h-3 w-3/4 rounded-md animate-shimmer" />
                <div className="h-3 w-1/2 rounded-md animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
