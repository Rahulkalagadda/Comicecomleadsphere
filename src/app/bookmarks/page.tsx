"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getBookmarks, toggleBookmark } from "@/lib/api/client";
import { BookmarkItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookmarks()
      .then(setBookmarks)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (item: BookmarkItem) => {
    await toggleBookmark(item);
    setBookmarks((prev) => prev.filter((b) => b.contentId !== item.contentId));
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-theme pb-4">
            <span className="font-heading text-xs font-semibold text-accent-gold uppercase tracking-[0.08em]">
              Saved Collection
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial tracking-[-0.025em] text-primary-token mt-1">
              My Saved Bookmarks
            </h1>
            <p className="text-sm text-secondary-token mt-1 leading-relaxed">
              Curated reading list bookmarked for later review.
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 mx-auto border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-surface-secondary flex items-center justify-center text-accent-gold">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-serif-editorial text-xl font-semibold text-primary-token">
                No saved bookmarks yet
              </h3>
              <p className="text-[13px] text-secondary-token max-w-sm mx-auto leading-relaxed">
                Click the bookmark ribbon on any book or graphic novel card to save it to your reading list.
              </p>
              <Link href="/books">
                <Button variant="primary" size="sm">
                  Browse Catalog
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bookmarks.map((bmk) => (
                <div
                  key={bmk.id}
                  className="rounded-2xl border border-theme bg-surface-primary p-4 theme-card-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full aspect-[3/4] rounded-xl border border-theme bg-[#07100D] p-2 mb-3 flex items-center justify-center overflow-hidden">
                      <img
                        src={bmk.coverUrl}
                        alt={bmk.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-heading text-[11px] uppercase font-semibold tracking-[0.06em] text-accent-gold block">
                      {bmk.contentType}
                    </span>
                    <h3 className="font-heading font-semibold tracking-[-0.015em] text-[15px] text-primary-token line-clamp-2 mt-0.5 leading-snug">
                      {bmk.title}
                    </h3>
                    <p className="text-[13px] text-secondary-token mt-0.5">
                      By {bmk.creatorOrAuthor}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-theme-subtle flex items-center justify-between gap-2">
                    <Link
                      href={
                        bmk.contentType === "podcast"
                          ? bmk.contentId.startsWith("ep-")
                            ? `/episodes/${bmk.contentId}`
                            : "/podcasts"
                          : `/read/${bmk.contentId}`
                      }
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        {bmk.contentType === "podcast" ? "Watch Episode" : "Open Preview"}
                      </Button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(bmk)}
                      className="p-2 rounded-lg text-secondary-token hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
