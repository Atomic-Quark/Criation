"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  ShieldCheck,
  Users,
  Package,
  DollarSign,
  Tag,
  AlertTriangle,
  Activity,
  CheckCircle2,
  XCircle,
  Plus,
  Flame,
  Lock,
  KeyRound,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminPage() {
  const {
    products,
    orders,
    formatPrice,
    showToast,
    lockAdmin,
    user,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"overview" | "moderation" | "coupons" | "logs">("overview");

  // New Coupon Form
  const [newCode, setNewCode] = useState("");
  const [newDisc, setNewDisc] = useState(15);
  const [newMinOrder, setNewMinOrder] = useState(799);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    showToast("Coupon Created! 🎟️", `Promo code "${newCode.toUpperCase()}" (${newDisc}% OFF) is now active site-wide.`, "success");
    setNewCode("");
  };

  const logs = [
    { time: "2 mins ago", event: "Order #CR-9824 placed via UPI", severity: "info" },
    { time: "14 mins ago", event: "Sunflower Keychain product stock decremented", severity: "info" },
    { time: "1 hour ago", event: "AuraGlow Sunset Lamp pricing synced with supplier", severity: "info" },
    { time: "3 hours ago", event: "Automated fraud check: Order #CR-9819 verified (Risk score: 2/100)", severity: "success" },
  ];

  // If user is NOT authenticated as Superadmin, show the Security Gateway
  if (!user.isAuthenticated || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
            Superadmin Access Required
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            This administration portal is restricted strictly to verified platform administrators with cryptographic server-side authorization.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-5">
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200">
            <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Role-Based Access Enforcement Active</span>
              <p className="text-[11px] text-rose-800 dark:text-rose-300 mt-0.5">
                Current active account ({user.name || "Guest"}) does not possess verified superadmin privileges. Please sign in with administrator credentials.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/auth/login?redirect=/admin"
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" /> Sign In with Admin Credentials
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
      {/* Admin Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-50/90 via-purple-50/50 to-white dark:from-rose-950/30 dark:via-purple-950/20 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 border border-rose-200/80 dark:border-rose-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800/60">
            <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Superadmin Terminal · Session Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
            Criation Control Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Monitor GMV velocity, moderate artisan listings, configure promo campaigns, and inspect live security audits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={lockAdmin}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900/50 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Lock Admin Terminal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {[
          { id: "overview", label: "Executive Overview", icon: Activity },
          { id: "moderation", label: "Artisan Listing Moderation", icon: Package },
          { id: "coupons", label: "Promo Codes & Discounts", icon: Tag },
          { id: "logs", label: "Live System Audit Trail", icon: AlertTriangle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-rose-600 text-rose-600 dark:text-rose-400"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase">Gross Merchandise Value (GMV)</span>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono">{formatPrice(1842000)}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">↑ +24.8% vs last month</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase">Registered Artisans</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">248 Artisans</p>
              <span className="text-[11px] text-zinc-400">Spread over 14 states</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase">Active Dropship Orders</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{orders.length} in transit</p>
              <span className="text-[11px] text-emerald-600 font-semibold">99.4% SLA Compliance</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase">Platform Take-Rate (Net)</span>
              <p className="text-2xl font-black text-emerald-600 font-mono">{formatPrice(92100)}</p>
              <span className="text-[11px] text-zinc-400">2% transaction fee</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Moderation */}
      {activeTab === "moderation" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Artisan Craft Submissions ({products.length})</h3>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {products.slice(0, 8).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{p.name}</p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">{p.categoryName} · {p.artisanLocation || "India"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    ✓ Verified Quality
                  </span>
                  <button
                    onClick={() => showToast("Listing Approved", `"${p.name}" verified site-wide.`, "success")}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold cursor-pointer"
                  >
                    Quick Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Coupons */}
      {activeTab === "coupons" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Create New Site-wide Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. DIWALI30"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 uppercase font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Discount (%)</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={newDisc}
                  onChange={(e) => setNewDisc(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 font-semibold"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-colors"
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
                <div key={c.code} className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">{c.code}</span>
                    <span className="text-zinc-400 dark:text-zinc-400 ml-2">({c.disc}, Min: {c.min})</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{c.usage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Logs */}
      {activeTab === "logs" && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Live Infrastructure & Security Audit Logs</h3>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {logs.map((l, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{l.event}</span>
                </div>
                <span className="text-zinc-400 dark:text-zinc-400 text-[10px] font-mono">{l.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
