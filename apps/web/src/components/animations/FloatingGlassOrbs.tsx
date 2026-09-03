"use client";

import React from "react";

interface FloatingGlassOrbsProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  className?: string;
}

export function FloatingGlassOrbs({
  primaryColor = "bg-indigo-600/25",
  secondaryColor = "bg-purple-600/20",
  accentColor = "bg-amber-500/15",
  className = "",
}: FloatingGlassOrbsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Primary Floating Glowing Orb */}
      <div
        className={`absolute -top-20 -left-20 w-80 sm:w-96 h-80 sm:h-96 ${primaryColor} rounded-full blur-3xl animate-pulse-soft`}
      />

      {/* Secondary Ambient Accent Orb */}
      <div
        className={`absolute top-1/3 -right-20 w-80 sm:w-96 h-80 sm:h-96 ${secondaryColor} rounded-full blur-3xl animate-pulse-soft`}
        style={{ animationDelay: "2.5s" }}
      />

      {/* Tertiary Deep Orb */}
      <div
        className={`absolute -bottom-20 left-1/4 w-80 sm:w-96 h-80 sm:h-96 ${accentColor} rounded-full blur-3xl animate-pulse-soft`}
        style={{ animationDelay: "4s" }}
      />

      {/* Subtle Geometric Matrix Dots */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}
