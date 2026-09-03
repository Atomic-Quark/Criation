"use client";

import React from "react";
import { CreditCard } from "lucide-react";

interface BankingPayoutStepProps {
  accountHolderName: string;
  setAccountHolderName: (val: string) => void;
  bankName: string;
  setBankName: (val: string) => void;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  confirmAccountNumber: string;
  setConfirmAccountNumber: (val: string) => void;
  ifsc: string;
  setIfsc: (val: string) => void;
}

export function BankingPayoutStep({
  accountHolderName,
  setAccountHolderName,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  confirmAccountNumber,
  setConfirmAccountNumber,
  ifsc,
  setIfsc,
}: BankingPayoutStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-amber-600" /> 3. Payout Settlement Banking
        </h2>
        <p className="text-xs text-zinc-500">
          Earnings from verified sales and dropship orders are settled directly into this account.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Account Beneficiary Name *
          </label>
          <input
            type="text"
            required
            placeholder="Name as per Passbook"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Bank Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. State Bank of India"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Account Number *
          </label>
          <input
            type="password"
            required
            placeholder="Enter Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
            className="w-full px-3 py-2.5 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            Confirm Account Number *
          </label>
          <input
            type="text"
            required
            placeholder="Re-enter Account Number"
            value={confirmAccountNumber}
            onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ""))}
            className="w-full px-3 py-2.5 rounded-xl font-mono text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
            11-Digit IFSC Code *
          </label>
          <input
            type="text"
            maxLength={11}
            required
            placeholder="SBIN0001234"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value.toUpperCase())}
            className="w-full px-3 py-2.5 rounded-xl font-mono text-sm uppercase bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
