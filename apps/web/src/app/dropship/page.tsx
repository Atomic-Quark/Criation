"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import {
  TrendingUp,
  DownloadCloud,
  Calculator,
  Truck,
  Layers,
  BarChart3,
  Sparkles,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
  Search,
  DollarSign,
  Package,
  Zap,
} from "lucide-react";
import { ProductItem } from "@/types/store";

export default function DropshipHubPage() {
  const {
    products,
    addProduct,
    suppliers,
    sourcingRequests,
    addSourcingRequest,
    orders,
    updateOrderStatus,
    formatPrice,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    "research" | "importer" | "calculator" | "suppliers" | "fulfillment" | "analytics"
  >("research");

  // Importer Form State
  const [importUrl, setImportUrl] = useState("");
  const [importPlatform, setImportPlatform] = useState<"AliExpress" | "CJ Dropshipping" | "Alibaba" | "Custom CSV">("AliExpress");
  const [importedTitle, setImportedTitle] = useState("Wireless Smart RGB Sunset Ambient Lamp");
  const [importedCost, setImportedCost] = useState(250);
  const [importedPrice, setImportedPrice] = useState(799);
  const [importedCategory, setImportedCategory] = useState("cat_dropship_trending");
  const [isImporting, setIsImporting] = useState(false);

  // Profit Calculator State
  const [calcCost, setCalcCost] = useState<number>(300);
  const [calcPrice, setCalcPrice] = useState<number>(999);
  const [calcShipping, setCalcShipping] = useState<number>(50);
  const [calcAdSpend, setCalcAdSpend] = useState<number>(200);
  const [calcMonthlyUnits, setCalcMonthlyUnits] = useState<number>(150);

  // Sourcing Request Modal
  const [isSourcingModalOpen, setIsSourcingModalOpen] = useState(false);
  const [sourcingName, setSourcingName] = useState("");
  const [sourcingCat, setSourcingCat] = useState("Home Decor");
  const [sourcingTargetPrice, setSourcingTargetPrice] = useState(350);
  const [sourcingQty, setSourcingQty] = useState(100);
  const [sourcingNotes, setSourcingNotes] = useState("");

  // Profit Calculations
  const grossProfitPerUnit = calcPrice - calcCost - calcShipping;
  const platformFee = Math.round(calcPrice * 0.02); // 2% gateway fee
  const netProfitPerUnit = grossProfitPerUnit - calcAdSpend - platformFee;
  const netMarginPercent = calcPrice > 0 ? ((netProfitPerUnit / calcPrice) * 100).toFixed(1) : "0";
  const breakEvenROAS = (calcCost + calcShipping + platformFee) > 0 ? (calcPrice / (calcPrice - calcCost - calcShipping - platformFee)).toFixed(2) : "0";
  const projectedMonthlyProfit = netProfitPerUnit * calcMonthlyUnits;

  // Handle 1-Click Import Submit
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsImporting(true);

    setTimeout(() => {
      const newProduct: Omit<ProductItem, "id" | "createdAt"> = {
        slug: importedTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: importedTitle,
        tagline: "Imported via 1-Click Dropship Engine with automated fulfillment",
        description: `High-demand trending dropship winner imported from ${importPlatform}. Quality checked with 24-hour dispatch.`,
        price: importedPrice,
        compareAtPrice: Math.round(importedPrice * 1.6),
        currency: "INR",
        categoryId: importedCategory,
        categoryName: "Trending Tech & Winners",
        tags: ["dropship", "winner", "viral", "trending"],
        badge: "🔥 Imported Winner",
        images: [
          { url: "/products/craft-item-10.jpeg", alt: importedTitle, isCover: true },
          { url: "/products/craft-item-11.jpeg", alt: "Imported product secondary view" },
        ],
        variants: [
          { id: `var_${Date.now()}`, sku: `DS-${Math.floor(1000 + Math.random() * 9000)}`, name: "Standard Pack", price: importedPrice, stock: 100 },
        ],
        rating: 4.8,
        reviewCount: 45,
        specifications: {
          "Source Platform": importPlatform,
          "Fulfillment Turnaround": "24-48 Hours",
          "Warranty": "1 Year Replacement Guarantee",
        },
        isHandcrafted: false,
        isDropship: true,
        isWinningProduct: true,
        stock: 100,
        supplierCost: importedCost,
        profitMarginPercent: Number((((importedPrice - importedCost) / importedPrice) * 100).toFixed(1)),
      };

      addProduct(newProduct);
      setIsImporting(false);
      setImportUrl("");
      showToast("Product Imported & Live! 🚀", `"${newProduct.name}" pushed to public store with ${newProduct.profitMarginPercent}% margin.`, "success");
    }, 1000);
  };

  // Handle Sourcing Request Submit
  const handleSourcingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcingName.trim()) return;
    addSourcingRequest({
      productName: sourcingName,
      category: sourcingCat,
      targetPrice: sourcingTargetPrice,
      quantity: sourcingQty,
      notes: sourcingNotes,
    });
    setIsSourcingModalOpen(false);
    setSourcingName("");
    setSourcingNotes("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-white text-zinc-900 border border-indigo-100/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200">
            <TrendingUp className="w-4 h-4 text-indigo-600" /> Dropship Operating System v2.6
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900">
            Dropshipping Command Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl">
            Discover viral winning products, import with 1-click, calculate real net margins, and fulfill customer orders automatically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab("importer")}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all flex items-center gap-2"
          >
            <DownloadCloud className="w-4 h-4" /> 1-Click Importer
          </button>
          <button
            onClick={() => setIsSourcingModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-white text-zinc-800 font-bold text-xs border border-zinc-200 hover:bg-zinc-50 transition-all flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4 text-indigo-600" /> New Sourcing Quote
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar">
        {[
          { id: "research", label: "Winning Products", icon: Flame },
          { id: "importer", label: "1-Click Importer", icon: DownloadCloud },
          { id: "calculator", label: "Profit & Margin Calculator", icon: Calculator },
          { id: "suppliers", label: "Supplier Directory & Sourcing", icon: Truck },
          { id: "fulfillment", label: "Order Fulfillment Queue", icon: Package },
          { id: "analytics", label: "Dropship Analytics", icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
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

      {/* Tab 1: Product Research & Winning Products */}
      {activeTab === "research" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Trending Winning Products
              </h2>
              <p className="text-xs text-zinc-500">
                Filtered by high saturation potential, rapid sales velocity, and verified factory margins.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.isDropship || p.isWinningProduct)
              .map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={p.images[0]?.url || "/products/craft-item-10.jpeg"}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="350px"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase">
                      {p.profitMarginPercent || 65}% Margin
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">{p.name}</h3>
                    <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Cost</span>
                        <strong className="text-zinc-900 dark:text-zinc-100">{formatPrice(p.supplierCost || 200)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Retail</span>
                        <strong className="text-indigo-600 font-bold">{formatPrice(p.price)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Net Profit</span>
                        <strong className="text-emerald-600 font-bold">{formatPrice(p.price - (p.supplierCost || 200))}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <Link
                      href={`/products/${p.slug}`}
                      className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
                    >
                      Storefront View
                    </Link>
                    <button
                      onClick={() => {
                        setCalcCost(p.supplierCost || 250);
                        setCalcPrice(p.price);
                        setActiveTab("calculator");
                        showToast("Loaded in Calculator", `Adjust margins for ${p.name}`, "info");
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-center text-xs font-bold hover:bg-indigo-500"
                    >
                      Simulate Margin
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 2: 1-Click Product Importer */}
      {activeTab === "importer" && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-md space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <DownloadCloud className="w-5 h-5 text-indigo-500" /> 1-Click Product Importer
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Paste any URL from AliExpress, CJ Dropshipping, or Alibaba to automatically parse images, variants, wholesale pricing, and push to your live store.
            </p>
          </div>

          <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Source Platform</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["AliExpress", "CJ Dropshipping", "Alibaba", "Custom CSV"] as const).map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setImportPlatform(plat)}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                      importPlatform === plat
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Product URL or CSV Data</label>
              <input
                type="text"
                placeholder="https://aliexpress.com/item/10050098231.html"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="font-bold block mb-1">Extracted Title (Editable)</label>
                <input
                  type="text"
                  value={importedTitle}
                  onChange={(e) => setImportedTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Target Category</label>
                <select
                  value={importedCategory}
                  onChange={(e) => setImportedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700"
                >
                  <option value="cat_dropship_trending">Trending Tech & Winners</option>
                  <option value="cat_home_decor">Royal Vases & Decor</option>
                  <option value="cat_crochet_accessories">Crochet & Woolen Charms</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Wholesale Cost (₹)</label>
                <input
                  type="number"
                  value={importedCost}
                  onChange={(e) => setImportedCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 font-mono"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Retail Selling Price (₹)</label>
                <input
                  type="number"
                  value={importedPrice}
                  onChange={(e) => setImportedPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 font-mono"
                />
              </div>
            </div>

            {/* Profit Margin Preview Pill */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  Estimated Profit per Sale: {formatPrice(importedPrice - importedCost)}
                </span>
              </div>
              <span className="font-black text-emerald-600 text-sm">
                {importedPrice > 0 ? (((importedPrice - importedCost) / importedPrice) * 100).toFixed(1) : 0}% Margin
              </span>
            </div>

            <button
              type="submit"
              disabled={isImporting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {isImporting ? "Enriching with AI & Publishing..." : "1-Click Push to Storefront →"}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Interactive Profit & Margin Calculator */}
      {activeTab === "calculator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
          {/* Sliders Box */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-500" /> Live Unit Economics Simulator
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                Formula v2.4
              </span>
            </div>

            {/* Slider 1: Selling Price */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-zinc-700 dark:text-zinc-300">Retail Selling Price</label>
                <span className="text-indigo-600 font-mono text-sm">{formatPrice(calcPrice)}</span>
              </div>
              <input
                type="range"
                min="200"
                max="9999"
                step="50"
                value={calcPrice}
                onChange={(e) => setCalcPrice(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Slider 2: Supplier Base Cost */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-zinc-700 dark:text-zinc-300">Supplier Wholesale Cost (COGS)</label>
                <span className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">{formatPrice(calcCost)}</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="25"
                value={calcCost}
                onChange={(e) => setCalcCost(Number(e.target.value))}
                className="w-full accent-zinc-700 cursor-pointer"
              />
            </div>

            {/* Slider 3: Shipping & Packaging */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-zinc-700 dark:text-zinc-300">Shipping & Cushion Packaging</label>
                <span className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">{formatPrice(calcShipping)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={calcShipping}
                onChange={(e) => setCalcShipping(Number(e.target.value))}
                className="w-full accent-zinc-700 cursor-pointer"
              />
            </div>

            {/* Slider 4: Marketing Cost per Acquisition (CPA) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-zinc-700 dark:text-zinc-300">Ad Spend / Customer Acquisition (CPA)</label>
                <span className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">{formatPrice(calcAdSpend)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="800"
                step="20"
                value={calcAdSpend}
                onChange={(e) => setCalcAdSpend(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Slider 5: Monthly Sales Volume */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between text-xs font-bold">
                <label className="text-zinc-700 dark:text-zinc-300">Projected Monthly Units Sold</label>
                <span className="text-purple-600 font-mono text-sm">{calcMonthlyUnits} units</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={calcMonthlyUnits}
                onChange={(e) => setCalcMonthlyUnits(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-gradient-to-b from-indigo-50/80 via-purple-50/40 to-white text-zinc-900 p-6 sm:p-8 rounded-3xl border border-indigo-100 shadow-md space-y-6">
            <h3 className="font-extrabold text-base text-indigo-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Margin & ROI Summary
            </h3>

            {/* Big Net Profit Card */}
            <div className="p-4 rounded-2xl bg-white border border-indigo-100 text-center space-y-1 shadow-xs">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Net Profit per Unit</span>
              <p className="text-3xl font-black text-emerald-600 font-mono">
                {formatPrice(Math.max(0, netProfitPerUnit))}
              </p>
              <span className="text-xs text-zinc-600 font-semibold">
                Net Margin: <strong className="text-zinc-900">{netMarginPercent}%</strong>
              </span>
            </div>

            <div className="space-y-2 text-xs text-zinc-600 border-t border-indigo-100/80 pt-3">
              <div className="flex justify-between">
                <span>Gross Revenue per Unit</span>
                <span className="font-bold text-zinc-900">{formatPrice(calcPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Product Base Cost</span>
                <span className="text-rose-600 font-medium">-{formatPrice(calcCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Packaging</span>
                <span className="text-rose-600 font-medium">-{formatPrice(calcShipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Ad Spend (CPA)</span>
                <span className="text-rose-600 font-medium">-{formatPrice(calcAdSpend)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform & Gateway Fee (2%)</span>
                <span className="text-rose-600 font-medium">-{formatPrice(platformFee)}</span>
              </div>
              <div className="flex justify-between text-indigo-900 font-bold pt-2 border-t border-indigo-100">
                <span>Break-Even Target ROAS</span>
                <span className="font-mono text-indigo-600 font-black">{breakEvenROAS}x</span>
              </div>
            </div>

            {/* Monthly Projection */}
            <div className="p-4 rounded-2xl bg-indigo-600 text-white text-center space-y-1 shadow-md shadow-indigo-600/20">
              <span className="text-[11px] font-bold text-indigo-100 uppercase">Estimated Monthly Net Earnings</span>
              <p className="text-2xl font-black text-white font-mono">{formatPrice(Math.max(0, projectedMonthlyProfit))}</p>
              <p className="text-[10px] text-indigo-100">Based on {calcMonthlyUnits} sales/month</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Supplier Directory & Sourcing */}
      {activeTab === "suppliers" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Vetted Supplier Directory
              </h2>
              <p className="text-xs text-zinc-500">
                Connect directly with verified Indian artisan guilds and fast global dropship suppliers.
              </p>
            </div>
            <button
              onClick={() => setIsSourcingModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
            >
              + Create Sourcing Request
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-zinc-200">
                      <Image src={sup.avatar} alt={sup.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        {sup.name}
                        {sup.verified && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </h3>
                      <p className="text-xs text-zinc-500">{sup.location}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 font-bold text-xs">
                    ★ {sup.rating}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Fulfillment</span>
                    <strong className="text-emerald-600">{sup.fulfillmentRate}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Dispatch Time</span>
                    <strong className="text-zinc-900 dark:text-zinc-100">{sup.avgShipDays} Days</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Min Qty</span>
                    <strong className="text-zinc-900 dark:text-zinc-100">{sup.minOrderQty} pc</strong>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {sup.categories.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sourcing Requests Queue */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Active Sourcing Quotes & Inquiries ({sourcingRequests.length})
            </h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {sourcingRequests.map((src) => (
                <div key={src.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{src.productName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        src.status === "quoted" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {src.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-zinc-500 mt-0.5">
                      Target: {formatPrice(src.targetPrice)} · Quantity: {src.quantity} units · Category: {src.category}
                    </p>
                  </div>

                  {src.quotedPrice && (
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 block">Supplier Quote</span>
                      <strong className="text-emerald-600 font-bold">{formatPrice(src.quotedPrice)}</strong>
                      <span className="text-[10px] text-zinc-500 ml-1">({src.leadTimeDays}d lead time)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Order Fulfillment Queue */}
      {activeTab === "fulfillment" && (
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" /> Automated Fulfillment Pipeline
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Push orders directly to manufacturing workshops or dropshipping courier hubs with 1-click.
              </p>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {orders.map((ord) => (
              <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Order #{ord.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {ord.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-zinc-500">
                    {ord.items.length} item(s) · Total: <strong>{formatPrice(ord.total)}</strong> · Deliver to {ord.shippingAddress.city}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateOrderStatus(ord.id, "shipped", "Dispatched to BlueDart")}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    1-Click Dispatch Order
                  </button>
                  <Link
                    href={`/orders/${ord.id}`}
                    className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Dropship Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase">Gross GMV</span>
              <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">₹1,48,920</p>
              <span className="text-[11px] text-emerald-600 font-semibold">↑ +24.8% this month</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase">Net Profit</span>
              <p className="text-2xl font-black text-emerald-600">₹68,450</p>
              <span className="text-[11px] text-zinc-500 font-semibold">Avg 46.2% Net Margin</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase">Orders Shipped</span>
              <p className="text-2xl font-black text-indigo-600">184</p>
              <span className="text-[11px] text-zinc-500 font-semibold">99.2% on-time delivery</span>
            </div>
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-zinc-400 uppercase">Return Rate</span>
              <p className="text-2xl font-black text-amber-500">1.4%</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Industry leading &lt; 2%</span>
            </div>
          </div>
        </div>
      )}

      {/* Sourcing Modal */}
      {isSourcingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Submit Sourcing Request</h3>
            <p className="text-xs text-zinc-500">Our supplier network will review and send wholesale quotations within 24h.</p>

            <form onSubmit={handleSourcingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Product Name / Concept</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Macrame Plant Hanger Set of 3"
                  value={sourcingName}
                  onChange={(e) => setSourcingName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Target Price (₹)</label>
                  <input
                    type="number"
                    value={sourcingTargetPrice}
                    onChange={(e) => setSourcingTargetPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Target Quantity</label>
                  <input
                    type="number"
                    value={sourcingQty}
                    onChange={(e) => setSourcingQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Notes / Specifications</label>
                <textarea
                  rows={3}
                  placeholder="Colors, materials, packaging preferences..."
                  value={sourcingNotes}
                  onChange={(e) => setSourcingNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSourcingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Submit Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
