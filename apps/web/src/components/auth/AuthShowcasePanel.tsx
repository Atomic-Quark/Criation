"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Gift,
  Truck,
  ArrowLeft,
} from "lucide-react";
import { FloatingGlassOrbs } from "@/components/animations/FloatingGlassOrbs";

interface AuthShowcasePanelProps {
  mode: "login" | "register";
}

export function AuthShowcasePanel({ mode }: AuthShowcasePanelProps) {
  const isLogin = mode === "login";

  return (
    <div
      className={`lg:w-[50%] xl:w-[52%] relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 min-h-[420px] lg:min-h-screen ${
        isLogin
          ? "bg-gradient-to-br from-zinc-950 via-indigo-950/80 to-purple-950/90"
          : "bg-gradient-to-br from-zinc-950 via-purple-950/80 to-amber-950/40"
      }`}
    >
      {/* Dynamic Animated Floating Glowing Orbs */}
      <FloatingGlassOrbs
        primaryColor={isLogin ? "bg-indigo-600/25" : "bg-amber-500/20"}
        secondaryColor="bg-purple-600/20"
        accentColor={isLogin ? "bg-amber-500/15" : "bg-indigo-600/20"}
      />

      {/* Top Branding & Return Link */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            C
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white block leading-none">
              Criation<span className="text-amber-400">.</span>
            </span>
            <span className="text-[10px] text-white/60 font-medium tracking-wider uppercase">
              {isLogin ? "Artisan Commerce" : "Artisan Collective"}
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 backdrop-blur-md border border-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Storefront</span>
        </Link>
      </div>

      {/* Center Hero Statement & Floating 3D Cards */}
      <div className="relative z-10 my-auto py-8 space-y-8">
        <div className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold shadow-lg backdrop-blur-md text-amber-300">
            {isLogin ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Direct From India's Heritage Masters</span>
              </>
            ) : (
              <>
                <Gift className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>Instant Welcome Reward</span>
              </>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]">
            {isLogin ? (
              <>
                Authentic Crafts. <br />
                <span className="bg-gradient-to-r from-amber-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  Zero Middlemen.
                </span>
              </>
            ) : (
              <>
                Claim <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">₹100 Bonus</span> <br />
                in Your Wallet.
              </>
            )}
          </h2>

          <p className="text-sm text-white/75 leading-relaxed">
            {isLogin
              ? "Step into India's premier artisanal marketplace connecting master rural craftsmen with discerning buyers and global dropship entrepreneurs."
              : "Create your account in 30 seconds. Receive instant shopping credit and join thousands of Indian craft enthusiasts supporting authentic rural artisans."}
          </p>
        </div>

        {/* Floating Glassmorphic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          {isLogin ? (
            <>
              <div className="p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl space-y-1.5 animate-float-slow">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>256-Bit SSL Protection</span>
                </div>
                <p className="text-[11px] text-white/70">
                  Edge token verification with strict RBAC boundary separation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl space-y-1.5 animate-float-reverse">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Instant Wallet Checkout</span>
                </div>
                <p className="text-[11px] text-white/70">
                  1-tap UPI, cards, and zero-interest wallet split settlement.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl space-y-1.5 animate-float-slow">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Direct Artisan Guilds</span>
                </div>
                <p className="text-[11px] text-white/70">
                  100% authentic crafts from 14+ Indian states with zero middlemen.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl space-y-1.5 animate-float-reverse">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Tracked Express Delivery</span>
                </div>
                <p className="text-[11px] text-white/70">
                  Live SMS & WhatsApp dispatch alerts right to your doorstep.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Social Proof */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Over 45,000+ satisfied craft lovers</span>
        </div>

        <div className="flex items-center gap-1 font-semibold text-amber-300">
          <span>★ 4.9/5 Average Rating</span>
        </div>
      </div>
    </div>
  );
}
