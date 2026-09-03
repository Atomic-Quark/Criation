"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

interface TaxVerificationStepProps {
  pan: string;
  setPan: (val: string) => void;
  isGstExempt: boolean;
  setIsGstExempt: (val: boolean) => void;
  gstin: string;
  setGstin: (val: string) => void;
  artisanCardNumber: string;
  setArtisanCardNumber: (val: string) => void;
}

export function TaxVerificationStep({
  pan,
  setPan,
  isGstExempt,
  setIsGstExempt,
  gstin,
  setGstin,
  artisanCardNumber,
  setArtisanCardNumber,
}: TaxVerificationStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. Indian Statutory Tax Identification
        </h2>
        <p className="text-xs text-zinc-500">
          GSTIN and PAN are verified automatically against Indian Ministry tax databases.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Permanent Account Number (PAN) *
          </label>
          <input
            type="text"
            maxLength={10}
            required
            placeholder="ABCDE1234F"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            className="w-full max-w-md px-3 py-2.5 rounded-xl font-mono text-sm uppercase bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-[10px] text-zinc-500 block mt-1">
            10-character PAN of the Proprietor or Legal Business Entity.
          </span>
        </div>

        {/* Exemption Toggle */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isGstExempt}
              onChange={(e) => setIsGstExempt(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                Claim Artisan Turnover Exemption (Below GST Threshold)
              </span>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                Under Indian GST Notification 65/2017 & Section 24, handcrafted artisans with annual turnover below ₹20/40 Lakhs may register using Pehchan Card or Udyam Registration.
              </p>
            </div>
          </label>
        </div>

        {!isGstExempt ? (
          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Goods and Services Tax ID (GSTIN) *
            </label>
            <input
              type="text"
              maxLength={15}
              required
              placeholder="08AAAAA0000A1Z5"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              className="w-full max-w-md px-3 py-2.5 rounded-xl font-mono text-sm uppercase bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-[10px] text-zinc-500 block mt-1">
              15-character statutory GST identification number.
            </span>
          </div>
        ) : (
          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Pehchan Artisan ID or Udyam Registration Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. RJ-HAND-2026-00482 or UDYAM-RJ-08-0012345"
              value={artisanCardNumber}
              onChange={(e) => setArtisanCardNumber(e.target.value)}
              className="w-full max-w-md px-3 py-2.5 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-[10px] text-zinc-500 block mt-1">
              Issued by Ministry of Textiles (Development Commissioner for Handicrafts) or MSME.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
