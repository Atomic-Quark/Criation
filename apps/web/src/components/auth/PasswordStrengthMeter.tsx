"use client";

import React from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  let label = "Weak";
  let color = "bg-rose-500";
  if (score === 2) {
    label = "Fair";
    color = "bg-amber-500";
  } else if (score === 3) {
    label = "Good";
    color = "bg-indigo-500";
  } else if (score >= 4) {
    label = "Strong";
    color = "bg-emerald-500";
  }

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-[10px] text-zinc-400">
        <span>Password Security</span>
        <span className="font-bold">{label}</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-full flex-1 rounded-full transition-all ${
              score >= i ? color : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
