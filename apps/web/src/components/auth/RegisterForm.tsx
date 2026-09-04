"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Gift,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { CountryCodeSelect } from "./CountryCodeSelect";
import { OtpVerificationModal } from "./OtpVerificationModal";
import { CloudflareTurnstile } from "./CloudflareTurnstile";
import {
  SUPPORTED_COUNTRIES,
  CountryTelecomInfo,
  validatePhoneNumber,
} from "@/lib/auth/phoneValidation";
import { validateEmail } from "@/lib/auth/emailValidation";

export function RegisterForm() {
  const router = useRouter();
  const { registerUser, showToast } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryTelecomInfo>(
    SUPPORTED_COUNTRIES[0]
  );
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // OTP Verification States
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Real-time phone validation
  const phoneValidation = useMemo(() => {
    if (!phone) return null;
    return validatePhoneNumber(selectedCountry.dialCode, phone);
  }, [selectedCountry.dialCode, phone]);

  // Real-time email validation
  const emailValidation = useMemo(() => {
    if (!email) return null;
    return validateEmail(email);
  }, [email]);

  const handleStartVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || "Please enter a valid email address.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("Please enter your mobile phone number.");
      return;
    }

    const phoneCheck = validatePhoneNumber(selectedCountry.dialCode, phone);
    if (!phoneCheck.isValid) {
      setErrorMessage(phoneCheck.error || "Please enter a valid mobile number.");
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

    if (!turnstileToken) {
      setErrorMessage("Please verify that you are human by completing the Cloudflare challenge.");
      return;
    }

    // If already verified with token, proceed to register directly
    if (isPhoneVerified && verificationToken) {
      executeRegistration(verificationToken);
      return;
    }

    // Otherwise open the OTP verification modal
    setIsOtpModalOpen(true);
  };

  const executeRegistration = async (token?: string) => {
    setLoading(true);
    setErrorMessage("");

    const res = await registerUser({
      name: name.trim(),
      email: email.trim(),
      dialCode: selectedCountry.dialCode,
      phone: phone.trim(),
      password,
      verificationToken: token || verificationToken || undefined,
      turnstileToken: turnstileToken || undefined,
    });

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
      setErrorMessage(res.error || "Registration failed. Please try a different email or phone.");
    }
  };

  const handleOtpVerified = (token: string) => {
    setVerificationToken(token);
    setIsPhoneVerified(true);
    showToast("Mobile Verified! 📱", "Proceeding to complete account registration...", "success");
    executeRegistration(token);
  };

  return (
    <div className="lg:w-[50%] xl:w-[48%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-zinc-950 text-zinc-100">
      {/* Top Bar inside Register Form Side */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Verified Customer Sign Up</span>
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
            Create Your Verified Account
          </h1>
          <p className="text-xs text-zinc-400">
            Sign up today with verified telecom details and get ₹100 instant wallet credit applied automatically.
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

        <form onSubmit={handleStartVerification} className="space-y-4 text-xs">
          {/* Full Name */}
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

          <div className="grid grid-cols-1 gap-4">
            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-zinc-300 block">Email Address *</label>
                {emailValidation && (
                  <span className={`text-[10px] font-semibold ${emailValidation.isValid ? "text-emerald-400 flex items-center gap-1" : "text-amber-400"}`}>
                    {emailValidation.isValid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Valid Domain
                      </>
                    ) : (
                      "Invalid Email"
                    )}
                  </span>
                )}
              </div>
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
                  className={`w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-900 border text-white placeholder:text-zinc-600 focus:outline-hidden transition-all ${
                    email && emailValidation && !emailValidation.isValid
                      ? "border-rose-700/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-zinc-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  }`}
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
              {email && emailValidation && !emailValidation.isValid && (
                <p className="text-[10px] text-rose-400 mt-1">{emailValidation.error}</p>
              )}
            </div>

            {/* Mobile Number with Country Code Select */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-zinc-300 block">
                  Mobile Number (Strict Verification) *
                </label>
                {phoneValidation && (
                  <span className={`text-[10px] font-semibold ${phoneValidation.isValid ? "text-emerald-400 flex items-center gap-1" : "text-amber-400"}`}>
                    {phoneValidation.isValid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Valid format
                      </>
                    ) : (
                      `${phone.replace(/\D/g, "").length} of ${selectedCountry.minLength} digits`
                    )}
                  </span>
                )}
              </div>
              <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all overflow-hidden">
                <CountryCodeSelect
                  value={selectedCountry.dialCode}
                  onChange={(country) => {
                    setSelectedCountry(country);
                    setErrorMessage("");
                  }}
                />
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="numeric"
                  placeholder={selectedCountry.placeholder}
                  value={phone}
                  onChange={(e) => {
                    // Only allow digits and spaces
                    const val = e.target.value.replace(/[^\d\s]/g, "");
                    setPhone(val);
                    setErrorMessage("");
                  }}
                  className="w-full px-3.5 py-3 bg-transparent text-white placeholder:text-zinc-600 focus:outline-hidden font-mono text-xs"
                />
                {isPhoneVerified && (
                  <div className="flex items-center pr-3 text-emerald-400" title="Verified Mobile">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 flex items-center justify-between">
                <span>{selectedCountry.flag} {selectedCountry.name}: {selectedCountry.hint}</span>
                {phone && phoneValidation && !phoneValidation.isValid && (
                  <span className="text-rose-400 font-medium">Invalid length</span>
                )}
              </p>
            </div>
          </div>

          {/* Password */}
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

          {/* Cloudflare Turnstile Human Verification Challenge */}
          <div className="pt-1">
            <CloudflareTurnstile
              onSuccess={(token) => {
                setTurnstileToken(token);
                setErrorMessage("");
              }}
              onExpire={() => setTurnstileToken(null)}
              theme="dark"
            />
          </div>

          {/* Terms Checkbox */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-400">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500/30"
              />
              <span>
                I agree to the{" "}
                <Link href="/legal/terms" className="text-amber-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="text-amber-400 hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 font-bold text-xs shadow-md shadow-amber-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : isPhoneVerified ? (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        type="phone"
        target={`${selectedCountry.flag} ${selectedCountry.dialCode} ${phone}`}
        dialCode={selectedCountry.dialCode}
        nationalValue={phone}
        onVerified={handleOtpVerified}
        onClose={() => setIsOtpModalOpen(false)}
      />

      {/* Bottom Footer inside Register Form Side */}
      <div className="pt-6 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 Criation Artisans Collective. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/legal/privacy" className="hover:text-zinc-400 transition-colors">
            Privacy
          </Link>
          <Link href="/legal/terms" className="hover:text-zinc-400 transition-colors">
            Terms
          </Link>
          <Link href="/support" className="hover:text-zinc-400 transition-colors">
            Help
          </Link>
        </div>
      </div>
    </div>
  );
}
