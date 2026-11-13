"use client";

import React, { useState, useEffect } from "react";
import { User, Entitlement } from "@/types";
import { getAdminUsers } from "@/lib/api/client";
import { SEED_ENTITLEMENTS } from "@/lib/api/seedData";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  Key,
  CheckCircle2,
  Lock,
} from "lucide-react";

export function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    getAdminUsers().then(setUsers);
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "active" ? "suspended" : "active";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif-editorial font-semibold tracking-[-0.025em] text-primary-token leading-[1.15]">
          User Management &amp; Entitlement Audits
        </h1>
        <p className="text-sm text-secondary-token mt-1 leading-relaxed">
          Inspect user accounts, verify issued backend access signatures, and enforce governance permissions.
        </p>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="p-4 rounded-xl bg-surface-primary border border-theme flex items-center gap-3">
        <Search className="w-4 h-4 text-muted-token" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by user name, corporate email, or role..."
          className="flex-1 bg-transparent text-xs text-primary-token focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="font-heading text-xs font-medium text-secondary-token hover:text-primary-token"
          >
            Clear
          </button>
        )}
      </div>

      {/* USERS TABLE */}
      <div className="p-6 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-theme text-secondary-token font-heading text-[11px] uppercase tracking-[0.05em] font-semibold">
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Entitlements</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Member Since</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              {filteredUsers.map((u) => {
                const userEntitlements = SEED_ENTITLEMENTS.filter((e) => e.userId === u.id);
                return (
                  <tr key={u.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-heading font-semibold text-primary-token">{u.name}</p>
                      <p className="text-[11px] text-secondary-token">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-1 rounded font-heading text-[11px] leading-none font-semibold uppercase tracking-[0.04em] bg-brand/10 text-brand-token">
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 font-heading font-semibold tabular-nums text-accent-gold">
                        <Key className="w-3.5 h-3.5" />
                        {userEntitlements.length} Active Key(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {u.status === "active" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-heading text-[11px] leading-none font-semibold bg-[#2CE0C9]/15 text-[#2CE0C9]">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-heading text-[11px] leading-none font-semibold bg-red-500/15 text-red-400">
                          <Lock className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-secondary-token tabular-nums">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 rounded bg-surface-secondary hover:bg-surface-tertiary font-heading font-semibold text-brand-token text-[11px]"
                        >
                          Keys
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-2.5 py-1 rounded font-heading font-semibold text-[11px] ${
                            u.status === "active"
                              ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                              : "bg-[#2CE0C9]/15 text-[#2CE0C9] hover:bg-[#2CE0C9]/25"
                          }`}
                        >
                          {u.status === "active" ? "Suspend" : "Reactivate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER ENTITLEMENTS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-surface-primary border border-theme p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme pb-3">
              <div>
                <h3 className="font-heading text-base font-semibold tracking-[-0.015em] text-primary-token">
                  Cryptographic Entitlements
                </h3>
                <p className="text-xs text-secondary-token">{selectedUser.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="font-heading text-xs font-semibold text-secondary-token hover:text-primary-token"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {SEED_ENTITLEMENTS.filter((e) => e.userId === selectedUser.id).length === 0 ? (
                <p className="text-xs text-secondary-token py-4 text-center">
                  No explicit entitlements granted yet.
                </p>
              ) : (
                SEED_ENTITLEMENTS.filter((e) => e.userId === selectedUser.id).map((ent) => (
                  <div
                    key={ent.id}
                    className="p-3 rounded-xl bg-surface-secondary border border-theme space-y-1 text-xs"
                  >
                    <div className="flex justify-between font-heading font-semibold text-primary-token">
                      <span className="uppercase text-[11px] tracking-[0.05em] text-accent-gold">
                        {ent.contentType}
                      </span>
                      <span className="font-mono text-[11px]">Target: {ent.contentId}</span>
                    </div>
                    <p className="font-mono text-[11px] text-secondary-token truncate">
                      Signature: {ent.verifiedBackendSignature}
                    </p>
                    <p className="text-[11px] text-muted-token tabular-nums">
                      Granted: {formatDate(ent.grantedAt)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSelectedUser(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
