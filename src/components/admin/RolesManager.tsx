"use client";

import React from "react";
import { Shield, Check, X } from "lucide-react";

export function RolesManager() {
  const permissions = [
    { name: "View Content Marketplace", super_admin: true, content_manager: true, support_agent: true, finance_manager: true, customer: true },
    { name: "Access Reader & Video Player", super_admin: true, content_manager: true, support_agent: true, finance_manager: true, customer: true },
    { name: "Upload & Draft Content", super_admin: true, content_manager: true, support_agent: false, finance_manager: false, customer: false },
    { name: "Publish & Archive Content", super_admin: true, content_manager: true, support_agent: false, finance_manager: false, customer: false },
    { name: "Configure 10-Page Preview Limits", super_admin: true, content_manager: true, support_agent: false, finance_manager: false, customer: false },
    { name: "Modify Pricing & Catalog Offers", super_admin: true, content_manager: false, support_agent: false, finance_manager: true, customer: false },
    { name: "Authorize Customer Refunds", super_admin: true, content_manager: false, support_agent: false, finance_manager: true, customer: false },
    { name: "Inspect & Suspend User Accounts", super_admin: true, content_manager: false, support_agent: true, finance_manager: false, customer: false },
    { name: "View Cryptographic Entitlements", super_admin: true, content_manager: true, support_agent: true, finance_manager: true, customer: false },
    { name: "Access Immutable Audit Logs", super_admin: true, content_manager: false, support_agent: false, finance_manager: false, customer: false },
    { name: "Modify Platform & Gateway Keys", super_admin: true, content_manager: false, support_agent: false, finance_manager: false, customer: false },
  ];

  const roles = [
    { key: "super_admin", label: "Super Admin", desc: "Full administrative and security authority" },
    { key: "content_manager", label: "Content Manager", desc: "Manage manuscripts, graphic panels & episodes" },
    { key: "finance_manager", label: "Finance Manager", desc: "Audit Razorpay ledger & authorize refunds" },
    { key: "support_agent", label: "Support Agent", desc: "Assist customers & inspect entitlements" },
    { key: "customer", label: "Customer / Reader", desc: "Store purchases and library access" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif-editorial font-semibold tracking-[-0.025em] text-primary-token leading-[1.15]">
          Roles &amp; Cryptographic Access Matrix
        </h1>
        <p className="text-sm text-secondary-token mt-1 leading-relaxed">
          Strict backend role-based access control (RBAC) governance configuration across administrative operations.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-theme text-secondary-token font-heading text-[11px] uppercase tracking-[0.06em] font-semibold">
                <th className="py-3 px-3">Permission Capability</th>
                {roles.map((r) => (
                  <th key={r.key} className="py-3 px-3 text-center">
                    <span className="block font-semibold text-primary-token">{r.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="py-3.5 px-3 font-heading font-semibold text-primary-token">
                    {p.name}
                  </td>
                  {roles.map((r) => {
                    const hasPerm = (p as any)[r.key];
                    return (
                      <td key={r.key} className="py-3.5 px-3 text-center">
                        {hasPerm ? (
                          <div className="w-5 h-5 mx-auto rounded-full bg-[#2CE0C9]/15 text-[#2CE0C9] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 mx-auto rounded-full bg-surface-secondary text-muted-token flex items-center justify-center">
                            <X className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
