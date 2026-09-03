"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, FileText, ArrowLeft } from "lucide-react";

export default function LegalPage() {
  const params = useParams();
  const rawSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const legalContent: Record<string, { title: string; subtitle: string; content: string[] }> = {
    "privacy-policy": {
      title: "Privacy & Data Protection Policy",
      subtitle: "Last updated: August 2026",
      content: [
        "At Criation, we are committed to safeguarding your personal data and upholding absolute transparency in our data processing practices.",
        "1. Information Collection: We collect essential contact information (name, delivery address, phone number, email) solely for processing orders, courier dispatch, and live shipment SMS tracking.",
        "2. Payment Security: All online transactions (UPI, Credit/Debit cards, NetBanking) are processed through 256-bit SSL encrypted, PCI-DSS Level 1 compliant payment gateways. Criation does not store raw credit card numbers or CVV codes.",
        "3. Cookies & Analytics: We use first-party performance cookies to remember cart contents, currency preferences, and improve storefront speed.",
        "4. Your Rights: You have the right to request access to or deletion of your personal data at any time by contacting privacy@criation.com.",
      ],
    },
    "terms-of-service": {
      title: "Terms & Conditions of Service",
      subtitle: "Last updated: August 2026",
      content: [
        "Welcome to Criation. By accessing our platform, placing orders, or registering as a merchant, you agree to the following terms.",
        "1. Authentic Handcrafted Variations: Our artisan products are 100% handcrafted by rural master weavers and craftswomen. Minor variations in stitch density, bead placement, or natural clay hues celebrate authentic handmade uniqueness.",
        "2. Pricing & Currency: All product prices are displayed in Indian Rupees (INR) or your chosen converted currency. Prices include applicable GST.",
        "3. Account Responsibility: Users are responsible for maintaining the confidentiality of their login credentials and wallet PIN.",
        "4. Intellectual Property: Photography and descriptions of artisan crafts on this platform are owned by Criation Cooperative and cannot be reproduced without written authorization.",
      ],
    },
    "refund-policy": {
      title: "Doorstep Return & Refund Policy",
      subtitle: "7-Day Hassle-Free Guarantees",
      content: [
        "We want you to love your handmade treasures and dropship items. If you are not completely satisfied, our return process is fast and transparent.",
        "1. 7-Day Window: You can initiate a return within 7 calendar days of delivery directly from your Orders page.",
        "2. Damaged in Transit: If a fragile ceramic vase or crystal diya arrives cracked or defective, take a photo and click 'Request Return' for an immediate free replacement dispatch.",
        "3. Instant Refunds: Refunds are credited immediately to your Criation Wallet or returned to your original payment method within 3-5 business days.",
        "4. Doorstep Reverse Pickup: BlueDart / Delhivery couriers will collect the return package directly from your address at no cost to you.",
      ],
    },
    "shipping-policy": {
      title: "Shipping & Courier Fulfillment Policy",
      subtitle: "Pan-India & Global Air Cargo",
      content: [
        "Criation partners with India's premier logistics carriers (BlueDart Express, Delhivery, Shadowfax) to ensure safe and prompt transit.",
        "1. Processing SLA: Handcrafted stock orders are inspected, packed, and dispatched within 24 hours. Custom made-to-order crafts require 48 hours for final weave inspection.",
        "2. Free Standard Delivery: All orders above ₹499 qualify for FREE standard shipping (3-4 business days).",
        "3. Express Priority Air: Available at checkout for ₹49 flat fee with 2-day delivery across metro hubs.",
        "4. Real-time Live Tracking: Receive instant SMS and WhatsApp notifications with AWB number and live GPS checkpoints upon courier dispatch.",
      ],
    },
    "dropshipping-policy": {
      title: "Dropshipping Merchant Policy & SLA",
      subtitle: "Guidelines for B2B Retail Partners",
      content: [
        "Criation operates an integrated dropshipping network connecting verified artisan guilds and vetted global suppliers with e-commerce entrepreneurs.",
        "1. Automated Fulfillment: Orders submitted via the 1-Click Importer or Dropship API are automatically routed to suppliers for priority packaging.",
        "2. Blind Packaging: Packages are shipped under your store's brand name with zero manufacturer marketing materials inside.",
        "3. Quality Inspection: All items undergo multi-point quality checks before handover to regional courier hubs.",
        "4. Dispute Resolution: Dedicated 24/7 dropship support ensures replacement dispatch in the event of courier damage.",
      ],
    },
  };

  const currentPolicy = legalContent[rawSlug as string] || legalContent["privacy-policy"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          {currentPolicy.title}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">{currentPolicy.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
        {currentPolicy.content.map((paragraph, idx) => (
          <p key={idx} className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Quick Navigation Links */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-zinc-500">Related Legal Documents:</span>
        <Link href="/legal/privacy-policy" className="text-indigo-600 hover:underline font-medium">Privacy Policy</Link>
        <span>·</span>
        <Link href="/legal/terms-of-service" className="text-indigo-600 hover:underline font-medium">Terms of Service</Link>
        <span>·</span>
        <Link href="/legal/refund-policy" className="text-indigo-600 hover:underline font-medium">Refund Policy</Link>
        <span>·</span>
        <Link href="/legal/shipping-policy" className="text-indigo-600 hover:underline font-medium">Shipping Policy</Link>
      </div>
    </div>
  );
}
