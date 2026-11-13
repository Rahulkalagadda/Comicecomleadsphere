"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Order } from "@/types";
import { getAdminOrders } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getAdminOrders().then(setOrders);
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-theme pb-4">
            <span className="font-heading text-xs font-semibold text-accent-gold uppercase tracking-[0.08em] flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4" />
              Purchase History
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial tracking-[-0.025em] text-primary-token mt-1">
              Your Orders & Receipts
            </h1>
            <p className="text-sm text-secondary-token mt-1 leading-relaxed">
              Verified Razorpay transactions and cryptographic license receipts.
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl bg-surface-primary border border-theme shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-xs text-brand-token">
                      {ord.orderNumber}
                    </span>
                    <span className="text-muted-token">•</span>
                    <span className="text-xs tabular-nums text-secondary-token">{formatDate(ord.createdAt)}</span>
                  </div>

                  <h3 className="font-heading font-semibold text-base text-primary-token">
                    {ord.items[0]?.title || "Content Title"}
                  </h3>

                  <div className="flex items-center gap-2 pt-1">
                    {ord.status === "payment_successful" && (
                      <span className="font-heading inline-flex items-center gap-1 text-[11px] font-semibold text-[#2CE0C9]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Active
                      </span>
                    )}
                    {ord.status === "refunded" && (
                      <span className="font-heading inline-flex items-center gap-1 text-[11px] font-semibold text-red-400">
                        <RotateCcw className="w-3.5 h-3.5" /> Refunded
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-theme">
                  <span className="font-serif-editorial font-semibold tabular-nums text-xl text-primary-token">
                    {formatCurrency(ord.totalAmount)}
                  </span>
                  <Link href={`/orders/${ord.id}`}>
                    <Button variant="outline" size="sm">
                      View Receipt
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
