"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme/ThemeContext";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const { theme } = useTheme();

  const badgeSize =
    size === "lg" ? "w-14 h-14 rounded-2xl p-1" : size === "sm" ? "w-8 h-8 rounded-lg p-0.5" : "w-10 h-10 rounded-xl p-0.5";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group select-none text-left focus:outline-none ${className}`}
      aria-label="LeadSphere Solutions - Return to Homepage"
    >
      <div
        className={`flex items-center justify-center bg-white border border-[#F5C451]/45 shadow-sm overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105 ${badgeSize}`}
      >
        <img
          src="/images/leadsphere-logo.jpg"
          alt="LeadSphere Solutions Logo"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex flex-col">
        <span className="font-heading font-bold tracking-[0.06em] text-primary-token leading-none text-base sm:text-lg">
          LEADSPHERE
        </span>
        <span className="text-[10px] sm:text-[11px] tracking-[0.09em] uppercase text-[#2CE0C9] font-semibold leading-none mt-1">
          {theme === "executive" ? "Solutions • Boardroom" : "Solutions • AI Jungle"}
        </span>
      </div>
    </Link>
  );
}
