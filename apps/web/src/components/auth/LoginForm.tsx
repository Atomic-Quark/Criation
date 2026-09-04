"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Gift,
  Store,
  Users,
} from "lucide-react";
import { CloudflareTurnstile } from "./CloudflareTurnstile";

export function LoginForm() {
  const router = useRouter();
  const { login, deviceAccounts, switchAccount } = useStore();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!turnstileToken) {
      setErrorMessage("Please verify that you are human by completing the Cloudflare challenge.");
      return;
    }

    setLoading(true);

    const res = await login(email, password, "customer", turnstileToken || undefined);
    setLoading(false);

    if (res.success) {
      if (email.toLowerCase().trim() === "dks45000000@gmail.com") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      setErrorMessage(res.error || "Invalid credentials. Please verify and try again.");
    }
  };

  return (
    <div className="lg:w-[50%] xl:w-[48%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-zinc-950 text-zinc-100">
      {/* Top Bar inside Login Form Side */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs font-bold">
          <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
          <span>Member Authentication</span>
        </div>

        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
          <span>New customer?</span>
          <Link
            href="/auth/register"
            className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors cursor-pointer"
          >
            Get ₹100 Bonus →
          </Link>
        </div>
      </div>

      {/* Form Center */}
      <div className="w-full max-w-md mx-auto my-auto py-8 space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-zinc-400">
            Enter your credentials to access orders, digital wallet, and exclusive member perks.
          </p>
        </div>

        {/* Quick Account Chooser if accounts exist on this device */}
        {mounted && deviceAccounts.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#161b22]/90 border border-indigo-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Choose an account to sign in:</span>
              </span>
              <span className="text-[10px] text-zinc-500">
                {deviceAccounts.length} saved on device
              </span>
            </div>

            <div className="space-y-2">
              {deviceAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={async () => {
                    await switchAccount(acc.email);
                    if (acc.email.toLowerCase().trim() === "dks45000000@gmail.com") {
                      router.push("/admin");
                    } else {
                      router.push("/");
                    }
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 hover:bg-indigo-950/40 border border-zinc-800 hover:border-indigo-700/50 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden relative bg-zinc-800 border border-zinc-700/60 shrink-0">
                      <Image
                        src={acc.avatar || "/products/craft-item-01.jpeg"}
                        alt={acc.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                        {acc.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate">
                        {acc.email}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0 pl-2">
                    Continue →
                  </span>
                </button>
              ))}
            </div>

            <div className="relative flex items-center justify-center pt-1">
              <div className="border-t border-zinc-800 w-full" />
              <span className="bg-[#161b22] px-2 text-[10px] text-zinc-500 uppercase tracking-wider absolute">
                Or sign in with password
              </span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-900/60 flex items-start gap-3 text-xs text-rose-200 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-300">Sign In Failed</p>
              <p className="text-[11px] text-rose-400 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-zinc-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-zinc-300">Password</label>
              <Link href="/support" className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline">
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
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying Session...
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Dedicated Callout Box for Registration with ₹100 Bonus */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-zinc-900 border border-indigo-900/40 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Don't have an account yet?</span>
            </p>
            <p className="text-[11px] text-zinc-400">
              Register in 30 seconds & unlock ₹100 instantly.
            </p>
          </div>
          <Link
            href="/auth/register"
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shrink-0 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Register Now
          </Link>
        </div>

        {/* Merchant Application Box */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-1">
          <p className="text-xs text-zinc-400 flex items-center justify-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-indigo-400" />
            <span>Are you a rural craftsman or artisan brand?</span>
          </p>
          <Link
            href="/seller/apply"
            className="text-xs font-bold text-indigo-400 hover:underline block"
          >
            Apply for Verified Merchant Onboarding →
          </Link>
        </div>
      </div>

      {/* Bottom Legal Notice */}
      <div className="pt-6 border-t border-zinc-800/80 text-center text-[11px] text-zinc-500 space-y-1">
        <p>
          By signing in, you agree to Criation's{" "}
          <Link href="/support" className="text-zinc-400 hover:underline">Terms of Service</Link> and{" "}
          <Link href="/support" className="text-zinc-400 hover:underline">Privacy Policy</Link>.
        </p>
        <p className="text-zinc-600">© 2026 Criation Inc. All rights reserved.</p>
      </div>
    </div>
  );
}
