"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Shield, Key, Sliders, Globe } from "lucide-react";

export function AdminSettings() {
  const [apiBaseUrl, setApiBaseUrl] = useState(process.env.NEXT_PUBLIC_API_BASE_URL || "");
  const [razorpayKey, setRazorpayKey] = useState("rzp_live_vance_corp_9901");
  const [previewLimit, setPreviewLimit] = useState(10);
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif-editorial font-semibold tracking-[-0.025em] text-primary-token leading-[1.15]">
          Platform &amp; Integration Settings
        </h1>
        <p className="text-sm text-secondary-token mt-1 leading-relaxed">
          Configure production API endpoints, Razorpay merchant credentials, and global preview policies.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="p-6 sm:p-8 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-xs font-semibold font-heading text-primary-token uppercase tracking-[0.06em] flex items-center gap-2">
            <Globe className="w-4 h-4 text-accent-gold" />
            Backend API Configuration
          </h2>

          <div>
            <label className="font-heading text-xs font-semibold text-primary-token block mb-1.5">
              Backend API Base URL (NEXT_PUBLIC_API_BASE_URL)
            </label>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              placeholder="https://api.leadsphere.press"
              className="w-full px-3 py-2 rounded-lg border border-theme bg-surface-secondary font-mono text-xs text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
            />
            <p className="text-[11px] text-secondary-token mt-1.5 leading-relaxed">
              Leave blank to operate in high-fidelity mock demo simulation mode.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-theme">
          <h2 className="text-xs font-semibold font-heading text-primary-token uppercase tracking-[0.06em] flex items-center gap-2">
            <Key className="w-4 h-4 text-accent-gold" />
            Payment Gateway (Razorpay)
          </h2>

          <div>
            <label className="font-heading text-xs font-semibold text-primary-token block mb-1.5">
              Razorpay Key ID
            </label>
            <input
              type="text"
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-theme bg-surface-secondary font-mono text-xs text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
            />
            <p className="text-[11px] text-secondary-token mt-1.5 leading-relaxed">
              Public publishable client key. Secret key is strictly restricted to secure backend environment variables.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-theme">
          <h2 className="text-xs font-semibold font-heading text-primary-token uppercase tracking-[0.06em] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-accent-gold" />
            Global Reading &amp; Preview Policies
          </h2>

          <div>
            <label className="font-heading text-xs font-semibold text-primary-token block mb-1.5">
              Global Free Preview Boundary (Pages)
            </label>
            <input
              type="number"
              value={previewLimit}
              onChange={(e) => setPreviewLimit(Number(e.target.value))}
              min="1"
              max="20"
              className="w-48 px-3 py-2 rounded-lg border border-theme bg-surface-secondary font-mono tabular-nums text-xs text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
            />
            <p className="text-[11px] text-secondary-token mt-1.5 leading-relaxed">
              Default is 10 pages across all books and comics.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-theme">
          {saved ? (
            <span className="font-heading text-xs font-semibold text-[#2CE0C9] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Platform settings updated successfully
            </span>
          ) : (
            <span />
          )}

          <Button variant="primary" type="submit" className="bg-brand hover:bg-brand-hover text-[#07100D]">
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
