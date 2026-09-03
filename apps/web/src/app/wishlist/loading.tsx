"use client";

import React from "react";
import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function WishlistLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-9 w-56 rounded-xl" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
