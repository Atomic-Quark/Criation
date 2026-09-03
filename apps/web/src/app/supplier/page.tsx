"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Truck,
  Layers,
  PackageCheck,
  CheckCircle2,
  DollarSign,
  Plus,
  Send,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export default function SupplierPortalPage() {
  const { suppliers, sourcingRequests, updateSourcingRequest, formatPrice, showToast, user } = useStore();
  const [activeTab, setActiveTab] = useState<"inventory" | "sourcing" | "orders">("sourcing");

  const [quoteAmount, setQuoteAmount] = useState(380);
  const [quoteLeadTime, setQuoteLeadTime] = useState(4);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  const handleQuoteSubmit = (reqId: string) => {
    updateSourcingRequest(reqId, {
      status: "quoted",
      quotedPrice: quoteAmount,
      leadTimeDays: quoteLeadTime,
      supplierName: "Criation Master Artisans Guild",
    });
    setSelectedReqId(null);
    showToast("Quotation Sent! 💼", `Quoted ${formatPrice(quoteAmount)} with ${quoteLeadTime} days lead time.`, "success");
  };

  // Security Gate: Defense-in-depth authorization for Wholesale Supplier Portal
  if (!user.isAuthenticated || (user.role !== "supplier" && user.role !== "admin")) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto shadow-sm">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
            Supplier Access Required
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            This Wholesale Supplier Portal is restricted strictly to verified B2B raw material suppliers and artisan cooperatives.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-5">
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Supplier Account Required</span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                Your current account ({user.name || "Guest"}) does not possess an approved wholesale supplier profile.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/auth/login?redirect=/supplier"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/25 transition-all flex items-center justify-center gap-2"
            >
              Sign In with Supplier Account
            </Link>

            <Link
              href="/"
              className="block text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 pt-1"
            >
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-white dark:from-amber-950/30 dark:via-orange-950/20 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 border border-amber-200/80 dark:border-amber-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/60">
            <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" /> B2B Wholesale & Guild Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
            Wholesale Supplier Portal
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Fulfill bulk artisan batch purchase orders and respond to real-time merchant sourcing quotes.
          </p>
        </div>
      </div>

      {/* Sourcing Requests Queue */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Active Sourcing Quotes Awaiting Supplier Response
            </h2>
            <p className="text-xs text-zinc-500">Submit competitive wholesale pricing to win merchant bulk production contracts.</p>
          </div>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {sourcingRequests.map((src) => (
            <div key={src.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{src.productName}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {src.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-zinc-500">
                  Target: <strong>{formatPrice(src.targetPrice)}</strong> · Batch Quantity: <strong>{src.quantity} units</strong> · Category: {src.category}
                </p>
                {src.notes && <p className="text-[11px] text-zinc-400 italic">"{src.notes}"</p>}
              </div>

              {selectedReqId === src.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Quoted Price ₹"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(Number(e.target.value))}
                    className="w-24 px-2 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-bold"
                  />
                  <input
                    type="number"
                    placeholder="Lead Days"
                    value={quoteLeadTime}
                    onChange={(e) => setQuoteLeadTime(Number(e.target.value))}
                    className="w-20 px-2 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs"
                  />
                  <button
                    onClick={() => handleQuoteSubmit(src.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                  >
                    Send Quote
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {src.quotedPrice && (
                    <span className="text-emerald-600 font-bold">
                      Quoted: {formatPrice(src.quotedPrice)}
                    </span>
                  )}
                  <button
                    onClick={() => setSelectedReqId(src.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    {src.status === "quoted" ? "Revise Quote" : "Submit Quote"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
