"use client";

import React, { useState, useMemo } from "react";
import { Book, Comic, PodcastSeries } from "@/types";
import { BookCard } from "@/components/cards/BookCard";
import { ComicCard } from "@/components/cards/ComicCard";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { Search, Filter, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CatalogViewProps {
  title: string;
  subtitle: string;
  contentType: "book" | "comic" | "podcast";
  items: (Book | Comic | PodcastSeries)[];
}

export function CatalogView({ title, subtitle, contentType, items }: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "newest" | "price-asc" | "price-desc">("featured");

  const validItems = useMemo(
    () => items.filter((item) => Boolean(item.coverUrl && item.coverUrl.trim())),
    [items]
  );

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    validItems.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [validItems]);

  // Filter & sort
  const filteredItems = useMemo(() => {
    let result = validItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((item as any).author && (item as any).author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ((item as any).creator && (item as any).creator.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ((item as any).host && (item as any).host.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });

    if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === "price-asc") {
      result = [...result].sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [validItems, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header */}
      <div className="border-b border-theme pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {contentType === "comic" ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-sniglet text-[#DFB260]">
                ⭐ Glossy Bubble &amp; Rounded Typography
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-shine-bubble text-[#DFB260] tracking-wide leading-tight drop-shadow-sm">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-fredoka max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-xs font-heading font-semibold text-accent-gold uppercase tracking-[0.1em]">
              Curated Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-serif-editorial font-semibold text-primary-token tracking-[-0.025em] leading-[1.12]">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-secondary-token max-w-2xl leading-relaxed">{subtitle}</p>
          </div>
        )}

        {/* 3D Mascot Companion Emblem */}
        <div className="hidden sm:flex items-center gap-3.5 p-3 px-4 rounded-2xl bg-surface-secondary/70 border border-theme/80 soft-surface shrink-0">
          <div className="w-14 h-14 shrink-0 flex items-center justify-center">
            {contentType === "podcast" ? (
              <img
                src="/images/mascot-wolf-transparent.png"
                alt="Wolf Audio Companion with headphones"
                className="w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-110 duration-300"
              />
            ) : contentType === "comic" ? (
              <img
                src="/images/mascot-lion.jpg"
                alt="Regal Lion Visual Companion"
                className="w-full h-full object-cover rounded-xl filter drop-shadow-sm transition-transform hover:scale-110 duration-300"
              />
            ) : (
              <img
                src="/images/mascot-elephant-avatar.png"
                alt="Scholar Elephant Reading Companion"
                className="w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-110 duration-300"
              />
            )}
          </div>
          <div className="pr-1 text-left">
            <span className="text-[11px] font-bold text-accent-gold uppercase tracking-wider block">
              {contentType === "podcast" ? "Audio Host" : contentType === "comic" ? "Visual Lead" : "Chief Scholar"}
            </span>
            <span className="text-xs font-medium text-secondary-token block">
              {contentType === "podcast" ? "Wolf with Headphones" : contentType === "comic" ? "Lion Strategist" : "Elephant Scholar"}
            </span>
          </div>
        </div>
      </div>

      {/* Typography Demonstration Showcase for Comics */}
      {contentType === "comic" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Active Font Suite Showcase
            </span>
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm">
              <span className="font-shine-bubble text-[#DFB260] text-lg sm:text-xl">
                Shine Bubble (HansCo)
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="font-sniglet text-emerald-400 text-sm sm:text-base font-semibold">
                Sniglet (Google Fonts)
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="font-fredoka text-sky-300 text-sm sm:text-base font-medium">
                Fredoka (Google Fonts)
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300 font-mono self-start sm:self-auto">
            Live in Comics
          </span>
        </div>
      )}

      {/* SEARCH AND CONTROLS */}
      <div className="p-4 rounded-2xl bg-surface-primary border border-theme shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-muted-token absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${contentType}s by title or creator...`}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-secondary border border-theme text-xs text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-token hover:text-primary-token"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills & Sort Selector */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-1.5 rounded-full font-fredoka text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "clay-btn-primary font-semibold shadow-md"
                  : "clay-btn-secondary font-medium text-secondary-token hover:text-white"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-fredoka text-xs whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "clay-btn-primary font-semibold shadow-md"
                    : "clay-btn-secondary font-medium text-secondary-token hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-token hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-surface-secondary border border-theme text-xs font-semibold text-primary-token focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Recently Published</option>
              {contentType !== "podcast" && (
                <>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* ACTIVE FILTER CHIPS */}
      {(selectedCategory !== "all" || searchQuery) && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-token">Active Filters:</span>
          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-secondary border border-theme text-primary-token font-medium">
              Category: {selectedCategory}
              <button type="button" onClick={() => setSelectedCategory("all")}>
                <X className="w-3 h-3 text-muted-token hover:text-primary-token" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-secondary border border-theme text-primary-token font-medium">
              Query: &quot;{searchQuery}&quot;
              <button type="button" onClick={() => setSearchQuery("")}>
                <X className="w-3 h-3 text-muted-token hover:text-primary-token" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="text-accent-gold font-semibold hover:underline ml-2"
          >
            Reset All
          </button>
        </div>
      )}

      {/* CATALOG GRID */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-secondary flex items-center justify-center text-muted-token">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-primary-token">
            No matching titles found
          </h3>
          <p className="text-xs text-secondary-token max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
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
