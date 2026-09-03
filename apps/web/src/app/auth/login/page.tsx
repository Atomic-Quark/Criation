"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, User, Store, Truck, Crown, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const res = await login(email, password, "customer");
    setLoading(false);

    if (res.success) {
      router.push("/account");
    } else {
      setErrorMessage(res.error || "Invalid credentials. Please verify and try again.");
    }
  };

  const handleDemoRoleLogin = async (role: "customer" | "seller" | "supplier" | "admin", demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setErrorMessage("");
    setLoading(true);

    const res = await login(demoEmail, "password123", role);
    setLoading(false);

    if (res.success) {
      if (role === "seller") router.push("/seller");
      else if (role === "supplier") router.push("/supplier");
      else if (role === "admin") router.push("/admin");
      else router.push("/account");
    } else {
      setErrorMessage(res.error || "Demo profile error.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Criation Secure Gateway</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
          Welcome to Criation
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Sign in to manage orders, wishlist, or digital wallet</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-md space-y-5">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-700 dark:text-rose-300">Authentication Failed</p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-zinc-700 dark:text-zinc-300">Password</label>
              <Link href="/support" className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors focus:outline-hidden cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              <>
                Sign In to Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Role Switcher Demo Buttons */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block text-center tracking-wider">
            🚀 1-Click Quick Demo Profiles
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoRoleLogin("customer", "divyanshu@criation.example")}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center gap-1.5 text-zinc-800 dark:text-zinc-200 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoRoleLogin("seller", "merchant@criation.example")}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center gap-1.5 text-indigo-600 dark:text-indigo-400 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Merchant
            </button>
            <button
              type="button"
              onClick={() => handleDemoRoleLogin("supplier", "supplier@criation.example")}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Supplier
            </button>
            <button
              type="button"
              onClick={() => handleDemoRoleLogin("admin", "admin@criation.example")}
              className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center gap-1.5 text-rose-600 dark:text-rose-400 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Superadmin
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="pt-2 text-center space-y-2 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
          <p>
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create an account (Get ₹100 bonus) →
            </Link>
          </p>
          <p>
            Want VIP perks & free express shipping?{" "}
            <Link href="/subscription" className="font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1">
              <Crown className="w-3 h-3" /> Explore Prime Plans
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
