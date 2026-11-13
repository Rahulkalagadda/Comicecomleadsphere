"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Receipt,
  BookOpen,
  Layers,
  Film,
  Users,
  ShieldCheck,
  Settings,
  PlusCircle,
  Menu,
  X,
  ExternalLink,
  Lock,
  ArrowRightLeft,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navCategories = [
    {
      title: "Intelligence",
      items: [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
        { label: "Revenue Analytics", href: "/admin/analytics", icon: BarChart3 },
        { label: "Orders & Payments", href: "/admin/orders", icon: Receipt },
      ],
    },
    {
      title: "Catalog & Editorial",
      items: [
        { label: "Content Library", href: "/admin/content", icon: Layers, badge: "482" },
        { label: "Books", href: "/admin/books", icon: BookOpen },
        { label: "Comics", href: "/admin/comics", icon: Layers },
        { label: "Podcasts", href: "/admin/podcast-series", icon: Film },
        { label: "Add Content", href: "/admin/content/new", icon: PlusCircle },
      ],
    },
    {
      title: "Governance",
      items: [
        { label: "Users & Cohorts", href: "/admin/users", icon: Users },
        { label: "Security & Audit", href: "/admin/audit-logs", icon: ShieldCheck },
        { label: "Platform Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-main text-primary-token font-sans antialiased transition-colors duration-200">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ADMIN SIDEBAR (MATCHING STITCH SCREEN 02 ASIDE) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-surface-secondary/80 border-r border-theme flex flex-col justify-between transition-transform duration-200 p-4 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto space-y-6">
          {/* Operations Hub Header Badge */}
          <div className="p-3 bg-surface-primary rounded-xl border border-theme shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white p-0.5 border border-[#F5C451]/45 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                <img
                  src="/images/leadsphere-logo.jpg"
                  alt="LeadSphere Solutions Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-semibold text-sm text-primary-token tracking-[-0.015em] leading-tight">
                  Operations Hub
                </p>
                <span className="inline-flex items-center gap-1.5 font-heading text-[11px] font-semibold text-[#2CE0C9] tabular-nums">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2CE0C9] animate-pulse" />
                  Cluster v2.4 Live
                </span>
              </div>
            </div>
            <span className="px-2 py-1 rounded-full bg-surface-secondary font-heading text-[10px] leading-none font-semibold uppercase tracking-[0.06em] text-accent-gold border border-theme">
              Admin
            </span>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5" aria-label="Admin Navigation">
            {navCategories.map((cat) => (
              <div key={cat.title} className="space-y-1">
                <p className="font-heading text-[11px] font-semibold text-muted-token px-3 py-1 uppercase tracking-[0.08em]">
                  {cat.title}
                </p>
                {cat.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2 rounded-xl font-heading text-xs tracking-[-0.005em] transition-all ${
                        isActive
                          ? "bg-surface-primary text-brand-token shadow-sm border border-theme font-semibold"
                          : "text-secondary-token hover:bg-surface-primary/60 hover:text-primary-token font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-brand-token" : "text-secondary-token"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-surface-secondary text-[11px] leading-none font-mono tabular-nums text-muted-token">
                          {item.badge}
                        </span>
                      )}
                      {isActive && !item.badge && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-token" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Super Admin Profile Card & System Heartbeat (Screen 02) */}
        <div className="pt-4 border-t border-theme space-y-2 mt-auto">
          <div className="p-3 bg-surface-primary rounded-xl border border-theme shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <img
                  src="/images/mascot-lion.jpg"
                  alt="Marcus Vance"
                  className="w-9 h-9 rounded-full object-cover border border-theme"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#2CE0C9] ring-2 ring-surface-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-semibold text-xs text-primary-token truncate leading-tight">
                  Marcus Vance
                </p>
                <p className="text-[11px] text-muted-token truncate mt-0.5">
                  Super Admin • AI Jungle Studio
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="p-1.5 rounded-lg text-secondary-token hover:text-primary-token hover:bg-surface-secondary transition-colors"
              title="Return to Customer Storefront"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center justify-between px-3 py-1.5 bg-surface-secondary rounded-lg text-[11px] text-secondary-token font-medium">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#2CE0C9]" />
              <span>Razorpay TLS 1.3 Active</span>
            </div>
            <span className="font-mono tabular-nums text-muted-token">0.24ms</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP ADMIN HEADER */}
        <header className="sticky top-0 z-30 h-16 bg-surface-primary/95 backdrop-blur-md border-b border-theme px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg nm-button bg-surface-primary text-secondary-token lg:hidden"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-gold block">
                LEADSPHERE ENTERPRISE CONSOLE
              </span>
              <span className="text-xs text-secondary-token">
                Dual-Theme Content Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-full nm-button bg-surface-secondary font-heading text-xs font-semibold text-primary-token flex items-center gap-1.5 transition-all cursor-pointer"
              title={`Currently in ${theme} mode. Click to toggle.`}
            >
              <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
              <span>Theme: {theme === "executive" ? "Executive" : "Jungle"}</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-theme font-heading text-xs font-medium text-secondary-token hover:text-primary-token hover:bg-surface-secondary transition-all"
            >
              <span>Customer Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* ADMIN SCROLLABLE WORKSPACE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
