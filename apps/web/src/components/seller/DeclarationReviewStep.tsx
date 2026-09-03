"use client";

import React from "react";
import { BadgeCheck } from "lucide-react";
import { EntityType } from "./types";

interface DeclarationReviewStepProps {
  businessName: string;
  tradeName: string;
  entityType: EntityType;
  pan: string;
  isGstExempt: boolean;
  gstin: string;
  artisanCardNumber: string;
  bankName: string;
  ifsc: string;
  declarationAccepted: boolean;
  setDeclarationAccepted: (val: boolean) => void;
}

export function DeclarationReviewStep({
  businessName,
  tradeName,
  entityType,
  pan,
  isGstExempt,
  gstin,
  artisanCardNumber,
  bankName,
  ifsc,
  declarationAccepted,
  setDeclarationAccepted,
}: DeclarationReviewStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-emerald-600" /> 5. Final Summary & Undertaking
        </h2>
        <p className="text-xs text-zinc-500">
          Please verify all submitted details before lodging your accreditation request with Superadmin.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-xs">
        <div>
          <span className="text-zinc-400 text-[10px]">Business Name</span>
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">{businessName}</p>
        </div>
        <div>
          <span className="text-zinc-400 text-[10px]">Trade / Brand</span>
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">{tradeName}</p>
        </div>
        <div>
          <span className="text-zinc-400 text-[10px]">Entity Classification</span>
          <p className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">
            {entityType.replace(/_/g, " ")}
          </p>
        </div>
        <div>
          <span className="text-zinc-400 text-[10px]">Tax ID (PAN)</span>
          <p className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{pan.toUpperCase()}</p>
        </div>
        <div>
          <span className="text-zinc-400 text-[10px]">GST Status</span>
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
            {isGstExempt ? `Exempt (${artisanCardNumber})` : gstin.toUpperCase()}
          </p>
        </div>
        <div>
          <span className="text-zinc-400 text-[10px]">Bank Payout</span>
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">{bankName} ({ifsc.toUpperCase()})</p>
        </div>
      </div>

      {/* Legal Undertaking Checkbox */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-2 text-xs">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={declarationAccepted}
            onChange={(e) => setDeclarationAccepted(e.target.checked)}
            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-[11px]">
            <strong>Statutory Declaration:</strong> I hereby solemnly declare under the laws of the Republic of India that the business identity, tax credentials (PAN/GSTIN), and bank payout particulars provided are authentic, current, and true. I understand that all submitted credentials are subject to automated verification against government portals and final sign-off by the platform Superadmin.
          </span>
        </label>
      </div>
    </div>
  );
}
