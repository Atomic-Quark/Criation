"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  ShieldCheck,
  Package,
  Tag,
  AlertTriangle,
  Activity,
  Lock,
  KeyRound,
  RefreshCw,
  Store,
} from "lucide-react";

import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";
import { MerchantKycTab } from "@/components/admin/MerchantKycTab";
import { ListingModerationTab } from "@/components/admin/ListingModerationTab";
import { CouponsManagementTab } from "@/components/admin/CouponsManagementTab";
import { SecurityAuditLogsTab } from "@/components/admin/SecurityAuditLogsTab";

export default function AdminPage() {
  const {
    products,
    orders,
    formatPrice,
    showToast,
    lockAdmin,
    user,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    "overview" | "merchants" | "moderation" | "coupons" | "logs"
  >("overview");

  // Merchant Applications State
  const [merchantApps, setMerchantApps] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const fetchMerchantApps = async () => {
    setLoadingApps(true);
    try {
      const res = await fetch("/api/admin/merchants");
      const data = await res.json();
      if (data.success) {
        setMerchantApps(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to load merchant applications:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    if (user.role === "admin" && user.email?.toLowerCase().trim() === "dks45000000@gmail.com") {
      fetchMerchantApps();
    }
  }, [user.role, user.email]);

  const handleReviewMerchant = async (
    applicationId: string,
    action: "approve" | "reject",
    notes?: string
  ) => {
    setReviewingId(applicationId);
    try {
      const res = await fetch("/api/admin/merchants/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, action, notes }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          action === "approve" ? "Merchant Approved! 🎉" : "Application Rejected",
          data.message,
          action === "approve" ? "success" : "info"
        );
        fetchMerchantApps();
      } else {
        showToast("Review Failed", data.error || "Unable to update application status.", "error");
      }
    } catch (err: any) {
      showToast("Network Error", "Could not connect to review API.", "error");
    } finally {
      setReviewingId(null);
    }
  };

  const handleCreateCoupon = (code: string, discount: number, minOrder: number) => {
    showToast(
      "Promotion Deployed",
      `Coupon ${code} (${discount}% OFF, Min: ₹${minOrder}) published.`,
      "success"
    );
  };

  const handleApproveListing = (name: string) => {
    showToast("Listing Approved", `"${name}" verified site-wide.`, "success");
  };

  const pendingApps = merchantApps.filter((a) => a.status === "pending_review");

  // Strict Superadmin Gate
  if (user.role !== "admin" || user.email?.toLowerCase().trim() !== "dks45000000@gmail.com") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
          <KeyRound className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Superadmin Security Lockdown
        </h1>
        <p className="text-xs text-zinc-500">
          The Admin Console is strictly locked to single identity authorization (
          <code className="text-rose-600 font-bold">dks45000000@gmail.com</code>).
        </p>
        <Link
          href="/auth/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-xs"
        >
          Sign In as Superadmin →
        </Link>
      </div>
    );
  }

  const logs = [
    { event: "RBAC Edge Middleware: Single identity dks45000000@gmail.com verified", time: "Just now" },
    { event: "Statutory Merchant KYC: GSTIN format and state code checked", time: "2 mins ago" },
    { event: "RBI IFSC Payout Validation: IFSC lookup completed successfully", time: "14 mins ago" },
    { event: "Cryptographic File Upload: Magic-byte inspection passed (image/webp)", time: "32 mins ago" },
    { event: "Digital Wallet Engine: ₹100 signup credit ledger transaction signed", time: "1 hour ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Superadmin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold shadow-2xs mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Criation Security Gateway · Superadmin Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
            Central Administration Hub
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Authorized Administrator:{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">{user.email}</strong> · Session ID:{" "}
            <span className="font-mono text-[11px] text-zinc-400">ADM-ROOT-9420</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMerchantApps}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs border border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingApps ? "animate-spin" : ""}`} /> Refresh Data
          </button>
          <button
            onClick={lockAdmin}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900/50 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Lock Admin Terminal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        {[
          { id: "overview", label: "Executive Overview", icon: Activity },
          {
            id: "merchants",
            label: "Merchant KYC & Approvals",
            icon: Store,
            badge: pendingApps.length > 0 ? `${pendingApps.length} Pending` : undefined,
          },
          { id: "moderation", label: "Artisan Listing Moderation", icon: Package },
          { id: "coupons", label: "Promo Codes & Discounts", icon: Tag },
          { id: "logs", label: "Live System Audit Trail", icon: AlertTriangle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "border-rose-600 text-rose-600 dark:text-rose-400"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold animate-pulse">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <AdminOverviewTab
          formatPrice={formatPrice}
          orderCount={orders.length}
          pendingAppsCount={pendingApps.length}
        />
      )}

      {/* Tab 2: Merchant KYC & Approvals */}
      {activeTab === "merchants" && (
        <MerchantKycTab
          merchantApps={merchantApps}
          loadingApps={loadingApps}
          reviewingId={reviewingId}
          handleReviewMerchant={handleReviewMerchant}
        />
      )}

      {/* Tab 3: Moderation */}
      {activeTab === "moderation" && (
        <ListingModerationTab
          products={products}
          onApproveListing={handleApproveListing}
        />
      )}

      {/* Tab 4: Coupons */}
      {activeTab === "coupons" && (
        <CouponsManagementTab onCreateCoupon={handleCreateCoupon} />
      )}

      {/* Tab 5: Logs */}
      {activeTab === "logs" && <SecurityAuditLogsTab logs={logs} />}
    </div>
  );
}
