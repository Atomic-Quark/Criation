"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  CreditCard,
  Sparkles,
  ShieldAlert,
  Megaphone,
  Settings,
  X,
  ExternalLink,
} from "lucide-react";
import { NotificationItem } from "@/types/store";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"all" | "order" | "dropship" | "system">("all");

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    return n.type === activeTab;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "order":
        return <Package className="w-4 h-4 text-emerald-400" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-indigo-400" />;
      case "dropship":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case "security":
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "marketing":
        return <Megaphone className="w-4 h-4 text-purple-400" />;
      default:
        return <Settings className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <>
      {/* Invisible Backdrop to close on outside click */}
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />

      {/* Dropdown Panel Aligned Directly Under Bell */}
      <div className="absolute top-full right-0 sm:-right-8 mt-3 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] z-50 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-900/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-950 dark:text-white text-sm flex items-center gap-1.5">
                Notifications
                {unreadNotificationCount > 0 && (
                  <span className="px-2 py-0.2 text-[10px] font-black bg-indigo-600 text-white rounded-full">
                    {unreadNotificationCount} new
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Live order updates & dropship alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                <CheckCheck className="w-4 h-4 text-indigo-500" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                title="Clear all"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-2 border-b border-zinc-100 dark:border-zinc-800 text-xs overflow-x-auto no-scrollbar bg-zinc-50/40 dark:bg-zinc-900/40 shrink-0">
          {(
            [
              { id: "all", label: "All" },
              { id: "order", label: "Orders" },
              { id: "dropship", label: "Dropship" },
              { id: "system", label: "System" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-xs font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center mx-auto mb-3 text-zinc-400">
                <Bell className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No notifications</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px] mx-auto">
                You're all caught up on all orders, payments, and artisan news.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-4 flex items-start gap-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer relative ${
                  !item.isRead ? "bg-indigo-50/30 dark:bg-indigo-950/20" : ""
                }`}
              >
                {!item.isRead && (
                  <span className="absolute top-4.5 right-4 w-2 h-2 rounded-full bg-indigo-600" />
                )}

                <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>

                  {item.link && (
                    <Link
                      href={item.link}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-2"
                    >
                      View Details <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Priority Alert Engine v2.6</span>
          <Link
            href="/account"
            onClick={onClose}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Manage Channels →
          </Link>
        </div>
      </div>
    </>
  );
}
