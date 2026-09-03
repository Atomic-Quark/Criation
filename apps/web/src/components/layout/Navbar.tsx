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
} from "lucide-react";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { Role } from "@/types/store";
import { ThemeToggleSwitch } from "../ui/ThemeToggleSwitch";
import { NavbarOceanCanvas } from "./NavbarOceanCanvas";

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

  const roles: { role: Role; label: string; icon: any; color: string }[] = [
    { role: "customer", label: "Customer Store", icon: User, color: "text-emerald-600" },
    { role: "seller", label: "Merchant Hub", icon: Store, color: "text-indigo-600" },
    { role: "supplier", label: "Wholesale Supplier", icon: Truck, color: "text-amber-600" },
    { role: "admin", label: "Superadmin Center", icon: ShieldCheck, color: "text-rose-600" },
  ];

  return (
    <header className="sticky top-0 z-40 relative w-full bg-zinc-950 dark:bg-zinc-950 transition-colors border-b border-zinc-200/20 dark:border-white/10 shadow-xs">
      {/* 2D Animated Horizon Background Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <NavbarOceanCanvas theme={theme} />
      </div>

      <div className="relative z-10 w-full max-w-[1920px] px-3 sm:px-6 mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* ========================================================================= */}
          {/* 1. LEFT: Brand Logo + Left-Aligned Search Bar                             */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Criation Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 py-1.5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all shadow-xs shrink-0 group cursor-pointer"
              title="Criation Home"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-sm group-hover:scale-105 transition-transform">
                C
              </div>
              <div className="flex items-center">
                <span className="font-black text-lg sm:text-xl tracking-tight text-zinc-950 dark:text-white leading-none">
                  Criation<span className="text-amber-500">.</span>
                </span>
              </div>
            </Link>

            {/* Left-Aligned Search Bar */}
            <div ref={searchRef} className="w-[180px] sm:w-[240px] md:w-[300px] lg:w-[340px] relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center w-full rounded-full border border-white/50 dark:border-white/15 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all shadow-md overflow-hidden">
                  <div className="pl-3.5 text-zinc-400">
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search crafts, gifts..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-full px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1 mr-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
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
                          ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
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
              className="p-2 sm:p-2.5 rounded-full bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-100 transition-colors shadow-2xs cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700" />}
            </button>

            {/* Wishlist Button with Badge */}
            <Link
              href="/wishlist"
              className="relative p-2 sm:p-2.5 rounded-full bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-100 transition-colors shadow-2xs"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlist.length > 9 ? "9+" : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button with Live Badge */}
            <button
              type="button"
              onClick={() => setIsMiniCartOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-100 transition-colors shadow-2xs cursor-pointer"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
              {totalCartCount > 0 && (
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalCartCount > 9 ? "9+" : totalCartCount}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 sm:p-2.5 rounded-full bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-100 transition-colors shadow-2xs cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
                )}
              </button>

              {isNotifOpen && (
                <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
              )}
            </div>

            {/* User Profile / Account Menu */}
            <div ref={profileRef} className="relative ml-1">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all cursor-pointer"
                title="Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {user.name.charAt(0)}
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

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
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
