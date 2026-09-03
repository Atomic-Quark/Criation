"use client";

import React from "react";

interface AdminOverviewTabProps {
  formatPrice: (val: number) => string;
  orderCount: number;
  pendingAppsCount: number;
}

export function AdminOverviewTab({
  formatPrice,
  orderCount,
  pendingAppsCount,
}: AdminOverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase">
            Gross Merchandise Value (GMV)
          </span>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono">
            {formatPrice(1842000)}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">↑ +24.8% vs last month</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase">Registered Artisans</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            248 Artisans
          </p>
          <span className="text-[11px] text-zinc-400">Spread over 14 states</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase">Active Dropship Orders</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {orderCount} in transit
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">99.4% SLA Compliance</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase">
            Pending Merchant Applications
          </span>
          <p className="text-2xl font-black text-rose-600 font-mono">{pendingAppsCount}</p>
          <span className="text-[11px] text-rose-600 font-semibold">
            Requires Superadmin Approval
          </span>
        </div>
      </div>
    </div>
  );
}
