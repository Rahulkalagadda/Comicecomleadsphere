"use client";

import React from "react";
import { useTheme } from "@/lib/theme/ThemeContext";
import { BookOpen, Sparkles, Trees } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
  variant?: "pill" | "dropdown" | "compact";
}

export function ThemeSwitcher({ className = "", variant = "pill" }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => setTheme(theme === "executive" ? "jungle" : "executive")}
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-heading text-xs font-semibold nm-button transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token",
          theme === "jungle"
            ? "bg-surface-primary text-[#2CE0C9]"
            : "bg-surface-primary text-accent-gold",
          className
        )}
        aria-label={`Current theme is ${theme}. Click to switch theme.`}
        title={`Switch to ${theme === "executive" ? "Canopy Studio" : "Obsidian Boardroom"} Theme`}
      >
        {theme === "executive" ? (
          <>
            <BookOpen className="w-3.5 h-3.5 text-brand-token" />
            <span className="tracking-wide">Boardroom</span>
          </>
        ) : (
          <>
            <Trees className="w-3.5 h-3.5 text-[#2CE0C9]" />
            <span className="tracking-wide">Canopy</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme selector"
      className={cn(
        "inline-flex items-center p-1 rounded-full nm-inset-control bg-surface-secondary/90 select-none",
        className
      )}
    >
      <button
        type="button"
        id="theme-btn-jungle"
        onClick={() => setTheme("jungle")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-heading text-xs transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token",
          theme === "jungle"
            ? "nm-button bg-[#13251F] text-[#F5C451] font-semibold shadow-sm border border-[#F5C451]/35"
            : "text-secondary-token hover:text-primary-token font-medium opacity-85 hover:opacity-100"
        )}
        aria-pressed={theme === "jungle"}
      >
        <Trees className={cn("w-3.5 h-3.5", theme === "jungle" ? "text-[#2CE0C9]" : "text-secondary-token")} />
        <span className="flex items-center gap-1 tracking-wide">
          Jungle Canopy
          <Sparkles className={cn("w-2.5 h-2.5", theme === "jungle" ? "text-[#F5C451]" : "text-accent-gold")} />
        </span>
      </button>

      <button
        type="button"
        id="theme-btn-executive"
        onClick={() => setTheme("executive")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-heading text-xs transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token",
          theme === "executive"
            ? "nm-button bg-surface-primary text-primary-token font-semibold shadow-sm border border-[#F5C451]/35"
            : "text-secondary-token hover:text-primary-token font-medium opacity-85 hover:opacity-100"
        )}
        aria-pressed={theme === "executive"}
      >
        <BookOpen className={cn("w-3.5 h-3.5", theme === "executive" ? "text-brand-token" : "text-secondary-token")} />
        <span className="tracking-wide">Boardroom</span>
      </button>
    </div>
  );
}
