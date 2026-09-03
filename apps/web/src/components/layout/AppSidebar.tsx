"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  Home,
  ShoppingBag,
  Layers,
  Flame,
  TrendingUp,
  Crown,
  Sparkles,
  Heart,
  Package,
  Wallet,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  User,
  Store,
  Truck,
  ShieldCheck,
  X,
} from "lucide-react";
import { Role } from "@/types/store";

export function AppSidebar() {
  const pathname = usePathname();
  const {
    categories,
    wishlist,
    cart,
    user,
    switchRole,
    formatPrice,
    isSidebarHovered,
    setIsSidebarHovered,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useStore();

  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const isExpanded = isSidebarHovered;

  const roles: { role: Role; label: string; icon: any; color: string; badge: string }[] = [
    { role: "customer", label: "Customer Mode", icon: User, color: "text-emerald-500", badge: "Shopper" },
    { role: "seller", label: "Merchant Hub", icon: Store, color: "text-indigo-500", badge: "Seller" },
    { role: "supplier", label: "Wholesale Supplier", icon: Truck, color: "text-amber-500", badge: "Supplier" },
    { role: "admin", label: "Superadmin Center", icon: ShieldCheck, color: "text-rose-500", badge: "Admin" },
  ];

  // 1. Collapsed Mini-Rail Items
  const miniRailItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/products", icon: ShoppingBag },
    { label: "Collections", href: "/products", icon: Layers },
    { label: "Deals", href: "/deals", icon: Flame, iconColor: "text-amber-500" },
    { label: "Dropship", href: "/dropship", icon: TrendingUp, iconColor: "text-indigo-500" },
    { label: "Prime", href: "/subscription", icon: Crown, iconColor: "text-amber-500" },
    { label: "AI Suite", href: "/ai-tools", icon: Sparkles, iconColor: "text-purple-500" },
    { label: "You", href: "/account", icon: User },
  ];

  // 2. Expanded Sidebar Primary Links
  const mainNavItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop All Products", href: "/products", icon: ShoppingBag },
    { label: "Flash Deals", href: "/deals", icon: Flame, badge: "HOT", badgeClass: "bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black shadow-xs animate-pulse" },
    { label: "Dropship Hub", href: "/dropship", icon: TrendingUp, badge: "B2B", badgeClass: "bg-indigo-600 text-white font-bold" },
    { label: "VIP Prime Club", href: "/subscription", icon: Crown, badge: "PRO", badgeClass: "bg-amber-400 text-zinc-950 font-black shadow-xs" },
    { label: "Criation AI Suite", href: "/ai-tools", icon: Sparkles, badge: "GenAI", badgeClass: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold" },
  ];

  // Category Color Palette for aesthetic bullet dots
  const categoryGlowColors = [
    "bg-rose-500 shadow-rose-500/50",
    "bg-amber-500 shadow-amber-500/50",
    "bg-indigo-500 shadow-indigo-500/50",
    "bg-purple-500 shadow-purple-500/50",
    "bg-emerald-500 shadow-emerald-500/50",
    "bg-cyan-500 shadow-cyan-500/50",
    "bg-pink-500 shadow-pink-500/50",
  ];

  // 3. You / Account items
  const youItems = [
    {
      label: "My Orders",
      href: "/orders",
      icon: Package,
      iconBg: "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Saved Wishlist",
      href: "/wishlist",
      icon: Heart,
      iconBg: "bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400",
      badge: wishlist.length > 0 ? wishlist.length : undefined,
      badgeClass: "bg-rose-500 text-white font-bold",
    },
    {
      label: "Criation Wallet",
      href: "/wallet",
      icon: Wallet,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400",
      badge: formatPrice(user.walletBalance),
      badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold",
    },
    {
      label: "24/7 Support",
      href: "/support",
      icon: HelpCircle,
      iconBg: "bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400",
    },
  ];

  const currentRoleConfig = roles.find((r) => r.role === user.role) || roles[0];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP SIDEBAR                                                        */}
      {/* ========================================================================= */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => {
          setIsSidebarHovered(false);
          setIsRoleMenuOpen(false);
        }}
        className={`hidden md:flex flex-col fixed top-16 sm:top-20 bottom-0 left-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-200/80 dark:border-zinc-800/80 transition-[width] duration-300 ease-in-out select-none overflow-hidden ${
          isExpanded ? "w-[250px] shadow-2xl z-50" : "w-[72px]"
        }`}
      >
        {!isExpanded ? (
          /* ----------------------------------------------------------------- */
          /* COLLAPSED MINI-RAIL: Balanced vertical tiles + Docked User Avatar */
          /* ----------------------------------------------------------------- */
          <div className="flex-1 flex flex-col justify-between h-full py-2 px-1.5 overflow-hidden">
            {/* Top Navigation Items */}
            <div className="space-y-1 w-full overflow-y-auto scrollbar-none">
              {miniRailItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`w-full flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs"
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                    title={item.label}
                  >
                    {/* Active Accent Glow Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-indigo-600 to-purple-600" />
                    )}

                    <Icon
                      className={`w-5 h-5 mb-1 transition-transform duration-200 group-hover:scale-110 ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : item.iconColor || "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                      }`}
                    />
                    <span className="text-[10px] leading-tight text-center truncate max-w-full font-medium tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Bottom Docked User Profile Avatar */}
            <div className="pt-2 pb-1 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col items-center shrink-0">
              <Link
                href="/account"
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md hover:scale-105 transition-transform relative group cursor-pointer"
                title={`${user.name} (${currentRoleConfig.label})`}
              >
                {user.name.charAt(0).toUpperCase()}
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900 absolute -bottom-0.5 -right-0.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* ----------------------------------------------------------------- */
          /* EXPANDED FULL SIDEBAR: Rich Luxury Navigation Drawer              */
          /* ----------------------------------------------------------------- */
          <div className="w-[250px] flex-1 flex flex-col justify-between h-full overflow-hidden">
            {/* Scrollable Navigation Body */}
            <div className="flex-1 py-3 px-3 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              {/* Section 1: Main Core Links */}
              <div className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group relative ${
                        isActive
                          ? "bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 hover:text-zinc-950 dark:hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />
                      )}

                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md shrink-0 ${item.badgeClass}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />

              {/* Section 2: Collections */}
              <div className="space-y-1">
                <Link
                  href="/products"
                  className="flex items-center justify-between px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                    <span>Collections</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <div className="space-y-0.5 pt-0.5">
                  {categories.slice(0, isCategoriesExpanded ? 7 : 4).map((cat, idx) => {
                    const isActive = pathname === `/products?category=${cat.slug}`;
                    const dotGlow = categoryGlowColors[idx % categoryGlowColors.length];

                    return (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors group ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotGlow} group-hover:scale-125 transition-transform`} />
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold px-1.5 py-0.5 rounded-md bg-zinc-100/80 dark:bg-zinc-800/80 shrink-0">
                          {cat.productCount}
                        </span>
                      </Link>
                    );
                  })}

                  {categories.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                      className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors cursor-pointer mt-1"
                    >
                      {isCategoriesExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Show fewer</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Show {categories.length - 4} more</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />

              {/* Section 3: You */}
              <div className="space-y-1">
                <Link
                  href="/account"
                  className="flex items-center justify-between px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                    <span>You</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <div className="space-y-0.5 pt-0.5">
                  {youItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors group ${
                          isActive
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeClass || ""}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pinned Bottom User Card & Role Switcher */}
            <div className="p-2.5 border-t border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-md shrink-0 relative">
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="w-full flex items-center justify-between p-2 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 text-left hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white font-black text-xs shadow-xs relative shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-800 absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold capitalize truncate">
                      {currentRoleConfig.label}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isRoleMenuOpen ? "rotate-180 text-indigo-600" : ""}`} />
              </button>

              {/* Role Switcher Menu Popup */}
              {isRoleMenuOpen && (
                <div className="absolute bottom-full left-2 right-2 mb-2 p-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-zinc-700/60 pb-1 mb-1">
                    Switch Workspace Role
                  </div>
                  {roles.map((r) => {
                    const RoleIcon = r.icon;
                    const isCurrent = user.role === r.role;
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => {
                          switchRole(r.role);
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isCurrent
                            ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <RoleIcon className={`w-4 h-4 ${r.color}`} />
                          <span>{r.label}</span>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                          isCurrent
                            ? "bg-indigo-600 text-white"
                            : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                        }`}>
                          {r.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE / TABLET DRAWER (Slide-Over Navigation)                         */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-in fade-in duration-200 md:hidden"
          />

          {/* Slide-over Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-zinc-900 z-50 shadow-2xl border-r border-zinc-200 dark:border-zinc-800 flex flex-col animate-in slide-in-from-left duration-250 md:hidden">
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
                  C
                </div>
                <span className="font-black text-lg tracking-tight text-zinc-950 dark:text-white leading-none">
                  Criation<span className="text-amber-500">.</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Content */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
              <div className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-zinc-500"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${item.badgeClass}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="h-px bg-zinc-200 dark:border-zinc-800 mx-1" />

              <div>
                <div className="px-3 py-1 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Collections
                </div>
                <div className="space-y-0.5 mt-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{cat.productCount}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="h-px bg-zinc-200 dark:border-zinc-800 mx-1" />

              <div>
                <div className="px-3 py-1 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  You
                </div>
                <div className="space-y-0.5 mt-1">
                  {youItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-zinc-500" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeClass || ""}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
