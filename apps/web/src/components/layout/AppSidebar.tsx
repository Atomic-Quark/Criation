"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore, CurrencyCode } from "@/context/StoreContext";
import {
  LayoutGrid,
  TrendingUp,
  Flame,
  MessageSquare,
  ShoppingCart,
  Heart,
  Settings,
  LogOut,
  LogIn,
  ShieldCheck,
  Store,
  X,
  UserPlus,
  ArrowRightLeft,
  Sun,
  Moon,
  Package,
  Wallet,
  User,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const {
    wishlist,
    cart,
    user,
    isAuthenticated,
    logout,
    openAccountSignOutModal,
    openAccountSwitcherModal,
    deviceAccounts,
    isSidebarHovered,
    setIsSidebarHovered,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsMiniCartOpen,
    currency,
    setCurrency,
    formatPrice,
    theme,
    toggleTheme,
  } = useStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isExpanded = isSidebarHovered;
  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Navigation Items
  const navItems: Array<{
    id: string;
    label: string;
    href?: string;
    action?: () => void;
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    badge?: number | string;
  }> = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/",
      icon: LayoutGrid,
      isActive: pathname === "/",
    },
    {
      id: "analytics",
      label: "Analytics & Shop",
      href: "/products",
      icon: TrendingUp,
      isActive: pathname.startsWith("/products"),
    },
    {
      id: "deals",
      label: "Flash Deals",
      href: "/deals",
      icon: Flame,
      isActive: pathname.startsWith("/deals"),
      badge: "HOT",
    },
    {
      id: "messages",
      label: "Messages",
      href: "/messages",
      icon: MessageSquare,
      isActive: pathname.startsWith("/messages"),
      badge: 2,
    },
    {
      id: "cart",
      label: "My Cart",
      action: () => setIsMiniCartOpen(true),
      icon: ShoppingCart,
      isActive: false,
      badge: mounted && totalCartCount > 0 ? totalCartCount : undefined,
    },
    {
      id: "saved",
      label: "Saved Wishlist",
      href: "/wishlist",
      icon: Heart,
      isActive: pathname.startsWith("/wishlist"),
      badge: mounted && wishlist.length > 0 ? wishlist.length : undefined,
    },
  ];

  return (
    <>
      {/* -------------------------------------------------------------------
          DESKTOP FLOATING SIDEBAR (100% Mathematically Centered & Pixel-Aligned)
          ------------------------------------------------------------------- */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`hidden md:flex fixed left-4 top-4 bottom-4 z-40 flex-col justify-between px-3 py-3 rounded-[32px] bg-[#faf7f2]/95 dark:bg-[#161311]/95 backdrop-blur-xl border border-[#e8e0d4] dark:border-[#352f29] shadow-[0_12px_40px_-8px_rgba(44,35,25,0.08)] dark:shadow-[0_16px_45px_-8px_rgba(0,0,0,0.7)] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] select-none overflow-hidden ${
          isExpanded ? "w-[244px]" : "w-[72px]"
        }`}
      >
        {/* TOP SECTION: Navigation Links */}
        <div className="space-y-2 pt-2 sm:pt-3">

          {/* Superadmin Shortcut (if authorized) */}
          {mounted && user.role === "admin" && user.email?.toLowerCase().trim() === "dks45000000@gmail.com" && (
            <Link
              href="/admin"
              className="w-full flex items-center h-11 rounded-2xl bg-[#fdf2ef] dark:bg-[#2d1b1a] text-[#b75258] dark:text-[#cf6e74] border border-[#f5d5cc] dark:border-[#452624] hover:opacity-90 font-bold text-xs transition-colors group"
              title="Superadmin Console"
            >
              <div className="w-12 h-11 min-w-12 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 shrink-0" />
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center ${
                  isExpanded ? "max-w-[160px] opacity-100 ml-1" : "max-w-0 opacity-0 pointer-events-none"
                }`}
              >
                <span className="truncate text-xs">Superadmin Console</span>
              </div>
            </Link>
          )}

          {/* Merchant Shortcut (if seller) */}
          {mounted && user.role === "seller" && (
            <Link
              href="/seller"
              className="w-full flex items-center h-11 rounded-2xl bg-[#f0f4f1] dark:bg-[#1b261e] text-[#56745f] dark:text-[#779b81] border border-[#d8e4db] dark:border-[#2d3f32] hover:opacity-90 font-bold text-xs transition-colors group"
              title="Merchant Hub"
            >
              <div className="w-12 h-11 min-w-12 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 shrink-0" />
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center ${
                  isExpanded ? "max-w-[160px] opacity-100 ml-1" : "max-w-0 opacity-0 pointer-events-none"
                }`}
              >
                <span className="truncate text-xs">Merchant Hub</span>
              </div>
            </Link>
          )}

          {/* MAIN NAVIGATION LIST */}
          <nav className="space-y-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const content = (
                <>
                  {/* Stationary 48px Anchor Slot (Centerline at exactly X = 36px) */}
                  <div className="w-12 h-11 min-w-12 flex items-center justify-center shrink-0 relative">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                        item.isActive
                          ? "bg-[#c25e3f] text-white shadow-md shadow-[#c25e3f]/25"
                          : "text-[#8a8075] dark:text-[#9e9489] group-hover:text-[#241f1c] dark:group-hover:text-[#f4ece1] group-hover:bg-[#f0eae0] dark:group-hover:bg-[#231f1b]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Collapsed Badge */}
                    {!isExpanded && mounted && item.badge !== undefined && (
                      <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#c25e3f] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#faf7f2] dark:ring-[#161311] shadow-xs animate-in zoom-in duration-200">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Smooth expanding Text Label & Badge */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-between min-w-0 flex-1 ${
                      isExpanded
                        ? "max-w-[170px] opacity-100 ml-1 pr-2.5"
                        : "max-w-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold text-left truncate leading-none ${
                        item.isActive
                          ? "text-[#c25e3f] dark:text-[#d97757] font-bold"
                          : "text-[#756c63] dark:text-[#a59b90] group-hover:text-[#241f1c] dark:group-hover:text-[#f4ece1]"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Expanded Badge */}
                    {item.badge !== undefined && (
                      <span className="ml-auto px-2 py-0.5 rounded-full bg-[#c25e3f] text-white text-[10px] font-bold shrink-0 shadow-xs uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </>
              );

              // Capsule background in expanded state
              const rowClass = isExpanded && item.isActive
                ? "bg-[#f0eae0] dark:bg-[#26211d] border border-[#e8e0d4] dark:border-[#3a332c] shadow-xs"
                : "border border-transparent";

              if (item.action) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    className={`w-full flex items-center h-11 rounded-2xl transition-all duration-300 cursor-pointer relative group ${rowClass}`}
                    title={!isExpanded ? item.label : undefined}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href!}
                  className={`w-full flex items-center h-11 rounded-2xl transition-all duration-300 relative group ${rowClass}`}
                  title={!isExpanded ? item.label : undefined}
                >
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SECTION: Settings & Logout/Sign In */}
        <div className="space-y-1.5 pt-2 border-t border-[#e8e0d4] dark:border-[#352f29]">
          {/* Settings */}
          <Link
            href="/account"
            className="w-full flex items-center h-11 rounded-2xl hover:bg-[#f0eae0]/70 dark:hover:bg-[#231f1b] transition-all group"
            title={!isExpanded ? "Settings" : undefined}
          >
            <div className="w-12 h-11 min-w-12 flex items-center justify-center shrink-0">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#8a8075] group-hover:text-[#241f1c] dark:group-hover:text-[#f4ece1] group-hover:bg-[#f0eae0] dark:group-hover:bg-[#231f1b] transition-colors">
                <Settings className="w-5 h-5" />
              </div>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center flex-1 ${
                isExpanded
                  ? "max-w-[160px] opacity-100 ml-1 pr-2"
                  : "max-w-0 opacity-0 pointer-events-none"
              }`}
            >
              <span className="text-xs font-semibold text-[#756c63] dark:text-[#a59b90] whitespace-nowrap">
                Settings
              </span>
            </div>
          </Link>

          {/* Logout / Sign In */}
          {mounted && isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center h-11 rounded-2xl hover:bg-[#fdf0ed] dark:hover:bg-[#2d1b1a] transition-all group cursor-pointer"
              title={!isExpanded ? "Logout" : undefined}
            >
              <div className="w-12 h-11 min-w-12 flex items-center justify-center shrink-0">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#8a8075] group-hover:text-[#b75258] dark:group-hover:text-[#cf6e74] group-hover:bg-[#c25e3f]/10 transition-colors">
                  <LogOut className="w-5 h-5" />
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center flex-1 ${
                  isExpanded
                    ? "max-w-[160px] opacity-100 ml-1 pr-2"
                    : "max-w-0 opacity-0 pointer-events-none"
                }`}
              >
                <span className="text-xs font-semibold text-[#756c63] dark:text-[#a59b90] group-hover:text-[#b75258] dark:group-hover:text-[#cf6e74] whitespace-nowrap">
                  Logout
                </span>
              </div>
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="w-full flex items-center h-11 rounded-2xl hover:bg-[#f0eae0]/70 dark:hover:bg-[#231f1b] transition-all group"
              title={!isExpanded ? "Sign In" : undefined}
            >
              <div className="w-12 h-11 min-w-12 flex items-center justify-center shrink-0">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#c25e3f] dark:text-[#d97757] group-hover:bg-[#c25e3f]/10 transition-colors">
                  <LogIn className="w-5 h-5" />
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center flex-1 ${
                  isExpanded
                    ? "max-w-[160px] opacity-100 ml-1 pr-2"
                    : "max-w-0 opacity-0 pointer-events-none"
                }`}
              >
                <span className="text-xs font-semibold text-[#c25e3f] dark:text-[#d97757] whitespace-nowrap">
                  Sign In
                </span>
              </div>
            </Link>
          )}
        </div>
      </aside>

      {/* -------------------------------------------------------------------
          MOBILE MENU SLIDE-OVER DRAWER (Maintained for phones)
          ------------------------------------------------------------------- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-[#faf7f2] dark:bg-[#161311] border-r border-[#e8e0d4] dark:border-[#352f29] p-4 shadow-2xl flex flex-col justify-between overflow-y-auto text-[#241f1c] dark:text-[#f4ece1]">
            <div className="space-y-4">
              {/* Header: Logo, Theme, and Close */}
              <div className="flex items-center justify-between pb-3 border-b border-[#e8e0d4] dark:border-[#352f29]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#c25e3f] via-[#d97757] to-[#b58334] flex items-center justify-center text-white font-serif font-black text-base shadow-sm">
                    C
                  </div>
                  <span className="font-serif font-black text-lg tracking-tight text-[#241f1c] dark:text-[#f4ece1]">
                    Criation<span className="text-[#c25e3f] dark:text-[#d97757]">.</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-white/80 dark:bg-[#231f1b] border border-[#e8e0d4] dark:border-[#352f29] text-[#241f1c] dark:text-[#f4ece1] cursor-pointer shadow-2xs"
                    title="Toggle Theme"
                  >
                    <Sun className="hidden dark:block w-4 h-4 text-[#d49f48]" />
                    <Moon className="block dark:hidden w-4 h-4 text-[#756c63]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-[#756c63] dark:text-[#a59b90] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* User / Auth Section in Mobile Drawer */}
              {mounted && isAuthenticated ? (
                <div className="p-3 rounded-2xl bg-white dark:bg-[#1e1a16] border border-[#e8e0d4] dark:border-[#352f29] shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#c25e3f] to-[#b58334] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate text-[#241f1c] dark:text-[#f4ece1]">{user.name}</p>
                      <p className="text-[10px] text-[#756c63] dark:text-[#a59b90] truncate">{user.email}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#c25e3f]/10 text-[#c25e3f] dark:text-[#d97757]">
                      {user.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#e8e0d4]/60 dark:border-[#352f29]/60 text-[11px]">
                    <span className="text-[#756c63] dark:text-[#a59b90]">Wallet Balance:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(user.walletBalance)}</span>
                  </div>

                  {/* Superadmin shortcut if applicable */}
                  {user.role === "admin" && user.email?.toLowerCase().trim() === "dks45000000@gmail.com" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Superadmin Console</span>
                      </div>
                    </Link>
                  )}

                  {/* Merchant shortcut if seller */}
                  {user.role === "seller" && (
                    <Link
                      href="/seller"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>Merchant Hub</span>
                      </div>
                    </Link>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAccountSwitcherModal();
                      }}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-[#f0eae0] dark:bg-[#28231e] text-[11px] font-semibold text-[#241f1c] dark:text-[#f4ece1] hover:opacity-90 cursor-pointer"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Switch</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:opacity-90 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1e1a16] border border-[#e8e0d4] dark:border-[#352f29] shadow-xs space-y-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-[#241f1c] dark:text-[#f4ece1]">Join Criation</h4>
                    <p className="text-[11px] text-[#756c63] dark:text-[#a59b90]">
                      Get ₹100 shopping credit on signup!
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#e8e0d4] dark:border-[#352f29] text-xs font-semibold text-[#241f1c] dark:text-[#f4ece1] hover:bg-[#f0eae0] dark:hover:bg-[#231f1b]"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#c25e3f] via-[#b58334] to-[#c25e3f] text-white text-xs font-semibold shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        item.isActive
                          ? "bg-[#c25e3f] text-white shadow-xs"
                          : "text-[#241f1c] dark:text-[#f4ece1] hover:bg-[#f0eae0] dark:hover:bg-[#231f1b]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.isActive
                              ? "bg-white text-[#c25e3f]"
                              : "bg-[#c25e3f] text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );

                  if (item.action) {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          item.action!();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left cursor-pointer"
                      >
                        {content}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href!}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {content}
                    </Link>
                  );
                })}
              </nav>

              {/* Currency Selector on Mobile Drawer */}
              <div className="pt-2 border-t border-[#e8e0d4] dark:border-[#352f29]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#756c63] dark:text-[#a59b90] px-1 pb-1.5">
                  Select Currency
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["INR", "USD", "EUR", "GBP"] as CurrencyCode[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        currency === c
                          ? "bg-[#c25e3f] text-white shadow-xs"
                          : "bg-white dark:bg-[#1e1a16] border border-[#e8e0d4] dark:border-[#352f29] text-[#756c63] dark:text-[#a59b90]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="pt-4 border-t border-[#e8e0d4] dark:border-[#352f29] text-[11px] text-[#756c63] dark:text-[#a59b90] flex items-center justify-between">
              <span>© 2026 Criation Platform</span>
              <span className="font-semibold text-[#c25e3f] dark:text-[#d97757]">v1.0 Mobile Web</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
