"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Truck,
  Heart,
  TrendingUp,
  ArrowRight,
  HelpCircle,
  Award,
  DownloadCloud,
  ChevronDown,
  CreditCard,
  QrCode,
  Wallet,
  Building2,
  Lock,
  X,
  CheckCircle2,
  Smartphone,
  Info,
} from "lucide-react";
import { downloadTaxInvoice } from "@/lib/invoice/generateInvoice";

// Smooth Counting Price Animation Component
function AnimatedPrice({ value, currency = "₹" }: { value: number; currency?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    prevValueRef.current = value;

    if (startValue === endValue) return;

    const duration = 450; // ms
    const startTime = performance.now();
    let animFrameId: number;

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out exponential curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + (endValue - startValue) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        animFrameId = requestAnimationFrame(updateCounter);
      }
    };

    animFrameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animFrameId);
  }, [value]);

  return (
    <span className="inline-flex items-baseline font-mono tracking-tight font-black transition-all duration-300">
      <span>{currency}</span>
      <span>{displayValue.toLocaleString("en-IN")}</span>
    </span>
  );
}

export default function SubscriptionPage() {
  const { user, updateProfile, formatPrice, showToast, addWalletMoney } = useStore();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Payment Gateway Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "wallet" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("mrdiv@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("789");
  const [cardName, setCardName] = useState(user.name || "Divyanshu Sharma");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [txnId, setTxnId] = useState("");

  const plans = [
    {
      id: "prime_artisan",
      name: "Artisan Prime",
      tagline: "For conscious shoppers & craft collectors",
      badge: "Artisan Supporter",
      color: "border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90",
      highlight: false,
      priceMonthly: 199,
      priceAnnual: 1999,
      savings: "Save ₹389/yr",
      features: [
        "100% Free Express Delivery across India",
        "5% Instant Cashback in Criation Wallet",
        "24-Hour Early Access to Festive Drops",
        "Quarterly Surprise Handmade Gift Box",
        "Direct Artisan Messaging & Custom Requests",
        "Priority Customer Support Hotline",
      ],
      ctaText: "Join Artisan Prime",
      tierName: "Gold",
    },
    {
      id: "pro_dropship",
      name: "Pro Dropship OS",
      tagline: "For scaling dropshippers & digital merchants",
      badge: "Most Popular 🔥",
      color: "border-indigo-500 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/40 dark:via-zinc-900 dark:to-zinc-900 ring-2 ring-indigo-500",
      highlight: true,
      priceMonthly: 1499,
      priceAnnual: 14999,
      savings: "Save ₹2,989/yr",
      features: [
        "Unlimited 1-Click AliExpress & CSV Product Importer",
        "0% Platform Transaction Fees (Save 2% per sale)",
        "Automated BlueDart & Delhivery AWB Fulfillment Queue",
        "Full AI Copywriting, SEO & Ad Hook Generator Suite",
        "15% Below-Wholesale Factory Supplier Pricing",
        "Real-Time Unit Economics & ROAS Profit Calculator",
        "Dedicated Telegram Dropship Alpha Community Access",
      ],
      ctaText: "Scale with Pro Dropship",
      tierName: "Diamond",
    },
    {
      id: "guild_enterprise",
      name: "Guild Enterprise",
      tagline: "For craft cooperatives & wholesale distributors",
      badge: "Enterprise Tier",
      color: "border-amber-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90",
      highlight: false,
      priceMonthly: 4999,
      priceAnnual: 49999,
      savings: "Save ₹9,989/yr",
      features: [
        "Everything in Pro Dropship OS",
        "Dedicated Guild Account Manager & Logistics Desk",
        "Instant T+0 Same-Day Bank Payout Settlements",
        "Custom White-Label Branded Invoices & Packaging",
        "Direct REST API & Webhook Catalog Sync",
        "Bulk Sourcing RFQ Guarantee (Quotes within 2 hours)",
        "Custom Contract SLA & 99.99% Guaranteed Dispatch",
      ],
      ctaText: "Activate Guild Enterprise",
      tierName: "Platinum",
    },
  ];

  const handleOpenPaymentModal = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setPaymentSuccess(false);
    setIsPaymentModalOpen(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setIsProcessing(true);

    setTimeout(() => {
      const generatedTxn = `TXN_CR_${Math.floor(100000 + Math.random() * 900000)}`;
      setTxnId(generatedTxn);
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Update user state
      updateProfile({ tier: selectedPlan.tierName as any });
      addWalletMoney(200); // give VIP cash reward

      showToast(
        "🎉 Payment Successful!",
        `You are now enrolled in ${selectedPlan.name}. VIP perks unlocked!`,
        "success"
      );
    }, 1500);
  };

  const faqs = [
    {
      q: "Can I switch between plans or cancel at any time?",
      a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time with 1-click from your Account Settings. If you cancel, your VIP benefits remain active until the end of your billing period.",
    },
    {
      q: "How does the 5% Artisan Cashback work?",
      a: "Whenever you order any handcrafted product (diyas, keychains, vases, poshaks), 5% of the total order value is instantly credited back to your Criation Wallet upon delivery. You can use wallet credits on future orders with zero expiry.",
    },
    {
      q: "What is included in the 1-Click Dropship Importer?",
      a: "The Dropship Importer allows you to paste any product URL or CSV catalog to instantly import photos, auto-calculate 65%+ profit margins, and push directly to your storefront with automated factory fulfillment.",
    },
    {
      q: "What payment methods are supported for subscriptions?",
      a: "We support UPI AutoPay (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Criation Digital Wallet balances.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 sm:space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 text-xs font-black shadow-2xs">
          <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Criation VIP & Dropship Growth Plans</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-tight">
          Supercharge Your Craft Experience & Dropship Margins
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
          Whether you are a lover of authentic Indian artisan creations or an ambitious e-commerce merchant building a 7-figure dropshipping empire, we have the perfect plan for you.
        </p>

        {/* Monthly / Annual Toggle with Smooth Active Pill */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="p-1.5 rounded-2xl bg-zinc-100/90 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 flex items-center shadow-inner relative">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-md shadow-zinc-950/5 scale-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                billingCycle === "annual"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-black animate-pulse">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isCurrentPlan =
            (plan.id === "prime_artisan" && user.tier === "Gold") ||
            (plan.id === "pro_dropship" && user.tier === "Diamond VIP") ||
            (plan.id === "guild_enterprise" && user.tier === "Diamond VIP");

          return (
            <div
              key={plan.id}
              className={`p-6 sm:p-8 rounded-3xl border ${plan.color} shadow-lg flex flex-col justify-between relative transition-all hover:translate-y-[-2px]`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-zinc-950 dark:text-white">{plan.name}</h3>
                    {!plan.highlight && (
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{plan.tagline}</p>
                </div>

                {/* Price Display with Smooth Number Roll Animation */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5 min-h-[72px] flex flex-col justify-center">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-zinc-950 dark:text-white font-mono tracking-tight transition-transform duration-300">
                      <AnimatedPrice value={billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly} />
                    </span>
                    <span
                      key={billingCycle}
                      className="text-xs text-zinc-400 dark:text-zinc-500 font-bold animate-in fade-in slide-in-from-bottom-1 duration-300"
                    >
                      /{billingCycle === "annual" ? "year" : "month"}
                    </span>
                  </div>
                  {billingCycle === "annual" ? (
                    <div className="flex items-center gap-2 animate-in zoom-in-95 fade-in duration-300">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black tracking-wide">
                        {plan.savings}
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 line-through font-mono">
                        ₹{(plan.priceMonthly * 12).toLocaleString("en-IN")}/yr
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 animate-in fade-in duration-300">
                      Billed monthly · Cancel anytime
                    </p>
                  )}
                </div>

                {/* Feature Bullet List */}
                <div className="space-y-3 pt-2">
                  <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Included Benefits:
                  </p>
                  <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-2 cursor-default"
                  >
                    <Check className="w-4 h-4" /> Current Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenPaymentModal(plan)}
                    className={`w-full py-3.5 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                      plan.highlight
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02]"
                        : "bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 shadow-zinc-900/20"
                    }`}
                  >
                    {plan.ctaText} <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center mt-2">
                  Instant activation · Cancel anytime
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 border border-indigo-100 dark:border-zinc-700 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-black text-lg text-zinc-950 dark:text-white">30-Day Money-Back Guarantee</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Not 100% satisfied with your VIP perks or dropship order velocity? Request a full refund within 30 days, no questions asked.
            </p>
          </div>
        </div>
        <Link
          href="/support"
          className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shrink-0 shadow-xs"
        >
          Talk to VIP Concierge
        </Link>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-zinc-950 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Everything you need to know about Criation memberships</p>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-2 cursor-pointer transition-all"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{faq.q}</h4>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                    openFaq === i ? "rotate-180 text-indigo-600" : ""
                  }`}
                />
              </div>
              {openFaq === i && (
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dedicated Payment Gateway Modal */}
      {isPaymentModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Criation Secure Checkout</h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">256-Bit SSL Encrypted Payment Area</p>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {paymentSuccess ? (
              /* Success Confirmation Screen */
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs border border-emerald-200 dark:border-emerald-800 animate-in zoom-in">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-zinc-950 dark:text-white">Payment Successful!</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Your subscription to <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedPlan.name}</span> is now active.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-left text-xs space-y-2">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Transaction Reference</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{txnId}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Amount Paid</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(billingCycle === "annual" ? selectedPlan.priceAnnual : selectedPlan.priceMonthly)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Billing Cycle</span>
                    <span className="capitalize font-semibold text-zinc-800 dark:text-zinc-200">{billingCycle}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Bonus Wallet Cashback</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹200 Credited</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href="/account"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs text-center transition-colors shadow-xs"
                  >
                    Go to My Account & Wallet
                  </Link>
                  <button
                    onClick={() => {
                      const amount = billingCycle === "annual" ? selectedPlan.priceAnnual : selectedPlan.priceMonthly;
                      const taxable = Math.round((amount / 1.18) * 100) / 100;
                      const tax = Math.round((amount - taxable) * 100) / 100;

                      downloadTaxInvoice({
                        invoiceNumber: `INV-CR-${Date.now().toString().slice(-6)}`,
                        invoiceDate: new Date().toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }),
                        transactionReference: txnId || `TXN_CR_${Math.floor(100000 + Math.random() * 900000)}`,
                        paymentMethod: paymentMethod || "UPI",
                        customer: {
                          name: user.name || "Divyanshu Sharma",
                          email: user.email,
                          phone: user.phone,
                          address: "Flat 402, Royal Palms Residency, Sector 18, Gurugram, Haryana - 122002",
                        },
                        items: [
                          {
                            name: `Criation ${selectedPlan.name} VIP Membership`,
                            description: `${billingCycle.toUpperCase()} Subscription · 100% Free Express Delivery & Dropship Tools`,
                            hsnSac: "998313",
                            quantity: 1,
                            rate: taxable,
                            taxableAmount: taxable,
                            cgst: Math.round(tax / 2),
                            sgst: Math.round(tax / 2),
                            total: amount,
                          },
                        ],
                        subtotal: taxable,
                        tax: tax,
                        discount: billingCycle === "annual" ? Math.round(selectedPlan.priceMonthly * 12 - selectedPlan.priceAnnual) : undefined,
                        totalAmount: amount,
                        type: "subscription",
                      });
                      showToast("Tax Invoice Downloaded 📄", "Saved as PDF/HTML tax receipt.", "success");
                    }}
                    className="px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <DownloadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Download Tax Invoice
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Area Form */
              <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
                {/* Plan Summary Card */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Selected Membership</span>
                    <h4 className="font-bold text-sm text-zinc-950 dark:text-white">{selectedPlan.name} ({billingCycle})</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-zinc-950 dark:text-white font-mono">
                      {formatPrice(billingCycle === "annual" ? selectedPlan.priceAnnual : selectedPlan.priceMonthly)}
                    </span>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Includes 18% GST</p>
                  </div>
                </div>

                {/* Payment Methods Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">Select Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "upi", label: "UPI / QR", icon: QrCode },
                      { id: "card", label: "Card", icon: CreditCard },
                      { id: "wallet", label: "Wallet", icon: Wallet },
                      { id: "netbanking", label: "NetBank", icon: Building2 },
                    ].map((tab) => (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => setPaymentMethod(tab.id as any)}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          paymentMethod === tab.id
                            ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs"
                            : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span className="text-[10px]">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Method 1: UPI & QR Code */}
                {paymentMethod === "upi" && (
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                        <QrCode className="w-16 h-16 text-zinc-900 dark:text-zinc-100" />
                      </div>
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-[10px]">
                          Scan & Pay with Any UPI App
                        </span>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Google Pay · PhonePe · Paytm · BHIM · CRED</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60">
                      <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Or Enter Virtual Payment Address (VPA)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Method 2: Credit / Debit Card */}
                {paymentMethod === "card" && (
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3 animate-in fade-in text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Method 3: Criation Wallet */}
                {paymentMethod === "wallet" && (
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2.5 animate-in fade-in text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">Available Wallet Balance</span>
                      <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">{formatPrice(user.walletBalance)}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      You have {formatPrice(user.walletBalance)} in digital credits. You can apply wallet funds toward this invoice.
                    </p>
                  </div>
                )}

                {/* Method 4: NetBanking */}
                {paymentMethod === "netbanking" && (
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2 animate-in fade-in text-xs">
                    <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 block">Select Primary Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* Submit Payment CTA */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-black text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authorizing Payment via Gateway...
                    </>
                  ) : (
                    <>
                      Pay {formatPrice(billingCycle === "annual" ? selectedPlan.priceAnnual : selectedPlan.priceMonthly)} Securely <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>RBI Compliant · 256-Bit SSL Encrypted Payment Area</span>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
