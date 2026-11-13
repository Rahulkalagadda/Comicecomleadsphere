"use client";

import React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";

interface OrderReceiptClientProps {
  order: Order;
}

export function OrderReceiptClient({ order }: OrderReceiptClientProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-token hover:text-primary-token"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Orders
          </Link>

          <div className="p-8 rounded-3xl bg-surface-primary border border-theme shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme pb-6">
              <div>
                <span className="font-heading text-[11px] font-semibold text-accent-gold uppercase tracking-[0.08em] block">
                  Official Merchant Receipt
                </span>
                <h1 className="text-2xl sm:text-3xl font-semibold font-serif-editorial tracking-[-0.02em] text-primary-token mt-1">
                  Order <span className="font-mono text-xl sm:text-2xl tracking-normal">{order.orderNumber}</span>
                </h1>
                <p className="text-xs tabular-nums text-secondary-token mt-0.5">
                  Issued on {formatDate(order.createdAt)}
                </p>
              </div>

              <div>
                {order.status === "payment_successful" && (
                  <span className="font-heading inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2CE0C9]/15 text-[#2CE0C9] border border-[#2CE0C9]/30">
                    <CheckCircle2 className="w-4 h-4" /> Payment Settled & Verified
                  </span>
                )}
                {order.status === "refunded" && (
                  <span className="font-heading inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
                    <RotateCcw className="w-4 h-4" /> Order Refunded
                  </span>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <h2 className="font-heading text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-token">
                Purchased Digital Assets
              </h2>
              <div className="p-4 rounded-2xl bg-surface-secondary border border-theme flex items-center justify-between">
                <div>
                  <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-accent-gold block">
                    {order.items[0]?.contentType}
                  </span>
                  <h3 className="font-heading font-semibold text-[15px] text-primary-token">
                    {order.items[0]?.title}
                  </h3>
                  <p className="text-[11px] font-mono text-muted-token mt-0.5">
                    Item ID: {order.items[0]?.contentId}
                  </p>
                </div>
                <span className="font-semibold font-serif-editorial tabular-nums text-lg text-primary-token">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>

            {/* Cryptographic Verification Details */}
            <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-theme space-y-2 text-[13px]">
              <div className="flex items-center gap-2 font-heading font-semibold text-primary-token">
                <ShieldCheck className="w-4 h-4 text-accent-gold" />
                <span>Backend Gateway Telemetry</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-secondary-token pt-1">
                <p>Razorpay Order ID: <strong className="text-primary-token font-mono">{order.razorpayOrderId || "N/A"}</strong></p>
                <p>Payment Reference: <strong className="text-primary-token font-mono">{order.razorpayPaymentId || "N/A"}</strong></p>
                <p>Verified Timestamp: <strong className="text-primary-token tabular-nums">{order.verifiedAt || order.createdAt}</strong></p>
                <p>Customer Email: <strong className="text-primary-token">{order.customerEmail}</strong></p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-theme flex items-center justify-between">
              <Link href="/library">
                <Button variant="primary">
                  Open in My Library
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
