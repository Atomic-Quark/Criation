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

      {/* GitHub-Style Card Modal */}
      <div className="relative w-full max-w-md bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-zinc-100 font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Select account to sign out
          </h2>
          <button
            type="button"
            onClick={closeAccountSignOutModal}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
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
                    className="flex items-center justify-between p-4 hover:bg-[#1c2128]/70 transition-colors gap-3"
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
                        <div className="flex items-center gap-1.5">
                          {isActive ? (
                            <span className="text-xs text-zinc-400 font-medium">
                              Signed in as
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-500 font-medium">
                              Signed in on device
                            </span>
                          )}
                          {acc.role === "admin" && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Admin
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-white truncate">
                          {acc.name}
                        </p>

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
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => switchAccount(acc.email)}
                          className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 transition-colors flex items-center gap-1 cursor-pointer"
                          title={`Switch to ${acc.name}`}
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Switch</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => signOutAccount(acc.email)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#21262d] hover:bg-[#30363d] text-zinc-200 border border-[#363b42] transition-colors cursor-pointer"
                      >
                        Sign out
                      </button>
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
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-zinc-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-zinc-400" />
            <span>Use another account</span>
          </Link>

          {/* Sign out from all accounts Button (Matching GitHub Red Accent) */}
          <button
            type="button"
            onClick={signOutAllAccounts}
            className="w-full py-3 px-4 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-[#f85149] hover:text-[#ff7b72] text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out from all accounts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
