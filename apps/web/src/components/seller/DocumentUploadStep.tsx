"use client";

import React from "react";
import { FileText } from "lucide-react";

interface DocumentUploadStepProps {
  panCardUrl: string;
  gstCertificateUrl: string;
  bankProofUrl: string;
  artisanProofUrl: string;
  isGstExempt: boolean;
  uploadingDoc: string | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, docType: "pan" | "gst" | "bank" | "artisan") => void;
}

export function DocumentUploadStep({
  panCardUrl,
  gstCertificateUrl,
  bankProofUrl,
  artisanProofUrl,
  isGstExempt,
  uploadingDoc,
  handleFileUpload,
}: DocumentUploadStepProps) {
  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600" /> 4. KYC Document Uploads
        </h2>
        <p className="text-xs text-zinc-500">
          Uploaded files are scanned for cryptographic magic-bytes and validated against tampering (Max 5MB).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* PAN Card Upload */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-2 bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">PAN Card Scan *</span>
            {panCardUrl && <span className="text-[10px] text-emerald-600 font-bold">✓ Attached</span>}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => handleFileUpload(e, "pan")}
            disabled={uploadingDoc === "pan"}
            className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <span className="text-[10px] text-zinc-400 block">PDF, PNG or JPG up to 5MB</span>
        </div>

        {/* Bank Proof Upload */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-2 bg-zinc-50/50 dark:bg-zinc-800/40">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">Bank Cheque / Passbook *</span>
            {bankProofUrl && <span className="text-[10px] text-emerald-600 font-bold">✓ Attached</span>}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => handleFileUpload(e, "bank")}
            disabled={uploadingDoc === "bank"}
            className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <span className="text-[10px] text-zinc-400 block">Cancelled cheque or first passbook page</span>
        </div>

        {/* GST Certificate (if not exempt) */}
        {!isGstExempt && (
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-2 bg-zinc-50/50 dark:bg-zinc-800/40">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">GST Registration Certificate *</span>
              {gstCertificateUrl && <span className="text-[10px] text-emerald-600 font-bold">✓ Attached</span>}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => handleFileUpload(e, "gst")}
              disabled={uploadingDoc === "gst"}
              className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <span className="text-[10px] text-zinc-400 block">Form GST REG-06 Certificate</span>
          </div>
        )}

        {/* Artisan Proof (if exempt) */}
        {isGstExempt && (
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-2 bg-zinc-50/50 dark:bg-zinc-800/40">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">Artisan Card / Pehchan Proof</span>
              {artisanProofUrl && <span className="text-[10px] text-emerald-600 font-bold">✓ Attached</span>}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => handleFileUpload(e, "artisan")}
              disabled={uploadingDoc === "artisan"}
              className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <span className="text-[10px] text-zinc-400 block">Pehchan card or MSME Udyam certificate</span>
          </div>
        )}
      </div>
    </div>
  );
}
