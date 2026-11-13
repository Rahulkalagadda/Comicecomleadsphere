"use client";

import React, { useState, useEffect, useRef } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SEED_CURRENT_USER } from "@/lib/api/seedData";
import { useTheme } from "@/lib/theme/ThemeContext";
import { Button } from "@/components/ui/Button";
import {
  User,
  Shield,
  Palette,
  CheckCircle2,
  Lock,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(SEED_CURRENT_USER.name);
  const [email, setEmail] = useState(SEED_CURRENT_USER.email);
  const [saved, setSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-b border-theme pb-4">
            <span className="font-heading text-xs font-semibold text-accent-gold uppercase tracking-[0.08em]">
              Account Governance
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial tracking-[-0.025em] text-primary-token mt-1">
              Account Settings & Preferences
            </h1>
            <p className="text-sm text-secondary-token mt-1 leading-relaxed">
              Manage your personal credentials, visual themes, and security settings.
            </p>
          </div>

          {/* Profile Form */}
          <form
            onSubmit={handleProfileSave}
            className="p-6 sm:p-8 rounded-3xl bg-surface-primary border border-theme shadow-sm space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-theme pb-3">
              <User className="w-5 h-5 text-accent-gold" />
              <h2 className="text-base font-semibold font-heading tracking-[-0.01em] text-primary-token">
                Executive Profile Details
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={SEED_CURRENT_USER.avatarUrl}
                alt={name}
                className="w-16 h-16 rounded-full border border-theme object-cover"
              />
              <div>
                <p className="font-heading text-xs font-semibold text-primary-token">Executive Avatar</p>
                <p className="text-[11px] text-muted-token">
                  Role: <strong className="uppercase">{SEED_CURRENT_USER.role.replace("_", " ")}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-heading text-xs font-semibold text-primary-token block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-theme text-sm text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
                />
              </div>

              <div>
                <label className="font-heading text-xs font-semibold text-primary-token block mb-1.5">
                  Corporate Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-theme text-sm text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved ? (
                <span className="text-xs font-bold text-[#2CE0C9] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Profile updated successfully
                </span>
              ) : (
                <span />
              )}
              <Button variant="primary" type="submit">
                Save Profile
              </Button>
            </div>
          </form>

          {/* Theme Preference */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-primary border border-theme shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-theme pb-3">
              <Palette className="w-5 h-5 text-accent-gold" />
              <h2 className="text-base font-semibold font-heading tracking-[-0.01em] text-primary-token">
                Visual Experience Theme
              </h2>
            </div>

            <p className="text-[13px] text-secondary-token leading-relaxed">
              Switch between the minimal Executive editorial theme and the illustrated Jungle theme with cartoon mascots without losing your reading progress or library items.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setTheme("executive")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  theme === "executive"
                    ? "border-[#F5C451] bg-[#F5C451]/10 shadow-sm"
                    : "border-theme bg-surface-secondary hover:bg-surface-primary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold text-sm text-primary-token">
                    Boardroom Obsidian
                  </span>
                  {theme === "executive" && (
                    <span className="font-heading text-[11px] font-semibold tracking-[0.06em] text-[#F5C451] uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-token mt-1 leading-relaxed">
                  Midnight sapphire-slate obsidian paired with Sovereign Burnished Gold for CXO briefings.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTheme("jungle")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  theme === "jungle"
                    ? "border-[#2CE0C9] bg-[#2CE0C9]/10 shadow-sm"
                    : "border-theme bg-surface-secondary hover:bg-surface-primary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold text-sm text-primary-token">
                    Jungle Canopy Studio
                  </span>
                  {theme === "jungle" && (
                    <span className="font-heading text-[11px] font-semibold tracking-[0.06em] text-[#2CE0C9] uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-token mt-1 leading-relaxed">
                  Deep nocturnal emerald obsidian with Hologram Cyber Teal, Lion, Elephant, Wolf &amp; Monkey.
                </p>
              </button>
            </div>
          </div>

          {/* Refund Policy Information */}
          <div className="p-6 rounded-3xl bg-surface-secondary border border-theme space-y-2">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.06em] text-primary-token flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-accent-gold" />
              Customer Refund & Support Guarantee
            </h3>
            <p className="text-[13px] text-secondary-token leading-relaxed">
              All digital purchases carry a 48-hour satisfaction guarantee. If you encounter any technical issues reading or streaming content, review our{" "}
              <Link href="/refund-policy" className="text-accent-gold font-semibold underline">
                Refund Policy
              </Link>{" "}
              or contact our executive support team.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
