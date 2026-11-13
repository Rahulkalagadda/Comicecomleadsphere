"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { createOrder, verifyPayment } from "@/lib/api/client";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
} from "lucide-react";
import Link from "next/link";

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    price: number;
    type: "book" | "comic" | "podcast_episode" | "podcast";
    coverUrl?: string;
  };
  onSuccess?: () => void;
}

type CheckoutStep = "review" | "paying" | "verifying" | "success" | "failed";

export function CheckoutModal({ isOpen, onClose, item, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("review");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [orderId, setOrderId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const paymentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setStep("review");
    setOrderId("");
    setErrorMessage("");
    if (paymentTimerRef.current) {
      clearTimeout(paymentTimerRef.current);
      paymentTimerRef.current = null;
    }
  }, [isOpen, item.id]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "paying" && step !== "verifying") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, step, onClose]);

  useEffect(() => {
    return () => {
      if (paymentTimerRef.current) {
        clearTimeout(paymentTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleStartPayment = async () => {
    try {
      setStep("paying");
      setErrorMessage("");

      // Step 1: Create backend order
      const order = await createOrder({
        id: item.id,
        title: item.title,
        price: item.price,
        type: item.type,
      });

      setOrderId(order.id);

      // Step 2: Simulate Razorpay Gateway interaction (1.5 seconds)
      if (paymentTimerRef.current) {
        clearTimeout(paymentTimerRef.current);
      }
      paymentTimerRef.current = setTimeout(async () => {
        try {
          setStep("verifying");
          // Step 3: Verify payment signature with backend
          const paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 10)}`;
          const result = await verifyPayment(order.id, paymentId);

          if (result.success) {
            setStep("success");
            if (onSuccess) onSuccess();
          } else {
            setStep("failed");
            setErrorMessage("Payment signature verification failed.");
          }
        } catch (err: any) {
          setStep("failed");
          setErrorMessage(err.message || "Payment verification encountered an error.");
        }
      }, 1500);
    } catch (err: any) {
      setStep("failed");
      setErrorMessage(err.message || "Failed to initialize order.");
    }
  };

  const getItemTargetUrl = () => {
    if (item.type === "book" || item.type === "comic") {
      return `/read/${item.id}`;
    }
    return `/episodes/${item.id}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-primary border border-theme shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        {step !== "paying" && step !== "verifying" && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-secondary-token hover:text-primary-token hover:bg-surface-secondary"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: REVIEW & SELECT PAYMENT */}
        {step === "review" && (
          <div className="space-y-5">
            <div>
              <span className="font-heading text-[11px] font-semibold text-accent-gold uppercase tracking-[0.08em]">
                Instant Access Checkout
              </span>
              <h2 id="checkout-modal-title" className="text-2xl font-semibold font-serif-editorial tracking-[-0.02em] text-primary-token mt-0.5">
                Unlock Complete Content
              </h2>
            </div>

            {/* Item Card */}
            <div className="flex gap-4 p-3.5 rounded-xl bg-surface-secondary/70 border border-theme">
              {item.coverUrl && (
                <div className="w-16 h-20 rounded-lg border border-theme bg-[#07100D] p-1 shadow-sm shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-token">
                    {item.type.replace("_", " ")}
                  </span>
                  <h3 className="font-heading font-semibold text-primary-token text-sm line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs text-secondary-token">Total Amount:</span>
                  <span className="text-lg font-semibold tabular-nums text-primary-token font-serif-editorial">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-secondary-token block">
                Select Payment Method (Razorpay Gateway)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "upi"
                      ? "border-brand bg-brand/5 text-primary-token font-semibold"
                      : "border-theme bg-surface-primary hover:bg-surface-secondary text-secondary-token"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-accent-gold" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "card"
                      ? "border-brand bg-brand/5 text-primary-token font-semibold"
                      : "border-theme bg-surface-primary hover:bg-surface-secondary text-secondary-token"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-brand-token" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "netbanking"
                      ? "border-brand bg-brand/5 text-primary-token font-semibold"
                      : "border-theme bg-surface-primary hover:bg-surface-secondary text-secondary-token"
                  }`}
                >
                  <Building className="w-5 h-5 text-secondary-token" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-2 text-xs text-muted-token">
              <Lock className="w-3.5 h-3.5 text-accent-gold" />
              <span>256-bit encrypted checkout via Razorpay • 100% money back within 48h</span>
            </div>

            {/* CTA */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <AddToCartButton
                size="lg"
                item={{
                  id: item.id,
                  title: item.title,
                  type: item.type === "podcast" ? "podcast_episode" : item.type,
                  badge: item.type === "comic" ? "COMIC" : item.type === "book" ? "BOOK" : "VIDEO",
                  edition: "The AI Jungle Safari • Season 1",
                  authorOrHost: "Dr. Amit Khandelwal",
                  tierOrFormat: "Full Browser Access",
                  price: item.price,
                  coverUrl: item.coverUrl || "/media/images/ai-jungle-safari-blueprint.jpg",
                }}
              />
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleStartPayment}
              >
                Pay {formatCurrency(item.price)} &amp; Unlock
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PAYING / RAZORPAY EMULATION */}
        {step === "paying" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-accent-gold/15 flex items-center justify-center animate-pulse">
              <CreditCard className="w-7 h-7 text-accent-gold" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-primary-token">
                Connecting to Razorpay...
              </h3>
              <p className="text-xs text-secondary-token mt-1">
                Authorizing secure payment for {formatCurrency(item.price)}
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: VERIFYING BACKEND SIGNATURE */}
        {step === "verifying" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-brand/15 flex items-center justify-center animate-spin">
              <ShieldCheck className="w-7 h-7 text-brand-token" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-primary-token">
                Verifying Backend Entitlement
              </h3>
              <p className="text-xs text-secondary-token mt-1">
                Validating cryptographic payment signature and registering access key...
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "success" && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#2CE0C9]/15 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-[#2CE0C9]" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-primary-token">
                Payment Verified!
              </h3>
              <p className="text-xs text-secondary-token mt-1 max-w-sm mx-auto">
                Your backend entitlement has been issued. Content is unlocked and available immediately in My Library and browser reader.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface-secondary text-xs text-muted-token">
              Order Ref: <strong className="font-mono text-primary-token">{orderId || "AGY-VERIFIED"}</strong>
            </div>

            <div className="flex gap-3 pt-2">
              <Link href={getItemTargetUrl()} className="flex-1" onClick={onClose}>
                <Button variant="primary" size="lg" className="w-full">
                  Read / Watch Now
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: FAILED */}
        {step === "failed" && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/15 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-primary-token">
                Payment Not Completed
              </h3>
              <p className="text-xs text-secondary-token mt-1">
                {errorMessage || "The transaction could not be verified by the backend."}
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <Button variant="primary" onClick={() => setStep("review")}>
                Retry Payment
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
