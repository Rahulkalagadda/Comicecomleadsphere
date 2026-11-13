"use client";

import React, { useEffect, useState } from "react";
import { Download, WifiOff, X, CheckCircle } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaManager() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showInstalledToast, setShowInstalledToast] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[PWA] Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.warn("[PWA] Service Worker registration failed:", error);
          });
      });
    }

    // 2. Track Online / Offline Status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    // 3. Capture beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstalledToast(true);
      setTimeout(() => setShowInstalledToast(false), 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setInstallPrompt(null);
      }
    } catch (err) {
      console.error("[PWA] Install prompt error:", err);
    }
  };

  return (
    <>
      {/* Offline Status Pill */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/90 text-amber-950 font-fredoka text-xs font-semibold shadow-lg backdrop-blur-md animate-pulse">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode Active • Cached Vault Available</span>
        </div>
      )}

      {/* App Installed Success Toast */}
      {showInstalledToast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-fredoka text-sm shadow-xl animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>LeadSphere installed successfully to your home screen!</span>
        </div>
      )}

      {/* Claymorphic Install Banner */}
      {installPrompt && !isDismissed && !isInstalled && (
        <aside
          aria-label="Install LeadSphere App"
          className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] p-4 rounded-2xl bg-[#0D1B16]/95 border border-[#2CE0C9]/30 shadow-2xl backdrop-blur-md flex items-center gap-3 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0 shadow-sm flex items-center justify-center overflow-hidden">
            <img
              src="/images/leadsphere-logo.jpg"
              alt="LeadSphere App"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-anton text-white text-base tracking-wide leading-none truncate">
              LEADSPHERE APP
            </p>
            <p className="font-sniglet text-[11px] text-[#2CE0C9] leading-tight mt-0.5">
              Install for instant offline reading &amp; comics vault access
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="clay-btn-primary px-3 py-1.5 rounded-xl font-fredoka text-xs font-bold flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-transform"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss app install banner"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}
    </>
  );
}

