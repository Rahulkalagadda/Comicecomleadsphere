"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Book, Comic, PodcastSeries } from "@/types";
import { useTheme } from "@/lib/theme/ThemeContext";
import { MascotElephant } from "@/components/mascots/Mascots";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BookCard } from "@/components/cards/BookCard";
import { ComicCard } from "@/components/cards/ComicCard";
import { getLibrary, getBookmarks } from "@/lib/api/client";
import { SEED_CURRENT_USER } from "@/lib/api/seedData";
import {
  BookOpen,
  Layers,
  Film,
  Bookmark,
  PlayCircle,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type LibraryTab = "all" | "books" | "comics" | "podcasts" | "bookmarks";

export function LibraryView({ initialTab = "all" }: { initialTab?: LibraryTab } = {}) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<LibraryTab>(initialTab);
  const [loading, setLoading] = useState(true);
  const [libraryData, setLibraryData] = useState<{
    ownedBooks: Book[];
    ownedComics: Comic[];
    ownedEpisodes: { series: PodcastSeries; episode: any }[];
  }>({ ownedBooks: [], ownedComics: [], ownedEpisodes: [] });
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    let mounted = true;
    const load = () => {
      Promise.all([getLibrary(), getBookmarks()])
        .then(([lib, bmk]) => {
          if (!mounted) return;
          setLibraryData(lib);
          setBookmarks(bmk);
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    };
    load();

    window.addEventListener("leadsphere-bookmarks-updated", load);
    window.addEventListener("storage", load);
    return () => {
      mounted = false;
      window.removeEventListener("leadsphere-bookmarks-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const totalItems =
    libraryData.ownedBooks.length +
    libraryData.ownedComics.length +
    libraryData.ownedEpisodes.length;

  const firstName = SEED_CURRENT_USER.name.split(" ")[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header (Matching Stitch Screen 08) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-theme pb-6">
        <div>
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-accent-gold">
            Personal Sanctuary • Verified Entitlements
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial font-semibold text-primary-token tracking-[-0.025em] leading-[1.15] mt-1">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm sm:text-base text-secondary-token mt-1.5 leading-relaxed">
            Your personal repository of authoritative volumes, prestige graphic chronicles, and video dialogues.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-secondary border border-theme overflow-x-auto text-xs">
          {[
            { id: "all", label: "All Items", count: totalItems },
            { id: "books", label: "Books", count: libraryData.ownedBooks.length },
            { id: "comics", label: "Comics", count: libraryData.ownedComics.length },
            { id: "podcasts", label: "Episodes", count: libraryData.ownedEpisodes.length },
            { id: "bookmarks", label: "Saved", count: bookmarks.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-surface-primary text-primary-token font-bold shadow-sm"
                  : "text-secondary-token hover:text-primary-token"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-xl bg-surface-secondary/70 animate-pulse border border-theme"
            />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && activeTab !== "bookmarks" && totalItems === 0 && (
        <div className="py-10 max-w-2xl mx-auto space-y-8">
          {/* Card exactly matching user uploaded screenshot input_file_0.png */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif-editorial font-semibold text-primary-token tracking-[-0.02em]">
              Continue Reading or Watching
            </h2>
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-secondary/80 border border-theme/80 soft-surface flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative flex items-center justify-center">
                <img
                  src="/images/mascot-elephant-avatar.png"
                  alt="Elephant Mascot reading companion"
                  className="w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-105 duration-300"
                />
              </div>
              <p className="text-sm text-secondary-token font-medium leading-relaxed">
                Nothing in progress yet. Open any free preview and your place will be kept here.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-surface-primary border border-theme/80 soft-surface text-center space-y-4">
            <h3 className="text-xl font-serif-editorial font-semibold text-primary-token tracking-[-0.018em]">
              Your Personal Repository is Ready
            </h3>
            <p className="text-sm text-secondary-token max-w-md mx-auto leading-relaxed">
              Start your collection with authoritative executive books, prestige graphic stories, and 4K video masterclasses.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link href="/books">
                <Button variant="primary" size="md">
                  <Compass className="w-4 h-4 mr-2" />
                  Explore Books
                </Button>
              </Link>
              <Link href="/podcasts">
                <Button variant="secondary" size="md">
                  Browse Podcasts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT GRIDS ACCORDING TO TAB */}
      {!loading && (totalItems > 0 || activeTab === "bookmarks") && (
        <div className="space-y-10">
          {/* BOOKS SECTION */}
          {(activeTab === "all" || activeTab === "books") && (
            libraryData.ownedBooks.length > 0 ? (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-heading text-primary-token flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-token" />
                    Purchased Books ({libraryData.ownedBooks.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {libraryData.ownedBooks.map((book) => (
                    <BookCard key={book.id} book={book} isOwned={true} />
                  ))}
                </div>
              </section>
            ) : activeTab === "books" ? (
              <div className="p-8 rounded-2xl bg-surface-secondary/50 border border-theme text-center space-y-3">
                <p className="text-sm text-secondary-token">No purchased books in your sanctuary yet.</p>
                <Link href="/books">
                  <Button variant="primary" size="sm">Explore Books</Button>
                </Link>
              </div>
            ) : null
          )}

          {/* COMICS SECTION */}
          {(activeTab === "all" || activeTab === "comics") && (
            libraryData.ownedComics.length > 0 ? (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-heading text-primary-token flex items-center gap-2">
                    <Layers className="w-5 h-5 text-accent-gold" />
                    Purchased Graphic Stories ({libraryData.ownedComics.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {libraryData.ownedComics.map((comic) => (
                    <ComicCard key={comic.id} comic={comic} isOwned={true} />
                  ))}
                </div>
              </section>
            ) : activeTab === "comics" ? (
              <div className="p-8 rounded-2xl bg-surface-secondary/50 border border-theme text-center space-y-3">
                <p className="text-sm text-secondary-token">No purchased graphic stories in your sanctuary yet.</p>
                <Link href="/comics">
                  <Button variant="primary" size="sm">Explore Comics</Button>
                </Link>
              </div>
            ) : null
          )}

          {/* PODCAST EPISODES SECTION */}
          {(activeTab === "all" || activeTab === "podcasts") &&
            libraryData.ownedEpisodes.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-heading text-primary-token flex items-center gap-2">
                    <Film className="w-5 h-5 text-brand-token" />
                    Available Podcast Episodes ({libraryData.ownedEpisodes.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {libraryData.ownedEpisodes.map(({ series, episode }) => (
                    <div
                      key={episode.id}
                      className="rounded-xl border border-theme bg-surface-primary p-4 theme-card-shadow flex flex-col justify-between"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-16 rounded-lg bg-[#07100D] p-1 border border-theme shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={episode.thumbnailUrl}
                            alt={episode.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant={episode.isFree ? "green" : "gold"}>
                            {episode.isFree ? "Free Episode 1" : "Owned"}
                          </Badge>
                          <h4 className="font-heading text-xs font-semibold text-primary-token line-clamp-2 mt-1">
                            {episode.title}
                          </h4>
                          <p className="text-[11px] text-muted-token mt-0.5 truncate">
                            {series.title}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-3 border-t border-theme-subtle flex items-center justify-between">
                        <span className="text-[11px] text-muted-token">{episode.duration}</span>
                        <Link href={`/episodes/${episode.id}`}>
                          <Button variant="primary" size="sm" className="text-xs">
                            <PlayCircle className="w-3.5 h-3.5" />
                            Watch Video
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* BOOKMARKS SECTION */}
          {activeTab === "bookmarks" && (
            <section className="space-y-4">
              <h3 className="text-lg font-bold font-heading text-primary-token flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-accent-gold" />
                Saved Bookmarks ({bookmarks.length})
              </h3>
              {bookmarks.length === 0 ? (
                <p className="text-xs text-muted-token">No items bookmarked yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bookmarks.map((bmk) => (
                    <div
                      key={bmk.id}
                      className="p-4 rounded-xl border border-theme bg-surface-primary flex flex-col justify-between"
                    >
                      <div className="w-full aspect-[3/4] rounded-lg border border-theme bg-[#07100D] p-2 mb-3 flex items-center justify-center overflow-hidden">
                        <img
                          src={bmk.coverUrl}
                          alt={bmk.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h4 className="font-bold text-sm text-primary-token line-clamp-2">
                        {bmk.title}
                      </h4>
                      <p className="text-xs text-secondary-token mt-1">By {bmk.creatorOrAuthor}</p>
                      <div className="pt-3 mt-3 border-t border-theme">
                        <Link
                          href={
                            bmk.contentType === "podcast"
                              ? bmk.contentId.startsWith("ep-")
                                ? `/episodes/${bmk.contentId}`
                                : "/podcasts"
                              : `/read/${bmk.contentId}`
                          }
                        >
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            {bmk.contentType === "podcast" ? "Watch Now" : "Read Now"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
