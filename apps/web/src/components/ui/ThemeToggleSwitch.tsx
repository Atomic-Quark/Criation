"use client";

import React from "react";

interface ThemeToggleSwitchProps {
  theme: "light" | "dark";
  onToggle: () => void;
  className?: string;
}

export function ThemeToggleSwitch({ theme, onToggle, className = "" }: ThemeToggleSwitchProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={isDark}
      suppressHydrationWarning={true}
      aria-label="Toggle light and dark theme"
      title="Switch between Golden Dawn (Light) and Starry Midnight (Dark)"
      className={`theme-toggle-btn relative inline-flex items-center w-[70px] h-[32px] rounded-full p-1 cursor-pointer select-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),inset_0_-1px_2px_rgba(255,255,255,0.2),0_2px_6px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/10 shrink-0 ${className}`}
    >
      {/* 1. BACKDROPS: Concentric Aura Waves behind Sun / Moon */}
      <div className="theme-toggle-aura absolute top-0 bottom-0 pointer-events-none">
        {/* Outer Aura Ring */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: "80px",
            height: "80px",
            left: "-16px",
            backgroundColor: "rgba(255, 255, 255, 0.12)",
          }}
        />
        {/* Mid Aura Ring */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: "56px",
            height: "56px",
            left: "-4px",
            backgroundColor: "rgba(255, 255, 255, 0.18)",
          }}
        />
        {/* Inner Aura Ring */}
        <div
          className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: "36px",
            height: "36px",
            left: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.25)",
          }}
        />
      </div>

      {/* 2. STARS (Night Mode Layer): Twinkling soft stars & constellations */}
      <div className="theme-toggle-stars absolute inset-0 pointer-events-none">
        {/* Star 1 */}
        <span
          className="absolute top-[6px] left-[10px] w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#fff] animate-pulse"
          style={{ animationDuration: "1.6s" }}
        />
        {/* Star 2 */}
        <span
          className="absolute top-[17px] left-[14px] w-1.5 h-1.5 rounded-full bg-indigo-100 shadow-[0_0_4px_#93c5fd] animate-pulse"
          style={{ animationDuration: "2.1s", animationDelay: "0.4s" }}
        />
        {/* Star 3 */}
        <span className="absolute top-[9px] left-[24px] w-0.5 h-0.5 rounded-full bg-white shadow-[0_0_3px_#fff]" />
        {/* Star 4 */}
        <span
          className="absolute top-[19px] left-[28px] w-1 h-1 rounded-full bg-blue-200 shadow-[0_0_3px_#60a5fa] animate-pulse"
          style={{ animationDuration: "1.9s", animationDelay: "0.8s" }}
        />
        {/* Star 5 */}
        <span className="absolute top-[7px] left-[35px] w-0.5 h-0.5 rounded-full bg-white opacity-80" />
      </div>

      {/* 3. CLOUDS (Day Mode Layer): Layered fluffy white clouds drifting softly */}
      <div className="theme-toggle-clouds absolute inset-0 pointer-events-none">
        {/* Cloud Back Layer */}
        <div className="absolute -bottom-1 right-3 flex items-end opacity-60">
          <div className="w-4 h-4 rounded-full bg-[#d0e6f8] -mr-1.5" />
          <div className="w-5 h-5 rounded-full bg-[#d0e6f8] -mr-1.5 mb-1" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#d0e6f8]" />
        </div>

        {/* Cloud Mid Layer */}
        <div className="absolute -bottom-1.5 -right-0.5 flex items-end opacity-85">
          <div className="w-4 h-4 rounded-full bg-white -mr-1.5" />
          <div className="w-6 h-6 rounded-full bg-white -mr-2 mb-0.5" />
          <div className="w-5 h-5 rounded-full bg-white -mr-1.5" />
          <div className="w-3.5 h-3.5 rounded-full bg-white" />
        </div>

        {/* Cloud Front Fluff */}
        <div className="absolute -bottom-2.5 right-2 flex items-end">
          <div className="w-5 h-5 rounded-full bg-[#f8fbff] -mr-1" />
          <div className="w-7 h-7 rounded-full bg-[#f8fbff] -mr-1.5 mb-1" />
          <div className="w-4.5 h-4.5 rounded-full bg-[#f8fbff]" />
        </div>
      </div>

      {/* 4. SUN / MOON CELESTIAL ORB: Smooth Sliding 3D Sphere */}
      <div className="theme-toggle-orb relative z-20 w-[24px] h-[24px] rounded-full flex items-center justify-center pointer-events-none">
        {/* Moon Craters (Visible in Dark Mode via html.dark CSS) */}
        <div className="theme-toggle-craters absolute inset-0 pointer-events-none">
          {/* Crater 1 */}
          <span className="absolute top-[4px] left-[5px] w-[5px] h-[5px] rounded-full bg-[#64748b]/60 shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.5)]" />
          {/* Crater 2 */}
          <span className="absolute bottom-[5px] left-[9px] w-[6px] h-[6px] rounded-full bg-[#64748b]/50 shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.4)]" />
          {/* Crater 3 */}
          <span className="absolute top-[8px] right-[4px] w-[3.5px] h-[3.5px] rounded-full bg-[#64748b]/50 shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.4)]" />
        </div>

        {/* Sun Flare Specular Point (Visible in Light Mode via html.dark CSS) */}
        <div className="theme-toggle-sunflare absolute inset-0 pointer-events-none">
          <span className="absolute top-[3px] left-[4px] w-[5px] h-[5px] rounded-full bg-white/70 blur-[0.5px]" />
        </div>
      </div>
    </button>
  );
}
