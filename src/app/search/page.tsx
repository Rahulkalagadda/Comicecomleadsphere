"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SEED_BOOKS, SEED_COMICS, SEED_PODCASTS } from "@/lib/api/seedData";
import { BookCard } from "@/components/cards/BookCard";
import { ComicCard } from "@/components/cards/ComicCard";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { Search, X, Sparkles, BookOpen, Layers, Film } from "lucide-react";
import { Book, Comic, PodcastSeries } from "@/types";

function SearchCatalogContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [formatFilter, setFormatFilter] = useState<"all" | "book" | "comic" | "podcast">("all");

  useEffect(() => {
    const qParam = searchParams.get("q");
    if (qParam !== null) {
      setQuery(qParam);
    }
  }, [searchParams]);

  const allItems = useMemo(() => {
    return [
      ...SEED_BOOKS,
      ...SEED_COMICS,
      ...SEED_PODCASTS,
    ].filter((item) => Boolean(item.coverUrl && item.coverUrl.trim()));
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allItems.filter((item) => {
      const matchesFormat = formatFilter === "all" || item.type === formatFilter;
      if (!q) return matchesFormat;

      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const catMatch = item.category.toLowerCase().includes(q);
      const authorMatch = (item as any).author?.toLowerCase().includes(q);
      const creatorMatch = (item as any).creator?.toLowerCase().includes(q);
      const hostMatch = (item as any).host?.toLowerCase().includes(q);

      return (
        matchesFormat &&
        (titleMatch || descMatch || catMatch || authorMatch || creatorMatch || hostMatch)
      );
    });
  }, [allItems, query, formatFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial tracking-[-0.025em] text-primary-token">
          Search Platform Catalog
        </h1>
        <p className="text-sm text-secondary-token mt-1 leading-relaxed">
          Find strategic executive volumes, graphic stories, and masterclass episodes.
        </p>
      </div>

      {/* Search Box */}
      <div className="p-4 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-muted-token absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across titles, creators, topics, or keywords..."
            className="w-full pl-12 pr-10 py-3 rounded-xl bg-surface-secondary border border-theme text-sm text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-token hover:text-primary-token"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: "all", label: "All Formats" },
            { id: "book", label: "Books", icon: BookOpen },
            { id: "comic", label: "Comics", icon: Layers },
            { id: "podcast", label: "Podcasts", icon: Film },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFormatFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                formatFilter === tab.id
                  ? "bg-brand text-[#07100D] font-bold"
                  : "bg-surface-secondary text-secondary-token hover:text-primary-token"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between text-[13px] text-secondary-token">
        <span className="tabular-nums">
          Found <strong>{results.length}</strong> title{results.length === 1 ? "" : "s"}
          {query && ` for "${query}"`}
        </span>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-secondary flex items-center justify-center text-muted-token">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif-editorial text-xl font-semibold text-primary-token">
            No matching titles found
          </h3>
          <p className="text-[13px] text-secondary-token max-w-sm mx-auto leading-relaxed">
            Try searching for broader terms like &quot;Strategy&quot;, &quot;Noir&quot;, or &quot;CFO&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((item) => {
            if (item.type === "book") {
              return <BookCard key={item.id} book={item as Book} />;
            } else if (item.type === "comic") {
              return <ComicCard key={item.id} comic={item as Comic} />;
            } else {
              return <PodcastCard key={item.id} series={item as PodcastSeries} />;
            }
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-10">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-xs text-muted-token">
              Loading catalog search...
            </div>
          }
        >
          <SearchCatalogContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
