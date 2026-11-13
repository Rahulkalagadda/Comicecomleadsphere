"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getAdminOrders } from "@/lib/api/client";
import { Order } from "@/types";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ShieldAlert, Loader2 } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [verifying, setVerifying] = useState(true);
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);
  const [verificationFailed, setVerificationFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    getAdminOrders().then((orders) => {
      if (!mounted) return;
      const found = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (found && found.status === "payment_successful") {
        setVerifiedOrder(found);
      } else {
        setVerificationFailed(true);
      }
      setVerifying(false);
    });

    return () => {
      mounted = false;
    };
  }, [orderId]);

  if (verifying) {
    return (
      <div className="p-8 rounded-3xl bg-surface-primary border border-theme shadow-md space-y-4">
        <Loader2 className="w-10 h-10 mx-auto text-brand-token animate-spin" />
        <h1 className="text-2xl font-semibold font-serif-editorial tracking-[-0.02em] text-primary-token">
          Verifying Backend Entitlement...
        </h1>
        <p className="text-[13px] text-secondary-token leading-relaxed">
          Validating cryptographic payment signature with Razorpay backend servers. Query parameters alone are never trusted.
        </p>
      </div>
    );
  }

  if (verifiedOrder) {
    return (
      <div className="p-8 rounded-3xl bg-surface-primary border border-theme shadow-lg space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#2CE0C9]/15 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-[#2CE0C9]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold font-serif-editorial tracking-[-0.02em] text-primary-token">
          Payment Authenticated
        </h1>
        <p className="text-[13px] text-secondary-token leading-relaxed">
          Backend signature verified. Your access entitlement has been activated for <strong>{verifiedOrder.items[0]?.title}</strong>.
        </p>

        <div className="p-3 rounded-xl bg-surface-secondary text-xs text-muted-token font-mono tabular-nums">
          Order Ref: {verifiedOrder.orderNumber}
        </div>

        <div className="flex gap-2 pt-2">
          <Link href="/library" className="flex-1">
            <Button variant="primary" size="lg" className="w-full">
              Go to My Library
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-3xl bg-surface-primary border border-theme shadow-lg space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-red-500/15 flex items-center justify-center">
        <ShieldAlert className="w-9 h-9 text-red-400" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold font-serif-editorial tracking-[-0.02em] text-primary-token">
        Unverified Purchase
      </h1>
      <p className="text-[13px] text-secondary-token leading-relaxed">
        No verified backend payment confirmation was found for this reference. Access cannot be granted based on URL parameters alone.
      </p>
      <div className="pt-2">
        <Link href="/orders">
          <Button variant="outline" size="sm">
            Inspect Order History
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-16">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <Suspense
            fallback={
              <div className="p-8 rounded-3xl bg-surface-primary border border-theme shadow-md space-y-4">
                <Loader2 className="w-10 h-10 mx-auto text-brand-token animate-spin" />
                <p className="text-xs text-secondary-token">Loading order telemetry...</p>
              </div>
            }
          >
            <CheckoutSuccessContent />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
