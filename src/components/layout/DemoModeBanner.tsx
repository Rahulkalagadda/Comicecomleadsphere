"use client";

import React, { useEffect, useState } from "react";
import { isDemoMode, setDemoMode } from "@/lib/api/client";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export function DemoModeBanner() {
  const [demo, setDemo] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isProd = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (isProd) return;
    setMounted(true);
    setDemo(isDemoMode());

    const handleUpdate = () => setDemo(isDemoMode());
    window.addEventListener("demo-mode-changed", handleUpdate);
    return () => window.removeEventListener("demo-mode-changed", handleUpdate);
  }, [isProd]);

  if (isProd || !mounted) return null;

  return (
    <div
      role="region"
      aria-label="API Integration Mode Banner"
      className="bg-surface-secondary/90 border-b border-theme text-xs py-1.5 px-4 flex items-center justify-between text-secondary-token transition-colors duration-200"
    >
      <div className="flex items-center gap-2">
        {demo ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-gold/15 text-accent-gold font-heading font-semibold text-[11px] uppercase tracking-[0.04em] border border-accent-gold/30">
            <ShieldCheck className="w-3 h-3" />
            DEMO MODE (Simulated Backend)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2CE0C9]/15 text-[#2CE0C9] font-heading font-semibold text-[11px] uppercase tracking-[0.04em] border border-[#2CE0C9]/30">
            <CheckCircle2 className="w-3 h-3" />
            LIVE API MODE
          </span>
        )}
        <span className="hidden sm:inline text-muted-token">
          {demo
            ? "Simulating Razorpay orders, 10-page preview boundaries & library entitlements."
            : "Calling configured NEXT_PUBLIC_API_BASE_URL endpoints."}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs select-none">
          <span>Demo Data</span>
          <input
            type="checkbox"
            checked={demo}
            onChange={(e) => setDemoMode(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-brand cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
