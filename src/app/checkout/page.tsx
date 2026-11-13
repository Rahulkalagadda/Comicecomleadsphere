"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useTheme } from "@/lib/theme/ThemeContext";
import {
  CartFolioItem,
  DEFAULT_CART_ITEMS,
  getCartItems,
  removeFromCart,
  clearCart,
  addToCart,
  createOrder,
  verifyPayment,
} from "@/lib/api/client";
import {
  SEED_BOOKS,
  SEED_COMICS,
  SEED_PODCASTS,
  SEED_CURRENT_USER,
} from "@/lib/api/seedData";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  AlertTriangle,
  X,
  ArrowRight,
  Tag,
  HelpCircle,
  Check,
  Palette,
  Sparkles,
  CheckCheck,
  Laptop,
  MailCheck,
  IndianRupee,
  Trash2,
  RotateCcw,
} from "lucide-react";

type PaymentTab = "cards" | "upi" | "netbanking" | "wallets";

interface ResolvedCheckoutSelection {
  items: CartFolioItem[];
  entitlementTargets: {
    id: string;
    title: string;
    price: number;
    type: "book" | "comic" | "podcast_episode" | "podcast";
    coverUrl?: string;
  }[];
  isDirect: boolean;
}

const BUNDLE_DEFINITIONS: Record<
  string,
  {
    folio: CartFolioItem;
    constituents: {
      id: string;
      title: string;
      price: number;
      type: "book" | "comic" | "podcast_episode";
      coverUrl?: string;
    }[];
  }
> = {
  "season-1-collector": {
    folio: {
      id: "season-1-collector",
      title: "Season 1 Complete AI Jungle Safari Collector Bundle",
      type: "bundle",
      badge: "SEASON 1",
      edition: "13-Chapter Blueprint + 3 Comic Issues + Video Clips 01–03",
      authorOrHost: "Dr. Amit Khandelwal & The AI Jungle Studio",
      tierOrFormat: "Complete Bundle • Instant My Library Access",
      price: 1999,
      coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
    },
    constituents: [
      {
        id: "book-jungle-safari",
        title: SEED_BOOKS[0].title,
        price: 899,
        type: "book",
        coverUrl: SEED_BOOKS[0].coverUrl,
      },
      {
        id: "book-jungle-audit-handbook",
        title: SEED_BOOKS[1].title,
        price: 599,
        type: "book",
        coverUrl: SEED_BOOKS[1].coverUrl,
      },
      {
        id: "comic-jungle-audit",
        title: SEED_COMICS[0].title,
        price: 299,
        type: "comic",
        coverUrl: SEED_COMICS[0].coverUrl,
      },
      {
        id: "comic-jungle-part-1",
        title: SEED_COMICS[1].title,
        price: 251,
        type: "comic",
        coverUrl: SEED_COMICS[1].coverUrl,
      },
      {
        id: "comic-jungle-part-2",
        title: SEED_COMICS[2].title,
        price: 250,
        type: "comic",
        coverUrl: SEED_COMICS[2].coverUrl,
      },
    ],
  },
  "jungle-audit-pack": {
    folio: {
      id: "jungle-audit-pack",
      title: "The Jungle Audit Executive Starter Pack",
      type: "bundle",
      badge: "STARTER PACK",
      edition: "Maturity Playbook + Part 1 & 2 Comics + Clips 01–03",
      authorOrHost: "Dr. Amit Khandelwal • Lion, Wolf & Elephant",
      tierOrFormat: "Complete Pack • Instant My Library Access",
      price: 1299,
      coverUrl: "/media/images/ai-jungle-podcast-comic.jpg",
    },
    constituents: [
      {
        id: "book-jungle-audit-handbook",
        title: SEED_BOOKS[1].title,
        price: 599,
        type: "book",
        coverUrl: SEED_BOOKS[1].coverUrl,
      },
      {
        id: "comic-jungle-part-1",
        title: SEED_COMICS[1].title,
        price: 350,
        type: "comic",
        coverUrl: SEED_COMICS[1].coverUrl,
      },
      {
        id: "comic-jungle-part-2",
        title: SEED_COMICS[2].title,
        price: 350,
        type: "comic",
        coverUrl: SEED_COMICS[2].coverUrl,
      },
    ],
  },
};

function resolveDirectSelection(
  typeParam: string | null,
  idParam: string | null
): ResolvedCheckoutSelection | null {
  if (!typeParam || !idParam) return null;

  if (typeParam === "bundle" && BUNDLE_DEFINITIONS[idParam]) {
    const bundle = BUNDLE_DEFINITIONS[idParam];
    return {
      items: [bundle.folio],
      entitlementTargets: bundle.constituents,
      isDirect: true,
    };
  }

  if (typeParam === "book") {
    const book = SEED_BOOKS.find((b) => b.id === idParam || b.slug === idParam);
    if (book) {
      const item: CartFolioItem = {
        id: book.id,
        title: book.title,
        type: "book",
        badge: "BOOK",
        edition: `${book.category} • ${book.pageCount} Pages`,
        authorOrHost: book.author,
        tierOrFormat: "Full Browser Access • 10-Page Preview Certified",
        price: book.price,
        coverUrl: book.coverUrl,
      };
      return {
        items: [item],
        entitlementTargets: [
          {
            id: book.id,
            title: book.title,
            price: book.price,
            type: "book",
            coverUrl: book.coverUrl,
          },
        ],
        isDirect: true,
      };
    }
  }

  if (typeParam === "comic") {
    const comic = SEED_COMICS.find((c) => c.id === idParam || c.slug === idParam);
    if (comic) {
      const item: CartFolioItem = {
        id: comic.id,
        title: comic.title,
        type: "comic",
        badge: "COMIC",
        edition: `${comic.genre} • ${comic.pageCount} Pages`,
        authorOrHost: comic.creator,
        tierOrFormat: "High-Res Web Reader • 10-Page Preview Certified",
        price: comic.price,
        coverUrl: comic.coverUrl,
      };
      return {
        items: [item],
        entitlementTargets: [
          {
            id: comic.id,
            title: comic.title,
            price: comic.price,
            type: "comic",
            coverUrl: comic.coverUrl,
          },
        ],
        isDirect: true,
      };
    }
  }

  if (typeParam === "podcast_episode" || typeParam === "episode" || typeParam === "podcast") {
    for (const series of SEED_PODCASTS) {
      const ep = series.episodes.find((e) => e.id === idParam);
      if (ep) {
        const item: CartFolioItem = {
          id: ep.id,
          title: ep.title,
          type: "podcast_episode",
          badge: "VIDEO",
          edition: `${series.title} • ${ep.duration}`,
          authorOrHost: series.host,
          tierOrFormat: "4K Studio Video Stream • Synced Browser Transcript",
          price: ep.price,
          coverUrl: ep.thumbnailUrl,
        };
        return {
          items: [item],
          entitlementTargets: [
            {
              id: ep.id,
              title: ep.title,
              price: ep.price,
              type: "podcast_episode",
              coverUrl: ep.thumbnailUrl,
            },
          ],
          isDirect: true,
        };
      }
    }
  }

  return null;
}

function CheckoutContent() {
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const idParam = searchParams.get("id");

  const directSelection = resolveDirectSelection(typeParam, idParam);

  // Cart items state (synced to localStorage in Cart mode)
  const [cartItems, setCartItems] = useState<CartFolioItem[]>(DEFAULT_CART_ITEMS);

  useEffect(() => {
    const syncCart = () => {
      setCartItems(getCartItems());
    };
    syncCart();
    window.addEventListener("leadsphere-cart-updated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("leadsphere-cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const displayedItems = directSelection ? directSelection.items : cartItems;
  const isDirectMode = Boolean(directSelection);

  // Payment tab state
  const [activeTab, setActiveTab] = useState<PaymentTab>("cards");

  // Form states
  const [cardName, setCardName] = useState(SEED_CURRENT_USER.name);
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4092");
  const [cardExpiry, setCardExpiry] = useState("09 / 28");
  const [cardCvc, setCardCvc] = useState("•••");
  const [saveCard, setSaveCard] = useState(true);

  // UPI state
  const [upiVpa, setUpiVpa] = useState("marcus.vance@okhdfcbank");
  const [isUpiVerified, setIsUpiVerified] = useState(false);

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState("hdfc");

  // Wallets state
  const [selectedWallet, setSelectedWallet] = useState("paytm");

  // Promo Code
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountPct, setPromoDiscountPct] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Checkout process & modal
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [settledPaymentId, setSettledPaymentId] = useState("");
  const [settledOrderNumber, setSettledOrderNumber] = useState("");
  const [settledTitles, setSettledTitles] = useState<string[]>([]);
  const [settledTotal, setSettledTotal] = useState<number>(0);

  const settlementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (settlementTimerRef.current) {
        clearTimeout(settlementTimerRef.current);
      }
    };
  }, []);

  const isJungle = theme === "jungle";

  // Financial calculations (INR Only)
  const rawSubtotal = displayedItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = appliedPromo ? (rawSubtotal * promoDiscountPct) / 100 : 0;
  const finalTotal = Math.max(0, Math.round(rawSubtotal - discountAmount));

  const formatPrice = (val: number) => `₹${Math.round(val).toLocaleString("en-IN")}`;

  const handleApplyPromo = () => {
    const clean = promoInput.trim().toUpperCase();
    if (!clean) return;

    if (
      clean === "STRATEGY20" ||
      clean === "FELLOWSHIP20" ||
      clean === "LEADSPHERE" ||
      clean === "LUMINA"
    ) {
      setAppliedPromo(clean);
      setPromoDiscountPct(20);
      setPromoMessage({ text: "20% Creator Fellowship discount applied!", isError: false });
    } else if (clean === "JUNGLE50" || clean === "DISCOVERY50") {
      setAppliedPromo(clean);
      setPromoDiscountPct(50);
      setPromoMessage({ text: "50% Jungle Explorer discount applied!", isError: false });
    } else {
      setPromoMessage({
        text: "Invalid promo code. Try STRATEGY20, LEADSPHERE, or JUNGLE50",
        isError: true,
      });
    }
  };

  const handleRemoveCartItem = (id: string) => {
    const updated = removeFromCart(id);
    setCartItems(updated);
  };

  const handleRestoreDefaultFolio = () => {
    DEFAULT_CART_ITEMS.forEach((item) => addToCart(item));
    setCartItems(getCartItems());
  };

  const handleAuthorizeAndSettle = async () => {
    if (displayedItems.length === 0) {
      setCheckoutError("Your Checkout Folio is empty. Add a book, comic, or podcast episode first.");
      return;
    }

    try {
      setCheckoutError(null);
      setIsProcessing(true);

      const lineItems: {
        id: string;
        title: string;
        price: number;
        type: "book" | "comic" | "podcast_episode" | "podcast";
        coverUrl?: string;
      }[] = directSelection
        ? directSelection.entitlementTargets
        : displayedItems.flatMap((it) => {
            if (it.type === "bundle") {
              return BUNDLE_DEFINITIONS[it.id]?.constituents ?? [];
            }
            return [
              {
                id: it.id,
                title: it.title,
                price: it.price,
                type: it.type,
                coverUrl: it.coverUrl,
              },
            ];
          });

      const combinedTitle =
        displayedItems.length === 1
          ? displayedItems[0].title
          : `${displayedItems[0].title} & ${displayedItems.length - 1} more`;

      // 1. Create order in platform system
      const order = await createOrder(
        {
          id: displayedItems[0].id,
          title: combinedTitle,
          price: finalTotal,
          type: displayedItems[0].type,
        },
        {
          name: cardName || SEED_CURRENT_USER.name,
          email: SEED_CURRENT_USER.email,
        },
        lineItems
      );

      const snapshotTitles = displayedItems.map((it) => it.title);
      const snapshotTotal = finalTotal;

      // 2. Simulate Razorpay Gateway settlement
      if (settlementTimerRef.current) {
        clearTimeout(settlementTimerRef.current);
      }

      settlementTimerRef.current = setTimeout(async () => {
        const generatedRzpId = `RZP_${Math.floor(10000000 + Math.random() * 90000000)}`;
        try {
          await verifyPayment(order.id, generatedRzpId);
          if (!isDirectMode) {
            clearCart();
          }
          setSettledPaymentId(generatedRzpId);
          setSettledOrderNumber(order.orderNumber || `AGY-${Date.now().toString().slice(-6)}`);
          setSettledTitles(snapshotTitles);
          setSettledTotal(snapshotTotal);
          setIsProcessing(false);
          setSuccessModalOpen(true);
        } catch (err: any) {
          setIsProcessing(false);
          setCheckoutError(
            err?.message || "Razorpay payment verification failed. Please retry your transaction."
          );
        }
      }, 1400);
    } catch (err: any) {
      setIsProcessing(false);
      setCheckoutError(
        err?.message || "Unable to initiate Razorpay checkout session. Please try again."
      );
    }
  };

  return (
    <main className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Editorial Header & Trust Ribbon */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-secondary-token font-heading text-xs mb-1.5">
              <span className="font-semibold uppercase tracking-[0.08em] text-[11px]">
                Folio Vault &amp; Entitlements
              </span>
              <span className="text-muted-token">•</span>
              <span className="font-semibold text-[#2CE0C9] flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-bit Encrypted Session
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial text-primary-token tracking-[-0.025em]">
              Checkout Folio
            </h1>
          </div>

          {/* Quick Trust Indicators & INR Domestic Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 bg-surface-secondary border border-theme rounded-xl px-3 py-1.5 shadow-sm text-xs font-semibold text-primary-token">
              <IndianRupee className="w-3.5 h-3.5 text-brand-token" />
              <span>INR Domestic</span>
            </div>

            <div className="flex items-center gap-3 bg-surface-secondary border border-theme px-3.5 py-1.5 rounded-xl shadow-sm text-xs">
              <div className="flex items-center gap-1.5 text-secondary-token">
                <ShieldCheck className="w-4 h-4 text-[#2CE0C9]" />
                <span className="font-medium text-primary-token">Razorpay Vaulted</span>
              </div>
              <span className="w-1 h-3 bg-border-subtle rounded-full" />
              <div className="flex items-center gap-1.5 text-secondary-token">
                <Sparkles className="w-4 h-4 text-brand-token" />
                <span className="font-medium text-primary-token">Instant Unlocking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace: Asymmetrical 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Payment Architecture & Gateway Integration (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Razorpay Orchestration Board */}
            <div className="bg-surface-primary rounded-2xl p-6 sm:p-8 border border-theme shadow-md transition-all">
              {/* Header with PCI-DSS Status */}
              <div className="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-theme gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-token/10 text-brand-token flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold font-serif-editorial tracking-[-0.015em] text-primary-token">
                      Payment Mechanism
                    </h2>
                    <p className="text-xs text-secondary-token">
                      Razorpay India Standard Routing
                    </p>
                  </div>
                </div>

                {/* Gateway Status Pill */}
                <div className="inline-flex items-center gap-1.5 bg-[#2CE0C9]/15 text-[#2CE0C9] px-3 py-1 rounded-full text-xs font-semibold border border-[#2CE0C9]/30">
                  <span className="w-2 h-2 rounded-full bg-[#2CE0C9] animate-pulse" />
                  <span>PCI-DSS L1 Compliant</span>
                </div>
              </div>

              {/* 4 Payment Method Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-surface-secondary p-1.5 rounded-xl mb-6 border border-theme">
                <button
                  type="button"
                  onClick={() => setActiveTab("cards")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "cards"
                      ? "bg-surface-primary text-primary-token shadow-sm border border-theme"
                      : "text-secondary-token hover:text-primary-token"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-brand-token" />
                  <span>Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("upi")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "upi"
                      ? "bg-surface-primary text-primary-token shadow-sm border border-theme"
                      : "text-secondary-token hover:text-primary-token"
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#2CE0C9]" />
                  <span>UPI Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("netbanking")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "netbanking"
                      ? "bg-surface-primary text-primary-token shadow-sm border border-theme"
                      : "text-secondary-token hover:text-primary-token"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-accent-gold" />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("wallets")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "wallets"
                      ? "bg-surface-primary text-primary-token shadow-sm border border-theme"
                      : "text-secondary-token hover:text-primary-token"
                  }`}
                >
                  <Wallet className="w-4 h-4 text-brand-token" />
                  <span>Wallets</span>
                </button>
              </div>

              {/* TAB 1: CARDS */}
              {activeTab === "cards" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-token mb-1.5">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Full name on card"
                      className="w-full bg-surface-secondary border border-theme rounded-xl px-4 py-2.5 text-sm text-primary-token outline-none focus:ring-2 focus:ring-brand-token/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-token mb-1.5">
                      Card Digits
                    </label>
                    <div className="flex items-center bg-surface-secondary border border-theme rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-brand-token/30 transition-all">
                      <CreditCard className="w-4 h-4 text-secondary-token mr-2.5 flex-shrink-0" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card number"
                        className="w-full bg-transparent text-sm text-primary-token outline-none font-mono"
                      />
                      <span className="text-[11px] font-mono font-semibold bg-surface-primary border border-theme px-2 py-0.5 rounded text-secondary-token ml-2">
                        VISA
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-token mb-1.5">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full bg-surface-secondary border border-theme rounded-xl px-4 py-2.5 text-sm text-primary-token outline-none font-mono focus:ring-2 focus:ring-brand-token/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-token mb-1.5">
                        Security CVC
                      </label>
                      <div className="flex items-center bg-surface-secondary border border-theme rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-brand-token/30 transition-all">
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full bg-transparent text-sm text-primary-token outline-none font-mono"
                        />
                        <HelpCircle className="w-4 h-4 text-secondary-token ml-1 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="save-card-box"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-token accent-brand-token cursor-pointer"
                    />
                    <label
                      htmlFor="save-card-box"
                      className="text-xs text-secondary-token cursor-pointer select-none"
                    >
                      Vault this card securely on Razorpay Tokenized Network
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: UPI INSTANT */}
              {activeTab === "upi" && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-150">
                  <div className="p-4 bg-surface-secondary rounded-xl border border-theme flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 bg-[#F5F1E6] rounded-xl p-2 border border-[#F5C451]/40 shadow-sm flex items-center justify-center flex-shrink-0">
                      <svg className="w-full h-full text-[#07100D]" viewBox="0 0 80 80">
                        <rect width="24" height="24" fill="currentColor" />
                        <rect x="4" y="4" width="16" height="16" fill="#F5F1E6" />
                        <rect x="8" y="8" width="8" height="8" fill="currentColor" />
                        <rect x="56" width="24" height="24" fill="currentColor" />
                        <rect x="60" y="4" width="16" height="16" fill="#F5F1E6" />
                        <rect x="64" y="8" width="8" height="8" fill="currentColor" />
                        <rect y="56" width="24" height="24" fill="currentColor" />
                        <rect x="4" y="60" width="16" height="16" fill="#F5F1E6" />
                        <rect x="8" y="64" width="8" height="8" fill="currentColor" />
                        <rect x="32" y="4" width="16" height="8" fill="currentColor" />
                        <rect x="36" y="24" width="12" height="12" fill="currentColor" />
                        <rect x="56" y="32" width="20" height="8" fill="currentColor" />
                        <rect x="28" y="44" width="20" height="12" fill="currentColor" />
                        <rect x="56" y="56" width="16" height="16" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-sm text-primary-token">Instant App Scan</h3>
                      <p className="text-xs text-secondary-token mt-1 leading-relaxed">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM. Instant UPI auto-settle.
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2CE0C9] mt-2">
                        <Check className="w-3.5 h-3.5" /> 0% Additional Surcharge
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary-token mb-1.5">
                      Or enter UPI ID / VPA
                    </label>
                    <div className="flex items-center bg-surface-secondary border border-theme rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-brand-token/30 transition-all">
                      <input
                        type="text"
                        value={upiVpa}
                        onChange={(e) => {
                          setUpiVpa(e.target.value);
                          setIsUpiVerified(false);
                        }}
                        placeholder="username@okhdfcbank"
                        className="w-full bg-transparent text-sm text-primary-token outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setIsUpiVerified(true)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          isUpiVerified
                            ? "bg-[#2CE0C9]/15 text-[#2CE0C9]"
                            : "text-brand-token hover:underline"
                        }`}
                      >
                        {isUpiVerified ? "✓ Verified" : "Verify"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NET BANKING */}
              {activeTab === "netbanking" && (
                <div className="flex flex-col gap-3 animate-in fade-in duration-150">
                  <p className="text-xs text-secondary-token">
                    Select your institutional clearing provider:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: "hdfc", name: "HDFC Bank", code: "HDFC", color: "text-sky-400" },
                      { id: "icici", name: "ICICI Direct", code: "ICICI", color: "text-orange-400" },
                      { id: "sbi", name: "State Bank of India", code: "SBI", color: "text-[#2CE0C9]" },
                      { id: "axis", name: "Axis Bank", code: "AXIS", color: "text-rose-400" },
                      { id: "kotak", name: "Kotak Mahindra", code: "KOTAK", color: "text-red-400" },
                      { id: "other", name: "All Other Banks", code: "50+ MORE", color: "text-secondary-token" },
                    ].map((bank) => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`p-3 rounded-xl text-left flex flex-col justify-between h-20 border transition-all cursor-pointer ${
                          selectedBank === bank.id
                            ? "bg-surface-primary border-brand-token ring-2 ring-brand-token/20 shadow-sm"
                            : "bg-surface-secondary border-theme hover:bg-surface-primary/60"
                        }`}
                      >
                        <span className={`font-mono text-[11px] font-bold tracking-[0.04em] ${bank.color}`}>{bank.code}</span>
                        <span className="font-heading text-xs font-semibold text-primary-token truncate">
                          {bank.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: WALLETS */}
              {activeTab === "wallets" && (
                <div className="flex flex-col gap-2.5 animate-in fade-in duration-150">
                  {[
                    { id: "paytm", name: "Paytm Wallet & Postpaid", icon: Wallet, color: "text-sky-400" },
                    { id: "amazon", name: "Amazon Pay Balance", icon: Wallet, color: "text-[#F5C451]" },
                    { id: "phonepe", name: "PhonePe Wallet", icon: Wallet, color: "text-purple-400" },
                  ].map((wallet) => (
                    <label
                      key={wallet.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedWallet === wallet.id
                          ? "bg-surface-primary border-brand-token ring-2 ring-brand-token/20 shadow-sm"
                          : "bg-surface-secondary border-theme hover:bg-surface-primary/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <wallet.icon className={`w-5 h-5 ${wallet.color}`} />
                        <span className="text-xs font-semibold text-primary-token">{wallet.name}</span>
                      </div>
                      <input
                        type="radio"
                        name="wallet-selection"
                        checked={selectedWallet === wallet.id}
                        onChange={() => setSelectedWallet(wallet.id)}
                        className="accent-brand-token"
                      />
                    </label>
                  ))}
                </div>
              )}

              {/* Error Banner */}
              {checkoutError && (
                <div
                  role="alert"
                  className="mt-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span className="flex-1 font-medium">{checkoutError}</span>
                  <button
                    type="button"
                    onClick={() => setCheckoutError(null)}
                    aria-label="Dismiss error"
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Dual-Mode Trigger Checkout CTA */}
              <div className="mt-8 pt-6 border-t border-theme">
                <button
                  type="button"
                  disabled={isProcessing || displayedItems.length === 0}
                  onClick={handleAuthorizeAndSettle}
                  className="font-heading w-full py-3.5 px-6 rounded-xl bg-brand hover:bg-brand-hover text-[#07100D] font-semibold tabular-nums text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#07100D]/25 border-t-[#07100D] rounded-full animate-spin" />
                      <span>Authorizing via Razorpay TLS 1.3...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authorize &amp; Settle {formatPrice(finalTotal)}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-secondary-token mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2CE0C9]" />
                  Payments orchestrated natively via Razorpay Financial Technologies
                </p>
              </div>
            </div>

            {/* Digital Entitlement Guarantee Badge & Digital Lock Protocol */}
            <div className="bg-surface-secondary rounded-2xl p-6 border border-theme shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#2CE0C9]/15 text-[#2CE0C9] flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold font-serif-editorial tracking-[-0.015em] text-base sm:text-lg text-primary-token">
                  Digital Entitlement Guarantee
                </h3>
                <p className="text-[13px] text-secondary-token mt-1 leading-relaxed">
                  Instant digital access to locked pages, high-res illustrated chapters, and
                  premium 4K podcast episodes inside My Library. Protected browser streaming with zero
                  unauthorized downloads under LeadSphere Archival Standard v4.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <span className="font-heading text-[11px] font-semibold text-[#2CE0C9] uppercase tracking-[0.06em] flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5" /> Lifetime Platform Stream
                  </span>
                  <span className="font-heading text-[11px] font-semibold text-secondary-token uppercase tracking-[0.06em] flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5" /> Synchronized Co-Reading
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dual-State Order Folio & Mascot Showcase (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Theme Mode Switcher Banner */}
            <div className="bg-surface-secondary rounded-2xl p-4 border border-theme flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-token" />
                <span className="font-heading text-xs font-semibold text-primary-token">Experience Toggle</span>
                <span className="font-heading text-[11px] uppercase font-semibold tracking-[0.05em] px-2 py-0.5 rounded-full bg-brand-token/10 text-brand-token">
                  {theme}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="font-heading text-xs font-semibold text-secondary-token hover:text-primary-token transition-colors cursor-pointer"
              >
                Switch mode →
              </button>
            </div>

            {/* The Order Folio Container */}
            <div className="relative bg-surface-primary rounded-2xl p-6 sm:p-7 border border-theme shadow-md overflow-hidden transition-all">
              {/* Accent Watermark */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-token/10 blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 mb-4 border-b border-theme">
                <div>
                  <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary-token">
                    {isDirectMode ? "Direct Express Folio" : "Cart Registry"}
                  </span>
                  <h3 className="text-xl font-semibold font-serif-editorial tracking-[-0.015em] text-primary-token">
                    Order Summary
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {isDirectMode && (
                    <Link
                      href="/checkout"
                      className="text-[11px] font-semibold text-brand-token hover:underline"
                    >
                      View Cart
                    </Link>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-surface-secondary border border-theme font-heading text-[11px] font-semibold tabular-nums text-secondary-token">
                    {displayedItems.length} {displayedItems.length === 1 ? "Unit" : "Units"}
                  </span>
                </div>
              </div>

              {/* Itemised Stack or Empty Cart State */}
              {displayedItems.length === 0 ? (
                <div className="py-8 text-center space-y-4">
                  <p className="text-xs text-secondary-token">
                    Your Cart Registry is currently empty.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Link
                      href="/books"
                      className="px-3.5 py-2 rounded-xl bg-brand text-[#07100D] text-xs font-semibold hover:bg-brand-hover transition-colors"
                    >
                      Browse Catalog
                    </Link>
                    <button
                      type="button"
                      onClick={handleRestoreDefaultFolio}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-secondary border border-theme text-xs font-semibold text-primary-token hover:bg-surface-primary transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore Sample Folio
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {displayedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 pb-4 border-b border-theme/60 last:border-b-0"
                    >
                      <div className="w-16 h-20 bg-[#07100D] rounded-xl overflow-hidden flex-shrink-0 border border-theme p-1 shadow-sm relative flex items-center justify-center">
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#07100D]/90 border border-[#F5C451]/35 text-[#F5C451] rounded font-heading text-[9px] leading-none font-semibold uppercase tracking-[0.04em]">
                          {item.badge}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-heading font-semibold text-sm text-primary-token leading-tight truncate">
                            {item.title}
                          </h4>
                          <span className="font-semibold text-base text-primary-token font-serif-editorial tabular-nums shrink-0">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        <p className="text-xs text-secondary-token truncate mt-0.5">
                          {item.edition}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-secondary-token min-w-0">
                            <span className="font-semibold text-primary-token truncate">
                              {item.authorOrHost}
                            </span>
                            <span>•</span>
                            <span className="truncate">{item.tierOrFormat}</span>
                          </div>
                          {!isDirectMode && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCartItem(item.id)}
                              aria-label={`Remove ${item.title}`}
                              className="p-1 rounded-md text-muted-token hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon / Creator Fellowship Token Input */}
              <div className="mt-4 mb-4">
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center bg-surface-secondary border border-theme rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-brand-token/30 transition-all">
                    <Tag className="w-4 h-4 text-secondary-token mr-2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Fellowship / Promo Code"
                      className="w-full bg-transparent text-xs text-primary-token outline-none uppercase placeholder:normal-case font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="font-heading px-4 py-2 rounded-xl bg-surface-secondary hover:bg-surface-primary border border-theme text-primary-token font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      promoMessage.isError ? "text-red-400 font-medium" : "text-[#2CE0C9] font-semibold"
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="bg-surface-secondary rounded-xl p-4 flex flex-col gap-2 border border-theme">
                <div className="flex justify-between items-center text-xs text-secondary-token">
                  <span>Folio Subtotal</span>
                  <span className="font-medium tabular-nums text-primary-token">{formatPrice(rawSubtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between items-center text-xs text-[#2CE0C9] font-medium">
                    <span>Fellowship Discount ({promoDiscountPct}%)</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-secondary-token">
                  <span>Platform Archival Licensing</span>
                  <span className="font-semibold text-[#2CE0C9]">Complimentary</span>
                </div>

                <div className="flex justify-between items-center text-xs text-secondary-token">
                  <span>Integrated GST (18% Included)</span>
                  <span className="font-medium text-primary-token">Included</span>
                </div>

                <div className="pt-2 mt-2 border-t border-theme flex justify-between items-baseline">
                  <span className="font-serif-editorial font-semibold text-base text-primary-token">
                    Total Payable
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-semibold font-serif-editorial tabular-nums text-brand-token">
                      {formatPrice(finalTotal)}
                    </span>
                    <span className="block font-heading text-[11px] text-secondary-token font-semibold uppercase tracking-[0.04em]">
                      INR Guaranteed Domestic Rate
                    </span>
                  </div>
                </div>
              </div>

              {/* Jungle Mascot Companion Box */}
              <div
                className={`mt-6 rounded-2xl p-4 relative overflow-hidden transition-all border ${
                  isJungle
                    ? "bg-amber-500/15 border-amber-500/30 text-primary-token"
                    : "bg-amber-500/10 border-amber-500/20 text-primary-token"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-primary border border-amber-400/40 p-1 shadow-sm">
                    <img
                      src="/images/mascot-lion.jpg"
                      alt="Playful Lion mascot waving happily"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1 bg-[#F5C451]/15 text-[#F5C451] border border-[#F5C451]/35 px-2.5 py-0.5 rounded-full font-heading text-[11px] font-semibold uppercase tracking-[0.04em] mb-1">
                      Jungle Co-Reader Ready
                    </div>
                    <h4 className="font-heading font-semibold text-xs sm:text-sm text-primary-token leading-tight">
                      Roar! Ready to read?
                    </h4>
                    <p className="text-xs text-secondary-token mt-0.5 leading-snug">
                      Your purchase rewards <strong>150 Jungle Paw Badges</strong> for family reading quests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebratory Checkout Success Modal */}
      {successModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-surface-primary max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-theme shadow-2xl relative overflow-hidden transform animate-in zoom-in-95 duration-200">
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setSuccessModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-secondary text-secondary-token transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden relative mb-4 p-1 bg-surface-secondary border border-theme shadow-md">
                <img
                  src="/images/mascot-lion.jpg"
                  alt="Celebratory Lion mascot congratulating on successful checkout"
                  className="w-full h-full object-cover rounded-xl"
                />
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#2CE0C9] text-[#07100D] flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              </div>

              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2CE0C9] mb-1">
                Payment Completed • {settledPaymentId || "RZP_92817340"}
              </span>

              <h2 className="text-2xl sm:text-3xl font-semibold font-serif-editorial tracking-[-0.02em] text-primary-token mb-2">
                Folio Unlocked &amp; Ready!
              </h2>

              <p className="text-[13px] sm:text-sm text-secondary-token max-w-sm mb-6 leading-relaxed">
                {settledTitles.length === 1 ? (
                  <>
                    <em>{settledTitles[0]}</em> has settled permanently into your private library vault.
                  </>
                ) : (
                  <>
                    All {settledTitles.length} selected works have settled permanently into your
                    private library vault ({settledOrderNumber}).
                  </>
                )}
              </p>

              <div className="w-full bg-surface-secondary rounded-2xl p-4 mb-6 text-left flex items-center justify-between border border-theme">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-token/10 text-brand-token flex items-center justify-center flex-shrink-0">
                    <MailCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-heading text-xs font-semibold text-primary-token">Vault Receipt Dispatched</p>
                    <p className="text-[11px] text-secondary-token">{SEED_CURRENT_USER.email}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold tabular-nums bg-surface-primary border border-theme px-2.5 py-1 rounded-lg text-primary-token">
                  {formatPrice(settledTotal)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <Link
                  href="/library"
                  className="font-heading w-full py-3 px-4 rounded-xl bg-brand hover:bg-brand-hover text-[#07100D] font-semibold text-xs sm:text-sm text-center shadow-sm transition-all"
                >
                  Open My Library
                </Link>
                <Link
                  href="/orders"
                  className="font-heading w-full py-3 px-4 rounded-xl bg-surface-secondary hover:bg-surface-primary border border-theme text-primary-token font-semibold text-xs sm:text-sm text-center transition-all"
                >
                  Review Order Receipt
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <Suspense
        fallback={
          <main className="w-full min-h-screen py-16 px-4 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </main>
        }
      >
        <CheckoutContent />
      </Suspense>
      <SiteFooter />
    </>
  );
}
