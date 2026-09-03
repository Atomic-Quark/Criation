"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import {
  Store,
  DollarSign,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Banknote,
  Send,
} from "lucide-react";
import { ProductItem } from "@/types/store";

export default function SellerPortalPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    formatPrice,
    showToast,
    user,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"products" | "orders" | "payouts">("products");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(25000);

  // New Product Form State
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("cat_crochet_accessories");
  const [newProdPrice, setNewProdPrice] = useState(299);
  const [newProdComparePrice, setNewProdComparePrice] = useState(599);
  const [newProdStock, setNewProdStock] = useState(30);
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdArtisan, setNewProdArtisan] = useState("Jaipur Master Weavers");
  const [newProdLocation, setNewProdLocation] = useState("Jaipur, Rajasthan");

  const sellerProducts = products;
  const totalRevenue = 124500;
  const pendingPayout = 38400;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const added = addProduct({
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: newProdName,
      tagline: "Handmade by Indian rural artisan cooperative",
      description: newProdDesc || "Authentic handcrafted masterpiece made with natural materials.",
      price: newProdPrice,
      compareAtPrice: newProdComparePrice,
      currency: "INR",
      categoryId: newProdCategory,
      categoryName: "Crochet & Woolen Charms",
      tags: ["handcrafted", "artisan", "new"],
      badge: "Artisan Drop",
      images: [
        { url: "/products/craft-item-01.jpeg", alt: newProdName, isCover: true },
      ],
      variants: [
        { id: `var_${Date.now()}`, sku: `ART-${Math.floor(1000 + Math.random() * 9000)}`, name: "Standard", price: newProdPrice, stock: newProdStock },
      ],
      rating: 5.0,
      reviewCount: 1,
      artisanName: newProdArtisan,
      artisanLocation: newProdLocation,
      artisanStory: "Crafted with immense care by rural women artisans.",
      isHandcrafted: true,
      isDropship: false,
      stock: newProdStock,
      specifications: {
        "Origin": newProdLocation,
        "Craft": "100% Handcrafted",
      },
    });

    setIsAddModalOpen(false);
    setNewProdName("");
    setNewProdDesc("");
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Withdrawal Requested 🏦", `Transfer of ${formatPrice(withdrawAmount)} initiated to your verified bank account.`, "success");
    setIsWithdrawModalOpen(false);
  };

  // Security Gate: Defense-in-depth authorization for Merchant Portal
  if (!user.isAuthenticated || (user.role !== "seller" && user.role !== "admin")) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto shadow-sm">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight">
            Merchant Access Required
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            This Merchant Hub is restricted strictly to verified artisan sellers and store managers.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-5">
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Merchant Account Required</span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                Your current account ({user.name || "Guest"}) does not possess an approved seller profile.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/auth/login?redirect=/seller"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              Sign In with Merchant Account
            </Link>

            <Link
              href="/"
              className="block text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 pt-1"
            >
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-white dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 border border-indigo-100 dark:border-indigo-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800/60">
            <Store className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Merchant / Artisan Store Manager
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
            Seller Operations Portal
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Manage your handcrafted inventory, fulfill customer orders, and withdraw earnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Craft Item
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-zinc-400 uppercase">Gross Sales (30 Days)</span>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{formatPrice(totalRevenue)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">↑ +18.4% growth</span>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-zinc-400 uppercase">Available Payout</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatPrice(pendingPayout)}</p>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Request Transfer →
          </button>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-zinc-400 uppercase">Active Catalog</span>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{sellerProducts.length} Items</p>
          <span className="text-[11px] text-zinc-500">Across 6 collections</span>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-xs">
          <span className="text-xs font-bold text-zinc-400 uppercase">Orders to Dispatch</span>
          <p className="text-2xl font-black text-amber-500">{orders.filter(o => o.status === 'confirmed').length}</p>
          <span className="text-[11px] text-amber-600 font-semibold">⚡ Action Required</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {[
          { id: "products", label: "My Products & Stock", count: sellerProducts.length },
          { id: "orders", label: "Customer Orders", count: orders.length },
          { id: "payouts", label: "Payouts & Settlements" },
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
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Product Management Table */}
      {activeTab === "products" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 uppercase font-bold text-[10px] border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Collection</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                {sellerProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-200 shrink-0">
                          <Image src={prod.images[0]?.url || "/products/craft-item-01.jpeg"} alt={prod.name} fill className="object-cover" sizes="40px" />
                        </div>
                        <div>
                          <Link href={`/products/${prod.slug}`} className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline">
                            {prod.name}
                          </Link>
                          <p className="text-[10px] text-zinc-400">{prod.badge || "Standard"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{prod.categoryName}</td>
                    <td className="p-4 font-bold text-zinc-900 dark:text-zinc-100">{formatPrice(prod.price)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${prod.stock < 20 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="p-4">★ {prod.rating} ({prod.reviewCount})</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updateProduct(prod.id, { stock: prod.stock + 10 })}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          +10 Stock
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Queue */}
      {activeTab === "orders" && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-xs">
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
                    Deliver to: {ord.shippingAddress.fullName} · {ord.shippingAddress.city} · Total: <strong>{formatPrice(ord.total)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {ord.status !== "shipped" && ord.status !== "delivered" && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, "shipped", "Marked as dispatched by seller")}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-indigo-500"
                    >
                      Print Label & Dispatch
                    </button>
                  )}
                  <Link
                    href={`/orders/${ord.id}`}
                    className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Payouts */}
      {activeTab === "payouts" && (
        <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Settlement Ledger</h3>
              <p className="text-xs text-zinc-500">Direct NEFT/RTGS bank transfers processed every Tuesday.</p>
            </div>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
            >
              Withdraw {formatPrice(pendingPayout)}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs">
            <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-100">
              <span>HDFC Bank Account (Verified)</span>
              <span>•••• •••• 4910</span>
            </div>
            <p className="text-zinc-500">IFSC: HDFC0001824 · Branch: Cyber City, Gurugram</p>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Add New Artisan Product</h3>

            <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handmade Woolen Krishna Mukut"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">MRP Strike Price (₹)</label>
                  <input
                    type="number"
                    value={newProdComparePrice}
                    onChange={(e) => setNewProdComparePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                  >
                    <option value="cat_crochet_accessories">Crochet & Woolen Charms</option>
                    <option value="cat_festive_diyas">Festive Designer Diyas</option>
                    <option value="cat_home_decor">Royal Vases & Decor</option>
                    <option value="cat_deity_poshak">Laddu Gopal Poshak</option>
                    <option value="cat_thalposh_mats">Thalposh & Table Runners</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Initial Stock (units)</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Artisan Guild Name & Origin</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Artisan Name"
                    value={newProdArtisan}
                    onChange={(e) => setNewProdArtisan(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Jaipur)"
                    value={newProdLocation}
                    onChange={(e) => setNewProdLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description & Craft Story</label>
                <textarea
                  rows={3}
                  placeholder="Describe the craft stitches, colors, materials, and significance..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Publish to Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Withdraw Earnings</h3>
            <p className="text-xs text-zinc-500">Funds will be deposited into your verified HDFC bank account within 24 hours.</p>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Amount to Transfer (₹)</label>
                <input
                  type="number"
                  max={pendingPayout}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none text-base font-black text-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
