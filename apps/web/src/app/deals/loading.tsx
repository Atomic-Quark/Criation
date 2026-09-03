"use client";

import React from "react";
import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function DealsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in">
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-10 w-80 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md max-w-full" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
