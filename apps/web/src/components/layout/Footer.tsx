"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  ArrowRight,
  Heart,
  CreditCard,
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
    <footer className="bg-white text-zinc-600 border-t border-zinc-200/80 pt-16 pb-24 sm:pb-16 text-xs transition-colors">
      {/* Trust Value Badges Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-zinc-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-sm">100% Handcrafted</h4>
              <p className="text-zinc-500 mt-0.5 text-[11px]">Direct from rural master artisans</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-sm">Express Shipping</h4>
              <p className="text-zinc-500 mt-0.5 text-[11px]">Free delivery on orders over ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-sm">7-Day Easy Returns</h4>
              <p className="text-zinc-500 mt-0.5 text-[11px]">Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-sm">Safe & Secure Pay</h4>
              <p className="text-zinc-500 mt-0.5 text-[11px]">256-bit encrypted UPI & Cards</p>
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
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md">
                C
              </div>
              <span className="font-black text-2xl tracking-tight text-zinc-900">
                Criation<span className="text-indigo-600">.</span>
              </span>
            </Link>
            <p className="text-zinc-500 leading-relaxed max-w-sm">
              Empowering traditional craftswomen across India with fair wages, modern dropshipping logistics, and a global digital storefront for exquisite handcrafted treasures.
            </p>

            {/* Newsletter Input */}
            <form onSubmit={handleSubscribe} className="pt-2">
              <p className="text-zinc-800 font-semibold mb-2">Get 10% OFF your first order:</p>
              <div className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-xs"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors flex items-center gap-1 shrink-0 text-xs shadow-sm"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h5 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Collections</h5>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-zinc-500 hover:text-indigo-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/deals" className="text-rose-600 font-semibold hover:underline transition-colors">
                  🔥 Flash Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Platforms & Business */}
          <div className="space-y-3">
            <h5 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Portals & Dropship</h5>
            <ul className="space-y-2 text-zinc-500">
              <li>
                <Link href="/subscription" className="text-amber-700 font-bold hover:text-amber-600 transition-colors flex items-center gap-1">
                  👑 VIP Prime Membership
                </Link>
              </li>
              <li>
                <Link href="/dropship" className="hover:text-indigo-600 transition-colors">
                  Dropship Hub & Research
                </Link>
              </li>
              <li>
                <Link href="/seller" className="hover:text-indigo-600 transition-colors">
                  Seller / Merchant Portal
                </Link>
              </li>
              <li>
                <Link href="/supplier" className="hover:text-indigo-600 transition-colors">
                  Wholesale Supplier Hub
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">
                  Admin Operations Center
                </Link>
              </li>
              <li>
                <Link href="/ai-tools" className="hover:text-purple-600 transition-colors text-purple-600 font-medium">
                  AI E-Commerce Suite
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="hover:text-indigo-600 transition-colors">
                  Affiliate Program (Earn 10%)
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Account */}
          <div className="space-y-3">
            <h5 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">Account & Policies</h5>
            <ul className="space-y-2 text-zinc-500">
              <li>
                <Link href="/auth/login" className="hover:text-indigo-600 font-medium transition-colors">
                  Sign In to Account
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-indigo-600 font-medium transition-colors text-indigo-600">
                  Register (Claim ₹100)
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-indigo-600 transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-indigo-600 transition-colors">
                  24/7 Customer Support
                </Link>
              </li>
              <li>
                <Link href="/legal/shipping-policy" className="hover:text-indigo-600 transition-colors">
                  Shipping & Delivery SLA
                </Link>
              </li>
              <li>
                <Link href="/legal/refund-policy" className="hover:text-indigo-600 transition-colors">
                  7-Day Return Guarantee
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy" className="hover:text-indigo-600 transition-colors">
                  Privacy & Data Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright and Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400 text-[11px]">
        <p className="flex items-center gap-1">
          © {new Date().getFullYear()} Criation Handmade & Dropshipping Platform. Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Indian Artisans.
        </p>
        <div className="flex items-center gap-3 font-semibold text-zinc-600">
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px]">UPI / QR</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px]">VISA</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px]">MasterCard</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px]">RuPay</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px]">NetBanking</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-[10px]">COD</span>
        </div>
      </div>
    </footer>
  );
}
