"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { SUPPORTED_COUNTRIES, CountryTelecomInfo } from "@/lib/auth/phoneValidation";

interface CountryCodeSelectProps {
  value: string; // e.g. "+91"
  onChange: (country: CountryTelecomInfo) => void;
  disabled?: boolean;
}

export function CountryCodeSelect({
  value,
  onChange,
  disabled = false,
}: CountryCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    SUPPORTED_COUNTRIES.find((c) => c.dialCode === value) || SUPPORTED_COUNTRIES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="h-full px-3 py-3 rounded-l-xl bg-zinc-800/90 hover:bg-zinc-800 border-r border-zinc-700 text-zinc-100 flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-amber-500"
        aria-label="Select Country Dial Code"
      >
        <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
        <span className="font-mono text-zinc-200">{selectedCountry.dialCode}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-64 max-h-64 overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 scrollbar-thin">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 mb-1">
            Select Country / Region
          </div>
          {SUPPORTED_COUNTRIES.map((c) => {
            const isSelected = c.dialCode === selectedCountry.dialCode && c.code === selectedCountry.code;
            return (
              <button
                key={`${c.code}-${c.dialCode}`}
                type="button"
                onClick={() => {
                  onChange(c);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-amber-950/70 text-amber-300 font-bold border border-amber-800/50"
                    : "text-zinc-300 hover:bg-zinc-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base select-none">{c.flag}</span>
                  <div className="truncate">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">{c.hint}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <span className="font-mono text-zinc-400 text-[11px]">{c.dialCode}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
