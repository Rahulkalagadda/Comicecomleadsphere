"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CartFolioItem } from "@/lib/api/client";
import {
  BookOpen,
  Compass,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Play,
  Pause,
  Star,
  Lock,
  Eye,
  Radio,
  Sliders,
  RotateCcw,
  RotateCw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Zap,
  Layers,
  Film,
  X,
} from "lucide-react";

type DiscoverWork = {
  id: string;
  type: "books" | "comics" | "audio";
  badge: string;
  freeTag: string;
  category: string;
  rating: string;
  author: string;
  title: string;
  description: string;
  price: string;
  coverUrl?: string;
  videoUrl?: string;
  href: string;
};

export function DiscoverView() {
  const [activeFilter, setActiveFilter] = useState<"all" | "books" | "comics" | "audio">("all");
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Persistent Audio Dock backed by real Episode 1 stream
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentSec, setAudioCurrentSec] = useState(0);
  const [audioDurationSec, setAudioDurationSec] = useState(172); // 02:52
  const [isDockVisible, setIsDockVisible] = useState(true);
  const dockMediaRef = useRef<HTMLVideoElement | null>(null);

  const formatTime = (sec: number) => {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  const toggleDockPlay = () => {
    const el = dockMediaRef.current;
    if (!el) return;
    if (isPlayingAudio) {
      el.pause();
      setIsPlayingAudio(false);
    } else {
      el.play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
    }
  };

  const seekDockBy = (delta: number) => {
    const el = dockMediaRef.current;
    if (!el) return;
    const dur = el.duration || audioDurationSec;
    el.currentTime = Math.max(0, Math.min(dur, el.currentTime + delta));
  };

  // Bento Video teaser player state
  const [isBentoVideoPlaying, setIsBentoVideoPlaying] = useState(false);
  const bentoVideoRef = useRef<HTMLVideoElement | null>(null);

  // Tactile Reader Engine Demo Interactive State
  const [readerTheme, setReaderTheme] = useState<"nocturnal-canopy" | "sovereign-obsidian" | "parchment-ivory">(
    "nocturnal-canopy"
  );
  const [readerTypeface, setReaderTypeface] = useState<"newsreader" | "jakarta" | "mono">("newsreader");
  const [readerFontSize, setReaderFontSize] = useState<number>(18);

  // Pure Season 1 AI Jungle Safari Works
  const trendingItems: DiscoverWork[] = [
    {
      id: "book-jungle-safari",
      type: "books",
      badge: "Season 1 Flagship",
      freeTag: "10-Page Free",
      category: "AI & Digital Transformation",
      rating: "4.95",
      author: "Dr. Amit Khandelwal",
      title: "The AI Jungle Safari Blueprint",
      description:
        "13 chapters & 10 Jungle C-Suite advisors taking boards from fragmented POCs to measurable enterprise AI ROI.",
      price: "₹899",
      coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
      href: "/books/ai-jungle-safari-transformation-blueprint",
    },
    {
      id: "book-jungle-audit-handbook",
      type: "books",
      badge: "Companion Playbook",
      freeTag: "10-Page Free",
      category: "Enterprise Readiness",
      rating: "4.90",
      author: "Dr. Amit Khandelwal",
      title: "The Jungle Audit: 5-Pillar Playbook",
      description:
        "Score Business Alignment, Process Maturity, Data Readiness, Talent Capability, and Risk Governance before scaling AI.",
      price: "₹599",
      coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
      href: "/books/the-jungle-audit-maturity-playbook",
    },
    {
      id: "comic-jungle-audit",
      type: "comics",
      badge: "7-Panel Comic Sheet",
      freeTag: "10-Page Free",
      category: "AI Strategy Comic",
      rating: "4.92",
      author: "Dr. Amit Khandelwal",
      title: "The AI Jungle Podcast: Episode 1 Comic",
      description:
        "Lion, Elephant, Wolf & Monkey unpack The Hook, The 4,000-Banana Trap, and The Five Executive Questions.",
      price: "₹299",
      coverUrl: "/media/images/ai-jungle-podcast-comic.jpg",
      href: "/read/comic-jungle-audit",
    },
    {
      id: "comic-jungle-part-1",
      type: "comics",
      badge: "1.1 Full Strip",
      freeTag: "10-Page Free",
      category: "Chapter 1 Comic Strip",
      rating: "4.94",
      author: "Dr. Amit Khandelwal",
      title: "1.1 The Jungle Audit — Part 1 (Clips 01–06)",
      description:
        "Full uncropped vertical comic strip covering The Jungle Is Changing, Process Maturity, Data Silos & Business Alignment.",
      price: "₹399",
      coverUrl: "/media/images/jungle-audit-part-1.jpg",
      href: "/read/comic-jungle-part-1",
    },
    {
      id: "comic-jungle-part-2",
      type: "comics",
      badge: "1.2 Full Strip",
      freeTag: "10-Page Free",
      category: "Chapter 1 Comic Strip",
      rating: "4.91",
      author: "Dr. Amit Khandelwal",
      title: "1.2 The Jungle Audit — Part 2 (Clips 07–12)",
      description:
        "Full vertical comic covering Map → Simplify → Automate, Data Governance, 4,000 Bananas & the 5-Pillar Scorecard.",
      price: "₹399",
      coverUrl: "/media/images/jungle-audit-part-2.jpg",
      href: "/read/comic-jungle-part-2",
    },
    {
      id: "ep-jungle-01",
      type: "audio",
      badge: "Studio Video Pilot",
      freeTag: "Watch Ep 1 Free",
      category: "AI Video Podcast",
      rating: "5.00",
      author: "Dr. Amit Khandelwal & Lion",
      title: "Ep 1: 1.1 The Jungle Audit (02:52 Pilot)",
      description:
        "Stream the full 02:52 Episode 1 studio broadcast free, or jump into Clips 01–03 on readiness and process maturity.",
      price: "Free",
      videoUrl: "/media/videos/jungle-audit-ep1-full.mp4#t=0.5",
      href: "/episodes/ep-jungle-01",
    },
  ];

  const filteredItems =
    activeFilter === "all" ? trendingItems : trendingItems.filter((item) => item.type === activeFilter);

  return (
    <div className="w-full bg-main min-h-screen text-primary-token antialiased selection:bg-brand/20 selection:text-brand-token pb-28">
      {/* Hidden backing video element for live Episode 1 playback inside the bottom dock */}
      <video
        ref={dockMediaRef}
        src="/media/videos/jungle-audit-ep1-full.mp4"
        preload="metadata"
        playsInline
        className="hidden"
        onLoadedMetadata={() => {
          const el = dockMediaRef.current;
          if (el && el.duration) setAudioDurationSec(el.duration);
        }}
        onTimeUpdate={() => {
          const el = dockMediaRef.current;
          if (el && el.duration) {
            setAudioCurrentSec(el.currentTime);
            setAudioProgress((el.currentTime / el.duration) * 100);
          }
        }}
        onEnded={() => setIsPlayingAudio(false)}
      />

      {/* ----------------------------------------------------
          HERO SECTION
          ---------------------------------------------------- */}
      <section className="relative w-full overflow-hidden pb-12 pt-6 lg:pt-10">
        <div className="absolute top-6 left-1/4 w-96 h-96 rounded-full bg-[#E0A62E]/10 blur-[90px] pointer-events-none -z-10" />
        <div className="absolute top-28 right-12 w-80 h-80 rounded-full bg-[#2CE0C9]/10 blur-[80px] pointer-events-none -z-10" />

        <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Editorial Typography Stream */}
            <div className="lg:col-span-7 flex flex-col gap-5 z-10">
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-surface-secondary/90 shadow-sm text-[#2CE0C9] font-jakarta font-semibold text-xs tracking-wider border border-theme/70">
                <Sparkles className="w-4 h-4 text-[#F5C451]" />
                <span>SEASON 1 SAFARI • DR. AMIT KHANDELWAL</span>
              </div>

              <h1 className="font-newsreader font-semibold text-4xl sm:text-5xl lg:text-6xl text-primary-token tracking-[-0.025em] leading-[1.1]">
                Think Strategically. <br className="hidden sm:inline" />
                Then Let <span className="italic font-normal text-brand-token">AI Roar.</span>
              </h1>

              <p className="font-jakarta text-base sm:text-lg text-secondary-token max-w-xl leading-relaxed">
                Explore the complete AI Jungle Safari Season 1 catalog—uncropped multi-panel comic sheets, 13-chapter executive blueprints, and studio video podcasts featuring Lion, Elephant, Wolf &amp; Monkey.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#handpicked"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand text-[#07100D] font-jakarta font-semibold text-sm shadow-lg hover:shadow-xl hover:bg-brand-hover transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]"
                >
                  <span>Explore Season 1</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#trending"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface-primary text-primary-token font-jakarta font-semibold text-sm shadow-md hover:bg-surface-secondary transition-all duration-300 transform hover:-translate-y-0.5 border border-theme"
                >
                  <Zap className="w-4 h-4 text-[#2CE0C9]" />
                  <span>Full Comic Sheets &amp; Clips</span>
                </a>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg">
                <div className="flex flex-col p-3 rounded-xl bg-surface-secondary/70 border border-theme shadow-sm">
                  <span className="font-jakarta font-bold tabular-nums text-lg sm:text-xl text-primary-token">13 Chapters</span>
                  <span className="font-jakarta text-xs text-muted-token">10 Jungle Advisors</span>
                </div>
                <div className="flex flex-col p-3 rounded-xl bg-surface-secondary/70 border border-theme shadow-sm">
                  <span className="font-jakarta font-bold tabular-nums text-lg sm:text-xl text-[#2CE0C9]">3 Comic Sheets</span>
                  <span className="font-jakarta text-xs text-muted-token">Uncropped Verticals</span>
                </div>
                <div className="flex flex-col p-3 rounded-xl bg-surface-secondary/70 border border-theme shadow-sm">
                  <span className="font-jakarta font-bold tabular-nums text-lg sm:text-xl text-accent-gold">4 HD Clips</span>
                  <span className="font-jakarta text-xs text-muted-token">Ep 1 Pilot Free</span>
                </div>
              </div>
            </div>

            {/* Right Tactile Dimensional Stage */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[440px] sm:min-h-[480px] py-6">
              <div className="absolute w-[290px] sm:w-[380px] h-[290px] sm:h-[380px] rounded-full bg-gradient-to-tr from-[#07100D] via-surface-secondary to-[#2CE0C9]/10 shadow-2xl opacity-90 transform -rotate-6 border border-theme" />

              {/* Central Floating Blueprint Card (Uncropped) */}
              <div className="relative z-20 w-60 sm:w-68 rounded-2xl bg-surface-primary shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden flex flex-col group border border-theme">
                <div className="relative w-full h-72 overflow-hidden bg-[#07100D] p-2 flex items-center justify-center border-b border-theme">
                  <img
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700"
                    alt="The AI Jungle Safari: Data, Digital & AI Transformation Blueprint"
                    src="/media/images/ai-jungle-safari-blueprint.jpg"
                  />
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#07100D]/90 border border-[#F5C451]/40 text-[#F5C451] font-jakarta font-semibold text-[11px] shadow-sm">
                    13 Chapters
                  </div>
                </div>

                <div className="p-3.5 flex flex-col justify-between bg-surface-primary gap-2">
                  <div>
                    <p className="font-jakarta text-[11px] font-semibold text-brand-token uppercase tracking-wide">
                      Season 1 • Dr. Amit Khandelwal
                    </p>
                    <h3 className="font-jakarta font-bold text-sm text-primary-token truncate mt-0.5">
                      The AI Jungle Safari Blueprint
                    </h3>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-jakarta font-bold tabular-nums text-base text-[#F5C451]">₹899</span>
                    <div className="flex items-center gap-1.5">
                      <AddToCartButton
                        compact
                        size="sm"
                        className="rounded-full"
                        item={{
                          id: "book-jungle-safari",
                          title: "The AI Jungle Safari: Data, Digital & AI Transformation Blueprint",
                          type: "book",
                          badge: "BOOK",
                          edition: "AI & Digital Transformation • 280 Pages",
                          authorOrHost: "Dr. Amit Khandelwal",
                          tierOrFormat: "Full Browser Access • 10-Page Preview Certified",
                          price: 899,
                          coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
                        }}
                      />
                      <Link
                        href="/read/book-jungle-safari"
                        className="px-2.5 py-1 rounded-full bg-[#2CE0C9]/15 border border-[#2CE0C9]/40 text-[#2CE0C9] font-jakarta font-semibold text-[11px] hover:bg-[#2CE0C9] hover:text-[#07100D] transition-colors whitespace-nowrap"
                      >
                        10p Free
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Full Comic Sheet Preview (Offset Upper Right, Uncropped) */}
              <Link
                href="/read/comic-jungle-part-1"
                className="hidden sm:block absolute -top-2 right-1 sm:right-2 z-30 w-40 rounded-xl bg-surface-primary p-2 shadow-xl transform -rotate-4 hover:rotate-0 transition-transform duration-300 border border-theme"
              >
                <div className="w-full h-36 rounded-lg overflow-hidden relative bg-[#07100D] p-1 flex items-center justify-center">
                  <img
                    className="w-full h-full object-contain"
                    alt="1.1 The Jungle Audit Part 1 Full Comic Sheet"
                    src="/media/images/jungle-audit-part-1.jpg"
                  />
                </div>
                <div className="p-1 pt-1.5">
                  <p className="font-jakarta font-semibold text-xs text-primary-token truncate">1.1 Jungle Audit</p>
                  <div className="flex items-center justify-between text-[#2CE0C9] font-jakarta text-[11px] mt-0.5">
                    <span>Full Comic Sheet</span>
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Real Studio Video Podcast Floating Card (Offset Lower Left) */}
              <Link
                href="/episodes/ep-jungle-01"
                className="absolute -bottom-3 left-1 sm:left-2 z-30 rounded-2xl bg-surface-primary/95 backdrop-blur-md p-2.5 sm:p-3 shadow-2xl flex items-center gap-2.5 sm:gap-3 max-w-[235px] sm:max-w-[280px] transform -rotate-2 hover:rotate-0 transition-transform duration-300 border border-theme"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-[#07100D] border border-[#2CE0C9]/30">
                  <video
                    src="/media/videos/jungle-audit-ep1-full.mp4#t=1.0"
                    preload="metadata"
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#07100D]/35 flex items-center justify-center">
                    <Radio className="w-4 h-4 text-[#2CE0C9]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[#2CE0C9] font-jakarta font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-[#2CE0C9] animate-pulse" />
                    <span>Free Pilot Video</span>
                  </div>
                  <h4 className="font-jakarta font-bold text-xs text-primary-token truncate">The AI Jungle Podcast</h4>
                  <p className="font-jakarta text-[11px] text-muted-token truncate tabular-nums">Ep. 1 • 02:52 HD Stream</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 1: HANDPICKED FOR YOU (Bento Grid - 100% AI Jungle)
          ---------------------------------------------------- */}
      <section className="w-full py-16 bg-surface-secondary/50 border-y border-theme" id="handpicked">
        <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-brand-token font-jakarta font-bold text-xs tracking-wider uppercase">
                <Star className="w-4 h-4 fill-current" />
                <span>SEASON 1 COMPENDIUM</span>
              </div>
              <h2 className="font-newsreader font-semibold tracking-[-0.02em] text-3xl sm:text-4xl text-primary-token">
                Featured AI Jungle Works
              </h2>
              <p className="font-jakarta text-sm sm:text-[15px] text-secondary-token leading-relaxed">
                Blueprints, uncropped multi-panel comic sheets, and studio broadcasts built around the 5-Pillar Jungle Audit.
              </p>
            </div>
            <div className="flex items-center">
              <span className="font-jakarta text-xs text-[#2CE0C9] px-3.5 py-1.5 rounded-full bg-[#2CE0C9]/10 border border-[#2CE0C9]/30 font-medium">
                Instant 10-Page Free Previews
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Large Primary Feature (8 Cols): Season 1 Blueprint + Live Video Teaser */}
            <div className="lg:col-span-8 rounded-3xl bg-surface-primary p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 border border-theme">
              <div className="md:w-5/12 h-72 md:h-auto rounded-2xl overflow-hidden relative shadow-inner flex-shrink-0 bg-[#07100D] border border-theme flex items-center justify-center">
                <video
                  ref={bentoVideoRef}
                  src="/media/videos/clip-01-jungle-is-changing.mp4#t=0.5"
                  playsInline
                  preload="metadata"
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  onEnded={() => setIsBentoVideoPlaying(false)}
                  onClick={() => {
                    const v = bentoVideoRef.current;
                    if (!v) return;
                    if (isBentoVideoPlaying) {
                      v.pause();
                      setIsBentoVideoPlaying(false);
                    } else {
                      v.play().then(() => setIsBentoVideoPlaying(true)).catch(() => {});
                    }
                  }}
                  className="w-full h-full object-contain bg-[#07100D] cursor-pointer"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#07100D]/90 border border-[#2CE0C9]/40 text-[#2CE0C9] font-jakarta font-semibold text-xs shadow-md pointer-events-none">
                  Clip 01 • Live Video
                </span>
                <div className="absolute bottom-3 left-3 right-3 bg-[#07100D]/90 border border-theme rounded-xl p-2.5 flex items-center justify-between text-primary-token pointer-events-none">
                  <span className="font-jakarta text-xs font-semibold">10-Page Free Blueprint</span>
                  <ShieldCheck className="w-4 h-4 text-brand-token" />
                </div>
              </div>

              <div className="md:w-7/12 flex flex-col justify-between py-1">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-secondary border border-theme text-[#2CE0C9] font-jakarta text-xs font-medium">
                      CXO Lanes 2026 Winner
                    </span>
                    <span className="text-accent-gold font-jakarta text-xs font-semibold flex items-center gap-1 tabular-nums">
                      <Star className="w-3.5 h-3.5 fill-current" /> 4.95 • Season 1
                    </span>
                  </div>

                  <h3 className="font-newsreader font-semibold tracking-[-0.02em] leading-[1.15] text-2xl sm:text-3xl text-primary-token">
                    The AI Jungle Safari: Data, Digital &amp; AI Blueprint
                  </h3>

                  <p className="font-jakarta text-xs text-muted-token uppercase tracking-[0.06em] font-semibold">
                    By Dr. Amit Khandelwal • 13 Chapters • 10 C-Suite Roles
                  </p>

                  <p className="font-jakarta text-sm text-secondary-token line-clamp-3 leading-relaxed">
                    Think Strategically. Then Let AI Roar. Lion, Elephant, Wolf, Owl, and Monkey walk boardrooms from disconnected pilots to governed, measurable enterprise transformation.
                  </p>

                  <div className="p-3 rounded-xl bg-main border border-theme flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const v = bentoVideoRef.current;
                        if (!v) {
                          setIsBentoVideoPlaying(!isBentoVideoPlaying);
                          return;
                        }
                        if (isBentoVideoPlaying) {
                          v.pause();
                          setIsBentoVideoPlaying(false);
                        } else {
                          v.play().then(() => setIsBentoVideoPlaying(true)).catch(() => {});
                        }
                      }}
                      className="w-8 h-8 rounded-full bg-brand text-[#07100D] flex items-center justify-center hover:bg-brand-hover transition-transform active:scale-95 flex-shrink-0 shadow-sm cursor-pointer"
                      aria-label={isBentoVideoPlaying ? "Pause Clip 01 preview" : "Play Clip 01 preview"}
                    >
                      {isBentoVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] font-jakarta font-medium text-secondary-token">
                        <span className="truncate">Clip 01 • The Jungle Is Changing (Video)</span>
                        <span className="text-[#2CE0C9] font-semibold">FREE PREVIEW</span>
                      </div>
                      <div className="w-full bg-surface-tertiary h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-brand h-full rounded-full transition-all duration-300"
                          style={{ width: isBentoVideoPlaying ? "100%" : "25%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-theme flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-jakarta text-xs text-muted-token block font-medium">Digital Collector Edition</span>
                    <span className="font-jakarta font-bold tabular-nums text-xl text-[#F5C451]">₹899</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href="/read/book-jungle-safari"
                      className="px-4 py-2 rounded-full bg-surface-secondary hover:bg-surface-tertiary text-primary-token font-jakarta text-xs font-semibold flex items-center gap-1.5 border border-theme transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Free 10p</span>
                    </Link>
                    <AddToCartButton
                      compact
                      size="md"
                      className="rounded-full"
                      item={{
                        id: "book-jungle-safari",
                        title: "The AI Jungle Safari: Data, Digital & AI Transformation Blueprint",
                        type: "book",
                        badge: "BOOK",
                        edition: "AI & Digital Transformation • 280 Pages",
                        authorOrHost: "Dr. Amit Khandelwal",
                        tierOrFormat: "Full Browser Access • 10-Page Preview Certified",
                        price: 899,
                        coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
                      }}
                    />
                    <Link
                      href="/checkout?type=book&id=book-jungle-safari"
                      className="px-5 py-2 rounded-full bg-brand text-[#07100D] font-jakarta text-xs font-semibold shadow-md hover:bg-brand-hover transition-all"
                    >
                      <span>Get Edition</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Card: Full Uncropped Comic Strip (4 Cols) */}
            <div className="lg:col-span-4 rounded-3xl bg-surface-primary p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-theme">
              <div className="flex flex-col gap-4">
                <Link
                  href="/read/comic-jungle-audit"
                  className="h-64 rounded-2xl overflow-hidden relative shadow-inner bg-[#07100D] p-2 border border-amber-400/20 flex items-center justify-center"
                >
                  <img
                    className="w-full h-full object-contain"
                    alt="The AI Jungle Podcast: Episode 1 Graphic Comic Sheet"
                    src="/media/images/ai-jungle-podcast-comic.jpg"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#07100D]/90 border border-[#2CE0C9]/40 text-[#2CE0C9] font-jakarta font-semibold text-xs shadow-sm">
                    Full Comic Sheet
                  </div>
                </Link>

                <div className="flex flex-col gap-1">
                  <span className="font-jakarta text-[11px] text-[#2CE0C9] font-semibold tracking-[0.06em] uppercase">
                    7-PANEL GRAPHIC COMIC
                  </span>
                  <h3 className="font-jakarta font-bold tracking-[-0.015em] text-lg text-primary-token">
                    AI Jungle Podcast: Episode 1 Comic
                  </h3>
                  <p className="font-jakarta text-xs text-muted-token">Dr. Amit Khandelwal • 16 Plates</p>
                  <p className="font-jakarta text-[13px] text-secondary-token line-clamp-2 leading-relaxed mt-1">
                    Inside the studio with Host Lion, Elephant, Wolf &amp; Monkey as 4,000 bananas expose unchecked AI hype.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-theme flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-jakarta text-xs text-muted-token block font-medium">Graphic Edition</span>
                  <p className="font-jakarta font-bold tabular-nums text-lg text-[#F5C451]">₹299</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <AddToCartButton
                    compact
                    size="md"
                    className="rounded-full"
                    item={{
                      id: "comic-jungle-audit",
                      title: "The AI Jungle Podcast: Episode 1 Comic",
                      type: "comic",
                      badge: "COMIC",
                      edition: "AI Strategy Comic • 16 Plates",
                      authorOrHost: "Dr. Amit Khandelwal",
                      tierOrFormat: "Full Uncropped Comic Sheet • 10p Preview",
                      price: 299,
                      coverUrl: "/media/images/ai-jungle-podcast-comic.jpg",
                    }}
                  />
                  <Link
                    href="/read/comic-jungle-audit"
                    className="px-4 py-2 rounded-full bg-surface-secondary hover:bg-surface-tertiary text-primary-token font-jakarta text-xs font-semibold flex items-center gap-1.5 border border-theme transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Read Comic</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Tertiary Card: Studio Video Podcast Series (6 Cols) */}
            <div className="lg:col-span-6 rounded-3xl bg-surface-primary p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5 border border-theme">
              <div className="sm:w-1/2 aspect-video sm:aspect-auto sm:min-h-[190px] rounded-2xl overflow-hidden relative shadow-inner flex-shrink-0 bg-[#07100D] border border-theme">
                <video
                  src="/media/videos/jungle-audit-ep1-full.mp4#t=1.2"
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#07100D]/90 border border-[#F5C451]/40 text-[#F5C451] font-jakarta font-semibold text-xs">
                  HD Broadcast • 4 Clips
                </div>
              </div>

              <div className="sm:w-1/2 flex flex-col justify-between py-1">
                <div className="flex flex-col gap-1.5">
                  <span className="font-jakarta text-[11px] text-brand-token font-semibold tracking-[0.06em] uppercase">
                    SEASON 1 BROADCAST
                  </span>
                  <h4 className="font-jakarta font-bold tracking-[-0.015em] text-base text-primary-token">
                    The AI Jungle Podcast
                  </h4>
                  <p className="font-jakarta text-xs text-muted-token">Dr. Amit Khandelwal &amp; The Lion</p>
                  <p className="font-jakarta text-[13px] text-secondary-token line-clamp-2 leading-relaxed mt-1">
                    Stream Episode 1 (02:52 Pilot) free and unlock Clips 01–03 on enterprise readiness and process maturity.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-theme flex items-center justify-between">
                  <div>
                    <span className="font-jakarta text-xs text-muted-token block font-medium">Ep 1 Complimentary</span>
                    <p className="font-jakarta font-bold tabular-nums text-lg text-[#2CE0C9]">Free / ₹199</p>
                  </div>
                  <Link
                    href="/episodes/ep-jungle-01"
                    className="px-4 py-2 rounded-full bg-[#2CE0C9] hover:bg-[#52ebd6] text-[#07100D] font-jakarta text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Ep 1 Free</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quaternary Card: 5-Pillar Maturity Playbook (6 Cols) */}
            <div className="lg:col-span-6 rounded-3xl bg-surface-primary p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5 border border-theme">
              <div className="sm:w-1/2 h-48 sm:h-auto rounded-2xl overflow-hidden relative shadow-inner flex-shrink-0 bg-[#07100D] p-2 border border-theme flex items-center justify-center">
                <img
                  className="w-full h-full object-contain"
                  alt="1.1 & 1.2 The Jungle Audit Maturity Playbook"
                  src="/media/images/jungle-audit-part-2.jpg"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#07100D]/90 border border-[#2CE0C9]/40 text-[#2CE0C9] font-jakarta font-semibold text-xs shadow-sm">
                  5-Pillar Scorecard
                </span>
              </div>

              <div className="sm:w-1/2 flex flex-col justify-between py-1">
                <div className="flex flex-col gap-1.5">
                  <span className="font-jakarta text-[11px] text-[#2CE0C9] font-semibold tracking-[0.06em] uppercase">
                    ENTERPRISE READINESS
                  </span>
                  <h4 className="font-jakarta font-bold tracking-[-0.015em] text-base text-primary-token">
                    The Jungle Audit Playbook
                  </h4>
                  <p className="font-jakarta text-xs text-muted-token">Dr. Amit Khandelwal • 164 Pages</p>
                  <p className="font-jakarta text-[13px] text-secondary-token line-clamp-2 leading-relaxed mt-1">
                    Diagnostic companion to Chapter 01 covering Business Alignment, Operations, Data Maturity, Talent &amp; Risk.
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-theme flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-jakarta text-xs text-muted-token block font-medium">Interactive Playbook</span>
                    <p className="font-jakarta font-bold tabular-nums text-lg text-[#F5C451]">₹599</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AddToCartButton
                      compact
                      size="md"
                      className="rounded-full"
                      item={{
                        id: "book-jungle-audit-handbook",
                        title: "The Jungle Audit: 5-Pillar AI Readiness & Maturity Playbook",
                        type: "book",
                        badge: "BOOK",
                        edition: "Enterprise Readiness • 164 Pages",
                        authorOrHost: "Dr. Amit Khandelwal",
                        tierOrFormat: "Full Browser Access • 10-Page Preview Certified",
                        price: 599,
                        coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
                      }}
                    />
                    <Link
                      href="/read/book-jungle-audit-handbook"
                      className="px-4 py-2 rounded-full bg-surface-secondary hover:bg-surface-tertiary text-primary-token font-jakarta text-xs font-semibold flex items-center gap-1.5 border border-theme transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Free 10p</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 2: EXPLORE BY FORMAT (Obsidian 3-Pillar Cards)
          ---------------------------------------------------- */}
      <section className="w-full py-16">
        <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="px-3.5 py-1.5 rounded-full bg-surface-secondary border border-theme text-[#2CE0C9] font-jakarta font-semibold text-xs tracking-[0.08em] uppercase">
              THREE INTERCONNECTED FORMATS
            </span>
            <h2 className="font-newsreader font-semibold tracking-[-0.02em] text-3xl sm:text-4xl text-primary-token mt-3">
              Explore Season 1 Formats
            </h2>
            <p className="font-jakarta text-sm sm:text-[15px] text-secondary-token mt-2 leading-relaxed">
              Read the strategic blueprint, zoom into full comic sheets, or watch the Lion &amp; Council video broadcast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Books Card */}
            <div className="relative group rounded-3xl bg-surface-primary p-7 shadow-md transition-all duration-300 flex flex-col justify-between border border-theme">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-surface-secondary shadow-inner flex items-center justify-center text-brand-token mb-5 group-hover:scale-105 transition-transform border border-theme">
                  <BookOpen className="w-7 h-7 text-brand-token" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-newsreader font-semibold tracking-[-0.015em] text-2xl text-primary-token">
                    AI Blueprints
                  </h3>
                  <span className="font-jakarta tabular-nums text-xs px-2.5 py-0.5 rounded-full bg-surface-secondary text-[#F5C451] border border-theme font-semibold">
                    2 Volumes
                  </span>
                </div>
                <p className="font-jakarta text-sm text-secondary-token mb-6 leading-relaxed">
                  Structured transformation playbooks covering all 13 Jungle Safari chapters and 10 C-Suite functions.
                </p>
                <div className="space-y-2.5 mb-8">
                  <div className="flex items-center gap-2 text-primary-token font-jakarta text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#2CE0C9] flex-shrink-0" />
                    <span>First 10 pages complimentary on both books</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-token font-jakarta text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#2CE0C9] flex-shrink-0" />
                    <span>5-Pillar Readiness &amp; ROI frameworks</span>
                  </div>
                </div>
              </div>

              <Link
                href="/books"
                className="w-full py-3 px-4 rounded-full bg-surface-secondary text-primary-token font-jakarta font-semibold text-xs text-center hover:bg-surface-tertiary border border-theme transition-all flex items-center justify-center gap-2"
              >
                <span>Browse AI Jungle Books</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Comics Card */}
            <div className="relative group rounded-3xl bg-surface-primary p-7 shadow-md transition-all duration-300 flex flex-col justify-between border border-theme">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-surface-secondary shadow-inner flex items-center justify-center text-[#2CE0C9] mb-5 group-hover:scale-105 transition-transform border border-theme">
                  <Layers className="w-7 h-7 text-[#2CE0C9]" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-newsreader font-semibold tracking-[-0.015em] text-2xl text-primary-token">
                    Comic Sheets
                  </h3>
                  <span className="font-jakarta tabular-nums text-xs px-2.5 py-0.5 rounded-full bg-[#2CE0C9]/15 border border-[#2CE0C9]/30 text-[#2CE0C9] font-semibold">
                    3 Full Sheets
                  </span>
                </div>
                <p className="font-jakarta text-sm text-secondary-token mb-6 leading-relaxed">
                  Full-resolution vertical comic sheets (Ep 1 Pilot, 1.1 Part 1, 1.2 Part 2) displayed uncropped with click-to-zoom.
                </p>
                <div className="space-y-2.5 mb-8">
                  <div className="flex items-center gap-2 text-primary-token font-jakarta text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#2CE0C9] flex-shrink-0" />
                    <span>Uncropped multi-panel sheet reader</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-token font-jakarta text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#2CE0C9] flex-shrink-0" />
                    <span>200% interactive zoom &amp; panel notes</span>
                  </div>
                </div>
              </div>

              <Link
                href="/comics"
                className="w-full py-3 px-4 rounded-full bg-surface-secondary text-primary-token font-jakarta font-semibold text-xs text-center hover:bg-surface-tertiary border border-theme transition-all flex items-center justify-center gap-2"
              >
                <span>Open Full Comic Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Podcasts Card */}
            <div className="relative group rounded-3xl bg-surface-primary p-7 shadow-md transition-all duration-300 flex flex-col justify-between border border-theme">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-surface-secondary shadow-inner flex items-center justify-center text-accent-gold mb-5 group-hover:scale-105 transition-transform border border-theme">
                  <Film className="w-7 h-7 text-accent-gold" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-newsreader font-semibold tracking-[-0.015em] text-2xl text-primary-token">
                    Video Podcast
                  </h3>
                  <span className="font-jakarta tabular-nums text-xs px-2.5 py-0.5 rounded-full bg-[#F5C451]/15 border border-[#F5C451]/30 text-[#F5C451] font-semibold">
                    4 Studio Cuts
                  </span>
                </div>
                <p className="font-jakarta text-sm text-secondary-token mb-6 leading-relaxed">
                  Watch Host Lion, Wolf (COO) &amp; Elephant (CDO) debate AI investment vs. readiness inside the obsidian studio.
                </p>
                <div className="space-y-2.5 mb-8">
                  <div className="flex items-center gap-2 text-primary-token font-jakarta text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#2CE0C9] flex-shrink-0" />
                    <span>Episode 1 full 02:52 cut streams free</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-token font-jakarta text-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#2CE0C9] flex-shrink-0" />
                    <span>Real MP4 video clips with instant playback</span>
                  </div>
                </div>
              </div>

              <Link
                href="/podcasts"
                className="w-full py-3 px-4 rounded-full bg-surface-secondary text-primary-token font-jakarta font-semibold text-xs text-center hover:bg-surface-tertiary border border-theme transition-all flex items-center justify-center gap-2"
              >
                <span>Watch Studio Broadcasts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 3: FULL SEASON 1 CATALOG CAROUSEL (Uncropped Comics + Real Video)
          ---------------------------------------------------- */}
      <section className="w-full py-16 bg-surface-secondary/50 border-y border-theme" id="trending">
        <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1.5">
              <span className="text-brand-token font-jakarta font-semibold text-xs uppercase tracking-[0.08em]">
                COMPLETE SEASON 1 ARCHIVE
              </span>
              <h2 className="font-newsreader font-semibold tracking-[-0.02em] text-3xl sm:text-4xl text-primary-token">
                All AI Jungle Safari Releases
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center p-1 rounded-full bg-surface-tertiary text-secondary-token font-jakarta text-xs border border-theme">
                {(
                  [
                    { id: "all", label: "All Works" },
                    { id: "books", label: "Books" },
                    { id: "comics", label: "Comic Sheets" },
                    { id: "audio", label: "Video Podcast" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-3 py-1 rounded-full transition-all font-medium cursor-pointer ${
                      activeFilter === tab.id
                        ? "bg-brand text-[#07100D] shadow-sm font-semibold"
                        : "hover:text-primary-token"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollCarousel("left")}
                  aria-label="Previous"
                  className="w-9 h-9 rounded-full bg-surface-primary shadow-sm hover:bg-surface-secondary flex items-center justify-center text-primary-token transition-colors border border-theme cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  aria-label="Next"
                  className="w-9 h-9 rounded-full bg-surface-primary shadow-sm hover:bg-surface-secondary flex items-center justify-center text-primary-token transition-colors border border-theme cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrolling Carousel Track */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="w-72 sm:w-80 flex-shrink-0 snap-start rounded-3xl bg-surface-primary p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-theme"
              >
                <div>
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-inner mb-3 group bg-[#07100D] border border-theme flex items-center justify-center p-2">
                    {item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        preload="metadata"
                        muted
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                        alt={item.title}
                        src={item.coverUrl}
                      />
                    )}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#07100D]/90 border border-theme text-[#F5C451] font-jakarta font-semibold text-[11px] shadow-sm">
                      {item.badge}
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#2CE0C9]/20 border border-[#2CE0C9]/40 text-[#2CE0C9] font-jakarta font-semibold text-[11px]">
                      {item.freeTag}
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-center px-3 py-1.5 bg-[#07100D]/85 backdrop-blur-sm rounded-xl text-primary-token font-jakarta text-[11px] border border-theme/60">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#F5C451] text-[#F5C451]" />
                        <span>{item.rating}</span>
                      </span>
                      <span className="text-[#2CE0C9] truncate">{item.category}</span>
                    </div>
                  </div>

                  <p className="font-jakarta text-xs text-brand-token font-medium">{item.author}</p>
                  <h4 className="font-jakarta font-bold tracking-[-0.015em] text-base text-primary-token truncate mt-0.5">
                    {item.title}
                  </h4>
                  <p className="font-jakarta text-[13px] text-secondary-token line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-theme flex items-center justify-between gap-2">
                  <span className="font-jakarta font-bold tabular-nums text-base text-[#F5C451]">{item.price}</span>
                  <div className="flex items-center gap-1.5">
                    {item.price !== "Free" && (
                      <AddToCartButton
                        compact
                        size="sm"
                        className="rounded-full"
                        item={(() => {
                          const numericPrice = Number(item.price.replace(/[^0-9]/g, "")) || 299;
                          const cartType: CartFolioItem["type"] =
                            item.type === "books"
                              ? "book"
                              : item.type === "comics"
                                ? "comic"
                                : "podcast_episode";
                          return {
                            id: item.id,
                            title: item.title,
                            type: cartType,
                            badge: item.type === "books" ? "BOOK" : item.type === "comics" ? "COMIC" : "VIDEO",
                            edition: item.category,
                            authorOrHost: item.author,
                            tierOrFormat: item.freeTag,
                            price: numericPrice,
                            coverUrl: item.coverUrl || "/media/images/ai-jungle-safari-blueprint.jpg",
                          };
                        })()}
                      />
                    )}
                    <Link
                      href={item.href}
                      className="px-3.5 py-1.5 rounded-full bg-brand text-[#07100D] font-jakarta font-semibold text-xs shadow hover:bg-brand-hover transition-colors whitespace-nowrap"
                    >
                      Instant Access
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 4: HOW THE JUNGLE AUDIT VAULT WORKS
          ---------------------------------------------------- */}
      <section className="w-full py-16">
        <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="px-3.5 py-1.5 rounded-full bg-[#2CE0C9]/15 border border-[#2CE0C9]/30 text-[#2CE0C9] font-jakarta font-semibold text-xs tracking-[0.08em] uppercase">
              MEASURE FIRST. TRANSFORM SECOND.
            </span>
            <h2 className="font-newsreader font-semibold tracking-[-0.02em] text-3xl sm:text-4xl text-primary-token mt-3">
              How The AI Jungle Vault Works
            </h2>
            <p className="font-jakarta text-sm sm:text-[15px] text-secondary-token mt-2 leading-relaxed">
              Preview uncropped comic strips, blueprint chapters, and studio broadcasts instantly in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="rounded-3xl bg-surface-primary p-7 shadow-md flex flex-col justify-between relative overflow-hidden border border-theme">
              <span className="absolute -right-2 -top-4 font-newsreader tabular-nums text-8xl text-theme select-none font-semibold opacity-40">
                01
              </span>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-surface-secondary shadow-inner flex items-center justify-center text-brand-token mb-5 border border-theme">
                  <Compass className="w-7 h-7 text-brand-token" />
                </div>
                <h3 className="font-newsreader font-semibold tracking-[-0.015em] text-2xl text-primary-token mb-2">
                  Explore Season 1
                </h3>
                <p className="font-jakarta text-sm text-secondary-token leading-relaxed">
                  Inspect uncropped comic storyboards (1.1 &amp; 1.2), 13 transformation chapters, and Lion&apos;s C-Suite video briefings.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-theme flex items-center gap-1.5 text-brand-token font-jakarta font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Pure Season 1 AI Jungle Content</span>
              </div>
            </div>

            <div className="rounded-3xl bg-surface-primary p-7 shadow-md flex flex-col justify-between relative overflow-hidden border border-theme">
              <span className="absolute -right-2 -top-4 font-newsreader tabular-nums text-8xl text-theme select-none font-semibold opacity-40">
                02
              </span>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-surface-secondary shadow-inner flex items-center justify-center text-[#2CE0C9] mb-5 border border-theme">
                  <BookOpen className="w-7 h-7 text-[#2CE0C9]" />
                </div>
                <h3 className="font-newsreader font-semibold tracking-[-0.015em] text-2xl text-primary-token mb-2">
                  Preview 10 Pages Free
                </h3>
                <p className="font-jakarta text-sm text-secondary-token leading-relaxed">
                  Every book and comic sheet grants 10 free preview pages—plus Episode 1 (02:52) of the podcast streams complimentary.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-theme flex items-center gap-1.5 text-[#2CE0C9] font-jakarta font-semibold text-xs">
                <Eye className="w-4 h-4" />
                <span>No sign-up mandatory for previews</span>
              </div>
            </div>

            <div className="rounded-3xl bg-surface-primary p-7 shadow-md flex flex-col justify-between relative overflow-hidden border border-theme">
              <span className="absolute -right-2 -top-4 font-newsreader tabular-nums text-8xl text-theme select-none font-semibold opacity-40">
                03
              </span>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-surface-secondary shadow-inner flex items-center justify-center text-accent-gold mb-5 border border-theme">
                  <Lock className="w-7 h-7 text-accent-gold" />
                </div>
                <h3 className="font-newsreader font-semibold tracking-[-0.015em] text-2xl text-primary-token mb-2">
                  Instant Vault Access
                </h3>
                <p className="font-jakarta text-sm text-secondary-token leading-relaxed">
                  Unlock individual editions or the complete Season 1 Collector Anthology in INR via UPI, Cards, or NetBanking.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-theme flex items-center gap-1.5 text-accent-gold font-jakarta font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Razorpay Secured Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          SECTION 5: TACTILE READER ENGINE DEMONSTRATOR
          ---------------------------------------------------- */}
      <section className="w-full py-16 bg-surface-secondary/50 border-t border-theme">
        <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="rounded-3xl bg-surface-primary p-6 sm:p-8 lg:p-12 shadow-xl border border-theme">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-secondary text-[#2CE0C9] border border-[#2CE0C9]/30 font-jakarta font-semibold text-xs self-start">
                  <Sliders className="w-4 h-4" />
                  <span>CANOPY READER ENGINE DEMO</span>
                </div>

                <h2 className="font-newsreader font-semibold tracking-[-0.02em] text-3xl sm:text-4xl text-primary-token">
                  Calibrated to Nocturnal Obsidian &amp; Gold
                </h2>

                <p className="font-jakarta text-sm sm:text-[15px] text-secondary-token leading-relaxed">
                  Preview Chapter 01 of The AI Jungle Safari across Nocturnal Canopy, Sovereign Obsidian, or Parchment contrast modes.
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="font-jakarta font-semibold text-xs text-primary-token tracking-[0.06em] uppercase">
                    SELECT READER CANVAS
                  </label>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setReaderTheme("nocturnal-canopy")}
                      className={`px-4 py-2 rounded-full font-jakarta font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        readerTheme === "nocturnal-canopy"
                          ? "bg-surface-secondary text-primary-token ring-2 ring-[#2CE0C9] shadow-inner"
                          : "bg-main text-muted-token hover:text-primary-token border border-theme"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0D1B16] border border-[#2CE0C9]" />
                      <span>Nocturnal Canopy {readerTheme === "nocturnal-canopy" ? "(Default)" : ""}</span>
                    </button>

                    <button
                      onClick={() => setReaderTheme("sovereign-obsidian")}
                      className={`px-4 py-2 rounded-full font-jakarta font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        readerTheme === "sovereign-obsidian"
                          ? "bg-surface-secondary text-primary-token ring-2 ring-[#F5C451] shadow-inner"
                          : "bg-main text-muted-token hover:text-primary-token border border-theme"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-[#080C0E] border border-[#F5C451]" />
                      <span>Sovereign Obsidian</span>
                    </button>

                    <button
                      onClick={() => setReaderTheme("parchment-ivory")}
                      className={`px-4 py-2 rounded-full font-jakarta font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        readerTheme === "parchment-ivory"
                          ? "bg-surface-secondary text-primary-token ring-2 ring-brand shadow-inner"
                          : "bg-main text-muted-token hover:text-primary-token border border-theme"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-[#F5F1E6] border border-[#E0A62E]" />
                      <span>Daylight Parchment</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-jakarta text-xs text-muted-token font-semibold uppercase tracking-[0.06em]">
                      TYPEFACE ENGINE
                    </span>
                    <select
                      value={readerTypeface}
                      onChange={(e) => setReaderTypeface(e.target.value as "newsreader" | "jakarta" | "mono")}
                      className="p-3 bg-surface-secondary rounded-xl text-primary-token font-jakarta font-semibold text-xs border border-theme outline-none cursor-pointer focus:ring-2 focus:ring-brand-token"
                    >
                      <option value="newsreader">Newsreader Antiqua (Serif)</option>
                      <option value="jakarta">Plus Jakarta Sans (Modern)</option>
                      <option value="mono">Editorial Monospace</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-token font-semibold uppercase tracking-[0.06em]">
                      <span>TEXT SCALE &amp; LEADING</span>
                      <span className="text-primary-token font-semibold tabular-nums normal-case tracking-normal">
                        {readerFontSize}px
                      </span>
                    </div>
                    <div className="p-2.5 bg-surface-secondary rounded-xl flex items-center gap-3 border border-theme">
                      <span className="text-xs font-semibold text-muted-token">A</span>
                      <input
                        type="range"
                        min="15"
                        max="22"
                        step="1"
                        value={readerFontSize}
                        onChange={(e) => setReaderFontSize(Number(e.target.value))}
                        className="w-full h-1.5 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-brand"
                      />
                      <span className="text-base font-bold text-primary-token">A</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reader Simulation Deck */}
              <div className="lg:col-span-6 rounded-2xl bg-surface-secondary p-5 sm:p-6 shadow-inner border border-theme">
                <div
                  className="rounded-2xl p-6 sm:p-8 shadow-md transition-all duration-300 border"
                  style={{
                    backgroundColor:
                      readerTheme === "parchment-ivory"
                        ? "#F5F1E6"
                        : readerTheme === "nocturnal-canopy"
                          ? "#07100D"
                          : "#080C0E",
                    borderColor:
                      readerTheme === "parchment-ivory"
                        ? "#D6CFC0"
                        : readerTheme === "nocturnal-canopy"
                          ? "rgba(44, 224, 201, 0.25)"
                          : "rgba(245, 196, 81, 0.25)",
                    color: readerTheme === "parchment-ivory" ? "#0D1B16" : "#F5F1E6",
                  }}
                >
                  <div
                    className="flex items-center justify-between pb-3 border-b text-xs font-jakarta font-semibold tracking-wider"
                    style={{
                      borderColor:
                        readerTheme === "parchment-ivory" ? "#D6CFC0" : "rgba(245, 196, 81, 0.2)",
                      color:
                        readerTheme === "parchment-ivory" ? "#3B4D44" : "#2CE0C9",
                    }}
                  >
                    <span>CHAPTER 01 • THE JUNGLE AUDIT</span>
                    <span
                      className="flex items-center gap-1 font-bold"
                      style={{
                        color: readerTheme === "parchment-ivory" ? "#9C6D14" : "#F5C451",
                      }}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" /> Page 1 of 280
                    </span>
                  </div>

                  <div
                    className="py-6"
                    style={{
                      fontFamily:
                        readerTypeface === "newsreader"
                          ? "var(--font-serif)"
                          : readerTypeface === "jakarta"
                            ? "var(--font-heading)"
                            : "var(--font-mono)",
                    }}
                  >
                    <h3
                      className="text-2xl sm:text-3xl font-normal mb-3"
                      style={{
                        color: readerTheme === "parchment-ivory" ? "#0D1B16" : "#F5C451",
                      }}
                    >
                      AI Investment ≠ AI Readiness
                    </h3>
                    <p
                      className="italic leading-relaxed mb-4 opacity-95"
                      style={{
                        fontSize: `${readerFontSize + 2}px`,
                        lineHeight: "1.7",
                      }}
                    >
                      &ldquo;Every beast knows how to run. But do you know where you&apos;re running? Companies rush to buy AI tools, models, and platforms while forgetting the first executive question: are we ready?&rdquo;
                    </p>
                    <p
                      className="leading-relaxed opacity-85"
                      style={{
                        fontSize: `${readerFontSize}px`,
                        lineHeight: "1.7",
                      }}
                    >
                      Before prescribing technology, disciplined boards start with a Jungle Audit across Business Alignment, Process Maturity, Data Readiness, Talent, and Risk Governance.
                    </p>
                  </div>

                  <div
                    className="pt-3 border-t flex items-center justify-between font-jakarta text-xs"
                    style={{
                      borderColor:
                        readerTheme === "parchment-ivory" ? "#D6CFC0" : "rgba(44, 224, 201, 0.2)",
                      color: readerTheme === "parchment-ivory" ? "#3B4D44" : "#B9C8BF",
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Headphones
                        className="w-4 h-4"
                        style={{ color: readerTheme === "parchment-ivory" ? "#0D6E62" : "#2CE0C9" }}
                      />
                      <span>Ep 1 Studio Video Sync Ready</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: readerTheme === "parchment-ivory" ? "#0D6E62" : "#2CE0C9" }}
                      />
                      <span>Reader Calibrated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------
          PERSISTENT FLOATING STUDIO AUDIO/VIDEO DOCK (REAL EP 1 STREAM)
          ---------------------------------------------------- */}
      {isDockVisible && (
        <div className="fixed bottom-6 left-0 right-0 z-40 px-4 pointer-events-none">
          <div className="max-w-[760px] mx-auto pointer-events-auto">
            <div className="rounded-full bg-surface-primary/95 backdrop-blur-xl p-2 px-4 sm:px-5 shadow-2xl flex items-center justify-between gap-3 sm:gap-4 border border-theme">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm relative bg-[#07100D] border border-[#2CE0C9]/40">
                  <img
                    className="w-full h-full object-cover"
                    alt="Lion Host"
                    src="/images/mascot-lion.jpg"
                  />
                  <div className="absolute inset-0 bg-[#07100D]/35 flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-[#2CE0C9]" />
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href="/episodes/ep-jungle-01"
                      className="font-jakarta font-bold text-xs text-primary-token hover:text-brand-token truncate"
                    >
                      The AI Jungle Podcast
                    </Link>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#2CE0C9]/20 border border-[#2CE0C9]/40 text-[#2CE0C9] text-[10px] leading-none font-bold tracking-[0.04em]">
                      EP 01
                    </span>
                  </div>
                  <span className="font-jakarta tabular-nums text-[11px] text-muted-token truncate">
                    1.1 The Jungle Audit • {formatTime(audioDurationSec)} Pilot
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex flex-1 items-center gap-2 max-w-xs mx-1">
                <span className="font-mono tabular-nums text-[11px] text-muted-token">
                  {formatTime(audioCurrentSec)}
                </span>
                <div
                  onClick={(e) => {
                    const el = dockMediaRef.current;
                    if (!el) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = Math.max(0, Math.min(1, clickX / rect.width));
                    const dur = el.duration || audioDurationSec;
                    el.currentTime = pct * dur;
                    setAudioProgress(pct * 100);
                  }}
                  className="flex-1 h-1.5 bg-surface-tertiary rounded-full overflow-hidden relative cursor-pointer shadow-inner"
                >
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-200"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <span className="font-mono tabular-nums text-[11px] text-muted-token">
                  {formatTime(audioDurationSec)}
                </span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => seekDockBy(-10)}
                  aria-label="Skip back 10 seconds"
                  className="w-8 h-8 rounded-full bg-surface-secondary hover:bg-surface-tertiary flex items-center justify-center text-primary-token transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleDockPlay}
                  aria-label="Play or pause Episode 1 audio"
                  className="w-10 h-10 rounded-full bg-brand text-[#07100D] flex items-center justify-center shadow-md hover:bg-brand-hover transition-all active:scale-95 cursor-pointer"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => seekDockBy(10)}
                  aria-label="Skip forward 10 seconds"
                  className="w-8 h-8 rounded-full bg-surface-secondary hover:bg-surface-tertiary flex items-center justify-center text-primary-token transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (dockMediaRef.current) dockMediaRef.current.pause();
                    setIsPlayingAudio(false);
                    setIsDockVisible(false);
                  }}
                  aria-label="Close audio dock"
                  title="Dismiss player dock"
                  className="w-7 h-7 rounded-full hover:bg-surface-secondary flex items-center justify-center text-muted-token hover:text-primary-token transition-colors ml-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
