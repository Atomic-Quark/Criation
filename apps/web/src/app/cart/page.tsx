"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Bookmark,
  ArrowRight,
  Truck,
  CheckCircle,
  Tag,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    saveForLater,
    savedForLater,
    moveToCart,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
    products,
  } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponInput("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Your Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Review your items, apply promotional vouchers, and proceed to secure checkout.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Your bag is currently empty</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Explore handcrafted artisan treasures and trending products to fill your bag.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Meter */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-indigo-950 dark:text-indigo-200">
                  <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> FREE Express Courier Delivery Unlocked!
                    </span>
                  ) : (
                    <>Add <span className="font-bold text-indigo-700 dark:text-indigo-300">{formatPrice(remainingForFreeShipping)}</span> more for FREE Shipping</>
                  )}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-indigo-100 dark:bg-indigo-900/60 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    freeShippingProgress === 100 ? "bg-emerald-500" : "bg-indigo-600"
                  }`}
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden shadow-xs">
              {cart.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                    </div>

                    <div className="space-y-1">
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <p className="text-xs text-zinc-500">Option: {item.variantName}</p>
                      )}
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => saveForLater(item.id)}
                          className="text-[11px] font-semibold text-zinc-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
                        >
                          <Bookmark className="w-3.5 h-3.5" /> Save for Later
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-zinc-900 dark:text-zinc-100 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Saved for Later Section */}
            {savedForLater.length > 0 && (
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-indigo-500" /> Saved For Later ({savedForLater.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedForLater.map((s) => (
                    <div key={s.id} className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-200">
                          <Image src={s.image} alt={s.name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="text-xs">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[130px]">{s.name}</p>
                          <p className="text-indigo-600 font-bold">{formatPrice(s.price)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => moveToCart(s.id)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold shrink-0"
                      >
                        Move to Bag
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Order Summary Column */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-md space-y-5">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Order Summary</h3>

              {/* Coupon Engine */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-500" /> Have a Coupon or Voucher?
                </label>
                {appliedCoupon ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-200">{appliedCoupon.code}</span>
                      <span className="text-emerald-600 ml-1">(-{formatPrice(cartDiscount)})</span>
                    </div>
                    <button onClick={removeCoupon} className="text-xs text-rose-600 font-bold hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try CRIATION10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-900 dark:text-zinc-100 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p className={`text-[11px] ${couponMsg.error ? "text-rose-500" : "text-emerald-600"}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between">
                  <span>Bag Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatPrice(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {cartShippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(cartShippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-zinc-900 dark:text-zinc-100 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <span>Total Amount</span>
                  <span className="text-xl text-indigo-600 dark:text-indigo-400">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
