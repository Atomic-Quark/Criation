"use client";

import React from "react";
import { Sparkles, Heart } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const logoSizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* Orbit Ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 p-0.5 animate-spin-slow shadow-md">
          <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[14px]" />
        </div>

        {/* Central Logo */}
        <div className={`relative ${logoSizes[size]} rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black flex items-center justify-center shadow-xs animate-pulse`}>
          C
        </div>

        {/* Float Sparkle */}
        {size !== "sm" && (
          <div className="absolute -top-1.5 -right-1.5 p-1 rounded-lg bg-amber-500 text-white shadow-xs animate-float">
            <Sparkles className="w-3 h-3" />
          </div>
        )}
      </div>

      {text && (
        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
}
