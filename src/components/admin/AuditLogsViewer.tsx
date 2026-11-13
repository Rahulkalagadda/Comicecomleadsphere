"use client";

import React, { useState, useEffect } from "react";
import { AuditLog } from "@/types";
import { getAdminAuditLogs } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";
import { Activity, Shield, CheckCircle2, AlertCircle } from "lucide-react";

export function AuditLogsViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    getAdminAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif-editorial font-semibold tracking-[-0.025em] text-primary-token leading-[1.15]">
          Platform Security &amp; Audit Trail
        </h1>
        <p className="text-sm text-secondary-token mt-1 leading-relaxed">
          Immutable audit record of all administrative operations, content publications, and refund transactions.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-theme text-secondary-token font-heading text-[11px] uppercase tracking-[0.06em] font-semibold">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Actor Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Action Event</th>
                <th className="py-3 px-3">Target Record</th>
                <th className="py-3 px-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono tabular-nums text-[11px] text-secondary-token">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3.5 px-3 font-heading font-semibold text-primary-token">
                    {log.actorEmail}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-1 rounded font-heading text-[11px] leading-none font-semibold uppercase tracking-[0.04em] bg-brand/10 text-brand-token">
                      {log.actorRole.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-accent-gold">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-3 text-primary-token">{log.targetRecord}</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 font-heading font-semibold text-[11px] leading-none bg-[#2CE0C9]/15 text-[#2CE0C9] px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
