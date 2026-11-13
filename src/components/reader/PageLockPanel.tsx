"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Lock, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

interface PageLockPanelProps {
  contentId: string;
  title: string;
  price: number;
  type: "book" | "comic";
  coverUrl?: string;
  onUnlocked?: () => void;
}

export function PageLockPanel({
  contentId,
  title,
  price,
  type,
  coverUrl,
  onUnlocked,
}: PageLockPanelProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div
      role="region"
      aria-label="Content Preview Lock Gate"
      className="my-8 mx-auto max-w-xl rounded-2xl bg-surface-primary border border-theme shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-accent-gold/15 flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-accent-gold" />
      </div>

      <span className="font-heading text-xs font-semibold text-accent-gold uppercase tracking-[0.1em]">
        Free 10-Page Preview Completed
      </span>

      <h2 className="text-2xl sm:text-3xl font-semibold font-serif-editorial tracking-[-0.02em] text-primary-token mt-2">
        Enjoyed the preview?
      </h2>

      <p className="text-sm text-secondary-token mt-2 max-w-md mx-auto leading-relaxed">
        Unlock the complete {type === "book" ? "book" : "graphic novel"} to continue reading beyond page 10. Access is granted instantly in your browser and synced across all your devices.
      </p>

      {/* Pricing and Security Summary */}
      <div className="mt-6 p-4 rounded-xl bg-surface-secondary/70 border border-theme flex items-center justify-between text-left">
        <div>
          <span className="font-heading text-[11px] font-semibold text-muted-token block uppercase tracking-[0.06em]">
            One-time Purchase
          </span>
          <span className="text-2xl font-semibold font-serif-editorial tabular-nums text-primary-token">
            {formatCurrency(price)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-token">
          <ShieldCheck className="w-4 h-4 text-accent-gold" />
          <span>Razorpay Verified</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={() => setCheckoutOpen(true)}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Unlock Full {type === "book" ? "Book" : "Graphic Novel"}
        </Button>

        <AddToCartButton
          size="lg"
          item={{
            id: contentId,
            title,
            type,
            badge: type === "book" ? "BOOK" : "COMIC",
            edition: "The AI Jungle Safari • Season 1",
            authorOrHost: "Dr. Amit Khandelwal",
            tierOrFormat: "Full Browser Access • Permanent Vault",
            price,
            coverUrl: coverUrl || "/media/images/ai-jungle-safari-blueprint.jpg",
          }}
        />

        <Link href="/library" className="sm:w-auto">
          <Button variant="outline" size="lg" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Library
          </Button>
        </Link>
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        item={{
          id: contentId,
          title,
          price,
          type,
          coverUrl,
        }}
        onSuccess={onUnlocked}
      />
    </div>
  );
}
