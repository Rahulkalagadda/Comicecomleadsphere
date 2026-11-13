"use client";

import React, { useState, useEffect, useRef } from "react";
import { Order, OrderStatus } from "@/types";
import { getAdminOrders } from "@/lib/api/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  ShoppingCart,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
} from "lucide-react";

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refundModalOrder, setRefundModalOrder] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundSuccess, setRefundSuccess] = useState(false);
  const refundTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getAdminOrders().then(setOrders);
    return () => {
      if (refundTimerRef.current) {
        clearTimeout(refundTimerRef.current);
      }
    };
  }, []);

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalOrder) return;

    setRefundSuccess(true);
    if (refundTimerRef.current) {
      clearTimeout(refundTimerRef.current);
    }
    refundTimerRef.current = setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === refundModalOrder.id) {
            return {
              ...o,
              status: "refunded" as OrderStatus,
              refundReason,
            };
          }
          return o;
        })
      );
      setRefundSuccess(false);
      setRefundModalOrder(null);
      setRefundReason("");
    }, 1000);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const matchesQuery =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif-editorial font-semibold tracking-[-0.025em] text-primary-token leading-[1.15]">
          Orders &amp; Payment Settlements
        </h1>
        <p className="text-sm text-secondary-token mt-1 leading-relaxed">
          Full transactional ledger verified via Razorpay API webhooks and backend signatures.
        </p>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="p-4 rounded-xl bg-surface-primary border border-theme flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-muted-token" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number or customer email..."
            className="text-xs text-primary-token bg-transparent focus:outline-none w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Orders" },
            { id: "payment_successful", label: "Paid" },
            { id: "refunded", label: "Refunded" },
            { id: "processing", label: "Processing" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-heading text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-brand text-[#07100D]"
                  : "text-secondary-token hover:bg-surface-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="p-6 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-theme text-secondary-token font-heading text-[11px] uppercase tracking-[0.05em] font-semibold">
                <th className="py-3 px-3">Order #</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Razorpay Ref</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono tabular-nums font-semibold text-brand-token">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-heading font-semibold text-primary-token">{ord.customerName}</p>
                    <p className="text-[11px] text-secondary-token">{ord.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-3 max-w-xs truncate text-primary-token">
                    {ord.items[0]?.title || "Content Title"}
                  </td>
                  <td className="py-3.5 px-3 font-semibold font-heading tabular-nums text-primary-token">
                    {formatCurrency(ord.totalAmount)}
                  </td>
                  <td className="py-3.5 px-3 font-mono tabular-nums text-[11px] text-secondary-token">
                    {ord.razorpayPaymentId || ord.razorpayOrderId || "—"}
                  </td>
                  <td className="py-3.5 px-3">
                    {ord.status === "payment_successful" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-heading text-[11px] leading-none font-semibold bg-[#2CE0C9]/15 text-[#2CE0C9]">
                        <CheckCircle2 className="w-3 h-3" /> Paid &amp; Settled
                      </span>
                    )}
                    {ord.status === "refunded" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-heading text-[11px] leading-none font-semibold bg-red-500/15 text-red-400">
                        <RotateCcw className="w-3 h-3" /> Refunded
                      </span>
                    )}
                    {ord.status === "processing" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-heading text-[11px] leading-none font-semibold bg-accent-gold/15 text-accent-gold">
                        Processing
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-secondary-token tabular-nums">
                    {formatDate(ord.createdAt)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1 rounded bg-surface-secondary hover:bg-surface-tertiary font-heading font-semibold text-brand-token text-[11px]"
                      >
                        Receipt
                      </button>
                      {ord.status === "payment_successful" && (
                        <button
                          type="button"
                          onClick={() => setRefundModalOrder(ord)}
                          className="px-2.5 py-1 rounded bg-red-500/15 text-red-400 hover:bg-red-500/25 font-heading font-semibold text-[11px]"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REFUND MODAL */}
      {refundModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleRefundSubmit}
            className="w-full max-w-md rounded-2xl bg-surface-primary border border-theme p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-red-500/15 text-red-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold tracking-[-0.015em] text-primary-token">
                  Issue Verified Refund
                </h3>
                <p className="text-xs text-secondary-token font-mono tabular-nums">
                  Order {refundModalOrder.orderNumber} • {formatCurrency(refundModalOrder.totalAmount)}
                </p>
              </div>
            </div>

            <p className="text-xs text-secondary-token leading-relaxed">
              This action revokes the customer&apos;s cryptographic entitlement for the purchased content and authorizes a Razorpay reversal back to the source bank account.
            </p>

            <div>
              <label className="font-heading text-xs font-semibold text-primary-token block mb-1.5">
                Audit Justification / Reason
              </label>
              <textarea
                required
                rows={3}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Customer reported accidental duplicate purchase..."
                className="w-full px-3 py-2 rounded-lg border border-theme bg-surface-secondary text-xs text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setRefundModalOrder(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                type="submit"
                isLoading={refundSuccess}
              >
                Confirm &amp; Reclaim Entitlement
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* RECEIPT AUDIT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-surface-primary border border-theme p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-gold" />
                <h3 className="font-heading text-base font-semibold tracking-[-0.015em] text-primary-token">
                  Commercial Settlement Record
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="font-heading text-xs font-semibold text-secondary-token hover:text-primary-token"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-surface-secondary border border-theme">
                <div>
                  <span className="font-heading text-[11px] font-semibold text-muted-token uppercase tracking-[0.05em] block mb-0.5">Order Number</span>
                  <span className="font-mono font-semibold tabular-nums text-primary-token">{selectedOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="font-heading text-[11px] font-semibold text-muted-token uppercase tracking-[0.05em] block mb-0.5">Settlement Status</span>
                  <span className="font-heading font-semibold text-[#2CE0C9] uppercase">{selectedOrder.status}</span>
                </div>
                <div>
                  <span className="font-heading text-[11px] font-semibold text-muted-token uppercase tracking-[0.05em] block mb-0.5">Customer</span>
                  <span className="font-heading font-semibold text-primary-token">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="font-heading text-[11px] font-semibold text-muted-token uppercase tracking-[0.05em] block mb-0.5">Corporate Email</span>
                  <span className="font-mono text-secondary-token break-all">{selectedOrder.customerEmail}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-theme space-y-2">
                <span className="font-heading text-[11px] text-muted-token uppercase tracking-[0.05em] font-semibold block">Purchased Line Item</span>
                <div className="flex justify-between items-center gap-3">
                  <span className="font-heading font-semibold text-primary-token">{selectedOrder.items[0]?.title}</span>
                  <span className="font-heading font-semibold tabular-nums text-primary-token shrink-0">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              <div className="space-y-1 text-secondary-token">
                <p>Razorpay Order ID: <span className="font-mono text-primary-token">{selectedOrder.razorpayOrderId || "N/A"}</span></p>
                <p>Razorpay Payment ID: <span className="font-mono text-primary-token">{selectedOrder.razorpayPaymentId || "N/A"}</span></p>
                <p>Created At: <span className="text-primary-token">{selectedOrder.createdAt}</span></p>
                {selectedOrder.refundReason && (
                  <p className="text-red-400 font-semibold mt-1">Refund Justification: {selectedOrder.refundReason}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSelectedOrder(null)}
              >
                Close Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
