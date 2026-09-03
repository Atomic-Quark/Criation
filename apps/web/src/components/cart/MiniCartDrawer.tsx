"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Bookmark,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle,
  Truck,
} from "lucide-react";

export function MiniCartDrawer() {
  const {
    cart,
    isMiniCartOpen,
    setIsMiniCartOpen,
    updateCartQuantity,
    removeFromCart,
    saveForLater,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
  } = useStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Close on Escape key
  React.useEffect(() => {
    if (!isMiniCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMiniCartOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMiniCartOpen, setIsMiniCartOpen]);

  if (!isMiniCartOpen) return null;

  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponCode("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag Drawer"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsMiniCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf7f2] dark:bg-[#161311] shadow-2xl flex flex-col border-l border-[#e8e0d4] dark:border-[#352f29] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#e8e0d4] dark:border-[#352f29] flex items-center justify-between bg-white dark:bg-[#1c1916]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#fdf2ef] dark:bg-[#281b17] text-[#c25e3f] dark:text-[#d97757]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-[#241f1c] dark:text-[#f4ece1] text-lg flex items-center gap-2">
                  Shopping Bag
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f0eae0] dark:bg-[#26211d] text-[#756c63] dark:text-[#a59b90]">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} items
                  </span>
                </h2>
              </div>
            </div>

            <button
              onClick={() => setIsMiniCartOpen(false)}
              className="p-2 rounded-xl text-[#8a8075] hover:text-[#241f1c] dark:hover:text-[#f4ece1] hover:bg-[#f0eae0] dark:hover:bg-[#231f1b] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          {cart.length > 0 && (
            <div className="p-4 bg-[#f0f4f1] dark:bg-[#18231b] border-b border-[#d8e4db] dark:border-[#2b3c2f]">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-[#241f1c] dark:text-[#f4ece1]">
                  <Truck className="w-4 h-4 text-[#56745f] dark:text-[#779b81]" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="font-bold text-[#56745f] dark:text-[#779b81] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> FREE Express Shipping Unlocked!
                    </span>
                  ) : (
                    <>Add <span className="font-bold text-[#c25e3f] dark:text-[#d97757]">{formatPrice(remainingForFreeShipping)}</span> more for FREE Delivery</>
                  )}
                </span>
                <span className="text-[#56745f] dark:text-[#779b81] font-bold">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[#e2ede4] dark:bg-[#223126] rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 rounded-full bg-[#56745f] dark:bg-[#779b81]"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-3xl bg-white dark:bg-[#1c1916] border border-[#e8e0d4] dark:border-[#352f29] flex items-center justify-center mx-auto mb-4 text-[#8a8075]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#241f1c] dark:text-[#f4ece1]">Your bag is empty</h3>
                <p className="text-xs text-[#756c63] dark:text-[#a59b90] mt-1 max-w-[240px] mx-auto leading-relaxed">
                  Explore our handcrafted artisan jewelry, festive diyas, and trending dropship gadgets.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsMiniCartOpen(false)}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c25e3f] hover:bg-[#a84d31] text-white text-xs font-semibold shadow-md shadow-[#c25e3f]/20 transition-all"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#1c1916] border border-[#e8e0d4] dark:border-[#352f29] shadow-2xs hover:border-[#c25e3f]/40 dark:hover:border-[#d97757]/40 transition-colors"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#faf7f2] dark:bg-[#24201c] shrink-0 border border-[#e8e0d4] dark:border-[#352f29]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.productId}`}
                          onClick={() => setIsMiniCartOpen(false)}
                          className="text-xs font-semibold text-[#241f1c] dark:text-[#f4ece1] hover:text-[#c25e3f] dark:hover:text-[#d97757] line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8a8075] hover:text-[#b75258] p-1 transition-colors shrink-0 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variantName && (
                        <p className="text-[11px] text-[#756c63] dark:text-[#a59b90] mt-0.5">
                          Variant: {item.variantName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <span className="font-serif text-sm font-bold text-[#241f1c] dark:text-[#f4ece1]">
                        {formatPrice(item.price)}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center rounded-xl border border-[#e8e0d4] dark:border-[#352f29] bg-[#faf7f2] dark:bg-[#24201c]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-[#756c63] hover:text-[#241f1c] dark:hover:text-[#f4ece1] transition-colors cursor-pointer"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#241f1c] dark:text-[#f4ece1] min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-[#756c63] hover:text-[#241f1c] dark:hover:text-[#f4ece1] transition-colors cursor-pointer"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white dark:bg-[#1c1916] border-t border-[#e8e0d4] dark:border-[#352f29] space-y-3.5">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f0f4f1] dark:bg-[#18231b] border border-[#d8e4db] dark:border-[#2b3c2f] text-xs">
                  <div className="flex items-center gap-1.5 text-[#56745f] dark:text-[#779b81] font-semibold">
                    <Tag className="w-4 h-4" />
                    <span>
                      {appliedCoupon.code} applied (-{appliedCoupon.discountValue}
                      {appliedCoupon.discountType === "percentage" ? "%" : "₹"})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#b75258] font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponMsg(null);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#faf7f2] dark:bg-[#24201c] border border-[#e8e0d4] dark:border-[#352f29] text-[#241f1c] dark:text-[#f4ece1] placeholder:text-[#9c9184] uppercase tracking-wider focus:outline-hidden focus:border-[#c25e3f]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#241f1c] dark:bg-[#f4ece1] text-[#faf7f2] dark:text-[#141210] text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMsg && (
                <p className={`text-[11px] ${couponMsg.error ? "text-[#b75258]" : "text-[#56745f]"}`}>
                  {couponMsg.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#756c63] dark:text-[#a59b90] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#241f1c] dark:text-[#f4ece1]">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#56745f] dark:text-[#779b81] font-medium">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-[#241f1c] dark:text-[#f4ece1]">
                    {cartShippingFee === 0 ? (
                      <span className="text-[#56745f] dark:text-[#779b81] font-bold">FREE</span>
                    ) : (
                      formatPrice(cartShippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span className="font-semibold text-[#241f1c] dark:text-[#f4ece1]">
                    {formatPrice(cartTax)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#241f1c] dark:text-[#f4ece1] pt-2 border-t border-[#e8e0d4] dark:border-[#352f29]">
                  <span>Estimated Total</span>
                  <span className="font-serif text-base text-[#c25e3f] dark:text-[#d97757]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsMiniCartOpen(false)}
                  className="w-full py-3 rounded-2xl border border-[#e8e0d4] dark:border-[#352f29] text-center text-xs font-semibold text-[#241f1c] dark:text-[#f4ece1] hover:bg-[#faf7f2] dark:hover:bg-[#231f1b] transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsMiniCartOpen(false)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#c25e3f] via-[#b85336] to-[#a84d31] hover:from-[#b85336] hover:to-[#9e3f26] text-white text-center text-xs font-semibold shadow-md shadow-[#c25e3f]/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Checkout Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
