"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function WalletLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in">
      <Skeleton className="h-4 w-36 rounded-md" />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-64 rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between">
          <Skeleton className="h-6 w-44 rounded-full" />
          <Skeleton className="h-12 w-64 rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-44 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>
      </div>

      {/* Activity Log */}
      <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <Skeleton className="h-6 w-48 rounded-md" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
