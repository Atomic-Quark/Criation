"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import {
  User,
  Wallet,
  Award,
  MapPin,
  Shield,
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CreditCard,
  X,
  Phone,
  Mail,
  Home as HomeIcon,
  Building,
} from "lucide-react";
import { Address } from "@/types/store";

export default function AccountPage() {
  const {
    user,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    walletTransactions,
    addWalletMoney,
    formatPrice,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"profile" | "wallet" | "addresses" | "security" | "notifications">("profile");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(500);

  // Edit Profile State with Live Sync
  const [nameInput, setNameInput] = useState(user.name || "");
  const [emailInput, setEmailInput] = useState(user.email || "");
  const [phoneInput, setPhoneInput] = useState(user.phone || "");

  // Sync inputs with context user upon hydration or update
  useEffect(() => {
    setNameInput(user.name || "");
    setEmailInput(user.email || "");
    setPhoneInput(user.phone || "");
  }, [user.name, user.email, user.phone]);

  // Add Address State
  const [isAddAddrOpen, setIsAddAddrOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user.name || "",
    phone: user.phone || "",
    line1: "",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122002",
    country: "India",
    type: "home" as "home" | "work" | "other",
    isDefault: false,
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showToast("Name Required", "Please enter your full name.", "error");
      return;
    }
    updateProfile({
      name: nameInput.trim(),
      email: emailInput.trim(),
      phone: phoneInput.trim(),
    });
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWalletMoney(topUpAmount);
    setIsTopUpOpen(false);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.line1.trim() || !newAddr.pincode.trim()) {
      showToast("Incomplete Address", "Please fill in Address Line and PIN code.", "error");
      return;
    }
    addAddress({
      ...newAddr,
      fullName: newAddr.fullName || user.name || "Customer",
      phone: newAddr.phone || user.phone || "+91 9876543210",
    });
    setIsAddAddrOpen(false);
    setNewAddr({
      fullName: user.name || "",
      phone: user.phone || "",
      line1: "",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      country: "India",
      type: "home",
      isDefault: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100 font-bold">My Account</span>
        <span>/</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold capitalize">{activeTab}</span>
      </nav>

      {/* Top Banner with VIP Profile */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-white dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 border border-indigo-100 dark:border-indigo-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-md shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
                {user.name || "Customer Profile"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> {user.tier} Member
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 flex-wrap">
              <span>{user.email || "No email set"}</span>
              {user.phone && (
                <>
                  <span>•</span>
                  <span>{user.phone}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick Balance Cards */}
        <div className="flex items-center gap-4">
          <Link
            href="/wallet"
            className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-indigo-100 dark:border-zinc-700 hover:border-indigo-400 transition-all text-center min-w-[130px] shadow-xs cursor-pointer group"
          >
            <span className="text-[10px] text-zinc-400 dark:text-zinc-400 uppercase font-bold group-hover:text-indigo-600 transition-colors">
              Criation Wallet
            </span>
            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {formatPrice(user.walletBalance)}
            </p>
          </Link>
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-indigo-100 dark:border-zinc-700 text-center min-w-[130px] shadow-xs">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-400 uppercase font-bold">Loyalty Points</span>
            <p className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
              {user.loyaltyPoints} pts
            </p>
          </div>
        </div>
      </div>

      {/* Website Direct Hub Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/orders"
          className="p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-indigo-50/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-zinc-700 transition-all shadow-2xs group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">My Orders</h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Live Courier AWB</p>
          </div>
        </Link>

        <Link
          href="/wishlist"
          className="p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-rose-50/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-zinc-700 transition-all shadow-2xs group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">Saved Wishlist</h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Favorite Crafts</p>
          </div>
        </Link>

        <Link
          href="/subscription"
          className="p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-amber-50/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-zinc-700 transition-all shadow-2xs group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">VIP Prime Club</h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Free Express & Deals</p>
          </div>
        </Link>

        <Link
          href="/products"
          className="p-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs group flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Explore Catalog</h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">67+ Artisan Items</p>
          </div>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar">
        {[
          { id: "profile", label: "Profile & Settings", icon: User },
          { id: "wallet", label: "Criation Wallet & Points", icon: Wallet },
          { id: "addresses", label: "Address Book", icon: MapPin },
          { id: "security", label: "Security & 2FA", icon: Shield },
          { id: "notifications", label: "Notification Channels", icon: Bell },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold"
                : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* Tab 1: Profile & Personal Information                                     */}
      {/* ========================================================================= */}
      {activeTab === "profile" && (
        <div className="max-w-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Personal Information</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Update your name, contact details, and account preferences.</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-500 transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 2: Wallet & Points                                                    */}
      {/* ========================================================================= */}
      {activeTab === "wallet" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">Criation Wallet Balance</span>
              <p className="text-3xl font-black font-mono">{formatPrice(user.walletBalance)}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(true)}
                  className="flex-1 py-2.5 rounded-xl bg-white text-indigo-900 text-xs font-extrabold hover:bg-zinc-100 shadow-sm cursor-pointer"
                >
                  + Add Money (Instant UPI)
                </button>
                <Link
                  href="/wallet"
                  className="px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors flex items-center justify-center"
                  title="Full Wallet Page"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase">Loyalty Points</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{user.loyaltyPoints} Points</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">100 Points = ₹100 instant checkout voucher</p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase">VIP Tier Status</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{user.tier} VIP</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">✓ Free Express Delivery on all orders</p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-950 dark:text-white">Wallet Activity Log</h3>
              <Link href="/wallet" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All Activity →
              </Link>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
              {walletTransactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{tx.description}</p>
                    <p className="text-[10px] text-zinc-400">{tx.date}</p>
                  </div>
                  <span className={`font-mono font-bold ${tx.type === "credit" ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                    {tx.type === "credit" ? "+" : "-"}{formatPrice(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 3: Saved Address Book                                                 */}
      {/* ========================================================================= */}
      {activeTab === "addresses" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Saved Delivery Addresses</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage shipping addresses for fast 1-click checkout.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddAddrOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {user.addresses.length === 0 ? (
            <div className="text-center py-12 p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-3">
              <MapPin className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No saved addresses yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Add your home or office delivery address to speed up order checkouts.
              </p>
              <button
                type="button"
                onClick={() => setIsAddAddrOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors cursor-pointer"
              >
                + Add Address Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-zinc-950 dark:text-white flex items-center gap-2">
                        {addr.type === "home" ? <HomeIcon className="w-4 h-4 text-indigo-500" /> : <Building className="w-4 h-4 text-purple-500" />}
                        {addr.fullName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] uppercase font-bold">
                        {addr.type}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {addr.line1}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> {addr.phone}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                    {addr.isDefault ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Default Shipping
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="text-rose-500 hover:text-rose-600 font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 4: Security & 2FA                                                     */}
      {/* ========================================================================= */}
      {activeTab === "security" && (
        <div className="max-w-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6 animate-in fade-in">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Security & Authentication</h2>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">Two-Factor Authentication (2FA)</p>
              <p className="text-zinc-500 dark:text-zinc-400">Require an SMS / Authenticator OTP when logging in</p>
            </div>
            <button
              type="button"
              onClick={() => {
                updateProfile({ twoFactorEnabled: !user.twoFactorEnabled });
                showToast("2FA Updated", `Two-factor security is now ${!user.twoFactorEnabled ? "ENABLED" : "DISABLED"}.`, "info");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                user.twoFactorEnabled
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {user.twoFactorEnabled ? "Enabled ✓" : "Disabled"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab 5: Notifications                                                      */}
      {/* ========================================================================= */}
      {activeTab === "notifications" && (
        <div className="max-w-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 animate-in fade-in text-xs">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Notification Channel Preferences</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Configure where you receive real-time order alerts & price drop notifications.</p>

          <div className="space-y-2.5 pt-2">
            {[
              { key: "inApp", label: "In-App Notification Center & Toasts" },
              { key: "whatsapp", label: "WhatsApp Order Updates & AWB Tracking" },
              { key: "sms", label: "SMS Shipment Dispatch Alerts" },
              { key: "email", label: "Email Tax Invoices & Artisan Stories" },
            ].map((ch) => (
              <div key={ch.key} className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{ch.label}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Enabled ✓</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: Add New Address Dialog                                           */}
      {/* ========================================================================= */}
      {isAddAddrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-zinc-950 dark:text-white">
                  Add Delivery Address
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAddrOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddressSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient name"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">House / Flat / Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Royal Palms Heights, Golf Course Road"
                  value={newAddr.line1}
                  onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    placeholder="122002"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Address Tag</label>
                <div className="flex gap-2">
                  {(["home", "work", "other"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddr({ ...newAddr, type: t })}
                      className={`flex-1 py-2 rounded-xl uppercase font-bold text-[11px] transition-colors cursor-pointer ${
                        newAddr.type === t
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newAddr.isDefault}
                  onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                  className="rounded-sm text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Set as default shipping address</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddAddrOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md cursor-pointer transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Top Up Wallet Dialog                                             */}
      {/* ========================================================================= */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Top-Up Criation Wallet</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Fast 1-click checkout with zero payment failure risk.</p>

            <form onSubmit={handleTopUpSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`p-3 rounded-xl border font-bold text-center cursor-pointer ${
                      topUpAmount === amt
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                        : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {formatPrice(amt)}
                  </button>
                ))}
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Custom Amount (₹)</label>
                <input
                  type="number"
                  min="100"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold text-base text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-500 dark:text-zinc-400 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  Recharge via UPI →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
