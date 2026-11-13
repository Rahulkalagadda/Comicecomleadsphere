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
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-heading text-xs font-medium transition-all duration-200 cursor-pointer border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-white",
          className
        )}
        aria-label={`Current theme is ${theme}. Click to switch theme.`}
        title={`Switch to ${theme === "executive" ? "Canopy Studio" : "Boardroom"} Theme`}
      >
        <span
          className={cn(
            "w-2 h-2 rounded-full",
            theme === "jungle" ? "bg-emerald-400" : "bg-sky-400"
          )}
        />
        <span className="font-sniglet tracking-wide text-xs">
          {theme === "executive" ? "Boardroom" : "Canopy"}
        </span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme selector"
      className={cn(
        "inline-flex items-center p-0.5 rounded-full bg-white/[0.03] border border-white/[0.08] select-none",
        className
      )}
    >
      <button
        type="button"
        id="theme-btn-jungle"
        onClick={() => setTheme("jungle")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full font-heading text-xs transition-all duration-200 cursor-pointer focus-visible:outline-none",
          theme === "jungle"
            ? "bg-white/[0.08] text-white font-medium border border-white/[0.1] shadow-sm"
            : "text-white/60 hover:text-white font-normal"
        )}
        aria-pressed={theme === "jungle"}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            theme === "jungle" ? "bg-emerald-400" : "bg-emerald-400/40"
          )}
        />
        <span className="font-sniglet tracking-wide text-xs">Canopy</span>
      </button>

      <button
        type="button"
        id="theme-btn-executive"
        onClick={() => setTheme("executive")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full font-heading text-xs transition-all duration-200 cursor-pointer focus-visible:outline-none",
          theme === "executive"
            ? "bg-white/[0.08] text-white font-medium border border-white/[0.1] shadow-sm"
            : "text-white/60 hover:text-white font-normal"
        )}
        aria-pressed={theme === "executive"}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            theme === "executive" ? "bg-sky-400" : "bg-sky-400/40"
          )}
        />
        <span className="font-sniglet tracking-wide text-xs">Boardroom</span>
      </button>
    </div>
  );
}
