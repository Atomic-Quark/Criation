"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  Gift,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export function RegisterForm() {
  const router = useRouter();
  const { registerUser, showToast } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("Please accept the terms and conditions to proceed.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    const res = await registerUser({ name, email, phone, password });
    setLoading(false);

    if (res.success) {
      showToast(
        "Account Created! 🎉",
        "Welcome to Criation! ₹100 welcome credit has been credited to your wallet.",
        "success"
      );
      if (email.toLowerCase().trim() === "dks45000000@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      setErrorMessage(res.error || "Registration failed. Please try a different email.");
    }
  };

  return (
    <div className="lg:w-[50%] xl:w-[48%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-zinc-950 text-zinc-100">
      {/* Top Bar inside Register Form Side */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>New Customer Sign Up</span>
        </div>

        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
          <span>Already a member?</span>
          <Link
            href="/auth/login"
            className="text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors cursor-pointer"
          >
            Sign In here →
          </Link>
        </div>
      </div>

      {/* Form Center */}
      <div className="w-full max-w-md mx-auto my-auto py-8 space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Your Free Account
          </h1>
          <p className="text-xs text-zinc-400">
            Sign up today and get ₹100 instant wallet credit applied automatically.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-900/60 flex items-start gap-3 text-xs text-rose-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-300">Registration Error</p>
              <p className="text-[11px] text-rose-400 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-zinc-300 block mb-1.5">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="e.g. Aditi Sharma"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-zinc-300 block mb-1.5">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="aditi@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="font-bold text-zinc-300 block mb-1.5">
                Mobile Number (for SMS) *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-zinc-300 block mb-1.5">Create Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Modular Password Strength Meter */}
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Instant Bonus Alert Pill */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-300">
            <Gift className="w-4 h-4 text-amber-400 shrink-0" />
            <span>₹100 Welcome Gift will be credited to your Criation Wallet upon registration.</span>
          </div>

          {/* Terms Checkbox */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-400">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded text-amber-500 focus:ring-amber-500"
              />
              <span className="text-[11px] leading-relaxed">
                I agree to Criation's{" "}
                <Link href="/support" className="text-amber-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/support" className="text-amber-400 hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:opacity-95 disabled:opacity-50 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                Creating Account & Crediting ₹100...
              </>
            ) : (
              <>
                <Gift className="w-4 h-4 text-zinc-950" />
                <span>Complete Registration & Claim ₹100 Bonus</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Sign In Box */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center text-xs text-zinc-400 space-y-1">
          <p>
            Already registered with Criation?{" "}
            <Link href="/auth/login" className="font-bold text-indigo-400 hover:underline">
              Sign In to existing account →
            </Link>
          </p>
        </div>

        {/* Merchant Link */}
        <div className="text-center text-xs text-zinc-500">
          <span>Want to sell authentic Indian crafts? </span>
          <Link href="/seller/apply" className="font-bold text-zinc-300 hover:underline">
            Apply as a Merchant →
          </Link>
        </div>
      </div>

      {/* Bottom Legal Notice */}
      <div className="pt-6 border-t border-zinc-800/80 text-center text-[11px] text-zinc-500 space-y-1">
        <p>Protected by reCAPTCHA & statutory Indian consumer guidelines.</p>
        <p className="text-zinc-600">© 2026 Criation Inc. All rights reserved.</p>
      </div>
    </div>
  );
}
