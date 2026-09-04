"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, DeviceAccount } from "@/context/StoreContext";
import {
  X,
  Plus,
  Monitor,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  LogOut,
  ArrowRightLeft,
} from "lucide-react";

export function MultiAccountSignOutModal() {
  const router = useRouter();
  const {
    user,
    deviceAccounts,
    isAccountSignOutModalOpen,
    closeAccountSignOutModal,
    signOutAccount,
    signOutAllAccounts,
    switchAccount,
  } = useStore();

  if (!isAccountSignOutModalOpen) return null;

  // Combine deviceAccounts with current user if not already in list
  const currentEmail = user?.email?.toLowerCase().trim();
  const accountsToDisplay: DeviceAccount[] = [...deviceAccounts];

  if (
    user?.isAuthenticated &&
    user?.email &&
    !accountsToDisplay.some((a) => a.email.toLowerCase() === currentEmail)
  ) {
    accountsToDisplay.unshift({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "/products/craft-item-01.jpeg",
      role: user.role,
      lastLoginIp: (user as any).lastLoginIp || "127.0.0.1",
      deviceInfo: "Windows PC (Current)",
      lastActive: "Active now",
      isActive: true,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeAccountSignOutModal}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Card Modal */}
      <div className="relative w-full max-w-md bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-zinc-100 font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-[#30363d]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-700/40 flex items-center justify-center text-indigo-400">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Switch Account
              </h2>
              <p className="text-xs text-zinc-400">
                Choose an account on this device or add a new one
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAccountSignOutModal}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Accounts Card List */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden divide-y divide-[#30363d]">
            {accountsToDisplay.length === 0 ? (
              <div className="p-6 text-center text-sm text-zinc-400">
                No active accounts registered on this device.
              </div>
            ) : (
              accountsToDisplay.map((acc) => {
                const isActive = acc.email.toLowerCase() === currentEmail;

                return (
                  <div
                    key={acc.email}
                    className={`flex items-center justify-between p-4 transition-colors gap-3 ${
                      isActive ? "bg-indigo-950/20" : "hover:bg-[#1c2128]/70"
                    }`}
                  >
                    {/* Account Info */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-zinc-700/60 shrink-0 bg-zinc-800">
                        <Image
                          src={acc.avatar || "/products/craft-item-01.jpeg"}
                          alt={acc.name}
                          fill
                          className="object-cover"
                        />
                        {isActive && (
                          <div
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#161b22]"
                            title="Active Account"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white truncate">
                            {acc.name}
                          </p>
                          {isActive ? (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Active
                            </span>
                          ) : null}
                          {acc.role === "admin" && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Admin
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400 truncate">
                          <span className="truncate">{acc.email}</span>
                          <span>•</span>
                          <span className="text-zinc-500 flex items-center gap-1 shrink-0 font-mono text-[10px]">
                            <Monitor className="w-3 h-3 text-zinc-500" />
                            {acc.lastLoginIp || "127.0.0.1"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={() => switchAccount(acc.email)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title={`Switch to ${acc.name}`}
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          <span>Switch</span>
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-emerald-400/90 px-2 py-1">
                          Current
                        </span>
                      )}

                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => signOutAccount(acc.email)}
                          className="px-2 py-1.5 text-xs font-medium rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Remove from device"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Add Another Account Button */}
          <Link
            href="/auth/login"
            onClick={closeAccountSignOutModal}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-zinc-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-zinc-400" />
            <span>Sign in to another account</span>
          </Link>

          {/* Sign out from all accounts Button */}
          <button
            type="button"
            onClick={signOutAllAccounts}
            className="w-full py-2.5 px-4 rounded-xl bg-[#161b22]/50 hover:bg-[#21262d] border border-zinc-800 text-[#f85149] hover:text-[#ff7b72] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out from all accounts on this device</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { MultiAccountSignOutModal as AccountSwitcherModal };

