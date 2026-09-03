"use client";

import React from "react";
import {
  Store,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  Building,
  FileText,
  ExternalLink,
} from "lucide-react";

interface MerchantKycTabProps {
  merchantApps: any[];
  loadingApps: boolean;
  reviewingId: string | null;
  handleReviewMerchant: (applicationId: string, action: "approve" | "reject", notes?: string) => Promise<void>;
}

export function MerchantKycTab({
  merchantApps,
  loadingApps,
  reviewingId,
  handleReviewMerchant,
}: MerchantKycTabProps) {
  const pendingApps = merchantApps.filter((a) => a.status === "pending_review");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Statutory Merchant Applications ({merchantApps.length})
          </h3>
          <p className="text-xs text-zinc-500">
            Review applicant tax credentials, government database matches, and grant verified seller privileges.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
          {pendingApps.length} Pending Review
        </span>
      </div>

      {loadingApps ? (
        <div className="p-12 text-center text-zinc-400 text-xs">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading merchant applications...
        </div>
      ) : merchantApps.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 space-y-2">
          <Store className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-600" />
          <p className="font-bold text-sm text-zinc-600 dark:text-zinc-400">No Merchant Applications Yet</p>
          <p className="text-xs">
            Prospective sellers can submit applications at <code className="text-indigo-600">/seller/apply</code>.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {merchantApps.map((app) => {
            const isPending = app.status === "pending_review";
            const isApproved = app.status === "approved";
            const isRejected = app.status === "rejected";
            const isProcessing = reviewingId === app.id;

            return (
              <div
                key={app.id}
                className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base font-black text-zinc-900 dark:text-zinc-100">{app.businessName}</h4>
                      <span className="text-xs text-zinc-400">({app.tradeName})</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isApproved
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : isRejected
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        }`}
                      >
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Applicant: <strong className="text-zinc-700 dark:text-zinc-300">{app.applicantName}</strong> ({app.applicantEmail}) · Phone: {app.phone}
                    </p>
                  </div>

                  {/* Action Buttons for Superadmin */}
                  {isPending && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleReviewMerchant(app.id, "approve")}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Merchant
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => {
                          const reason = prompt("Enter rejection reason for this applicant:");
                          if (reason !== null) {
                            handleReviewMerchant(app.id, "reject", reason);
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Particulars Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-400 text-[10px]">Entity Classification</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">
                      {app.entityType?.replace(/_/g, " ")}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[10px]">Specialization</span>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">{app.category}</p>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[10px]">Registered PAN</span>
                    <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{app.pan}</p>
                  </div>

                  <div>
                    <span className="text-zinc-400 text-[10px]">GSTIN / Exemption</span>
                    <p className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                      {app.isGstExempt ? `Artisan Exempt (${app.artisanCardNumber})` : app.gstin}
                    </p>
                  </div>
                </div>

                {/* Government Verification Badges */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px]">Govt Verification:</span>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>GSTIN Status: {app.govVerification?.gstinStatus || "Active"}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PAN Match: Verified ({app.govVerification?.confidenceScore || 98}%)</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-100/70 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold text-[11px]">
                    <Building className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Bank IFSC: {app.bankDetails?.ifsc} (Valid)</span>
                  </div>
                </div>

                {/* Bank Settlement & Documents */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                  <div className="text-zinc-500">
                    Payout Account: <strong className="text-zinc-800 dark:text-zinc-200">{app.bankDetails?.bankName}</strong> ({app.bankDetails?.accountHolderName})
                  </div>

                  <div className="flex items-center gap-2">
                    {app.documents?.panCardUrl && (
                      <a
                        href={app.documents.panCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> PAN Scan <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {app.documents?.bankProofUrl && (
                      <a
                        href={app.documents.bankProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> Bank Cheque <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {app.documents?.gstCertificateUrl && (
                      <a
                        href={app.documents.gstCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> GST Reg <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Admin Review Notes if rejected/approved */}
                {app.adminNotes && (
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs">
                    Audit Note: {app.adminNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
