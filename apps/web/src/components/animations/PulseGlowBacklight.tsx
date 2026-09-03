"use client";

import React from "react";

interface PulseGlowBacklightProps {
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PulseGlowBacklight({
  color = "bg-indigo-500/20",
  size = "md",
  className = "",
}: PulseGlowBacklightProps) {
  const sizeClasses = {
    sm: "w-36 h-36 blur-xl",
    md: "w-64 h-64 blur-2xl",
    lg: "w-96 h-96 blur-3xl",
    xl: "w-[30rem] h-[30rem] blur-[80px]",
  };

  return (
    <div
      className={`absolute rounded-full pointer-events-none animate-pulse-soft ${color} ${sizeClasses[size]} ${className}`}
    />
  );
}
