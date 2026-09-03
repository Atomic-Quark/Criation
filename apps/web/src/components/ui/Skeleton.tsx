"use client";

import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`rounded-xl bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800/80 dark:via-zinc-700/50 dark:to-zinc-800/80 bg-[length:200%_100%] animate-pulse ${className}`}
      {...props}
    />
  );
}

// 1. Reusable Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-3.5 sm:p-4 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3.5 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Image Placeholder */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/80 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-200/60 dark:bg-zinc-700/50" />
        </div>

        {/* Category & Badge */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
      </div>

      {/* Price & Add Button */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-3 w-12 rounded-md" />
        </div>
        <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
      </div>
    </div>
  );
}

// 2. Product Grid Skeleton (e.g. for /products, /deals, /dropship)
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

// 3. Product Details Page Skeleton (for /products/[id])
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in">
      <Skeleton className="h-4 w-48 rounded-md" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-8 w-full rounded-xl" />
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-6 w-36 rounded-md" />
          </div>

          <div className="space-y-2 py-4 border-y border-zinc-200 dark:border-zinc-800">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-4/6 rounded-md" />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Cart / Checkout Skeleton
export function CartPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in">
      <Skeleton className="h-8 w-44 rounded-xl" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex gap-4">
              <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-24 rounded-lg" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <Skeleton className="h-6 w-32 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
            <Skeleton className="h-12 w-full rounded-2xl pt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
