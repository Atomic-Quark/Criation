"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Share2,
  DollarSign,
  TrendingUp,
  Award,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

export default function AffiliatePage() {
  const { user, formatPrice, showToast } = useStore();
  const [copied, setCopied] = useState(false);
  const referralLink = `https://criation.com/?ref=${user.name.toLowerCase().replace(/\s+/g, "")}10`;

  const copyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      showToast("Referral Link Copied! 🎁", "Share with friends & audience to earn 10% commission on every order.", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-white dark:from-emerald-950/30 dark:via-zinc-900 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60">
          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Criation Partner & Influencer Program
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
          Earn 10% Lifetime Commissions
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
          Share unique handcrafted Indian treasures and viral dropship products with your community. Get paid every week.
        </p>
      </div>

      {/* Referral Link Box */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-500" /> Your Unique Partner Tracking Link
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200 border-none select-all"
          />
          <button
            onClick={copyLink}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Link Copied" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Affiliate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-zinc-400 uppercase">Total Clicks</span>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">1,248</p>
          <span className="text-[11px] text-emerald-600 font-semibold">↑ +14.2% this week</span>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-zinc-400 uppercase">Referred Orders</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">86</p>
          <span className="text-[11px] text-zinc-400 font-semibold">6.8% Conversion Rate</span>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-zinc-400 uppercase">Commission Earned</span>
          <p className="text-2xl font-black text-emerald-600">{formatPrice(8420)}</p>
          <span className="text-[11px] text-zinc-400 font-semibold">Auto-deposited to wallet</span>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-zinc-400 uppercase">Tier Level</span>
          <p className="text-2xl font-black text-amber-500">Gold Affiliate</p>
          <span className="text-[11px] text-zinc-400 font-semibold">10% commission rate</span>
        </div>
      </div>
    </div>
  );
}
