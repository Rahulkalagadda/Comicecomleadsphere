"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme/ThemeContext";
import { Book, Comic, PodcastSeries } from "@/types";
import { getCatalog, getBookmarks, toggleBookmark } from "@/lib/api/client";
import { BookCard } from "@/components/cards/BookCard";
import { ComicCard } from "@/components/cards/ComicCard";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Button } from "@/components/ui/Button";
import {
  MascotMonkey,
  MascotLion,
  MascotElephant,
  MascotWolf,
} from "@/components/mascots/Mascots";
import { ContinueReadingBanner } from "./ContinueReadingBanner";
import {
  BookOpen,
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Film,
  CheckCircle2,
  Bookmark,
  Mail,
  Layers,
  ChevronRight,
  TreePine,
  Feather,
  Award,
  Play,
  Pause,
  Star,
  Eye,
  Radio,
  Clock,
  Palette,
} from "lucide-react";

export function HomeView() {
  const { theme, setTheme } = useTheme();
  const [catalog, setCatalog] = useState<{
    books: Book[];
    comics: Comic[];
    podcasts: PodcastSeries[];
  }>({ books: [], comics: [], podcasts: [] });

  // Hero Video interaction state
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);
  const [heroVideoProgress, setHeroVideoProgress] = useState(0);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  // Studio video clips playback state
  const [playingSnippet, setPlayingSnippet] = useState<string | null>(null);
  const dispatchVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Season 1 Screening Room active clip index
  const [activeJungleClipIdx, setActiveJungleClipIdx] = useState(0);
  const jungleScreeningVideoRef = useRef<HTMLVideoElement | null>(null);

  // Bookmarks state synced with localStorage
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});

  // Comics horizontal strip track ref
  const comicsTrackRef = useRef<HTMLDivElement>(null);

  // Dispatch newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const jungleScreeningClips = [
    {
      id: "ep-jungle-01",
      label: "Full Pilot • 1.1 The Jungle Audit",
      duration: "02:52",
      badge: "Free Episode 1",
      src: "/media/videos/jungle-audit-ep1-full.mp4",
      caption:
        "Complete pilot episode: Lion, Elephant, Wolf & Monkey examine enterprise AI readiness vs. unchecked tool hype.",
      href: "/episodes/ep-jungle-01",
    },
    {
      id: "ep-jungle-02",
      label: "Clip 01 • The Jungle Is Changing",
      duration: "00:10",
      badge: "Keynote Cut",
      src: "/media/videos/clip-01-jungle-is-changing.mp4",
      caption:
        '"Every beast knows how to run. But do you know where you\'re running?" Why AI velocity without strategy fails.',
      href: "/episodes/ep-jungle-02",
    },
    {
      id: "ep-jungle-03",
      label: "Clip 02 • Don't Buy the Engine First",
      duration: "00:10",
      badge: "Boardroom Reality",
      src: "/media/videos/clip-02-ai-investment-readiness.mp4",
      caption:
        "AI Investment ≠ AI Readiness. Buying subscriptions without clean data pipelines creates expensive shelfware.",
      href: "/episodes/ep-jungle-03",
    },
    {
      id: "ep-jungle-04",
      label: "Clip 03 • Process Maturity First",
      duration: "00:10",
      badge: "COO Playbook",
      src: "/media/videos/clip-03-process-maturity.mp4",
      caption:
        "Wolf (COO) & Lion explain why broken workflows must be mapped and simplified before automation.",
      href: "/episodes/ep-jungle-04",
    },
  ] as const;

  useEffect(() => {
    getCatalog().then(setCatalog).catch(() => {});
  }, []);

  useEffect(() => {
    if (jungleScreeningVideoRef.current) {
      jungleScreeningVideoRef.current.pause();
      jungleScreeningVideoRef.current.load();
    }
  }, [activeJungleClipIdx]);

  useEffect(() => {
    const syncBookmarks = () => {
      getBookmarks()
        .then((items) => {
          const nextMap: Record<string, boolean> = {};
          items.forEach((b) => {
            nextMap[b.contentId] = true;
          });
          setBookmarkedMap(nextMap);
        })
        .catch(() => {});
    };
    syncBookmarks();
    window.addEventListener("leadsphere-bookmarks-updated", syncBookmarks);
    window.addEventListener("storage", syncBookmarks);
    return () => {
      window.removeEventListener("leadsphere-bookmarks-updated", syncBookmarks);
      window.removeEventListener("storage", syncBookmarks);
    };
  }, []);

  const toggleHeroPlay = () => {
    const vid = heroVideoRef.current;
    if (!vid) {
      setIsHeroPlaying((prev) => !prev);
      return;
    }
    if (isHeroPlaying) {
      vid.pause();
      setIsHeroPlaying(false);
    } else {
      const p = vid.play();
      if (p && typeof p.then === "function") {
        p.then(() => setIsHeroPlaying(true)).catch(() => setIsHeroPlaying(false));
      } else {
        setIsHeroPlaying(true);
      }
    }
  };

  const scrollComics = (direction: number) => {
    if (comicsTrackRef.current) {
      comicsTrackRef.current.scrollBy({ left: direction * 380, behavior: "smooth" });
    }
  };

  const toggleSnippet = (id: string) => {
    const targetVideo = dispatchVideoRefs.current[id];
    Object.entries(dispatchVideoRefs.current).forEach(([key, el]) => {
      if (key !== id && el && !el.paused) {
        el.pause();
      }
    });
    if (!targetVideo) {
      setPlayingSnippet((curr) => (curr === id ? null : id));
      return;
    }
    if (playingSnippet === id && !targetVideo.paused) {
      targetVideo.pause();
      setPlayingSnippet(null);
    } else {
      const p = targetVideo.play();
      if (p && typeof p.then === "function") {
        p.then(() => setPlayingSnippet(id)).catch(() => setPlayingSnippet(null));
      } else {
        setPlayingSnippet(id);
      }
    }
  };

  const handleBookBookmark = async (book: Book) => {
    const nextState = await toggleBookmark({
      id: `bmk-${book.id}`,
      contentId: book.id,
      contentType: "book",
      title: book.title,
      creatorOrAuthor: book.author,
      coverUrl: book.coverUrl,
      price: book.price,
      savedAt: new Date().toISOString(),
    });
    setBookmarkedMap((prev) => ({ ...prev, [book.id]: nextState }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* =========================================================================
          THEME DECIDER: EXECUTIVE BOARDROOM OBSIDIAN VS JUNGLE CANOPY STUDIO
          Both views strictly feature Dr. Amit Khandelwal's AI Jungle Safari catalog
          ========================================================================= */}

      {theme === "executive" ? (
        <div className="relative w-full overflow-hidden">
          {/* Nocturnal Obsidian & Cyber Teal Ambient Glows */}
          <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-[#E0A62E]/10 blur-3xl pointer-events-none" />
          <div className="absolute top-96 right-10 w-[30rem] h-[30rem] rounded-full bg-[#2CE0C9]/10 blur-3xl pointer-events-none" />

          {/* 1. HERO SECTION (BOARDROOM EDITION) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-12 lg:pb-24 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Hero Text Column */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-surface-secondary border border-theme text-[#F5C451] font-heading text-[11px] font-semibold tracking-[0.08em] uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#2CE0C9] animate-pulse" />
                  Season 1 Folio • Dr. Amit Khandelwal
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-editorial font-semibold text-primary-token tracking-[-0.028em] leading-[1.08] max-w-2xl">
                  Think Strategically. <br className="hidden sm:inline" />
                  Then Let <span className="italic font-normal text-brand-token">AI Roar.</span>
                </h1>

                <p className="text-base sm:text-lg text-secondary-token max-w-xl leading-relaxed">
                  Explore The AI Jungle Safari ecosystem: 13 transformation chapters, 10 Jungle C-Suite advisors, uncropped vertical comic strips, and Season 1 studio broadcasts.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Link
                    href="/books/ai-jungle-safari-transformation-blueprint"
                    className="font-heading px-6 py-3 rounded-xl bg-brand hover:bg-brand-hover text-[#07100D] font-semibold text-sm shadow-md transition-all flex items-center gap-2 group"
                  >
                    <span>Explore Blueprints</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="#curations"
                    className="font-heading px-6 py-3 rounded-xl bg-surface-secondary text-primary-token font-semibold text-sm border border-theme hover:bg-surface-primary transition-all flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-brand-token" />
                    <span>Collector Bundles</span>
                  </a>

                  <div className="flex items-center gap-2 pl-2 text-[#2CE0C9] font-heading text-xs font-semibold uppercase tracking-[0.06em]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>CXO Lanes Power List 2026</span>
                  </div>
                </div>

                {/* Proof Stat Metrics */}
                <div className="grid grid-cols-3 gap-6 pt-6 max-w-lg border-t border-theme/60">
                  <div>
                    <p className="text-2xl sm:text-3xl font-serif-editorial font-semibold tabular-nums tracking-[-0.02em] text-primary-token">
                      13
                    </p>
                    <p className="font-heading text-[11px] font-semibold text-secondary-token uppercase tracking-[0.08em] mt-1">
                      Blueprint Chapters
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-serif-editorial font-semibold tabular-nums tracking-[-0.02em] text-brand-token">
                      10
                    </p>
                    <p className="font-heading text-[11px] font-semibold text-secondary-token uppercase tracking-[0.08em] mt-1">
                      C-Suite Archetypes
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-serif-editorial font-semibold tabular-nums tracking-[-0.02em] text-[#2CE0C9]">
                      5 Pillars
                    </p>
                    <p className="font-heading text-[11px] font-semibold text-secondary-token uppercase tracking-[0.08em] mt-1">
                      Jungle Audit Matrix
                    </p>
                  </div>
                </div>
              </div>

              {/* Hero Visual Spotlight (Right) */}
              <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  <div className="absolute -inset-2 rounded-2xl bg-surface-secondary/80 rotate-2 translate-y-3 pointer-events-none border border-theme shadow-md" />

                  <div className="relative rounded-2xl bg-surface-primary p-6 border border-theme shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between pb-3">
                      <span className="px-3 py-1 rounded-full bg-[#2CE0C9]/15 text-[#2CE0C9] font-heading font-semibold text-[11px] leading-none uppercase tracking-[0.06em] border border-[#2CE0C9]/30">
                        Season 1 • Video Clip 01
                      </span>
                      <span className="text-[11px] font-mono text-secondary-token tabular-nums">
                        13 Chapters • 10 Roles
                      </span>
                    </div>

                    {/* Real Video Player Showcase */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden my-2 bg-[#07100D] shadow-inner border border-theme">
                      <video
                        ref={heroVideoRef}
                        src="/media/videos/clip-01-jungle-is-changing.mp4#t=0.5"
                        playsInline
                        preload="metadata"
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                        onTimeUpdate={() => {
                          const v = heroVideoRef.current;
                          if (v && v.duration) {
                            setHeroVideoProgress((v.currentTime / v.duration) * 100);
                          }
                        }}
                        onEnded={() => {
                          setIsHeroPlaying(false);
                          setHeroVideoProgress(0);
                        }}
                        onClick={toggleHeroPlay}
                        className="w-full h-full object-contain bg-[#07100D] cursor-pointer"
                      />
                      {!isHeroPlaying && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07100D]/80 via-transparent to-transparent flex items-end justify-between p-3 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-md bg-[#07100D]/90 border border-[#2CE0C9]/40 text-[#2CE0C9] font-heading text-[11px] leading-none font-semibold uppercase tracking-[0.05em]">
                            Real Studio Feed
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-[#07100D]/90 border border-[#F5C451]/40 text-[#F5C451] font-mono text-[11px] leading-none font-medium">
                            00:10 Preview
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold font-serif-editorial tracking-[-0.015em] text-primary-token">
                            The AI Jungle Safari Blueprint
                          </h3>
                          <p className="text-[13px] text-secondary-token mt-0.5">
                            Dr. Amit Khandelwal • Data, Digital &amp; AI Strategy
                          </p>
                        </div>
                        <span className="text-xl font-semibold font-serif-editorial tabular-nums text-brand-token">
                          ₹899
                        </span>
                      </div>

                      <div className="mt-4 p-3 rounded-xl bg-surface-secondary border border-theme flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={toggleHeroPlay}
                          aria-label={isHeroPlaying ? "Pause Clip 01 preview" : "Play Clip 01 preview"}
                          className="w-10 h-10 rounded-full bg-brand hover:bg-brand-hover text-[#07100D] flex items-center justify-center shadow transition-all flex-shrink-0 cursor-pointer"
                        >
                          {isHeroPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-xs font-semibold text-primary-token truncate">
                            Clip 01 • The Jungle Is Changing
                          </p>
                          <div className="w-full bg-surface-primary h-1.5 rounded-full mt-1.5 overflow-hidden border border-theme">
                            <div
                              className="bg-brand h-full rounded-full transition-all duration-150"
                              style={{ width: `${heroVideoProgress}%` }}
                            />
                          </div>
                        </div>
                        <Link
                          href="/episodes/ep-jungle-01"
                          className="text-[11px] font-heading font-semibold text-[#2CE0C9] hover:underline flex-shrink-0"
                        >
                          Full Ep 1 →
                        </Link>
                      </div>

                      <div className="pt-3 flex flex-wrap items-center gap-2">
                        <Link
                          href="/read/book-jungle-safari"
                          className="font-heading flex-1 min-w-[120px] py-2 px-3 rounded-lg bg-surface-secondary hover:bg-surface-primary border border-theme text-xs font-semibold text-center text-primary-token transition-colors"
                        >
                          Read 10p Preview
                        </Link>
                        <AddToCartButton
                          compact
                          size="md"
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
                          className="font-heading py-2 px-3 rounded-lg bg-brand hover:bg-brand-hover text-[#07100D] text-xs font-semibold text-center transition-colors shadow-sm"
                        >
                          Unlock
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ContinueReadingBanner />

          {/* 2. EXECUTIVE TRANSFORMATION VOLUMES (ONLY AI JUNGLE BOOKS) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-brand-token font-heading text-[11px] font-semibold uppercase tracking-[0.1em] mb-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Season 1 Executive Volumes</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif-editorial font-semibold text-primary-token tracking-[-0.025em]">
                  AI Transformation Playbooks
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-secondary-token">
                  Uncropped full blueprint folios with 10-page complimentary previews
                </span>
                <Link
                  href="/books"
                  className="font-heading text-xs font-semibold text-brand-token hover:underline flex items-center gap-0.5 tabular-nums"
                >
                  <span>View Books ({catalog.books.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {catalog.books.map((book) => (
                <article
                  key={book.id}
                  className="group rounded-2xl bg-surface-primary p-5 border border-theme shadow-md flex flex-col sm:flex-row gap-5 transition-all hover:-translate-y-1"
                >
                  <Link
                    href={`/books/${book.slug}`}
                    className="relative sm:w-56 h-72 sm:h-auto rounded-xl overflow-hidden bg-[#07100D] border border-theme flex-shrink-0 flex items-center justify-center p-2"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full max-h-72 object-contain group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-[#07100D]/90 border border-[#2CE0C9]/40 text-[#2CE0C9] font-heading text-[10px] leading-none font-semibold uppercase tracking-[0.04em]">
                      10 Pages Free
                    </span>
                    <button
                      type="button"
                      title="Save to reading list"
                      aria-label={`Bookmark ${book.title}`}
                      aria-pressed={!!bookmarkedMap[book.id]}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBookBookmark(book);
                      }}
                      className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#07100D]/90 border border-theme flex items-center justify-center transition-colors cursor-pointer ${
                        bookmarkedMap[book.id]
                          ? "text-[#F5C451]"
                          : "text-[#B9C8BF] hover:text-[#F5C451]"
                      }`}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${bookmarkedMap[book.id] ? "fill-current" : ""}`}
                      />
                    </button>
                  </Link>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded bg-surface-secondary border border-theme text-[#2CE0C9] font-heading text-[11px] font-semibold uppercase tracking-[0.04em]">
                          {book.category}
                        </span>
                        <div className="flex items-center text-[#F5C451]">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-semibold tabular-nums text-primary-token ml-1">
                            {book.rating}
                          </span>
                        </div>
                      </div>

                      <Link href={`/books/${book.slug}`}>
                        <h3 className="font-serif-editorial font-semibold tracking-[-0.015em] text-xl text-primary-token group-hover:text-brand-token transition-colors leading-snug">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-[13px] text-secondary-token mt-1">{book.author}</p>
                      <p className="text-xs text-muted-token mt-2.5 line-clamp-3 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-theme/60">
                      <div>
                        <span className="font-serif-editorial font-semibold tabular-nums text-lg text-[#F5C451]">
                          ₹{book.price}
                        </span>
                        <span className="block text-[11px] text-secondary-token font-mono">
                          {book.pageCount} Pages{book.tableOfContents?.length ? ` • ${book.tableOfContents.length} Chapters` : ""}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/read/${book.id}`}
                          className="font-heading px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-surface-tertiary text-primary-token font-semibold text-xs border border-theme transition-all"
                        >
                          Read 10p
                        </Link>
                        <AddToCartButton
                          compact
                          size="sm"
                          item={{
                            id: book.id,
                            title: book.title,
                            type: "book",
                            badge: "BOOK",
                            edition: `${book.category} • ${book.pageCount} Pages`,
                            authorOrHost: book.author,
                            tierOrFormat: "Full Browser Access • 10-Page Preview Certified",
                            price: book.price,
                            coverUrl: book.coverUrl,
                          }}
                        />
                        <Link
                          href={`/checkout?type=book&id=${book.id}`}
                          className="font-heading px-3.5 py-1.5 rounded-lg bg-brand hover:bg-brand-hover text-[#07100D] font-semibold text-xs transition-all"
                        >
                          Unlock
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 3. FULL-SHEET COMICS GALLERY (UNCROPPED VERTICAL STRIPS — NOT THUMBNAILS) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-[#2CE0C9] font-heading text-[11px] font-semibold uppercase tracking-[0.1em] mb-1.5">
                  <Palette className="w-4 h-4" />
                  <span>Full Uncropped Sequential Comics • Zero Cropping</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif-editorial font-semibold text-primary-token tracking-[-0.025em]">
                  The Jungle Audit Comic Sheets
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous Comic"
                  onClick={() => scrollComics(-1)}
                  className="w-10 h-10 rounded-full bg-surface-secondary hover:bg-surface-primary border border-theme text-primary-token flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next Comic"
                  onClick={() => scrollComics(1)}
                  className="w-10 h-10 rounded-full bg-surface-secondary hover:bg-surface-primary border border-theme text-primary-token flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={comicsTrackRef}
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: "none" }}
            >
              {catalog.comics.map((comic) => (
                <div
                  key={comic.id}
                  className="w-80 md:w-96 flex-shrink-0 snap-start rounded-2xl bg-surface-primary p-4 border border-theme shadow-md flex flex-col justify-between"
                >
                  <div>
                    <Link
                      href={`/read/${comic.id}`}
                      className="relative block w-full rounded-xl overflow-hidden bg-[#07100D] p-2.5 mb-4 border border-amber-400/25"
                    >
                      <img
                        src={comic.coverUrl}
                        alt={comic.title}
                        className="w-full h-[380px] object-contain mx-auto"
                      />
                      <span className="mt-2 inline-block px-2.5 py-1 rounded bg-[#07100D]/90 border border-[#2CE0C9]/40 text-[#2CE0C9] font-heading text-[10px] leading-none font-semibold uppercase tracking-[0.05em]">
                        Full Uncropped Sheet • 10p Free
                      </span>
                    </Link>

                    <div className="flex items-center justify-between text-secondary-token text-[11px] font-mono mb-1">
                      <span>{comic.genre}</span>
                      <span>{comic.pageCount} Plates</span>
                    </div>
                    <Link href={`/comics/${comic.slug}`}>
                      <h3 className="font-serif-editorial font-semibold tracking-[-0.015em] text-xl text-primary-token hover:text-brand-token transition-colors">
                        {comic.title}
                      </h3>
                    </Link>
                    <p className="text-[13px] text-secondary-token mt-1">{comic.creator}</p>
                  </div>

                  <div className="pt-4 mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-theme/60">
                    <span className="font-serif-editorial font-semibold tabular-nums text-lg text-[#F5C451]">
                      ₹{comic.price}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Link
                        href={`/read/${comic.id}`}
                        className="font-heading px-3 py-2 rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-primary-token font-semibold text-xs border border-theme transition-all flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read</span>
                      </Link>
                      <AddToCartButton
                        compact
                        size="sm"
                        className="rounded-xl py-2"
                        item={{
                          id: comic.id,
                          title: comic.title,
                          type: "comic",
                          badge: "COMIC",
                          edition: `${comic.genre} • ${comic.pageCount} Pages`,
                          authorOrHost: comic.creator,
                          tierOrFormat: "Full Uncropped Comic Sheet • 10p Preview",
                          price: comic.price,
                          coverUrl: comic.coverUrl,
                        }}
                      />
                      <Link
                        href={`/checkout?type=comic&id=${comic.id}`}
                        className="font-heading px-3 py-2 rounded-xl bg-brand hover:bg-brand-hover text-[#07100D] font-semibold text-xs transition-all"
                      >
                        Unlock
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. VOICES & DISPATCHES (REAL AI JUNGLE STUDIO MP4 CLIPS) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-brand-token font-heading text-[11px] font-semibold uppercase tracking-[0.1em] mb-1.5">
                  <Radio className="w-4 h-4" />
                  <span>The AI Jungle Podcast • Studio Dispatches</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif-editorial font-semibold text-primary-token tracking-[-0.025em]">
                  Voices &amp; Dispatches
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[13px] text-secondary-token max-w-sm leading-relaxed">
                  Watch studio clips from Lion, Wolf &amp; Elephant, or stream the complete 02:52 Episode 1 pilot free.
                </p>
                <Link
                  href="/episodes/ep-jungle-01"
                  className="font-heading px-3.5 py-2 rounded-lg bg-[#2CE0C9] hover:bg-[#52ebd6] text-[#07100D] text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  Watch Full Ep 1 Free →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  key: "clip-01",
                  badge: "Clip 01 • Keynote Cut",
                  badgeType: "cyan" as const,
                  duration: "00:10",
                  title: "The Jungle Is Changing",
                  description:
                    '"Every beast knows how to run. But do you know where you\'re running?" Lion opens the C-Suite council on strategic AI direction.',
                  videoSrc: "/media/videos/clip-01-jungle-is-changing.mp4#t=0.5",
                  href: "/episodes/ep-jungle-02",
                  tag: "Host Lion",
                },
                {
                  key: "clip-02",
                  badge: "Clip 02 • Strategy",
                  badgeType: "gold" as const,
                  duration: "00:10",
                  title: "Don't Buy the Engine First",
                  description:
                    "AI Investment ≠ AI Readiness. Why buying AI tools before fixing business problems creates expensive enterprise shelfware.",
                  videoSrc: "/media/videos/clip-02-ai-investment-readiness.mp4#t=0.5",
                  href: "/episodes/ep-jungle-03",
                  tag: "Lion & Elephant",
                },
                {
                  key: "clip-03",
                  badge: "Clip 03 • Operations",
                  badgeType: "cyan" as const,
                  duration: "00:10",
                  title: "Map It Before You Automate It",
                  description:
                    "Wolf (COO) joins Lion to show why automating disconnected manual habits multiplies chaos across legacy enterprise workflows.",
                  videoSrc: "/media/videos/clip-03-process-maturity.mp4#t=0.5",
                  href: "/episodes/ep-jungle-04",
                  tag: "Wolf & Lion",
                },
              ].map((clip) => (
                <div
                  key={clip.key}
                  className="rounded-2xl bg-surface-primary p-5 border border-theme shadow-md flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full font-heading text-[11px] leading-none font-semibold uppercase tracking-[0.05em] border ${
                          clip.badgeType === "cyan"
                            ? "bg-[#2CE0C9]/15 text-[#2CE0C9] border-[#2CE0C9]/30"
                            : "bg-[#F5C451]/15 text-[#F5C451] border-[#F5C451]/30"
                        }`}
                      >
                        {clip.badge}
                      </span>
                      <span className="text-[11px] tabular-nums text-secondary-token flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {clip.duration}
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#07100D] border border-theme">
                      <video
                        ref={(el) => {
                          dispatchVideoRefs.current[clip.key] = el;
                        }}
                        src={clip.videoSrc}
                        playsInline
                        preload="metadata"
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                        onEnded={() => setPlayingSnippet((curr) => (curr === clip.key ? null : curr))}
                        onClick={() => toggleSnippet(clip.key)}
                        className="w-full h-full object-contain bg-[#07100D] cursor-pointer"
                      />
                    </div>

                    <div>
                      <h3 className="font-serif-editorial font-semibold tracking-[-0.015em] text-lg text-primary-token mb-1.5 leading-snug">
                        {clip.title}
                      </h3>
                      <p className="text-[13px] text-secondary-token line-clamp-3 leading-relaxed">
                        {clip.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-theme/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSnippet(clip.key)}
                        className="w-9 h-9 rounded-full bg-brand hover:bg-brand-hover text-[#07100D] flex items-center justify-center transition-opacity cursor-pointer shadow-sm"
                        aria-label={`${playingSnippet === clip.key ? "Pause" : "Play"} ${clip.title}`}
                      >
                        {playingSnippet === clip.key ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>
                      <span className="font-heading text-xs font-semibold text-primary-token">
                        {playingSnippet === clip.key ? "Playing Clip" : "Play Clip"}
                      </span>
                    </div>
                    <Link
                      href={clip.href}
                      className="text-[11px] font-mono text-[#2CE0C9] hover:underline font-semibold"
                    >
                      {clip.tag} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. CURATED AI JUNGLE COLLECTIONS */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full" id="curations">
            <div className="mb-8">
              <span className="font-heading text-accent-gold text-[11px] font-semibold uppercase tracking-[0.1em] block mb-1.5">
                Season 1 Collectors Editions
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-editorial font-semibold text-primary-token tracking-[-0.025em]">
                Curated AI Jungle Bundles
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Collection 1: Season 1 Collector Anthology */}
              <div className="lg:col-span-2 rounded-2xl bg-surface-secondary p-8 relative overflow-hidden flex flex-col justify-between border border-theme shadow-md">
                <div className="relative z-10 max-w-lg">
                  <span className="px-3 py-1 rounded-full bg-surface-primary border border-theme text-[#2CE0C9] font-heading text-[11px] font-semibold uppercase tracking-[0.06em]">
                    Complete Season 1 Vault • 5 Works
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token mt-3 mb-2 leading-tight">
                    AI Jungle Safari: Season 1 Collector Anthology
                  </h3>
                  <p className="text-sm sm:text-[15px] text-secondary-token leading-relaxed">
                    Unlock both flagship books (13-Chapter Blueprint &amp; 5-Pillar Audit Playbook) plus all three uncropped Jungle Audit comic volumes in one enterprise license.
                  </p>
                </div>

                <div className="relative z-10 pt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/checkout?type=bundle&id=season-1-collector"
                    className="font-heading px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-[#07100D] font-semibold tabular-nums text-xs sm:text-sm transition-all shadow-sm"
                  >
                    Access Anthology (₹1,999)
                  </Link>
                  <AddToCartButton
                    size="md"
                    className="rounded-xl py-2.5"
                    item={{
                      id: "season-1-collector",
                      title: "Season 1 Complete AI Jungle Safari Collector Bundle",
                      type: "bundle",
                      badge: "SEASON 1",
                      edition: "13-Chapter Blueprint + 3 Comic Issues + Video Clips 01–03",
                      authorOrHost: "Dr. Amit Khandelwal & The AI Jungle Studio",
                      tierOrFormat: "Complete Bundle • Instant My Library Access",
                      price: 1999,
                      coverUrl: "/media/images/ai-jungle-safari-blueprint.jpg",
                    }}
                  />
                  <span className="text-xs text-secondary-token">
                    Saves ₹496 • Instant permanent vault access
                  </span>
                </div>

                <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none text-brand-token">
                  <svg fill="none" height="340" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 200 200" width="340">
                    <circle cx="100" cy="100" r="80" strokeDasharray="4 4" />
                    <circle cx="100" cy="100" r="50" />
                    <circle cx="100" cy="100" r="20" />
                    <line x1="20" x2="180" y1="100" y2="100" />
                    <line x1="100" x2="100" y1="20" y2="180" />
                  </svg>
                </div>
              </div>

              {/* Collection 2: Jungle Audit Complete Pack */}
              <div className="rounded-2xl bg-surface-secondary p-8 relative overflow-hidden flex flex-col justify-between border border-theme shadow-md">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#2CE0C9]/15 text-[#2CE0C9] font-heading text-[11px] font-semibold uppercase tracking-[0.06em] border border-[#2CE0C9]/30">
                    Visual + Playbook Pack
                  </span>
                  <h3 className="text-2xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token mt-3 mb-2 leading-tight">
                    1.1 &amp; 1.2 Jungle Audit Pack
                  </h3>
                  <p className="text-[13px] sm:text-sm text-secondary-token leading-relaxed">
                    Part 1 &amp; Part 2 full-sheet comics alongside The Jungle Audit 5-Pillar Readiness &amp; Maturity Playbook.
                  </p>
                </div>

                <div className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono tabular-nums text-secondary-token">3 Titles Bundled</span>
                    <span className="text-xl font-serif-editorial font-semibold tabular-nums text-[#F5C451]">
                      ₹1,299
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AddToCartButton
                      compact
                      size="md"
                      className="rounded-xl py-2.5"
                      item={{
                        id: "jungle-audit-pack",
                        title: "The Jungle Audit Executive Starter Pack",
                        type: "bundle",
                        badge: "STARTER PACK",
                        edition: "Maturity Playbook + Part 1 & 2 Comics + Clips 01–03",
                        authorOrHost: "Dr. Amit Khandelwal • Lion, Wolf & Elephant",
                        tierOrFormat: "Complete Pack • Instant My Library Access",
                        price: 1299,
                        coverUrl: "/media/images/ai-jungle-podcast-comic.jpg",
                      }}
                    />
                    <Link
                      href="/checkout?type=bundle&id=jungle-audit-pack"
                      className="font-heading flex-1 text-center block py-2.5 rounded-xl bg-surface-primary hover:bg-brand hover:text-[#07100D] hover:border-brand text-primary-token font-semibold text-xs border border-theme transition-all"
                    >
                      Inspect Pack
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. SWITCH TO JUNGLE CANOPY STUDIO BANNER */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="rounded-2xl bg-gradient-to-r from-[#2CE0C9]/10 via-surface-secondary to-[#F5C451]/10 p-8 sm:p-10 border border-theme shadow-md relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                <div className="md:col-span-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-primary/90 text-[#2CE0C9] font-heading text-[11px] font-semibold uppercase tracking-[0.06em] mb-2 border border-theme/60">
                    <TreePine className="w-3.5 h-3.5" />
                    <span>Dual Obsidian Presentation</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token">
                    Prefer the Illustrated AI Jungle Canopy Studio?
                  </h3>
                  <p className="text-[13px] sm:text-sm text-secondary-token max-w-xl mt-1.5 leading-relaxed">
                    Switch to <strong className="text-primary-token font-semibold">Jungle Canopy</strong> for the 4-Advisor council (Lion, Elephant, Wolf, Monkey), interactive Season 1 screening room, and nocturnal emerald atmosphere.
                  </p>
                </div>

                <div className="md:col-span-4 flex md:justify-end items-center">
                  <button
                    type="button"
                    onClick={() => setTheme("jungle")}
                    className="font-heading px-6 py-3 rounded-full bg-brand hover:bg-brand-hover text-[#07100D] font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <TreePine className="w-4 h-4" />
                    <span>Switch to Jungle Canopy</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* =======================================================================
           JUNGLE CANOPY STUDIO (DEFAULT NOCTURNAL OBSIDIAN + GOLD + CYBER TEAL)
           ======================================================================= */
        <div className="space-y-16 sm:space-y-24">
          {/* Jungle Hero Section */}
          <section className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24 border-b border-theme/80 transition-colors duration-300">
            <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#2CE0C9]/10 blur-3xl pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full nm-inset-control bg-surface-secondary font-heading text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2CE0C9]">
                      <Sparkles className="w-3.5 h-3.5 text-[#F5C451]" />
                      <span>The AI Jungle • Nocturnal Studio</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-serif-editorial font-semibold text-primary-token tracking-[-0.028em] leading-[1.08]">
                      Think Strategically. <br />
                      Then Let <span className="text-brand-token italic font-normal">AI Roar.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-secondary-token leading-relaxed max-w-xl mx-auto lg:mx-0">
                      Master enterprise Data, Digital &amp; AI Transformation with Dr. Amit Khandelwal and the Jungle Council—featuring uncropped full-sheet comics, Season 1 blueprints, and studio video broadcasts.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                      <Link href="/discover">
                        <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
                          <Compass className="w-4 h-4 mr-2" />
                          Explore the Safari
                        </Button>
                      </Link>
                      <Link href="/library">
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                          <Bookmark className="w-4 h-4 mr-2" />
                          My Personal Vault
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* 3D Jungle Library Scene */}
                  <div className="lg:col-span-6 flex justify-center">
                    <div className="relative w-full max-w-lg rounded-3xl overflow-hidden soft-surface border border-theme shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                      <img
                        src="/images/jungle-library-hero.jpg"
                        alt="The AI Jungle Studio: Lion host in obsidian library with scholar Elephant and Explorer Monkey"
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-[#07100D]/90 text-[#2CE0C9] flex items-center gap-2 shadow-lg border border-[#2CE0C9]/30 font-heading text-[11px] font-semibold uppercase tracking-[0.06em]">
                        <span className="w-2 h-2 rounded-full bg-[#2CE0C9] animate-pulse" />
                        <span>Season 1 Live Archive</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4-Mascot Guided Council */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
                  <div className="p-5 rounded-2xl bg-surface-primary border border-theme/80 soft-surface flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
                    <MascotLion size={96} />
                    <h4 className="font-heading font-semibold tracking-[-0.01em] text-[15px] text-primary-token mt-3">
                      Lion • CEO &amp; Strategy
                    </h4>
                    <p className="text-xs text-secondary-token mt-1 leading-relaxed">
                      Business Alignment, Executive Vision &amp; Measured AI Value.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-primary border border-theme/80 soft-surface flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
                    <MascotElephant size={96} />
                    <h4 className="font-heading font-semibold tracking-[-0.01em] text-[15px] text-primary-token mt-3">
                      Elephant • CDO &amp; Data
                    </h4>
                    <p className="text-xs text-secondary-token mt-1 leading-relaxed">
                      Data Readiness: clean, connected, governed enterprise pipelines.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-primary border border-theme/80 soft-surface flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
                    <MascotWolf size={96} />
                    <h4 className="font-heading font-semibold tracking-[-0.01em] text-[15px] text-primary-token mt-3">
                      Wolf • COO &amp; Operations
                    </h4>
                    <p className="text-xs text-secondary-token mt-1 leading-relaxed">
                      Process Maturity: map and simplify workflows before automating.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-primary border border-theme/80 soft-surface flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
                    <MascotMonkey size={96} />
                    <h4 className="font-heading font-semibold tracking-[-0.01em] text-[15px] text-primary-token mt-3">
                      Monkey • GenAI Lab
                    </h4>
                    <p className="text-xs text-secondary-token mt-1 leading-relaxed">
                      Guards against unchecked bottom-up hype &amp; 4,000-banana traps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ContinueReadingBanner />

          {/* Jungle Season 1 Spotlight: The AI Jungle Safari & Screening Studio */}
          <section
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
            id="ai-jungle-safari-studio"
          >
            <div className="rounded-3xl bg-surface-primary border border-theme shadow-xl p-6 sm:p-8 lg:p-10 soft-surface space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-theme/80 pb-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#2CE0C9]/15 text-[#2CE0C9] font-heading text-[11px] font-semibold uppercase tracking-[0.06em] border border-[#2CE0C9]/30">
                      Season 1 • Dr. Amit Khandelwal
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#F5C451]/15 text-[#F5C451] font-heading text-[11px] font-semibold uppercase tracking-[0.06em] border border-[#F5C451]/30">
                      CXO Lanes Power List 2026 Winner
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token">
                    The AI Jungle Safari: Think Strategically. Then Let AI Roar.
                  </h2>
                  <p className="text-sm text-secondary-token max-w-2xl leading-relaxed">
                    Conceptualized, curated, and published across 13 chapters and 10 Jungle C-Suite advisors—combining executive strategy blueprints, full comic sheets, and the AI Jungle Studio video podcast.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Link href="/read/book-jungle-safari">
                    <Button variant="primary" size="sm">
                      <BookOpen className="w-4 h-4 mr-1.5" />
                      Read 13-Chapter Blueprint
                    </Button>
                  </Link>
                  <AddToCartButton
                    compact
                    size="md"
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
                  <Link href="/read/comic-jungle-audit">
                    <Button variant="secondary" size="sm">
                      <Layers className="w-4 h-4 mr-1.5" />
                      Read Comic Sheets
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Master Poster Uncropped + 10 C-Suite Roles */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="rounded-2xl overflow-hidden border border-theme bg-[#07100D] p-2 shadow-md">
                    <img
                      src="/media/images/ai-jungle-safari-blueprint.jpg"
                      alt="The AI Jungle Safari Master Transformation Blueprint — 13 Chapters & 10 Jungle C-Suite Roles"
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-theme space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs font-semibold uppercase tracking-[0.06em] text-primary-token">
                        10 Jungle C-Suite Advisors
                      </span>
                      <span className="font-mono text-[11px] text-[#2CE0C9] tabular-nums">
                        13 Chapters
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Lion • CEO & AI Strategy",
                        "Elephant • CDO & Data",
                        "Wolf • COO & Ops",
                        "Owl • Governance",
                        "Fox • CSO Innovation",
                        "Cheetah • Automation",
                        "Eagle • CISO Security",
                        "Ant • Workforce & HR",
                        "Peacock • CMO CX",
                        "Monkey • GenAI",
                      ].map((role) => (
                        <span
                          key={role}
                          className="px-2.5 py-1 rounded-full bg-surface-primary border border-theme text-[11px] font-medium text-secondary-token"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Interactive 4-Clip MP4 Screening Studio */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-brand-token" />
                      <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-brand-token">
                        AI Jungle Studio • Screening Room
                      </span>
                    </div>
                    <Link
                      href={jungleScreeningClips[activeJungleClipIdx].href}
                      className="font-heading text-xs font-semibold text-[#2CE0C9] hover:underline"
                    >
                      Open in Full Player →
                    </Link>
                  </div>

                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#07100D] border border-theme shadow-xl">
                    <video
                      ref={jungleScreeningVideoRef}
                      src={`${jungleScreeningClips[activeJungleClipIdx].src}#t=0.5`}
                      controls
                      playsInline
                      preload="metadata"
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-theme space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.06em] text-accent-gold">
                          {jungleScreeningClips[activeJungleClipIdx].badge} •{" "}
                          {jungleScreeningClips[activeJungleClipIdx].duration}
                        </span>
                        <h3 className="font-serif-editorial text-lg font-semibold text-primary-token">
                          {jungleScreeningClips[activeJungleClipIdx].label}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs sm:text-[13px] text-secondary-token leading-relaxed">
                      {jungleScreeningClips[activeJungleClipIdx].caption}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {jungleScreeningClips.map((clip, idx) => {
                        const isActive = idx === activeJungleClipIdx;
                        return (
                          <button
                            key={clip.id}
                            type="button"
                            onClick={() => setActiveJungleClipIdx(idx)}
                            className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                              isActive
                                ? "bg-surface-primary border-brand shadow-sm text-primary-token"
                                : "bg-surface-primary/60 border-theme text-secondary-token hover:bg-surface-primary"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="font-heading text-xs font-semibold truncate">
                                {clip.label}
                              </p>
                              <p className="text-[11px] text-[#2CE0C9]">{clip.badge}</p>
                            </div>
                            <span className="font-mono text-[11px] tabular-nums shrink-0 px-2 py-0.5 rounded bg-surface-secondary text-[#F5C451]">
                              {clip.duration}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Jungle Section 2: Transformation Playbooks (Books) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="story-clearing">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-theme/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-token" />
                  <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-accent-gold">
                    Season 1 Editions • Blueprints &amp; Playbooks
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token mt-1">
                  AI Jungle Safari Volumes
                </h2>
                <p className="text-[13px] sm:text-sm text-secondary-token mt-0.5 leading-relaxed">
                  Executive blueprints on enterprise AI strategy, data maturity, and the 5-Pillar Jungle Audit. First 10 pages complimentary.
                </p>
              </div>

              <Link href="/books">
                <Button variant="secondary" size="sm" className="self-start sm:self-auto">
                  View All Books ({catalog.books.length})
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.books
                .filter((book) => Boolean(book.coverUrl?.trim()))
                .map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
            </div>
          </section>

          {/* Jungle Section 3: Comic Canopy (Full Uncropped Vertical Comics) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="comic-canopy">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-theme/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent-gold" />
                  <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-accent-gold">
                    Comic Canopy • Uncropped Full Comic Sheets
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token mt-1">
                  The AI Jungle Comic Editions
                </h2>
                <p className="text-[13px] sm:text-sm text-secondary-token mt-0.5 leading-relaxed">
                  Sequential AI boardroom comics displayed in full uncropped vertical format—click any sheet to read with interactive zoom.
                </p>
              </div>

              <Link href="/comics">
                <Button variant="secondary" size="sm" className="self-start sm:self-auto">
                  View All Comics ({catalog.comics.filter((c) => Boolean(c.coverUrl?.trim())).length})
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.comics
                .filter((comic) => Boolean(comic.coverUrl?.trim()))
                .map((comic) => (
                  <ComicCard key={comic.id} comic={comic} />
                ))}
            </div>
          </section>

          {/* Jungle Section 4: Voices from the Studio */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="voices-from-the-wild">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-theme/80 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden soft-surface border border-theme/80 bg-surface-secondary/40 p-1 hidden sm:flex items-center justify-center">
                  <img
                    src="/images/mascot-wolf-transparent.png"
                    alt="Wolf COO with Studio Headphones"
                    className="w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Film className="w-5 h-5 text-brand-token" />
                    <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-[#2CE0C9]">
                      The AI Jungle Podcast • Studio Series
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token mt-1">
                    Voices from the Council
                  </h2>
                  <p className="text-[13px] sm:text-sm text-secondary-token mt-0.5 leading-relaxed">
                    Episode 1 (1.1 The Jungle Audit) is complimentary in full HD video. Unlock individual studio clips below.
                  </p>
                </div>
              </div>

              <Link href="/podcasts">
                <Button variant="secondary" size="sm" className="self-start sm:self-auto">
                  View Series ({catalog.podcasts.filter((p) => Boolean(p.coverUrl?.trim())).length})
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {catalog.podcasts
                .filter((series) => Boolean(series.coverUrl?.trim()))
                .map((series) => (
                  <PodcastCard key={series.id} series={series} />
                ))}
            </div>
          </section>

          {/* Jungle Section 5: Switch to Boardroom Obsidian */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-surface-primary border border-theme p-8 sm:p-10 soft-surface relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                <div className="md:col-span-8 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-secondary text-[#2CE0C9] font-heading text-[11px] font-semibold uppercase tracking-[0.08em] border border-[#2CE0C9]/30">
                    <Award className="w-3.5 h-3.5 text-accent-gold" />
                    <span>Executive Boardroom Layout</span>
                  </div>
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-primary-token">
                    Prefer a streamlined Boardroom Briefing view?
                  </h3>
                  <p className="text-sm text-secondary-token max-w-xl leading-relaxed">
                    Switch anytime to <strong className="text-primary-token font-semibold">Boardroom Obsidian</strong> for our compact typographic grid built around Dr. Khandelwal&apos;s AI Jungle Safari blueprints and comic sheets.
                  </p>
                </div>

                <div className="md:col-span-4 flex md:justify-end">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setTheme("executive")}
                    className="w-full sm:w-auto"
                  >
                    <Feather className="w-4 h-4 mr-2 text-accent-gold" />
                    Switch to Boardroom Mode
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Jungle Section 6: AI Transformation Topics */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-surface-secondary/70 border border-theme/80 space-y-6 soft-surface">
              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-accent-gold">
                  5 Pillars &amp; 13 Chapters
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif-editorial font-semibold tracking-[-0.02em] text-primary-token">
                  Explore AI Jungle Topics
                </h2>
                <p className="text-[13px] sm:text-sm text-secondary-token leading-relaxed">
                  Filter blueprints, comic sheets, and podcast clips by Season 1 strategic discipline
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                {[
                  "Jungle Audit",
                  "Business Alignment",
                  "Data Maturity",
                  "Process Maturity",
                  "GenAI Strategy",
                  "AI Governance",
                ].map((topic) => (
                  <Link
                    key={topic}
                    href={`/search?q=${encodeURIComponent(topic)}`}
                    className="px-4 py-2 rounded-full nm-button bg-surface-primary text-xs font-semibold text-primary-token transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2CE0C9]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CE0C9]"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Global The AI Jungle Dispatch Newsletter */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-surface-primary border border-theme shadow-xl overflow-hidden soft-surface">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-token/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#2CE0C9]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-secondary border border-theme text-[#2CE0C9] font-heading text-[11px] font-semibold uppercase tracking-[0.08em]">
                  <span className="w-2 h-2 rounded-full bg-[#2CE0C9] animate-pulse" />
                  <span>The AI Jungle Dispatch • CXO Transformation Brief</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-editorial font-semibold text-primary-token tracking-[-0.025em] leading-[1.12]">
                  The AI Jungle <span className="italic font-normal text-brand-token">Dispatch</span>.
                </h2>

                <p className="text-sm sm:text-base text-secondary-token leading-relaxed max-w-xl">
                  Receive Dr. Amit Khandelwal&apos;s boardroom field notes, Season 2 comic sheets, and 5-Pillar AI Readiness scorecards direct to your executive inbox.
                </p>

                {subscribed ? (
                  <div className="p-5 rounded-2xl bg-[#2CE0C9]/10 border border-[#2CE0C9]/30 text-[#2CE0C9] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#2CE0C9]" />
                      <span>Welcome to The AI Jungle Safari Circle</span>
                    </div>
                    <p className="text-xs text-secondary-token leading-relaxed">
                      Your complimentary Chapter 01 Jungle Audit checklist and studio briefing schedule are confirmed.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3.5 pt-1">
                    <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl nm-inset-control bg-surface-secondary border border-theme">
                      <div className="relative flex-1 flex items-center">
                        <Mail className="w-4 h-4 text-secondary-token ml-3.5 absolute pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="Enter corporate email address..."
                          className="w-full pl-10 pr-4 py-3 bg-transparent text-xs sm:text-sm text-primary-token placeholder:text-secondary-token/60 focus:outline-none"
                        />
                      </div>
                      <Button
                        variant="primary"
                        type="submit"
                        className="sm:px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <span>Join the Safari</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-secondary-token pt-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2CE0C9]" />
                        <span>Weekly AI Strategy Notes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-token" />
                        <span>Enterprise Ready • Zero Spam</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-accent-gold" />
                        <span>1-Click Unsubscribe</span>
                      </div>
                    </div>
                  </form>
                )}

                <div className="pt-3 border-t border-theme/60 flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-primary object-cover"
                      src="/images/mascot-lion.jpg"
                      alt="Lion Advisor"
                    />
                    <img
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-primary object-cover"
                      src="/images/mascot-elephant.jpg"
                      alt="Elephant Advisor"
                    />
                    <img
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-primary object-cover"
                      src="/images/mascot-wolf.jpg"
                      alt="Wolf Advisor"
                    />
                    <img
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-primary object-cover"
                      src="/images/mascot-monkey.jpg"
                      alt="Monkey Advisor"
                    />
                  </div>
                  <p className="text-xs text-secondary-token">
                    Guided by <strong className="text-primary-token font-semibold">Lion, Elephant, Wolf &amp; Monkey</strong> from Season 1.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="p-6 sm:p-7 rounded-2xl bg-surface-secondary/70 border border-theme shadow-md soft-surface relative space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-theme/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#2CE0C9] animate-pulse" />
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.06em] text-secondary-token">
                        Season 1 Briefing Highlights
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-brand-token font-semibold uppercase tracking-[0.05em]">
                      Open Preview
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/books/ai-jungle-safari-transformation-blueprint"
                      className="block p-3.5 rounded-xl bg-surface-primary border border-theme/70 hover:border-brand/50 transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between font-heading text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary-token">
                        <span className="text-brand-token">Transformation Blueprint</span>
                        <span className="tabular-nums">13 Chapters</span>
                      </div>
                      <h4 className="font-serif-editorial font-semibold tracking-[-0.01em] text-[15px] text-primary-token leading-snug">
                        AI Investment ≠ AI Readiness: Conduct the Jungle Audit First
                      </h4>
                      <p className="text-xs text-secondary-token line-clamp-2 leading-relaxed">
                        Why clean, connected, governed data pipelines determine enterprise AI ROI before buying a single model.
                      </p>
                    </Link>

                    <Link
                      href="/episodes/ep-jungle-01"
                      className="block p-3.5 rounded-xl bg-surface-primary border border-theme/70 hover:border-[#2CE0C9]/50 transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between font-heading text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary-token">
                        <span className="text-[#2CE0C9]">Studio Video Pilot</span>
                        <span className="tabular-nums">02:52 HD</span>
                      </div>
                      <h4 className="font-serif-editorial font-semibold tracking-[-0.01em] text-[15px] text-primary-token leading-snug">
                        Ep 1: 1.1 The Jungle Audit — Free Full Video Broadcast
                      </h4>
                      <p className="text-xs text-secondary-token line-clamp-2 leading-relaxed">
                        Stream Host Lion, Wolf (COO), Elephant (CDO) and Monkey around the Season 1 studio desk.
                      </p>
                    </Link>

                    <Link
                      href="/read/comic-jungle-part-2"
                      className="block p-3.5 rounded-xl bg-surface-primary border border-theme/70 hover:border-brand/50 transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between font-heading text-[11px] font-semibold uppercase tracking-[0.05em] text-secondary-token">
                        <span className="text-accent-gold">Comic Sheet 1.2</span>
                        <span className="tabular-nums">Clips 07–12</span>
                      </div>
                      <h4 className="font-serif-editorial font-semibold tracking-[-0.01em] text-[15px] text-primary-token leading-snug">
                        1.2 The Jungle Audit Part 2: 4,000 Bananas &amp; Maturity Scorecard
                      </h4>
                      <p className="text-xs text-secondary-token line-clamp-2 leading-relaxed">
                        Full vertical graphic strip illustrating Map → Simplify → Automate and the 5-Pillar Value Chain.
                      </p>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-theme/60 flex items-center justify-between text-[11px] text-secondary-token font-mono">
                    <span>Free 10-page previews</span>
                    <span className="font-bold text-[#F5C451]">Season 1 Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
