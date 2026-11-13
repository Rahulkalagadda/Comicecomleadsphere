"use client";

import React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SEED_BOOKS, SEED_COMICS, SEED_PODCASTS } from "@/lib/api/seedData";
import { Button } from "@/components/ui/Button";
import { History, BookOpen, PlayCircle, Clock } from "lucide-react";

export default function HistoryPage() {
  const recentReading = [
    {
      item: SEED_BOOKS[0],
      currentPage: 7,
      totalPages: SEED_BOOKS[0].pageCount,
      percent: Math.round((7 / SEED_BOOKS[0].pageCount) * 100),
      lastAccessed: "2 hours ago",
    },
    {
      item: SEED_COMICS[0],
      currentPage: 5,
      totalPages: SEED_COMICS[0].pageCount,
      percent: Math.round((5 / SEED_COMICS[0].pageCount) * 100),
      lastAccessed: "Yesterday",
    },
  ];

  const recentWatching = [
    {
      series: SEED_PODCASTS[0],
      episode: SEED_PODCASTS[0].episodes[0],
      timeWatched: "28:15",
      duration: "54:12",
      percent: 52,
      lastAccessed: "3 days ago",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-b border-theme pb-4">
            <span className="font-heading text-xs font-semibold text-accent-gold uppercase tracking-[0.08em] flex items-center gap-1.5">
              <History className="w-4 h-4" />
              Activity Telemetry
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial tracking-[-0.025em] text-primary-token mt-1">
              Reading & Watch History
            </h1>
            <p className="text-sm text-secondary-token mt-1 leading-relaxed">
              Synchronized cross-device bookmarks and reading position progress.
            </p>
          </div>

          {/* Continue Reading Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold font-heading tracking-[-0.015em] text-primary-token flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-token" />
              Continue Reading
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentReading.map(({ item, currentPage, totalPages, percent, lastAccessed }) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-surface-primary border border-theme shadow-sm flex gap-4 items-center justify-between"
                >
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-xl border border-theme"
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <h3 className="font-heading font-semibold text-[15px] text-primary-token truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs tabular-nums text-muted-token">
                        Page {currentPage} of {totalPages} • Last read {lastAccessed}
                      </p>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <Link href={`/read/${item.id}`}>
                    <Button variant="primary" size="sm">
                      Resume
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Continue Watching Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold font-heading tracking-[-0.015em] text-primary-token flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-brand-token" />
              Continue Watching
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentWatching.map(({ series, episode, timeWatched, duration, percent, lastAccessed }) => (
                <div
                  key={episode.id}
                  className="p-5 rounded-2xl bg-surface-primary border border-theme shadow-sm flex gap-4 items-center justify-between"
                >
                  <img
                    src={episode.thumbnailUrl}
                    alt={episode.title}
                    className="w-24 h-16 object-cover rounded-xl border border-theme"
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <h3 className="font-heading font-semibold text-[15px] text-primary-token truncate">
                        {episode.title}
                      </h3>
                      <p className="text-xs tabular-nums text-muted-token">
                        {timeWatched} / {duration} • Watched {lastAccessed}
                      </p>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <Link href={`/episodes/${episode.id}`}>
                    <Button variant="primary" size="sm">
                      Play
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
