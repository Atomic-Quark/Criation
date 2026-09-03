"use client";

import React from "react";

interface ListingModerationTabProps {
  products: any[];
  onApproveListing: (name: string) => void;
}

export function ListingModerationTab({
  products,
  onApproveListing,
}: ListingModerationTabProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
        Artisan Craft Submissions ({products.length})
      </h3>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
        {products.slice(0, 8).map((p) => (
          <div key={p.id} className="py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">{p.name}</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                {p.categoryName} · {p.artisanLocation || "India"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                ✓ Verified Quality
              </span>
              <button
                onClick={() => onApproveListing(p.name)}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold cursor-pointer transition-colors"
              >
                Approve Listing
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
