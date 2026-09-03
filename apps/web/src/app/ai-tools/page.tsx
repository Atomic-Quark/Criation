"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Sparkles,
  FileText,
  Megaphone,
  TrendingUp,
  Search,
  Copy,
  Check,
  Zap,
} from "lucide-react";

export default function AIToolsPage() {
  const { showToast } = useStore();
  const [activeTab, setActiveTab] = useState<"desc" | "ads" | "pricing">("desc");

  // Description Generator State
  const [productTitle, setProductTitle] = useState("Handmade Sunflower Joy Crochet Keychain");
  const [keywords, setKeywords] = useState("pure wool, sunflower, cute gift, sturdy brass ring");
  const [generatedDesc, setGeneratedDesc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Ad Copy State
  const [adProduct, setAdProduct] = useState("Royal Empress Pearl Beaded Flower Vase");
  const [adDiscount, setAdDiscount] = useState("50% OFF Festive Sale");
  const [generatedAd, setGeneratedAd] = useState("");
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);

  const handleGenerateDesc = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedDesc(
        `✨ **${productTitle}**\n\n` +
        `Bring sunshine and authentic artisanal charm into your everyday life with our handcrafted ${productTitle}. Lovingly double-knit with 100% hypoallergenic soft wool by rural master craftswomen, each petal is intricately shaped to deliver timeless durability and joyful aesthetics.\n\n` +
        `🌟 **Key Highlights:**\n` +
        `• 100% Hand-knitted with organic soft wool yarn\n` +
        `• Heavy-duty rust-proof antique alloy ring & clip\n` +
        `• Perfect heartfelt gift for keys, backpacks, and handbags\n` +
        `• Supports fair-wage rural women artisan cooperatives\n\n` +
        `🔍 **SEO Meta Description:** Buy authentic handcrafted ${productTitle} online at Criation. Premium handmade wool charm with express delivery.`
      );
      setIsGenerating(false);
      showToast("AI Description Generated ✨", "Copy to clipboard or paste in seller portal.", "success");
    }, 900);
  };

  const handleGenerateAd = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAd(true);
    setTimeout(() => {
      setGeneratedAd(
        `🔥 STOP SCROLLING! You won't believe this is 100% Handcrafted! 😱✨\n\n` +
        `Elevate your home aesthetic with the majestic **${adProduct}**. Hand-encrusted with hundreds of shimmering pearls and crystal studs. Ideal for pooja altars & luxury centerpieces.\n\n` +
        `⚡ **LIMITED FESTIVE OFFER: ${adDiscount}**\n` +
        `🚚 FREE Express Shipping across India\n` +
        `🎁 Luxury Velvet Gift Box Included\n\n` +
        `👉 Tap 'Shop Now' before stock runs out: criation.com/shop\n` +
        `#HandcraftedDecor #ArtisanCrafts #HomeAesthetic #FestiveGift`
      );
      setIsGeneratingAd(false);
      showToast("Viral Ad Copy Ready 🚀", "Ready for Instagram, Facebook & TikTok campaigns.", "success");
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      showToast("Copied to Clipboard!", "Content copied.", "info");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-white dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 border border-purple-200/80 dark:border-purple-900/40 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800/60">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" /> AI E-Commerce Automation Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
          AI Power Tools for Artisans & Dropshippers
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
          Instantly generate high-converting SEO product copy, viral social ad hooks, and intelligent pricing benchmarks with specialized e-commerce AI models.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {[
          { id: "desc", label: "AI Product & SEO Generator", icon: FileText },
          { id: "ads", label: "AI Social Ad Copy Hook", icon: Megaphone },
          { id: "pricing", label: "AI Pricing Benchmark Analyzer", icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tool 1: Description Generator */}
      {activeTab === "desc" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Input Craft Details</h3>
            <form onSubmit={handleGenerateDesc} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Key Features / Stitches / Material</label>
                <textarea
                  rows={3}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> {isGenerating ? "Analyzing & Writing Copy..." : "Generate AI Description →"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">AI Generated Content</h3>
              {generatedDesc && (
                <button
                  onClick={() => copyToClipboard(generatedDesc)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold flex items-center gap-1.5"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            {generatedDesc ? (
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs leading-relaxed whitespace-pre-line text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                {generatedDesc}
              </div>
            ) : (
              <div className="py-16 text-center text-zinc-400 text-xs">
                Click generate to produce full marketing description, bullets, and SEO meta tags.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 2: Social Ad Copy Generator */}
      {activeTab === "ads" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Campaign Details</h3>
            <form onSubmit={handleGenerateAd} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1">Product to Advertise</label>
                <input
                  type="text"
                  required
                  value={adProduct}
                  onChange={(e) => setAdProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Special Offer / Angle</label>
                <input
                  type="text"
                  value={adDiscount}
                  onChange={(e) => setAdDiscount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingAd}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Megaphone className="w-4 h-4" /> {isGeneratingAd ? "Writing Ad Hooks..." : "Generate Viral Ad Copy →"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Instagram & TikTok Copy</h3>
              {generatedAd && (
                <button
                  onClick={() => copyToClipboard(generatedAd)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              )}
            </div>

            {generatedAd ? (
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs leading-relaxed whitespace-pre-line text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                {generatedAd}
              </div>
            ) : (
              <div className="py-16 text-center text-zinc-400 text-xs">
                Generate high-converting ad copy with attention hooks and call to actions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 3: Pricing Optimizer */}
      {activeTab === "pricing" && (
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 animate-in fade-in">
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
            Market Benchmark & Margin Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2">
              <span className="text-xs font-bold text-zinc-500 uppercase">Competitive / Volume</span>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">₹399</p>
              <p className="text-zinc-500">Target 40% margin for rapid market penetration and viral sales velocity.</p>
            </div>
            <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-500 space-y-2">
              <span className="text-xs font-bold text-indigo-600 uppercase">Balanced Optimum (Recommended)</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">₹649</p>
              <p className="text-zinc-600 dark:text-zinc-300">Optimal profit vs conversion balance with 65% gross margin.</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2">
              <span className="text-xs font-bold text-zinc-500 uppercase">Premium Artisan Luxury</span>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">₹899</p>
              <p className="text-zinc-500">Premium gift packaging positioning for boutique buyers and international orders.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
