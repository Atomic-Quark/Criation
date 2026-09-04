"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

interface OtpVerificationModalProps {
  isOpen: boolean;
  target: string; // e.g. "+91 98765 43210" or "aditi@example.com"
  type: "phone" | "email";
  dialCode: string;
  nationalValue: string;
  onVerified: (verificationToken: string) => void;
  onClose: () => void;
}

export function OtpVerificationModal({
  isOpen,
  target,
  type,
  dialCode,
  nationalValue,
  onVerified,
  onClose,
}: OtpVerificationModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);

  // Send OTP when modal opens
  useEffect(() => {
    if (isOpen) {
      setCode("");
      setErrorMessage("");
      setSuccessMessage("");
      sendVerificationCode();
    }
  }, [isOpen, target]);

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (isOpen && cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, cooldown]);

  const sendVerificationCode = async () => {
    setSending(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          dialCode,
          value: nationalValue,
        }),
      });
      const data = await res.json();
      setSending(false);

      if (data.success) {
        setSuccessMessage(data.message || "Verification code dispatched.");
        setCooldown(60);
        if (data.devCode) {
          setDevCode(data.devCode);
        }
      } else {
        setErrorMessage(data.error || "Failed to send code. Please try again.");
      }
    } catch (e: any) {
      setSending(false);
      setErrorMessage("Network error connecting to verification service.");
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const targetParam = type === "phone" ? `${dialCode}${nationalValue.replace(/\D/g, "")}` : nationalValue.trim();
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: targetParam,
          code: code.trim(),
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.verificationToken) {
        onVerified(data.verificationToken);
        onClose();
      } else {
        setErrorMessage(data.error || "Verification failed. Code is invalid or expired.");
      }
    } catch (e: any) {
      setLoading(false);
      setErrorMessage("Failed to verify code. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-700/80 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-100 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-800/60 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Verify {type === "phone" ? "Mobile Number" : "Email Address"}
          </h2>
          <p className="text-xs text-zinc-400">
            We sent a 6-digit verification code to{" "}
            <span className="font-mono text-amber-300 font-bold">{target}</span>
          </p>
        </div>

        {/* Development Helper Badge */}
        {devCode && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-700/60 text-xs text-amber-200 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-300">Development Mode Code: </span>
                <span className="font-mono font-black text-white tracking-widest text-sm bg-zinc-950 px-2 py-0.5 rounded-lg border border-amber-800/40">
                  {devCode}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setCode(devCode);
                setErrorMessage("");
              }}
              className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
            >
              Auto-Fill
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-rose-300">{errorMessage}</p>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2 text-center">
              Enter 6-Digit One-Time Password (OTP)
            </label>
            <input
              type="text"
              required
              maxLength={6}
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="••••••"
              value={code}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setCode(digits);
                setErrorMessage("");
              }}
              className="w-full text-center py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white font-mono text-2xl tracking-[0.5em] placeholder:tracking-normal placeholder:text-zinc-700 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs shadow-md shadow-amber-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Verifying..." : "Confirm & Proceed"}
          </button>
        </form>

        {/* Resend Action */}
        <div className="text-center pt-1 border-t border-zinc-800/80">
          <p className="text-xs text-zinc-400">
            Didn't receive the code?{" "}
            {cooldown > 0 ? (
              <span className="text-zinc-500 font-mono font-medium">Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                disabled={sending}
                onClick={sendVerificationCode}
                className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${sending ? "animate-spin" : ""}`} />
                <span>Resend OTP Code</span>
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
