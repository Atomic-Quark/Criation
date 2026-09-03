"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { EntityType, SellerApplicationData } from "@/components/seller/types";
import { ApplicationStatusDashboard } from "@/components/seller/ApplicationStatusDashboard";
import { BusinessIdentityStep } from "@/components/seller/BusinessIdentityStep";
import { TaxVerificationStep } from "@/components/seller/TaxVerificationStep";
import { BankingPayoutStep } from "@/components/seller/BankingPayoutStep";
import { DocumentUploadStep } from "@/components/seller/DocumentUploadStep";
import { DeclarationReviewStep } from "@/components/seller/DeclarationReviewStep";

export default function SellerApplyPage() {
  const router = useRouter();
  const { user, isAuthenticated, showToast } = useStore();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingApp, setExistingApp] = useState<SellerApplicationData | null>(null);

  // Wizard Step: 1 = Business, 2 = Tax, 3 = Bank, 4 = Documents, 5 = Review
  const [step, setStep] = useState(1);

  // Step 1: Business Identity
  const [businessName, setBusinessName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [entityType, setEntityType] = useState<EntityType>("individual_craftsman");
  const [category, setCategory] = useState("Handicrafts & Wooden Decor");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("Rajasthan");
  const [pincode, setPincode] = useState("");

  // Step 2: Statutory Tax Identification
  const [pan, setPan] = useState("");
  const [isGstExempt, setIsGstExempt] = useState(false);
  const [gstin, setGstin] = useState("");
  const [artisanCardNumber, setArtisanCardNumber] = useState("");

  // Step 3: Banking Details
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("State Bank of India");
  const [accountHolderName, setAccountHolderName] = useState(user?.name || "");

  // Step 4: Statutory Document Uploads
  const [panCardUrl, setPanCardUrl] = useState("");
  const [gstCertificateUrl, setGstCertificateUrl] = useState("");
  const [bankProofUrl, setBankProofUrl] = useState("");
  const [artisanProofUrl, setArtisanProofUrl] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  // Step 5: Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch existing application status on load
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    async function checkStatus() {
      try {
        const res = await fetch("/api/seller/apply/status");
        const data = await res.json();
        if (data.success && data.hasApplication) {
          setExistingApp(data.application);
        }
      } catch (err) {
        console.error("Error fetching merchant status:", err);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [isAuthenticated]);

  // Document upload handler
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: "pan" | "gst" | "bank" | "artisan"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Uploaded document exceeds 5MB size limit.");
      return;
    }

    setUploadingDoc(docType);
    setFormError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);

    try {
      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload document");
      }

      if (docType === "pan") setPanCardUrl(data.url);
      if (docType === "gst") setGstCertificateUrl(data.url);
      if (docType === "bank") setBankProofUrl(data.url);
      if (docType === "artisan") setArtisanProofUrl(data.url);

      showToast("Document Attached", `${file.name} uploaded securely.`, "success");
    } catch (err: any) {
      setFormError(err.message || "Document upload failed");
    } finally {
      setUploadingDoc(null);
    }
  };

  // Step validation
  const validateStep = (currentStep: number): boolean => {
    setFormError("");

    if (currentStep === 1) {
      if (!businessName.trim()) {
        setFormError("Please enter your registered Business / Cooperative Name.");
        return false;
      }
      if (!tradeName.trim()) {
        setFormError("Please enter your Trade / Brand Name.");
        return false;
      }
      if (!phone.trim()) {
        setFormError("Please provide an authorized contact phone number.");
        return false;
      }
      if (!addressLine1.trim() || !city.trim() || !pincode.trim()) {
        setFormError("Please provide complete business address details.");
        return false;
      }
      if (pincode.length !== 6) {
        setFormError("Please enter a valid 6-digit Indian PIN code.");
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan.toUpperCase())) {
        setFormError("Invalid PAN format. Must be 10 characters (e.g. ABCDE1234F).");
        return false;
      }

      if (!isGstExempt) {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(gstin.toUpperCase())) {
          setFormError("Invalid GSTIN format. Must be a valid 15-character Indian GSTIN.");
          return false;
        }
        const stateCode = gstin.substring(0, 2);
        if (parseInt(stateCode, 10) < 1 || parseInt(stateCode, 10) > 38) {
          setFormError("Invalid GSTIN State Code prefix.");
          return false;
        }
      } else {
        if (!artisanCardNumber.trim()) {
          setFormError("Please enter your Pehchan Artisan ID or Udyam MSME Registration.");
          return false;
        }
      }
      return true;
    }

    if (currentStep === 3) {
      if (!accountHolderName.trim()) {
        setFormError("Please enter the Account Holder Name.");
        return false;
      }
      if (!accountNumber || accountNumber.length < 9) {
        setFormError("Please enter a valid bank account number (at least 9 digits).");
        return false;
      }
      if (accountNumber !== confirmAccountNumber) {
        setFormError("Bank account numbers do not match. Please verify.");
        return false;
      }
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(ifsc.toUpperCase())) {
        setFormError("Invalid IFSC code format (e.g. SBIN0001234). 5th character must be '0'.");
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
      if (!panCardUrl) {
        setFormError("Please upload a scan or photo of your PAN Card.");
        return false;
      }
      if (!bankProofUrl) {
        setFormError("Please upload bank account proof (Cancelled Cheque / Passbook).");
        return false;
      }
      if (!isGstExempt && !gstCertificateUrl) {
        setFormError("Please upload your GST Registration Certificate.");
        return false;
      }
      if (isGstExempt && !artisanProofUrl) {
        setFormError("Please upload Pehchan Artisan ID or Udyam Certificate.");
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmitApplication = async () => {
    if (!declarationAccepted) {
      setFormError("You must agree to the statutory legal undertaking to proceed.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const payload = {
        businessName,
        tradeName,
        entityType,
        category,
        phone,
        addressLine1,
        city,
        state: stateName,
        pincode,
        pan: pan.toUpperCase(),
        isGstExempt,
        gstin: isGstExempt ? undefined : gstin.toUpperCase(),
        artisanCardNumber: isGstExempt ? artisanCardNumber : undefined,
        bankDetails: {
          accountNumber,
          ifsc: ifsc.toUpperCase(),
          bankName,
          accountHolderName,
        },
        documents: {
          panCardUrl,
          gstCertificateUrl: isGstExempt ? undefined : gstCertificateUrl,
          bankProofUrl,
          artisanProofUrl: isGstExempt ? artisanProofUrl : undefined,
        },
      };

      const res = await fetch("/api/seller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Application submission failed");
      }

      setExistingApp(data.application);
      showToast(
        "Application Filed Successfully! 🏛️",
        "Your details are undergoing automated statutory checks and Superadmin review.",
        "success"
      );
    } catch (err: any) {
      setFormError(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Account Login Required
        </h1>
        <p className="text-xs text-zinc-500">
          To initiate statutory merchant onboarding and government accreditation, please sign in with your primary Criation profile.
        </p>
        <Link
          href="/auth/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Sign In to Continue →
        </Link>
      </div>
    );
  }

  if (existingApp) {
    return (
      <ApplicationStatusDashboard
        application={existingApp}
        userRole={user.role}
        onResubmit={() => setExistingApp(null)}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Statutory Artisan & Merchant Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
          Merchant Hub Onboarding
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
          To protect buyers and ensure compliance with Indian e-commerce laws, merchant access requires multi-step business verification and Superadmin approval.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
        {[
          { num: 1, label: "Identity" },
          { num: 2, label: "Tax & GST" },
          { num: 3, label: "Banking" },
          { num: 4, label: "Documents" },
          { num: 5, label: "Declaration" },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2 rounded-2xl border transition-all ${
              step === s.num
                ? "bg-indigo-600 text-white font-bold border-indigo-600 shadow-md shadow-indigo-600/20"
                : step > s.num
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                : "bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <span className="block text-[10px] opacity-80 uppercase tracking-widest">Step {s.num}</span>
            <span className="text-xs truncate block">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form Error Banner */}
      {formError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs text-rose-900 dark:text-rose-200 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-800 dark:text-rose-300">Action Required</p>
            <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">{formError}</p>
          </div>
        </div>
      )}

      {/* Wizard Form Card */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
        {step === 1 && (
          <BusinessIdentityStep
            businessName={businessName}
            setBusinessName={setBusinessName}
            tradeName={tradeName}
            setTradeName={setTradeName}
            entityType={entityType}
            setEntityType={setEntityType}
            category={category}
            setCategory={setCategory}
            phone={phone}
            setPhone={setPhone}
            addressLine1={addressLine1}
            setAddressLine1={setAddressLine1}
            city={city}
            setCity={setCity}
            stateName={stateName}
            setStateName={setStateName}
            pincode={pincode}
            setPincode={setPincode}
          />
        )}

        {step === 2 && (
          <TaxVerificationStep
            pan={pan}
            setPan={setPan}
            isGstExempt={isGstExempt}
            setIsGstExempt={setIsGstExempt}
            gstin={gstin}
            setGstin={setGstin}
            artisanCardNumber={artisanCardNumber}
            setArtisanCardNumber={setArtisanCardNumber}
          />
        )}

        {step === 3 && (
          <BankingPayoutStep
            accountHolderName={accountHolderName}
            setAccountHolderName={setAccountHolderName}
            bankName={bankName}
            setBankName={setBankName}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            confirmAccountNumber={confirmAccountNumber}
            setConfirmAccountNumber={setConfirmAccountNumber}
            ifsc={ifsc}
            setIfsc={setIfsc}
          />
        )}

        {step === 4 && (
          <DocumentUploadStep
            panCardUrl={panCardUrl}
            gstCertificateUrl={gstCertificateUrl}
            bankProofUrl={bankProofUrl}
            artisanProofUrl={artisanProofUrl}
            isGstExempt={isGstExempt}
            uploadingDoc={uploadingDoc}
            handleFileUpload={handleFileUpload}
          />
        )}

        {step === 5 && (
          <DeclarationReviewStep
            businessName={businessName}
            tradeName={tradeName}
            entityType={entityType}
            pan={pan}
            isGstExempt={isGstExempt}
            gstin={gstin}
            artisanCardNumber={artisanCardNumber}
            bankName={bankName}
            ifsc={ifsc}
            declarationAccepted={declarationAccepted}
            setDeclarationAccepted={setDeclarationAccepted}
          />
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Continue to Step {step + 1} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitApplication}
              disabled={submitting || !declarationAccepted}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying with Govt Portals...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Submit Application for Approval
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
