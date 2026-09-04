"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useStore, CurrencyCode } from "@/context/StoreContext";
import {
  Search,
  ShoppingBag,
  Heart,
  Bell,
  User,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Flame,
  Layers,
  TrendingUp,
  Store,
  Truck,
  ShieldCheck,
  Crown,
  LogIn,
  LogOut,
  UserPlus,
  Package,
  Sun,
  Moon,
  Wallet,
  ArrowRightLeft,
} from "lucide-react";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { Role } from "@/types/store";
import { NavbarOceanCanvas } from "../animations/NavbarOceanCanvas";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    cart,
    wishlist,
    unreadNotificationCount,
    setIsMiniCartOpen,
    categories,
    products,
    user,
    isAuthenticated,
    logout,
    openAccountSwitcherModal,
    deviceAccounts,
    switchRole,
    currency,
    setCurrency,
    formatPrice,
    theme,
    toggleTheme,
    toggleSidebar,
    setIsMobileMenuOpen,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyMenuOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Autocomplete matching
  const matchingProducts = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="relative w-full bg-[#faf7f2]/92 dark:bg-[#141210]/92 backdrop-blur-md transition-colors border-b md:border border-[#e8e0d4] dark:border-[#2e2822] dark:md:border-[#352f29] shadow-xs md:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.3)] md:rounded-[28px] overflow-hidden">
      {/* 2D Animated Horizon Background Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-35 dark:opacity-25">
        <NavbarOceanCanvas theme={theme} />
      </div>

      <div className="relative z-10 w-full max-w-[1920px] px-2 sm:px-4 mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-[68px] gap-2 sm:gap-4">
          
          {/* ========================================================================= */}
          {/* 1. LEFT: Mobile Hamburger + Brand Logo + Responsive Search Bar           */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
            {/* Mobile Hamburger Menu Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/80 dark:bg-[#1e1a16]/80 border border-[#e8e0d4] dark:border-[#352f29] text-[#241f1c] dark:text-[#f4ece1] hover:bg-white dark:hover:bg-[#25201b] transition-colors shadow-2xs cursor-pointer shrink-0"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-[#756c63] dark:text-[#a59b90]" />
            </button>

            {/* Criation Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-2.5 py-1.5 rounded-2xl bg-white/80 dark:bg-[#1e1a16]/80 border border-[#e8e0d4] dark:border-[#352f29] backdrop-blur-md hover:bg-white dark:hover:bg-[#25201b] transition-all shadow-xs shrink-0 group cursor-pointer"
              title="Criation Home"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#c25e3f] via-[#d97757] to-[#b58334] flex items-center justify-center text-white font-serif font-black text-base sm:text-lg shadow-sm group-hover:scale-105 transition-transform">
                C
              </div>
              <div className="flex items-center">
                <span className="font-serif font-black text-base sm:text-xl tracking-tight text-[#241f1c] dark:text-[#f4ece1] leading-none">
                  Criation<span className="text-[#c25e3f] dark:text-[#d97757]">.</span>
                </span>
              </div>
            </Link>

            {/* Left-Aligned Search Bar (Responsive Width) */}
            <div ref={searchRef} className="w-[110px] xs:w-[150px] sm:w-[240px] md:w-[320px] lg:w-[380px] xl:w-[420px] relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center w-full rounded-full border border-[#e8e0d4] dark:border-[#352f29] bg-white/90 dark:bg-[#1c1916]/90 backdrop-blur-md focus-within:border-[#c25e3f] dark:focus-within:border-[#d97757] focus-within:ring-2 focus-within:ring-[#c25e3f]/15 transition-all shadow-xs overflow-hidden">
                  <div className="pl-2.5 sm:pl-3.5 text-[#9c9184]">
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search crafts..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-full px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm bg-transparent text-[#241f1c] dark:text-[#f4ece1] placeholder:text-[#9c9184] focus:outline-hidden"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1 mr-1 text-[#9c9184] hover:text-[#241f1c] dark:hover:text-[#f4ece1] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Search Autocomplete Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 p-2">
                  {searchQuery.trim() ? (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Matching Products ({matchingProducts.length})
                      </div>
                      {matchingProducts.length === 0 ? (
                        <p className="text-xs text-zinc-500 p-3 text-center">
                          No exact matches. Press Enter to search all products.
                        </p>
                      ) : (
                        <div className="space-y-1 mt-1">
                          {matchingProducts.map((p) => (
                            <Link
                              key={p.id}
                              href={`/products/${p.slug}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                                <Image
                                  src={p.images[0]?.url || "/products/craft-item-01.jpeg"}
                                  alt={p.name}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                  {formatPrice(p.price)}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Trending Searches
                      </div>
                      {["Crochet Charms", "Handmade Brass Diya", "Dropship Jewellery", "Royal Pearl Vase"].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setSearchQuery(term);
                            setIsSearchOpen(false);
                            router.push(`/search?q=${encodeURIComponent(term)}`);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
                        >
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. CENTER: Clear Open Sky for Celestial Animation & Water Shimmer        */}
          {/* ========================================================================= */}
          <div className="flex-1" />

          {/* ========================================================================= */}
          {/* 3. RIGHT: YouTube Style Action Icons & Profile Cluster                    */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Currency Selector */}
            <div ref={currencyRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {isCurrencyMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-28 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl p-1 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  {(["INR", "USD", "EUR", "GBP"] as CurrencyCode[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCurrency(c);
                        setIsCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                        currency === c
                          ? "bg-[#faf7f2] dark:bg-[#28231e] text-[#c25e3f] dark:text-[#d97757] font-bold"
                          : "text-[#756c63] dark:text-[#a59b90] hover:bg-[#faf7f2] dark:hover:bg-[#231f1b]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle (Light / Dark Mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-full bg-white/80 dark:bg-[#1e1a16]/80 border border-[#e8e0d4] dark:border-[#352f29] backdrop-blur-md hover:bg-white dark:hover:bg-[#25201b] text-[#241f1c] dark:text-[#f4ece1] transition-colors shadow-2xs cursor-pointer"
              title="Toggle Color Theme"
              aria-label="Toggle Color Theme"
            >
              <Sun className="hidden dark:block w-4 h-4 sm:w-5 sm:h-5 text-[#d49f48]" />
              <Moon className="block dark:hidden w-4 h-4 sm:w-5 sm:h-5 text-[#756c63]" />
            </button>

            {/* Wishlist Button with Badge (Hidden on mobile; provided in MobileBottomBar) */}
            <Link
              href="/wishlist"
              className="hidden md:flex relative p-2 sm:p-2.5 rounded-full bg-white/80 dark:bg-[#1e1a16]/80 border border-[#e8e0d4] dark:border-[#352f29] backdrop-blur-md hover:bg-white dark:hover:bg-[#25201b] text-[#241f1c] dark:text-[#f4ece1] transition-colors shadow-2xs"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {mounted && wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#b75258] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlist.length > 9 ? "9+" : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button with Live Badge */}
            <button
              type="button"
              onClick={() => setIsMiniCartOpen(true)}
              className="relative flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-full bg-white/80 dark:bg-[#1e1a16]/80 border border-[#e8e0d4] dark:border-[#352f29] backdrop-blur-md hover:bg-white dark:hover:bg-[#25201b] text-[#241f1c] dark:text-[#f4ece1] transition-colors shadow-2xs cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#c25e3f] dark:text-[#d97757]" />
              {mounted && totalCartCount > 0 && (
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#c25e3f] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalCartCount > 9 ? "9+" : totalCartCount}
                </span>
              )}
            </button>

            {/* Notifications Bell (Visible on desktop/tablet) */}
            <div ref={notifRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 sm:p-2.5 rounded-full bg-white/80 dark:bg-[#1e1a16]/80 border border-[#e8e0d4] dark:border-[#352f29] backdrop-blur-md hover:bg-white dark:hover:bg-[#25201b] text-[#241f1c] dark:text-[#f4ece1] transition-colors shadow-2xs cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {mounted && unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#b75258] shadow-xs" />
                )}
              </button>

              {isNotifOpen && (
                <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
              )}
            </div>

            {/* User Profile / Auth Buttons: Separate Sign In & Register on Desktop (Hidden on mobile; featured in Drawer & Bottom Bar) */}
            {!mounted || !isAuthenticated ? (
              <div className="hidden md:flex items-center gap-1.5 ml-1">
                <Link
                  href="/auth/login"
                  className="px-3.5 py-2 rounded-full text-xs font-semibold text-[#241f1c] dark:text-[#f4ece1] hover:bg-[#ede6d8] dark:hover:bg-[#231f1b] border border-transparent hover:border-[#e8e0d4] dark:hover:border-[#352f29] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#c25e3f] via-[#b58334] to-[#c25e3f] hover:opacity-95 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-extrabold text-[#fdf4dc]">
                    +₹100
                  </span>
                </Link>
              </div>
            ) : (
              <div ref={profileRef} className="relative ml-1">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#c25e3f]/40 transition-all cursor-pointer"
                  title="Account Menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c25e3f] to-[#b58334] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#1c1916] border border-[#e8e0d4] dark:border-[#352f29] rounded-2xl shadow-xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150 text-[#241f1c] dark:text-[#f4ece1]">
                    <div className="flex items-center gap-3 p-2.5 bg-[#faf7f2] dark:bg-[#24201c] rounded-xl border border-[#e8e0d4]/60 dark:border-[#352f29]">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#c25e3f] to-[#b58334] flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#241f1c] dark:text-[#f4ece1] truncate">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-[#756c63] dark:text-[#a59b90] truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Portals strictly visible only to authorized accounts */}
                    {user.role === "admin" && user.email?.toLowerCase().trim() === "dks45000000@gmail.com" && (
                      <div className="pb-1 border-b border-zinc-100 dark:border-zinc-800">
                        <Link
                          href="/admin"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Superadmin Center</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">Admin</span>
                        </Link>
                      </div>
                    )}

                    {/* Customer: Apply to Sell (Merchant Onboarding) */}
                    {user.role !== "seller" && user.role !== "admin" && (
                      <div className="pb-1 border-b border-zinc-100 dark:border-zinc-800">
                        <Link
                          href="/seller/apply"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4" />
                            <span>Apply to Sell (Merchant)</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">KYC</span>
                        </Link>
                      </div>
                    )}

                    {user.role === "seller" && (
                      <div className="pb-1 border-b border-zinc-100 dark:border-zinc-800">
                        <Link
                          href="/seller"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4" />
                            <span>Merchant Hub</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">Seller</span>
                        </Link>
                      </div>
                    )}

                    {user.role === "supplier" && (
                      <div className="pb-1 border-b border-zinc-100 dark:border-zinc-800">
                        <Link
                          href="/supplier"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            <span>Wholesale Supplier</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">Supplier</span>
                        </Link>
                      </div>
                    )}

                    <div className="space-y-1 pt-1">
                      <Link
                        href="/account"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-zinc-500" />
                        <span>Your Profile</span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      >
                        <Package className="w-4 h-4 text-zinc-500" />
                        <span>Your Orders</span>
                      </Link>

                      <Link
                        href="/wallet"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-emerald-500" />
                        <span>Wallet ({formatPrice(user.walletBalance)})</span>
                      </Link>
                    </div>

                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        openAccountSwitcherModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                    >
                      <ArrowRightLeft className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
