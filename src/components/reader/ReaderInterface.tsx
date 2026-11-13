"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Book, Comic } from "@/types";
import { Button } from "@/components/ui/Button";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { PageLockPanel } from "./PageLockPanel";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Bookmark,
  ZoomIn,
  ZoomOut,
  ShieldAlert,
} from "lucide-react";
import {
  getReaderPage,
  saveReadingProgress,
  getReadingProgress,
  checkEntitlement,
  toggleBookmark,
  isBookmarked,
  ReaderPageResponse,
} from "@/lib/api/client";

interface ReaderInterfaceProps {
  item: Book | Comic;
}

export function ReaderInterface({ item }: ReaderInterfaceProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState<ReaderPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwned, setIsOwned] = useState(false);
  const [fontSizePercent, setFontSizePercent] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initial load: entitlement, bookmarks, reading progress restoration
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const [owned, progress, bmk] = await Promise.all([
          checkEntitlement(item.id),
          getReadingProgress(item.id),
          isBookmarked(item.id),
        ]);
        if (!mounted) return;
        setIsOwned(owned);
        setBookmarked(bmk);
        if (progress && progress.currentPage > 0 && progress.currentPage <= item.pageCount) {
          // If owned or page <= 10, restore last position
          if (owned || progress.currentPage <= 10) {
            setCurrentPage(progress.currentPage);
          }
        }
      } catch (err: any) {
        console.error("Reader initialization error:", err);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [item.id, item.pageCount]);

  // Load page data whenever currentPage or isOwned changes
  const loadPage = useCallback(
    async (page: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReaderPage(item.id, page);
        setPageData(data);
        // Save progress if authorized
        if (!data.locked) {
          saveReadingProgress(item.id, page, item.pageCount);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load page content.");
      } finally {
        setLoading(false);
      }
    },
    [item.id, item.pageCount]
  );

  useEffect(() => {
    loadPage(currentPage);
  }, [currentPage, loadPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        if (currentPage < item.pageCount) setCurrentPage((p) => p + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, item.pageCount]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleBookmark = async () => {
    const nextState = await toggleBookmark({
      id: `bmk-${item.id}`,
      contentId: item.id,
      contentType: item.type,
      title: item.title,
      creatorOrAuthor: (item as any).author || (item as any).creator,
      coverUrl: item.coverUrl,
      price: item.price,
      savedAt: new Date().toISOString(),
    });
    setBookmarked(nextState);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col bg-main text-primary-token select-none transition-colors duration-200"
    >
      {/* READER TOP TOOLBAR */}
      <header className="sticky top-0 z-30 w-full bg-surface-primary/95 backdrop-blur-md border-b border-theme py-2.5 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={item.type === "book" ? `/books/${item.slug}` : `/comics/${item.slug}`}
            className="p-1.5 rounded-lg text-secondary-token hover:text-primary-token hover:bg-surface-secondary"
            aria-label="Exit reader"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold font-heading tracking-[-0.01em] text-primary-token truncate">
              {item.title}
            </h1>
            <p className="text-[11px] text-muted-token tabular-nums">
              {(item as any).author || (item as any).creator} • {item.pageCount} Pages total
            </p>
          </div>
        </div>

        {/* Center: Tactile Page Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-lg nm-button bg-surface-primary text-secondary-token hover:text-primary-token disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-heading text-xs font-semibold tabular-nums px-3 py-1.5 rounded-lg nm-inset-control bg-surface-secondary text-primary-token tracking-[0.01em]">
            Page {currentPage} of {item.pageCount}
          </span>

          <button
            type="button"
            disabled={currentPage >= item.pageCount}
            onClick={() => setCurrentPage((p) => Math.min(item.pageCount, p + 1))}
            className="p-2 rounded-lg nm-button bg-surface-primary text-secondary-token hover:text-primary-token disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom, Fullscreen, Bookmark, Theme */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 nm-inset-control rounded-lg p-0.5 bg-surface-secondary">
            <button
              type="button"
              onClick={() => setFontSizePercent((f) => Math.max(80, f - 10))}
              className="p-1.5 rounded text-secondary-token hover:text-primary-token hover:bg-surface-primary transition-colors cursor-pointer"
              title={item.type === "book" ? "Decrease font size" : "Zoom out comic"}
              aria-label={item.type === "book" ? "Decrease font size" : "Zoom out comic"}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium tabular-nums px-1.5 text-muted-token">
              {fontSizePercent}%
            </span>
            <button
              type="button"
              onClick={() =>
                setFontSizePercent((f) => Math.min(item.type === "comic" ? 180 : 140, f + 10))
              }
              className="p-1.5 rounded text-secondary-token hover:text-primary-token hover:bg-surface-primary transition-colors cursor-pointer"
              title={item.type === "book" ? "Increase font size" : "Zoom in comic"}
              aria-label={item.type === "book" ? "Increase font size" : "Zoom in comic"}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
            className="p-2 rounded-lg nm-button bg-surface-primary text-secondary-token hover:text-primary-token transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token"
          >
            <Bookmark
              className={`w-4 h-4 transition-colors ${bookmarked ? "fill-accent-gold text-accent-gold" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="p-2 rounded-lg nm-button bg-surface-primary text-secondary-token hover:text-primary-token transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="hidden md:block">
            <ThemeSwitcher variant="compact" />
          </div>
        </div>
      </header>

      {/* READING CANVAS BODY */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto p-4 sm:p-8">
        {loading && (
          <div className="py-24 text-center">
            <div className="w-8 h-8 mx-auto border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-muted-token mt-3">Loading page {currentPage}...</p>
          </div>
        )}

        {error && (
          <div className="py-16 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-primary-token">Unable to load page</h3>
            <p className="text-xs text-secondary-token">{error}</p>
            <Button variant="outline" size="sm" onClick={() => loadPage(currentPage)}>
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && pageData && (
          <>
            {/* LOCKED GATE: When page > 10 and not purchased */}
            {pageData.locked ? (
              <PageLockPanel
                contentId={item.id}
                title={item.title}
                price={item.price}
                type={item.type}
                coverUrl={item.coverUrl}
                onUnlocked={() => {
                  setIsOwned(true);
                  loadPage(currentPage);
                }}
              />
            ) : (
              /* AUTHORIZED VIEW: Book text or Comic artwork */
              <div
                className="w-full bg-surface-primary border border-theme rounded-2xl p-4 sm:p-8 lg:p-10 shadow-md transition-all duration-200"
                style={item.type === "book" ? { fontSize: `${fontSizePercent}%` } : undefined}
              >
                {item.type === "book" ? (
                  <article className="max-w-none reading-canvas space-y-6">
                    <div className="border-b border-theme pb-4 mb-6">
                      <span className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-accent-gold">
                        {pageData.title || `Chapter ${Math.ceil(currentPage / 5)}`}
                      </span>
                    </div>
                    <div className="whitespace-pre-line text-primary-token">
                      {pageData.text}
                    </div>
                  </article>
                ) : (
                  <div className="flex flex-col items-center w-full overflow-x-auto">
                    <div
                      className="w-full rounded-xl overflow-hidden border border-theme bg-surface-secondary shadow-lg transition-all duration-200 mx-auto"
                      style={{ maxWidth: `${Math.round(680 * (fontSizePercent / 100))}px` }}
                    >
                      <img
                        src={pageData.imageUrl || item.coverUrl}
                        alt={pageData.title || `Panel ${currentPage}`}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-auto block pointer-events-none select-none"
                      />
                    </div>
                    {pageData.title && (
                      <p className="font-serif-editorial text-sm text-secondary-token mt-4 italic text-center max-w-2xl">
                        {pageData.title}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER PROGRESS BAR */}
      <footer className="py-2.5 px-6 border-t border-theme bg-surface-primary/80 backdrop-blur-sm font-heading text-xs text-secondary-token flex items-center justify-between">
        <span>
          {currentPage <= 10 ? (
            <span className="text-[#2CE0C9] font-semibold">Free Preview Zone (Pages 1–10)</span>
          ) : isOwned ? (
            <span className="text-accent-gold font-semibold">Verified Entitlement Active</span>
          ) : (
            <span className="text-red-400 font-semibold">Locked Page (Entitlement Required)</span>
          )}
        </span>

        {/* Progress Bar */}
        <div className="w-36 sm:w-64 h-1.5 rounded-full bg-surface-secondary overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${Math.round((currentPage / item.pageCount) * 100)}%` }}
          />
        </div>

        <span className="tabular-nums font-medium">
          {Math.round((currentPage / item.pageCount) * 100)}% Completed
        </span>
      </footer>
    </div>
  );
}
