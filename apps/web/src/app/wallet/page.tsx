"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Sparkles,
  ShieldCheck,
  Award,
  CreditCard,
  QrCode,
  CheckCircle2,
  RefreshCw,
  Gift,
  Zap,
} from "lucide-react";

export default function WalletPage() {
  const { user, walletTransactions, addWalletMoney, formatPrice, showToast } = useStore();

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [txFilter, setTxFilter] = useState<"all" | "credit" | "debit">("all");
  const [voucherCode, setVoucherCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  const presetAmounts = [200, 500, 1000, 2000, 5000];

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = customAmount ? parseFloat(customAmount) : topUpAmount;
    if (isNaN(amount) || amount <= 0) {
      showToast("Invalid Amount", "Please enter a valid top-up amount.", "error");
      return;
    }
    addWalletMoney(amount);
    setIsTopUpOpen(false);
    setCustomAmount("");
    showToast("Money Added!", `${formatPrice(amount)} added to your Criation Wallet.`, "success");
  };

  const handleVoucherRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    setIsRedeeming(true);
    setTimeout(() => {
      setIsRedeeming(false);
      if (voucherCode.trim().toUpperCase() === "WELCOME100") {
        addWalletMoney(100);
        showToast("Voucher Redeemed!", "₹100 bonus credited to your wallet.", "success");
        setVoucherCode("");
      } else if (voucherCode.trim().toUpperCase() === "FESTIVE250") {
        addWalletMoney(250);
        showToast("Voucher Redeemed!", "₹250 festive bonus credited to your wallet.", "success");
        setVoucherCode("");
      } else {
        showToast("Invalid Voucher", "Code is expired or invalid. Try WELCOME100 or FESTIVE250.", "error");
      }
    }, 600);
  };

  const filteredTransactions = walletTransactions.filter((tx) => {
    if (txFilter === "credit") return tx.type === "credit";
    if (txFilter === "debit") return tx.type === "debit";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/account" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          My Account
        </Link>
        <span>/</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Criation Wallet</span>
      </nav>

      {/* Hero Header & Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Wallet Balance Card */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[260px]">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold w-fit">
                <Wallet className="w-3.5 h-3.5" />
                <span>Criation Instant Pay Wallet</span>
              </div>
              <span className="text-xs font-bold text-indigo-100 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> 100% Protected
              </span>
            </div>

            <div className="pt-3">
              <span className="text-xs text-indigo-200 font-medium uppercase tracking-wider">
                Available Cash Balance
              </span>
              <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight mt-1">
                {formatPrice(user.walletBalance)}
              </h1>
            </div>
          </div>

          <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsTopUpOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white text-indigo-950 font-extrabold text-xs sm:text-sm hover:bg-zinc-100 shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Add Money (Instant UPI)</span>
            </button>

            <Link
              href="/products"
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Spend on Crafts</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Loyalty & Tier Status Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Loyalty Points */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Reward Points
              </span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {user.loyaltyPoints} <span className="text-xs font-semibold text-zinc-500">Pts</span>
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                100 Pts = ₹100 instant checkout voucher
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          {/* VIP Tier */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                VIP Membership
              </span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {user.tier} Club
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Free Express Delivery & 5% Cashback
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Voucher Promo Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 font-black">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Have a Gift Card or Promo Voucher?
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Redeem code <span className="font-mono font-bold text-amber-600 dark:text-amber-400">WELCOME100</span> or <span className="font-mono font-bold text-amber-600 dark:text-amber-400">FESTIVE250</span> for instant bonus cash.
            </p>
          </div>
        </div>

        <form onSubmit={handleVoucherRedeem} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Enter Code (e.g. WELCOME100)"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono uppercase focus:ring-2 focus:ring-amber-500 focus:outline-hidden w-full sm:w-56"
          />
          <button
            type="submit"
            disabled={isRedeeming}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isRedeeming ? "Applying..." : "Redeem"}
          </button>
        </form>
      </div>

      {/* Wallet Activity Log & Transactions */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Transaction History</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Real-time audit log of all credits, top-ups, and checkout deductions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">
            {(["all", "credit", "debit"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setTxFilter(filter)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-colors cursor-pointer ${
                  txFilter === filter
                    ? "bg-white dark:bg-zinc-700 text-zinc-950 dark:text-white font-bold shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                {filter === "all" ? "All Activity" : filter === "credit" ? "Credits (+)" : "Debits (-)"}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <RefreshCw className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <p className="text-xs font-semibold text-zinc-500">No transactions found for this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredTransactions.map((tx) => {
              const isCredit = tx.type === "credit";
              return (
                <div
                  key={tx.id}
                  className="py-4 flex items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCredit
                          ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {tx.date} • ID: {tx.id}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-mono font-bold text-xs sm:text-sm ${
                        isCredit
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {isCredit ? "+" : "-"}
                      {formatPrice(tx.amount)}
                    </p>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md">
                      Completed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top-Up Modal Popup */}
      {isTopUpOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-zinc-950 dark:text-white">
                  Add Money to Wallet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTopUpOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit} className="space-y-5">
              {/* Preset Buttons */}
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
                  Select Quick Amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setTopUpAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        topUpAmount === amt && !customAmount
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {formatPrice(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Or Custom Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Supported Payment Modes Note */}
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant Processing
                </div>
                <p>Supports Google Pay, PhonePe, Paytm UPI, Net Banking, and All Major Cards.</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-colors cursor-pointer"
                >
                  Proceed to Pay {formatPrice(customAmount ? parseFloat(customAmount) || 0 : topUpAmount)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
