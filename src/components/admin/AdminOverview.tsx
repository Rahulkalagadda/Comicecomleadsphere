"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { getAdminOrders, getCatalog } from "@/lib/api/client";
import { Order, Book, Comic, PodcastSeries } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  IndianRupee,
  TrendingUp,
  RotateCcw,
  ShoppingCart,
  Users,
  BookOpen,
  Layers,
  Film,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Eye,
  Archive,
  Lock,
  CheckCircle2,
  Calendar,
  BarChart3,
  ChevronRight,
  Sparkles,
  Activity,
  CreditCard,
  X,
} from "lucide-react";

export function AdminOverview() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "funnel" | "catalog" | "transactions"
  >("overview");
  const [reportingPeriod, setReportingPeriod] = useState<"30d" | "7d" | "all">("30d");
  const [catalogFilter, setCatalogFilter] = useState<"all" | "books" | "comics" | "podcasts">("all");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);
  const exportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [catalog, setCatalog] = useState<{
    books: Book[];
    comics: Comic[];
    podcasts: PodcastSeries[];
  }>({ books: [], comics: [], podcasts: [] });
  const [loading, setLoading] = useState(true);

  // New Content Form State
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"book" | "comic" | "podcast">("book");
  const [newPrice, setNewPrice] = useState("799");
  const [newCreator, setNewCreator] = useState("");

  useEffect(() => {
    Promise.all([getAdminOrders(), getCatalog()])
      .then(([ords, cat]) => {
        setOrders(ords);
        setCatalog(cat);
      })
      .finally(() => setLoading(false));

    return () => {
      if (exportTimerRef.current) {
        clearTimeout(exportTimerRef.current);
      }
    };
  }, []);

  const formatMoney = (inrAmount: number) => {
    return `₹${Math.round(inrAmount).toLocaleString("en-IN")}`;
  };

  // Calculations
  const totalGross = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRefunds = orders
    .filter((o) => o.status === "refunded")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const netSales = totalGross - totalRefunds;
  const paidOrdersCount = orders.filter((o) => o.status === "payment_successful").length;
  const avgOrderValue = paidOrdersCount > 0 ? Math.round(netSales / paidOrdersCount) : 0;

  // Flatten catalog items for catalog master table
  const allCatalogItems = useMemo(() => {
    const list: any[] = [];
    catalog.books.forEach((b) =>
      list.push({ ...b, itemType: "book", lifecycle: "Live • In-Market", conversion: "21.4%", previewRule: "Pages 1–10 Open" })
    );
    catalog.comics.forEach((c) =>
      list.push({ ...c, itemType: "comic", lifecycle: "Live • In-Market", conversion: "18.2%", previewRule: "Pages 1–10 Open" })
    );
    catalog.podcasts.forEach((p) =>
      list.push({ ...p, itemType: "podcast", lifecycle: "Live • In-Market", conversion: "14.9%", previewRule: "Episode 1 Free" })
    );
    return list;
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    return allCatalogItems.filter((item) => {
      const matchType = catalogFilter === "all" || item.itemType === catalogFilter;
      const matchSearch =
        catalogSearch === "" ||
        item.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        ((item.author || item.creator || item.host) &&
          (item.author || item.creator || item.host).toLowerCase().includes(catalogSearch.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [allCatalogItems, catalogFilter, catalogSearch]);

  const handleRefund = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "refunded" as const,
              refundReason: "Customer discretionary satisfaction request",
            }
          : o
      )
    );
  };

  const handleExportCSV = () => {
    setExportNotice(true);
    if (exportTimerRef.current) {
      clearTimeout(exportTimerRef.current);
    }
    exportTimerRef.current = setTimeout(() => setExportNotice(false), 4000);
  };

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const priceNum = parseInt(newPrice, 10) || 799;
    if (newType === "book") {
      const newBook: Book = {
        id: `book-${Date.now()}`,
        slug: newTitle.toLowerCase().replace(/\s+/g, "-"),
        title: newTitle,
        author: newCreator || "Staff Editorial",
        description: "Authoritative blueprint created via AI Jungle Studio Console.",
        coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
        price: priceNum,
        category: "AI Transformation",
        tags: ["Monograph", "Executive"],
        publishedAt: new Date().toISOString(),
        pageCount: 320,
        previewPageLimit: 10,
        type: "book",
      };
      setCatalog((prev) => ({ ...prev, books: [newBook, ...prev.books] }));
    }
    setUploadModalOpen(false);
    setNewTitle("");
    setNewCreator("");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. TOP HEADER & SYSTEM CONSOLE CONTROLS (MATCHING STITCH SCREEN 02) */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-theme">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-heading text-[11px] font-semibold text-accent-gold uppercase tracking-[0.08em]">
            <Activity className="w-3.5 h-3.5" />
            <span>SYSTEM CONSOLE • EXECUTIVE REPORTING • OPS HUB v2.4</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial font-semibold tracking-[-0.025em] leading-[1.1] text-primary-token">
            Platform Performance &amp; Catalog
          </h1>
          <p className="text-sm text-secondary-token max-w-2xl leading-relaxed">
            Publishing telemetry, 10-page preview funnel conversion, settled Razorpay receipts, and catalog master.
          </p>
        </div>

        {/* Global Controls: Settlement Rail, Period & Upload Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* INR Razorpay Settlement Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-secondary border border-theme font-heading text-xs font-semibold text-primary-token">
            <IndianRupee className="w-3.5 h-3.5 text-brand-token" />
            <span>INR (₹) • Razorpay Settlements</span>
          </div>

          {/* Reporting Period */}
          <select
            value={reportingPeriod}
            onChange={(e) => setReportingPeriod(e.target.value as any)}
            className="px-3.5 py-2 rounded-xl bg-surface-primary border border-theme font-heading text-xs font-semibold text-primary-token shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-token"
          >
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
            <option value="all">All Time Historical</option>
          </select>

          {/* Upload Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            className="shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Upload New Content
          </Button>
        </div>
      </section>

      {/* 2. TAB NAVIGATION BAR (STITCH ADMIN WORKSPACE TABS) */}
      <div className="border-b border-theme">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 font-heading text-xs">
          {[
            { id: "overview", label: "Executive Overview", icon: BarChart3 },
            { id: "analytics", label: "Revenue Velocity", icon: TrendingUp },
            { id: "funnel", label: "10-Page Reader Funnel", icon: Sparkles },
            { id: "catalog", label: "Editorial Catalog Master", icon: Layers, badge: String(allCatalogItems.length) },
            { id: "transactions", label: "Recent Reader Transactions", icon: CreditCard, badge: String(orders.length) },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-brand-token text-brand-token"
                    : "border-transparent text-secondary-token hover:text-primary-token hover:border-theme"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-token" : "text-secondary-token"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] leading-none font-mono tabular-nums ${
                      isActive ? "bg-brand-token/10 text-brand-token font-semibold" : "bg-surface-secondary text-muted-token"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 5 HIGH-IMPACT METRIC CARDS (MATCHING STITCH SCREEN 02 SECTION 2) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        {/* Metric 1: Gross Sales */}
        <div className="p-5 rounded-2xl bg-surface-primary border border-theme soft-surface flex flex-col justify-between gap-3 hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-token">
              Gross Sales
            </span>
            <div className="w-8 h-8 rounded-full bg-brand-token/10 text-brand-token flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold font-serif-editorial tracking-[-0.02em] tabular-nums text-primary-token">
              {formatMoney(totalGross)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs text-[#2CE0C9] font-semibold tabular-nums">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2%</span>
              <span className="text-muted-token font-normal">vs prior mo</span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-token h-full rounded-full" style={{ width: "78%" }} />
          </div>
        </div>

        {/* Metric 2: Net Settled */}
        <div className="p-5 rounded-2xl bg-surface-primary border border-theme soft-surface flex flex-col justify-between gap-3 hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-token">
              Net Settled
            </span>
            <div className="w-8 h-8 rounded-full bg-[#2CE0C9]/15 text-[#2CE0C9] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold font-serif-editorial tracking-[-0.02em] tabular-nums text-[#2CE0C9]">
              {formatMoney(netSales)}
            </p>
            <p className="text-[11px] text-muted-token mt-1">Post Razorpay gateway &amp; TDS</p>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-token font-medium tabular-nums">
            <span>Deductions: {formatMoney(totalRefunds)}</span>
            <span className="text-[#2CE0C9] font-semibold">90.9% Net</span>
          </div>
        </div>

        {/* Metric 3: Paid Orders */}
        <div className="p-5 rounded-2xl bg-surface-primary border border-theme soft-surface flex flex-col justify-between gap-3 hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-token">
              Paid Orders
            </span>
            <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center text-primary-token">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold font-serif-editorial tracking-[-0.02em] tabular-nums text-primary-token">
              {paidOrdersCount.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs text-[#2CE0C9] font-semibold tabular-nums">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8.4%</span>
              <span className="text-muted-token font-normal">AOV {formatMoney(avgOrderValue)}</span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden">
            <div className="bg-accent-gold h-full rounded-full" style={{ width: "64%" }} />
          </div>
        </div>

        {/* Metric 4: 10-Page Conversion */}
        <div className="p-5 rounded-2xl bg-surface-primary border border-theme soft-surface flex flex-col justify-between gap-3 hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-token">
              10-Page Conversion
            </span>
            <div className="w-8 h-8 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold font-serif-editorial tracking-[-0.02em] tabular-nums text-primary-token">
              18.6%
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs text-[#2CE0C9] font-semibold tabular-nums">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3.1%</span>
              <span className="text-muted-token font-normal">preview paywall</span>
            </div>
          </div>
          <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#2CE0C9] h-full rounded-full" style={{ width: "52%" }} />
          </div>
        </div>

        {/* Metric 5: Active Readers */}
        <div className="p-5 rounded-2xl bg-surface-primary border border-theme soft-surface flex flex-col justify-between gap-3 hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-token">
              Active Readers
            </span>
            <div className="w-8 h-8 rounded-full bg-brand-token/10 text-brand-token flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-semibold font-serif-editorial tracking-[-0.02em] tabular-nums text-primary-token">
              12,850
            </p>
            <p className="text-[11px] text-muted-token mt-1 tabular-nums">DAU / MAU: 41.8%</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#2CE0C9] font-medium tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[#2CE0C9] animate-ping" />
            <span>2,140 in active sessions</span>
          </div>
        </div>
      </section>

      {/* 4. TAB CONTENT PANELS */}

      {/* TAB A: OVERVIEW & REVENUE VELOCITY WITH FUNNEL (SCREEN 02 SECTION 3) */}
      {(activeTab === "overview" || activeTab === "analytics") && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Velocity & Medium Mix Chart (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl bg-surface-primary border border-theme soft-surface flex flex-col justify-between space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-theme-subtle">
              <div>
                <h2 className="text-lg sm:text-xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token">
                  Revenue Velocity &amp; Medium Mix
                </h2>
                <p className="text-xs text-secondary-token mt-0.5">
                  Gross sales by publishing medium across reporting period
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 font-heading text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-brand-token" />
                  <span className="text-secondary-token">Books</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#2CE0C9]" />
                  <span className="text-secondary-token">Comics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-sky-400" />
                  <span className="text-secondary-token">Podcasts</span>
                </div>
              </div>
            </div>

            {/* Stacked Bars Timeline (Screen 02 Oct 01 to Today) */}
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
              {[
                { date: "Oct 01", books: 58, comics: 24, podcasts: 18 },
                { date: "Oct 05", books: 64, comics: 30, podcasts: 22 },
                { date: "Oct 10", books: 82, comics: 34, podcasts: 28 },
                { date: "Oct 15", books: 94, comics: 42, podcasts: 32 },
                { date: "Oct 20", books: 76, comics: 38, podcasts: 26 },
                { date: "Oct 25", books: 104, comics: 48, podcasts: 40, highlight: true },
                { date: "Today", books: 112, comics: 52, podcasts: 46 },
              ].map((point) => (
                <div
                  key={point.date}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-full flex flex-col items-center gap-1 justify-end h-40">
                    <div
                      className="w-full max-w-[32px] rounded-t-sm bg-sky-400 transition-all duration-300 group-hover:opacity-80"
                      style={{ height: `${point.podcasts}px` }}
                    />
                    <div
                      className="w-full max-w-[32px] bg-[#2CE0C9] transition-all duration-300 group-hover:opacity-80"
                      style={{ height: `${point.comics}px` }}
                    />
                    <div
                      className="w-full max-w-[32px] rounded-b-sm bg-brand-token transition-all duration-300 group-hover:opacity-80"
                      style={{ height: `${point.books}px` }}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-mono tabular-nums ${
                      point.highlight ? "font-semibold text-brand-token underline" : "text-muted-token"
                    }`}
                  >
                    {point.date}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom Micro Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-theme-subtle text-left">
              <div>
                <p className="font-heading text-xs text-muted-token font-medium">Books Catalog GMV</p>
                <p className="text-base sm:text-lg font-semibold font-serif-editorial tracking-[-0.015em] tabular-nums text-primary-token mt-0.5">
                  {formatMoney(771108)}
                </p>
              </div>
              <div>
                <p className="font-heading text-xs text-muted-token font-medium">Graphic Comics GMV</p>
                <p className="text-base sm:text-lg font-semibold font-serif-editorial tracking-[-0.015em] tabular-nums text-primary-token mt-0.5">
                  {formatMoney(385554)}
                </p>
              </div>
              <div>
                <p className="font-heading text-xs text-muted-token font-medium">Podcasts &amp; Masterclasses</p>
                <p className="text-base sm:text-lg font-semibold font-serif-editorial tracking-[-0.015em] tabular-nums text-primary-token mt-0.5">
                  {formatMoney(326238)}
                </p>
              </div>
            </div>
          </div>

          {/* 10-Page Reader Funnel (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-surface-primary border border-theme soft-surface flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token">
                  10-Page Reader Funnel
                </h2>
                <span className="flex items-center gap-1.5 font-heading text-[11px] leading-none font-semibold text-[#2CE0C9] bg-[#2CE0C9]/15 px-2.5 py-1 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2CE0C9] animate-pulse" />
                  Live Stream
                </span>
              </div>
              <p className="text-xs text-secondary-token mt-1">
                Reader drop-off and conversion across sample reading gates
              </p>
            </div>

            {/* Visual Funnel 4 Stages (Screen 02) */}
            <div className="space-y-3">
              {/* Stage 1 */}
              <div className="p-3 bg-surface-secondary/60 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-semibold text-primary-token flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-primary border border-theme text-xs font-mono tabular-nums font-semibold flex items-center justify-center">
                      1
                    </span>
                    Preview Started
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-primary-token">24,620</span>
                </div>
                <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-token h-full rounded-full" style={{ width: "100%" }} />
                </div>
                <span className="text-[11px] text-muted-token block leading-snug">100% of organic reader sample impressions</span>
              </div>

              {/* Stage 2 */}
              <div className="p-3 bg-surface-secondary/60 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-semibold text-primary-token flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-primary border border-theme text-xs font-mono tabular-nums font-semibold flex items-center justify-center">
                      2
                    </span>
                    10th Page Reached
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-primary-token">11,818</span>
                </div>
                <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-token h-full rounded-full" style={{ width: "48%" }} />
                </div>
                <span className="text-[11px] text-muted-token block leading-snug">48.0% retention through opening teaser chapter</span>
              </div>

              {/* Stage 3 */}
              <div className="p-3 bg-surface-secondary/60 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-semibold text-primary-token flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-surface-primary border border-theme text-xs font-mono tabular-nums font-semibold flex items-center justify-center">
                      3
                    </span>
                    Paywall Click / Intent
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-primary-token">5,416</span>
                </div>
                <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-accent-gold h-full rounded-full" style={{ width: "22%" }} />
                </div>
                <span className="text-[11px] text-muted-token block leading-snug">45.8% CTR on embedded unlocking trigger</span>
              </div>

              {/* Stage 4 */}
              <div className="p-3 bg-surface-secondary/60 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-semibold text-[#2CE0C9] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2CE0C9]/20 text-[#2CE0C9] text-xs font-mono tabular-nums font-semibold flex items-center justify-center">
                      4
                    </span>
                    Razorpay Settled
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-[#2CE0C9]">3,240</span>
                </div>
                <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2CE0C9] h-full rounded-full" style={{ width: "18.6%" }} />
                </div>
                <span className="text-[11px] text-[#2CE0C9] font-semibold block leading-snug">18.6% overall conversion (Preview → Cash)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary/80 border border-theme flex items-center justify-between text-xs">
              <span className="text-secondary-token font-medium">Optimal Sample Length</span>
              <span className="font-heading font-semibold text-brand-token">10 Pages (Rule Active)</span>
            </div>
          </div>
        </section>
      )}

      {/* TAB B: 10-PAGE READER FUNNEL DEDICATED ANALYSIS */}
      {activeTab === "funnel" && (
        <section className="p-6 sm:p-8 rounded-2xl bg-surface-primary border border-theme soft-surface space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme pb-4">
            <div>
              <h2 className="text-xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token">
                10-Page Preview Cutoff Conversion Telemetry
              </h2>
              <p className="text-xs text-secondary-token mt-0.5">
                Detailed step-by-step conversion analytics from organic reader impressions to settled entitlements.
              </p>
            </div>
            <Badge variant="gold">Strict 10-Page Hard Boundary Active</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-surface-secondary/60 border border-theme space-y-2">
              <span className="font-heading text-[11px] font-semibold text-muted-token uppercase tracking-[0.06em]">1. Preview Opened</span>
              <p className="text-3xl font-serif-editorial font-semibold tracking-[-0.025em] tabular-nums text-primary-token">24,620</p>
              <p className="text-xs text-secondary-token leading-relaxed">Average reading duration: 8m 40s across free preview.</p>
            </div>
            <div className="p-5 rounded-xl bg-surface-secondary/60 border border-theme space-y-2">
              <span className="font-heading text-[11px] font-semibold text-muted-token uppercase tracking-[0.06em]">2. Page 10 Milestone</span>
              <p className="text-3xl font-serif-editorial font-semibold tracking-[-0.025em] tabular-nums text-primary-token">11,818</p>
              <p className="text-xs text-secondary-token leading-relaxed">48% completion of free preview sample chapter.</p>
            </div>
            <div className="p-5 rounded-xl bg-surface-secondary/60 border border-theme space-y-2">
              <span className="font-heading text-[11px] font-semibold text-muted-token uppercase tracking-[0.06em]">3. Paywall Trigger Hit</span>
              <p className="text-3xl font-serif-editorial font-semibold tracking-[-0.025em] tabular-nums text-accent-gold">5,416</p>
              <p className="text-xs text-secondary-token leading-relaxed">Users initiated checkout folio from Page 11 lock screen.</p>
            </div>
            <div className="p-5 rounded-xl bg-surface-secondary/60 border border-theme space-y-2">
              <span className="font-heading text-[11px] font-semibold text-muted-token uppercase tracking-[0.06em]">4. Instant Entitlement</span>
              <p className="text-3xl font-serif-editorial font-semibold tracking-[-0.025em] tabular-nums text-[#2CE0C9]">3,240</p>
              <p className="text-xs text-secondary-token leading-relaxed">Permanent browser entitlement issued with zero latency.</p>
            </div>
          </div>
        </section>
      )}

      {/* TAB C: EDITORIAL CATALOG MASTER (MATCHING STITCH SCREEN 02 SECTION 4) */}
      {(activeTab === "overview" || activeTab === "catalog") && (
        <section className="p-6 sm:p-8 rounded-2xl bg-surface-primary border border-theme soft-surface space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-theme">
            <div>
              <h2 className="text-xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token">
                Editorial Catalog Master
              </h2>
              <p className="text-xs text-secondary-token mt-0.5">
                Manage editions, adjust pricing, inspect preview status, and deploy publishing commands.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-token absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Filter title, author, SKU..."
                  className="pl-9 pr-4 py-1.5 rounded-full bg-surface-secondary border border-theme text-xs text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token w-56 sm:w-64"
                />
              </div>

              {/* Category Filter Tabs */}
              <div className="inline-flex items-center p-0.5 rounded-full bg-surface-secondary border border-theme font-heading text-xs">
                {(["all", "books", "comics", "podcasts"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setCatalogFilter(filter)}
                    className={`px-3 py-1 rounded-full font-semibold capitalize transition-all cursor-pointer ${
                      catalogFilter === filter
                        ? "bg-surface-primary text-primary-token shadow-sm"
                        : "text-muted-token hover:text-primary-token"
                    }`}
                  >
                    {filter === "all" ? `All (${allCatalogItems.length})` : filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CATALOG TABLE (MATCHING STITCH SCREEN 02 TABLE) */}
          <div className="overflow-x-auto rounded-xl border border-theme">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-secondary text-secondary-token border-b border-theme font-heading text-[11px] font-semibold uppercase tracking-[0.05em]">
                  <th className="py-3 px-4">Item &amp; Cover</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Lifecycle</th>
                  <th className="py-3 px-3">10-Page Preview</th>
                  <th className="py-3 px-3">Conversion</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme bg-surface-primary">
                {filteredCatalog.slice(0, 10).map((item) => (
                  <tr key={item.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-10 h-12 rounded object-cover border border-theme shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-heading font-semibold text-primary-token truncate">{item.title}</p>
                          <p className="text-[11px] text-muted-token truncate mt-0.5">
                            {item.author || item.creator || item.host} • <span className="font-mono">SKU-{item.id.toUpperCase()}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-heading capitalize font-semibold text-secondary-token">
                        {item.itemType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold tabular-nums text-primary-token">
                      {formatMoney(item.price || 799)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-heading text-[11px] leading-none font-semibold bg-[#2CE0C9]/15 text-[#2CE0C9]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2CE0C9]" />
                        Live • In-Market
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-heading text-[11px] leading-none font-medium bg-brand-token/10 text-brand-token">
                        <Lock className="w-2.5 h-2.5" />
                        {item.previewRule}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-semibold tabular-nums text-[#2CE0C9]">
                      {item.conversion}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          className="p-1.5 rounded-lg border border-theme text-secondary-token hover:text-primary-token hover:bg-surface-secondary"
                          title="Edit Metadata"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={item.itemType === "book" ? `/books/${item.slug || item.id}` : item.itemType === "comic" ? `/comics/${item.slug || item.id}` : `/podcasts/${item.slug || item.id}`}
                          className="p-1.5 rounded-lg border border-theme text-secondary-token hover:text-primary-token hover:bg-surface-secondary"
                          title="View Live Reader Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          className="p-1.5 rounded-lg border border-theme text-secondary-token hover:text-red-400 hover:bg-red-500/10"
                          title="Archive Volume"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB D: RECENT READER TRANSACTIONS (MATCHING STITCH SCREEN 02 SECTION 5) */}
      {(activeTab === "overview" || activeTab === "transactions") && (
        <section className="p-6 sm:p-8 rounded-2xl bg-surface-primary border border-theme soft-surface space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-theme">
            <div>
              <div className="flex items-center gap-1.5 font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-[#2CE0C9]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>RAZORPAY DIRECT CAPTURE &amp; SETTLEMENT PIPELINE</span>
              </div>
              <h2 className="text-xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token mt-1">
                Recent Reader Transactions
              </h2>
            </div>

            <Button variant="secondary" size="sm" onClick={handleExportCSV}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV Audit Ledger
            </Button>
          </div>

          {exportNotice && (
            <div className="p-3 rounded-xl bg-[#2CE0C9]/15 text-[#2CE0C9] font-heading text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2CE0C9]" />
              CSV Audit Ledger generated successfully: leadsphere_ledger_settlement_oct2026.csv
            </div>
          )}

          {/* Transactions List */}
          <div className="divide-y divide-theme border border-theme rounded-xl overflow-hidden bg-surface-primary">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-token/10 text-brand-token font-heading font-bold text-xs flex items-center justify-center shrink-0">
                    {order.customerEmail.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-semibold text-xs text-primary-token">{order.id}</span>
                      <span className="text-[11px] font-mono text-muted-token">
                        RZP-{order.razorpayPaymentId || order.razorpayOrderId || "PAY-VERIFIED"}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-token">{order.customerEmail}</p>
                    <p className="text-[11px] text-muted-token mt-0.5">
                      Purchased on {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • Instant Entitlement Verified
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="text-base font-semibold font-serif-editorial tracking-[-0.015em] tabular-nums text-primary-token">
                      {formatMoney(order.totalAmount)}
                    </p>
                    <span
                      className={`inline-block font-heading text-[11px] leading-none font-semibold uppercase tracking-[0.04em] px-2.5 py-1 rounded-full mt-0.5 ${
                        order.status === "payment_successful"
                          ? "bg-[#2CE0C9]/15 text-[#2CE0C9]"
                          : order.status === "refunded"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-accent-gold/15 text-accent-gold"
                      }`}
                    >
                      {order.status === "payment_successful" ? "Settled" : order.status}
                    </span>
                  </div>

                  {order.status === "payment_successful" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefund(order.id)}
                      className="text-xs"
                    >
                      Refund
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MODAL: UPLOAD NEW CONTENT */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-primary border border-theme rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-5 right-5 text-muted-token hover:text-primary-token"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="font-heading text-[11px] font-semibold text-accent-gold uppercase tracking-[0.06em]">
                Ops Hub • Publishing Pipeline
              </span>
              <h3 className="text-2xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token mt-1">
                Upload New Catalog Edition
              </h3>
              <p className="text-xs text-secondary-token mt-1 leading-relaxed">
                Deploy a new book, sequential comic album, or video masterclass with automatic 10-page preview rules.
              </p>
            </div>

            <form onSubmit={handleCreateContent} className="space-y-4 text-xs">
              <div>
                <label className="font-heading font-semibold text-primary-token block mb-1.5">Content Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Asymmetric Thinking &amp; Capital"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-theme text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-heading font-semibold text-primary-token block mb-1.5">Publishing Medium</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-secondary border border-theme text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
                  >
                    <option value="book">Curated Book</option>
                    <option value="comic">Graphic Comic Album</option>
                    <option value="podcast">Video Podcast Series</option>
                  </select>
                </div>
                <div>
                  <label className="font-heading font-semibold text-primary-token block mb-1.5">Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-theme font-mono tabular-nums text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
                  />
                </div>
              </div>

              <div>
                <label className="font-heading font-semibold text-primary-token block mb-1.5">Author / Creator</label>
                <input
                  type="text"
                  value={newCreator}
                  onChange={(e) => setNewCreator(e.target.value)}
                  placeholder="e.g. Julian Vance, Ph.D."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-theme text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
                />
              </div>

              <div className="p-3 bg-surface-secondary rounded-xl border border-theme text-[11px] text-secondary-token space-y-1 leading-relaxed">
                <span className="font-heading font-semibold text-brand-token block">Automatic Preview Guard:</span>
                <span>• Pages 1–10 automatically designated as unrestricted free sample.</span>
                <span>• Page 11 onward protected by encrypted entitlement signature.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button variant="secondary" size="md" type="button" onClick={() => setUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Deploy to Catalog
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
