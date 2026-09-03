"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  BadgeCheck,
  Clock,
  XCircle,
  ArrowRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import { SellerApplicationData } from "./types";

interface ApplicationStatusDashboardProps {
  application: SellerApplicationData;
  userRole: string;
  onResubmit: () => void;
}

export function ApplicationStatusDashboard({
  application,
  userRole,
  onResubmit,
}: ApplicationStatusDashboardProps) {
  const isApproved = application.status === "approved" || userRole === "seller";
  const isPending = application.status === "pending_review";
  const isRejected = application.status === "rejected";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Government Statutory Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
          Merchant Application Status
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Application Reference ID:{" "}
          <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
            {application.id || "APP-KYC-PENDING"}
          </span>
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="flex items-center gap-3">
            {isApproved && <BadgeCheck className="w-8 h-8 text-emerald-500 shrink-0" />}
            {isPending && <Clock className="w-8 h-8 text-amber-500 shrink-0 animate-pulse" />}
            {isRejected && <XCircle className="w-8 h-8 text-rose-500 shrink-0" />}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Status</span>
              <p className="text-lg font-black text-zinc-900 dark:text-zinc-100 capitalize">
                {isApproved && "Verified & Approved"}
                {isPending && "Under Superadmin Verification"}
                {isRejected && "Application Needs Attention"}
              </p>
            </div>
          </div>

          <div>
            {isApproved && (
              <Link
                href="/seller"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm inline-flex items-center gap-2"
              >
                Enter Merchant Hub <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            {isRejected && (
              <button
                onClick={onResubmit}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Resubmit Application
              </button>
            )}
          </div>
        </div>

        {/* Verification Pipeline Steps */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Accreditation Lifecycle</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-200">1. Application Filed</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300">Documents securely submitted</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-200">2. Govt Tax Checks</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300">GSTIN, PAN & Bank Validated</p>
              </div>
            </div>

            <div
              className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                isApproved
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40"
                  : isRejected
                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40"
                  : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40"
              }`}
            >
              {isApproved && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {isPending && <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-spin" />}
              {isRejected && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold text-zinc-900 dark:text-zinc-100">3. Superadmin Sign-off</p>
                <p className="text-[10px] text-zinc-500">
                  {isApproved
                    ? "Approved by dks45000000@gmail.com"
                    : isPending
                    ? "Awaiting Superadmin Review"
                    : "Rejected"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Review Notes */}
        {application.adminNotes && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" /> Superadmin Audit Feedback:
            </span>
            <p className="text-[11px] text-amber-800 dark:text-amber-300">{application.adminNotes}</p>
          </div>
        )}

        {/* Details Preview */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs space-y-2">
          <h4 className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
            Registered Entity Particulars
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-zinc-400 text-[10px]">Business Name</span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">{application.businessName}</p>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px]">Trade / Brand</span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">{application.tradeName}</p>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px]">Tax ID (PAN)</span>
              <p className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{application.pan}</p>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px]">GSTIN Status</span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                {application.isGstExempt ? "Artisan Exempt" : application.gstin || "Active"}
              </p>
            </div>
            <div>
              <span className="text-zinc-400 text-[10px]">Bank Payout</span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                {application.bankDetails?.bankName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
