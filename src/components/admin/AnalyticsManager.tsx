"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, TrendingUp, PieChart, Users, DollarSign } from "lucide-react";

export function AnalyticsManager() {
  const channelBreakdown = [
    { type: "AI Jungle Transformation Blueprints", percentage: 56, revenue: 48450, color: "bg-brand" },
    { type: "Jungle Audit Graphic Comics", percentage: 29, revenue: 25140, color: "bg-accent-gold" },
    { type: "AI Jungle Podcast Studio Clips", percentage: 15, revenue: 13240, color: "bg-[#2CE0C9]" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif-editorial font-semibold tracking-[-0.025em] text-primary-token leading-[1.15]">
          Revenue Analytics &amp; Audience Intelligence
        </h1>
        <p className="text-sm text-secondary-token mt-1 leading-relaxed">
          Detailed financial breakdowns, conversion metrics, and Season 1 AI Jungle Safari sales velocity.
        </p>
      </div>

      {/* REVENUE CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-4">
          <h2 className="text-base font-semibold font-heading tracking-[-0.015em] text-primary-token">
            Revenue Split by Content Classification
          </h2>

          <div className="space-y-4 pt-2">
            {channelBreakdown.map((item) => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex justify-between font-heading text-xs font-semibold text-primary-token">
                  <span>{item.type}</span>
                  <span className="tabular-nums">{formatCurrency(item.revenue)} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-tertiary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-theme flex items-center justify-between text-xs text-secondary-token">
            <span>Average Conversion from 10-Page Preview to Full Purchase:</span>
            <strong className="font-heading text-[#2CE0C9] text-sm font-semibold tabular-nums">18.4%</strong>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-4">
          <h2 className="text-base font-semibold font-heading tracking-[-0.015em] text-primary-token">
            Top Converting Content
          </h2>
          <div className="space-y-3">
            {[
              { title: "The AI Jungle Safari Blueprint", format: "Book", units: 54, revenue: 48546 },
              { title: "1.1 The Jungle Audit (Part 1)", format: "Comic", units: 42, revenue: 16758 },
              { title: "AI Jungle Podcast • Clip 02", format: "Episode", units: 38, revenue: 9462 },
            ].map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-surface-secondary border border-theme flex justify-between items-center text-xs gap-3">
                <div className="min-w-0">
                  <p className="font-heading font-semibold text-primary-token truncate">{c.title}</p>
                  <p className="text-[11px] text-secondary-token tabular-nums">{c.format} • {c.units} Purchases</p>
                </div>
                <span className="font-semibold font-heading tabular-nums text-primary-token shrink-0">
                  {formatCurrency(c.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
