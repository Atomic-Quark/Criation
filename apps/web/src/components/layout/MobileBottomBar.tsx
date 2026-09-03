"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Home, Grid, TrendingUp, Heart, ShoppingBag, User } from "lucide-react";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { cart, wishlist, setIsMiniCartOpen } = useStore();

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Shop", icon: Grid },
    { href: "/wishlist", label: "Wishlist", icon: Heart, badge: wishlist.length },
    {
      action: () => setIsMiniCartOpen(true),
      label: "Cart",
      icon: ShoppingBag,
      badge: totalCartCount,
    },
    { href: "/account", label: "Account", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 lg:hidden px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item, idx) => {
          const isActive = item.href ? pathname === item.href : false;
          const Icon = item.icon;

          if (item.action) {
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center justify-center p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors relative min-w-[54px]"
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 text-[9px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href!}
              className={`flex flex-col items-center justify-center p-1.5 transition-colors relative min-w-[54px] ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
