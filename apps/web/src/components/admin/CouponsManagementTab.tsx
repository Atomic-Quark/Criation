"use client";

import React, { useState } from "react";

interface CouponsManagementTabProps {
  onCreateCoupon: (code: string, discount: number, minOrder: number) => void;
}

export function CouponsManagementTab({ onCreateCoupon }: CouponsManagementTabProps) {
  const [newCode, setNewCode] = useState("");
  const [newDisc, setNewDisc] = useState(15);
  const [newMinOrder, setNewMinOrder] = useState(799);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    onCreateCoupon(newCode.trim().toUpperCase(), newDisc, newMinOrder);
    setNewCode("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
          Issue Global Promotional Code
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Coupon Code</label>
            <input
              type="text"
              required
              placeholder="e.g. DIWALI50"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Discount (%)</label>
              <input
                type="number"
                min={1}
                max={90}
                value={newDisc}
                onChange={(e) => setNewDisc(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Min. Order (₹)</label>
              <input
                type="number"
                min={0}
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition-colors"
          >
            + Launch Promo Campaign
          </button>
        </form>
      </div>

      <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Active Coupons</h3>
        <div className="space-y-2 text-xs">
          {[
            { code: "CRIATION10", disc: "10% OFF", min: "₹0", usage: "342 uses" },
            { code: "FIRST500", disc: "₹500 OFF", min: "₹1,999", usage: "128 uses" },
            { code: "FESTIVE20", disc: "20% OFF", min: "₹999", usage: "854 uses" },
          ].map((c) => (
            <div
              key={c.code}
              className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"
            >
              <div>
                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                  {c.code}
                </span>
                <span className="text-zinc-400 dark:text-zinc-400 ml-2">
                  ({c.disc}, Min: {c.min})
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {c.usage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
