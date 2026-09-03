"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Mail,
  ArrowRight,
  Heart,
} from "lucide-react";

export function Footer() {
  const { categories, showToast } = useStore();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Invalid Email", "Please enter a valid email address.", "error");
      return;
    }
    showToast("Subscribed! 🎉", "You'll receive exclusive artisan drop alerts and 10% coupon.", "success");
    setEmail("");
  };

  return (
    <footer className="bg-[#f5f0e6] dark:bg-[#100e0c] text-[#756c63] dark:text-[#a59b90] border-t border-[#e8e0d4] dark:border-[#2e2822] pt-16 pb-24 sm:pb-16 text-xs transition-colors">
      {/* Trust Value Badges Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#e8e0d4] dark:border-[#25201b]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#fdf2ef] dark:bg-[#251915] border border-[#f5d5cc] dark:border-[#452620] flex items-center justify-center text-[#c25e3f] dark:text-[#d97757] shrink-0 shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#241f1c] dark:text-[#f4ece1] text-sm">100% Handcrafted</h4>
              <p className="text-[#756c63] dark:text-[#a59b90] mt-0.5 text-[11px]">Direct from rural master artisans</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#f0f4f1] dark:bg-[#18231b] border border-[#d8e4db] dark:border-[#2b3c2f] flex items-center justify-center text-[#56745f] dark:text-[#779b81] shrink-0 shadow-2xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#241f1c] dark:text-[#f4ece1] text-sm">Express Shipping</h4>
              <p className="text-[#756c63] dark:text-[#a59b90] mt-0.5 text-[11px]">Free delivery on orders over ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#fbf5ea] dark:bg-[#262015] border border-[#f2dfbf] dark:border-[#45371f] flex items-center justify-center text-[#b58334] dark:text-[#d49f48] shrink-0 shadow-2xs">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#241f1c] dark:text-[#f4ece1] text-sm">7-Day Easy Returns</h4>
              <p className="text-[#756c63] dark:text-[#a59b90] mt-0.5 text-[11px]">Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#f6f2f9] dark:bg-[#211927] border border-[#e8ddf1] dark:border-[#3d2b4b] flex items-center justify-center text-[#7c5b96] dark:text-[#ab8ec3] shrink-0 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#241f1c] dark:text-[#f4ece1] text-sm">Safe & Secure Pay</h4>
              <p className="text-[#756c63] dark:text-[#a59b90] mt-0.5 text-[11px]">256-bit encrypted UPI & Cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#c25e3f] via-[#d97757] to-[#b58334] flex items-center justify-center text-white font-serif font-black text-lg shadow-sm">
                C
              </div>
              <span className="font-serif font-black text-2xl tracking-tight text-[#241f1c] dark:text-[#f4ece1]">
                Criation<span className="text-[#c25e3f] dark:text-[#d97757]">.</span>
              </span>
            </Link>
            <p className="text-[#756c63] dark:text-[#a59b90] leading-relaxed max-w-sm text-xs">
              Empowering traditional craftswomen across India with fair wages, modern dropshipping logistics, and a global digital storefront for exquisite handcrafted treasures.
            </p>

            {/* Newsletter Input */}
            <form onSubmit={handleSubscribe} className="pt-2">
              <p className="text-[#241f1c] dark:text-[#f4ece1] font-semibold mb-2 text-xs">Get 10% OFF your first order:</p>
              <div className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181512] border border-[#e8e0d4] dark:border-[#352f29] text-[#241f1c] dark:text-[#f4ece1] placeholder:text-[#9c9184] focus:outline-hidden focus:ring-2 focus:ring-[#c25e3f]/20 focus:border-[#c25e3f] transition-all text-xs"
                  />
                  <Mail className="w-4 h-4 text-[#9c9184] absolute right-3.5 top-3" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#c25e3f] hover:bg-[#a84d31] text-white font-semibold transition-colors flex items-center gap-1 shrink-0 text-xs shadow-xs cursor-pointer"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-[#241f1c] dark:text-[#f4ece1] uppercase tracking-wider text-[11px]">Collections</h5>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-[#756c63] dark:text-[#a59b90] hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/deals" className="text-[#b75258] dark:text-[#cf6e74] font-semibold hover:underline transition-colors">
                  🔥 Flash Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Platforms & Business */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-[#241f1c] dark:text-[#f4ece1] uppercase tracking-wider text-[11px]">Portals & Dropship</h5>
            <ul className="space-y-2 text-[#756c63] dark:text-[#a59b90]">
              <li>
                <Link href="/subscription" className="text-[#b58334] dark:text-[#d49f48] font-bold hover:opacity-80 transition-colors flex items-center gap-1">
                  👑 VIP Prime Membership
                </Link>
              </li>
              <li>
                <Link href="/dropship" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors">
                  Dropship Hub & Research
                </Link>
              </li>
              <li>
                <Link href="/seller" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors">
                  Seller / Merchant Portal
                </Link>
              </li>
              <li>
                <Link href="/supplier" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors">
                  Wholesale Supplier Hub
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors">
                  Admin Operations Center
                </Link>
              </li>
              <li>
                <Link href="/ai-tools" className="hover:text-[#7c5b96] dark:hover:text-[#ab8ec3] transition-colors text-[#7c5b96] dark:text-[#ab8ec3] font-medium">
                  AI E-Commerce Suite
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors">
                  Affiliate Program (Earn 10%)
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Account */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-[#241f1c] dark:text-[#f4ece1] uppercase tracking-wider text-[11px]">Account & Policies</h5>
            <ul className="space-y-2 text-[#756c63] dark:text-[#a59b90]">
              <li>
                <Link href="/auth/login" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] font-medium transition-colors">
                  Sign In to Account
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] font-medium transition-colors text-[#c25e3f] dark:text-[#d97757]">
                  Register (Claim ₹100)
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors">
                  24/7 Customer Support
                </Link>
              </li>
              <li>
                <Link href="/legal/shipping-policy" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors">
                  Shipping & Delivery SLA
                </Link>
              </li>
              <li>
                <Link href="/legal/refund-policy" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors">
                  7-Day Return Guarantee
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy" className="hover:text-[#c25e3f] dark:hover:text-[#d97757] transition-colors">
                  Privacy & Data Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright and Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#e8e0d4] dark:border-[#25201b] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8a8075] dark:text-[#9e9489] text-[11px]">
        <p className="flex items-center gap-1">
          © {new Date().getFullYear()} Criation Handmade & Dropshipping Platform. Crafted with <Heart className="w-3.5 h-3.5 text-[#b75258] fill-[#b75258] inline" /> for Indian Artisans.
        </p>
        <div className="flex items-center gap-2.5 font-semibold text-[#756c63] dark:text-[#a59b90]">
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181512] border border-[#e8e0d4] dark:border-[#352f29] text-[10px]">UPI / QR</span>
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181512] border border-[#e8e0d4] dark:border-[#352f29] text-[10px]">VISA</span>
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181512] border border-[#e8e0d4] dark:border-[#352f29] text-[10px]">MasterCard</span>
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181512] border border-[#e8e0d4] dark:border-[#352f29] text-[10px]">RuPay</span>
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181512] border border-[#e8e0d4] dark:border-[#352f29] text-[10px]">NetBanking</span>
          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#181512] border border-[#e8e0d4] dark:border-[#352f29] text-[10px]">COD</span>
        </div>
      </div>
    </footer>
  );
}
