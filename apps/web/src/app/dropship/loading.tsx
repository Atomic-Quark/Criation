"use client";

import React from "react";
import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function DropshipLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in">
      <div className="space-y-3">
        <Skeleton className="h-6 w-36 rounded-full" />
        <Skeleton className="h-9 w-72 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md max-w-full" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
