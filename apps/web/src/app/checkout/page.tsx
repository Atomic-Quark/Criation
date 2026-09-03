"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  Wallet,
  Banknote,
  Building2,
  Plus,
  MapPin,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Address, Order } from "@/types/store";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    user,
    addAddress,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTax,
    cartTotal,
    createOrder,
    formatPrice,
    showToast,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user.addresses.find((a) => a.isDefault)?.id || user.addresses[0]?.id || ""
  );
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("upi");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // New Address Form State
  const [newAddr, setNewAddr] = useState({
    fullName: user.name,
    phone: user.phone,
    line1: "",
    line2: "",
    landmark: "",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122002",
    country: "India",
    type: "home" as "home" | "work" | "other",
    isDefault: true,
  });

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Your bag is empty</h1>
        <p className="text-xs text-zinc-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-md"
        >
          Browse Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.line1.trim() || !newAddr.pincode.trim()) {
      showToast("Missing Address Fields", "Please complete required address details.", "warning");
      return;
    }
    addAddress(newAddr);
    setIsAddingNewAddress(false);
    showToast("Address Saved", "Delivery address selected.", "success");
  };

  const handlePlaceOrder = () => {
    const chosenAddress = user.addresses.find((a) => a.id === selectedAddressId) || user.addresses[0];
    if (!chosenAddress) {
      showToast("Select Address", "Please select or add a shipping address.", "warning");
      setStep(1);
      return;
    }

    if (paymentMethod === "wallet" && user.walletBalance < cartTotal) {
      showToast("Insufficient Wallet Balance", `Your balance is ${formatPrice(user.walletBalance)}. Please choose another payment method or top up.`, "error");
      return;
    }

    setIsProcessingOrder(true);

    setTimeout(() => {
      const orderItems = cart.map((c) => ({
        id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        productId: c.productId,
        variantId: c.variantId,
        name: c.name,
        image: c.image,
        price: c.price,
        quantity: c.quantity,
        variantName: c.variantName,
      }));

      const finalShipping = deliverySpeed === "express" ? cartShippingFee + 49 : cartShippingFee;
      const finalTotal = cartTotal + (deliverySpeed === "express" ? 49 : 0);

      const placedOrder = createOrder({
        items: orderItems,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shippingFee: finalShipping,
        tax: cartTax,
        total: finalTotal,
        shippingAddress: chosenAddress,
        paymentMethod,
      });

      setIsProcessingOrder(false);
      router.push(`/orders/${placedOrder.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header & Steps Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Secure Checkout
          </h1>
          <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1">
            <Lock className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL Encrypted Payment Portal
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setStep(1)}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              step >= 1 ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
            }`}
          >
            1. Address
          </button>
          <span className="text-zinc-400">→</span>
          <button
            onClick={() => setStep(2)}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              step >= 2 ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
            }`}
          >
            2. Shipping
          </button>
          <span className="text-zinc-400">→</span>
          <button
            onClick={() => setStep(3)}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              step === 3 ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
            }`}
          >
            3. Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Checkout Steps */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Shipping Address Selection */}
          {step === 1 && (
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500" /> Select Delivery Address
                </h2>
                <button
                  onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              </div>

              {/* Add New Address Form */}
              {isAddingNewAddress && (
                <form onSubmit={handleAddNewAddressSubmit} className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-4">
                  <h4 className="font-bold text-xs uppercase text-zinc-500">New Destination</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1 text-zinc-800 dark:text-zinc-200">Full Name</label>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1 text-zinc-800 dark:text-zinc-200">Phone Number</label>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold block mb-1 text-zinc-800 dark:text-zinc-200">Flat / Building / House No.</label>
                      <input
                        type="text"
                        required
                        autoComplete="street-address"
                        value={newAddr.line1}
                        onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1 text-zinc-800 dark:text-zinc-200">Area / Sector / Street</label>
                      <input
                        type="text"
                        autoComplete="address-line2"
                        value={newAddr.line2}
                        onChange={(e) => setNewAddr({ ...newAddr, line2: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1 text-zinc-800 dark:text-zinc-200">PIN Code</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1 text-zinc-800 dark:text-zinc-200">City</label>
                      <input
                        type="text"
                        required
                        autoComplete="address-level2"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1 text-zinc-800 dark:text-zinc-200">State</label>
                      <input
                        type="text"
                        required
                        autoComplete="address-level1"
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                    >
                      Save & Use
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      selectedAddressId === addr.id
                        ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">{addr.fullName}</span>
                        <span className="ml-2 px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-[10px] uppercase font-bold text-zinc-700 dark:text-zinc-300">
                          {addr.type}
                        </span>
                      </div>
                      {selectedAddressId === addr.id && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {addr.line1}, {addr.line2 && `${addr.line2}, `}
                      {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                    </p>

                    <p className="text-xs text-zinc-500 font-medium">📞 {addr.phone}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-500 flex items-center gap-2"
                >
                  Continue to Shipping <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Options */}
          {step === 2 && (
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 animate-in fade-in">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-500" /> Delivery Method & Speed
              </h2>

              <div className="space-y-3">
                <div
                  onClick={() => setDeliverySpeed("standard")}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    deliverySpeed === "standard"
                      ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Truck className="w-5 h-5 text-indigo-600" />
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">Standard Inspected Delivery</p>
                      <p className="text-zinc-500">Delivered within 3-4 business days via BlueDart / Delhivery</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">FREE</span>
                </div>

                <div
                  onClick={() => setDeliverySpeed("express")}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    deliverySpeed === "express"
                      ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <div className="text-xs">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">Priority Express 2-Day Air Cargo</p>
                      <p className="text-zinc-500">Priority packing + fastest air transit with live GPS SMS</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">+ ₹49</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100"
                >
                  ← Back to Address
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-500 flex items-center gap-2"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Selection */}
          {step === 3 && (
            <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 animate-in fade-in">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-500" /> Choose Payment Option
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    id: "upi",
                    title: "UPI (GPay / PhonePe / Paytm)",
                    desc: "Scan QR or enter UPI VPA ID",
                    icon: QrCode,
                    color: "text-emerald-500",
                  },
                  {
                    id: "card",
                    title: "Credit / Debit Card",
                    desc: "Visa, Mastercard, RuPay, Amex",
                    icon: CreditCard,
                    color: "text-indigo-500",
                  },
                  {
                    id: "wallet",
                    title: `Criation Wallet (${formatPrice(user.walletBalance)})`,
                    desc: "1-Click instant debit from wallet",
                    icon: Wallet,
                    color: "text-amber-500",
                  },
                  {
                    id: "cod",
                    title: "Cash on Delivery",
                    desc: "Pay at your doorstep on arrival",
                    icon: Banknote,
                    color: "text-purple-500",
                  },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      paymentMethod === p.id
                        ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="checkoutPaymentMethod"
                      value={p.id}
                      checked={paymentMethod === p.id}
                      onChange={() => setPaymentMethod(p.id as any)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <p.icon className={`w-5 h-5 ${p.color}`} />
                      {paymentMethod === p.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{p.title}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{p.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Payment Details Form */}
              {paymentMethod === "upi" && (
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xs">
                    <QrCode className="w-24 h-24 text-zinc-900 dark:text-white" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Pay securely with any UPI App (GPay, PhonePe, Paytm, BHIM) for <strong>{formatPrice(cartTotal)}</strong>
                  </p>
                  <p className="text-[10px] text-zinc-500">Automated instant payment intent will be triggered on place order.</p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2 text-center text-xs">
                  <div className="flex justify-center items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                    <ShieldCheck className="w-5 h-5" /> 256-Bit Encrypted Gateway
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                    You will be redirected to the secure Payment Aggregator checkout to complete 3D Secure 2.0 verification for <strong>{formatPrice(cartTotal)}</strong>.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100"
                >
                  ← Back to Shipping
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessingOrder}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-600/25 hover:opacity-95 transition-all flex items-center gap-2"
                >
                  {isProcessingOrder ? (
                    <span>Confirming Order...</span>
                  ) : (
                    <>Pay {formatPrice(cartTotal)} & Place Order →</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Box */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4 sticky top-24">
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Order Overview</h3>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-56 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[150px]">{item.name}</p>
                    <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-{formatPrice(cartDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {deliverySpeed === "express" ? "₹49 (Express)" : "FREE"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5% GST)</span>
              <span>{formatPrice(cartTax)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <span>Final Total</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {formatPrice(cartTotal + (deliverySpeed === "express" ? 49 : 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
