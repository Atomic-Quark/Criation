"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "bg-emerald-950/90 text-emerald-100 border-emerald-700/50 shadow-emerald-950/30"
              : toast.type === "error"
              ? "bg-rose-950/90 text-rose-100 border-rose-700/50 shadow-rose-950/30"
              : toast.type === "warning"
              ? "bg-amber-950/90 text-amber-100 border-amber-700/50 shadow-amber-950/30"
              : "bg-zinc-900/90 text-zinc-100 border-zinc-700/50 shadow-black/40"
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-indigo-400" />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold tracking-tight">{toast.title}</p>
            {toast.message && (
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed break-words">{toast.message}</p>
            )}
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity hover:bg-white/10 shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
