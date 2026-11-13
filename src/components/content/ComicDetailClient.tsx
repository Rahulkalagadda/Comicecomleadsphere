"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Comic } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ComicCard } from "@/components/cards/ComicCard";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { checkEntitlement, isBookmarked, toggleBookmark } from "@/lib/api/client";
import {
  Bookmark,
  Eye,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Layers,
  Palette,
} from "lucide-react";

interface ComicDetailClientProps {
  comic: Comic;
  relatedComics: Comic[];
}

export function ComicDetailClient({ comic, relatedComics }: ComicDetailClientProps) {
  const [isOwned, setIsOwned] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    checkEntitlement(comic.id).then(setIsOwned);
    isBookmarked(comic.id).then(setBookmarked);
  }, [comic.id]);

  const handleBookmark = async () => {
    const nextState = await toggleBookmark({
      id: `bmk-${comic.id}`,
      contentId: comic.id,
      contentType: "comic",
      title: comic.title,
      creatorOrAuthor: comic.creator,
      coverUrl: comic.coverUrl,
      price: comic.price,
      savedAt: new Date().toISOString(),
    });
    setBookmarked(nextState);
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb back */}
          <Link
            href="/comics"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-token hover:text-primary-token"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Comics Catalog
          </Link>

          {/* Comic Showcase Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Uncropped Full Comic Sheet Showcase */}
            <div className="lg:col-span-5 max-w-md mx-auto w-full space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-amber-400/25 shadow-2xl bg-[#07100D] p-3">
                <img
                  src={comic.coverUrl}
                  alt={comic.title}
                  className="w-full h-auto max-h-[660px] object-contain mx-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/5 pointer-events-none" />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <Badge variant="green" className="shadow-sm">
                    Full Comic Sheet • 10p Free
                  </Badge>
                  {isOwned && (
                    <Badge variant="gold" className="shadow-sm">
                      Owned in Library
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBookmark}
                  className="flex-1 py-2.5 px-4 rounded-xl nm-button bg-surface-primary text-xs font-semibold text-primary-token flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token"
                >
                  <Bookmark
                    className={`w-4 h-4 transition-colors ${bookmarked ? "fill-accent-gold text-accent-gold" : "text-secondary-token"}`}
                  />
                  <span>{bookmarked ? "Saved in Bookmarks" : "Save to Bookmarks"}</span>
                </button>
              </div>
            </div>

            {/* Details & Synopsis */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-accent-gold">
                  {comic.genre}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-serif-editorial font-semibold text-primary-token mt-1.5 leading-[1.12] tracking-[-0.025em]">
                  {comic.title}
                </h1>
                <p className="text-base text-secondary-token mt-2.5">
                  Created by <strong className="text-primary-token font-semibold">{comic.creator}</strong>
                  {comic.illustrator && ` • Art by ${comic.illustrator}`}
                </p>
              </div>

              {/* Specs */}
              <div className="flex items-center gap-4 py-3.5 border-y border-theme/80 text-xs text-secondary-token">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-brand-token" />
                  <span className="font-medium">{comic.pageCount} Illustrated Pages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-accent-gold" />
                  <span>Aspect Ratio 3:4 High-Resolution</span>
                </div>
              </div>

              {/* Synopsis */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary-token font-heading">
                  Story Synopsis
                </h3>
                <p className="text-sm sm:text-base text-secondary-token leading-relaxed">
                  {comic.description}
                </p>
              </div>

              {/* Preview Rule Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-secondary/70 border border-theme/80 soft-surface flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-primary-token">
                    10-Page Preview Policy
                  </p>
                  <p className="text-secondary-token leading-relaxed">
                    The opening 10 graphic pages are free to view in browser. Continued reading requires verified backend entitlement purchase.
                  </p>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="p-6 rounded-2xl bg-surface-primary border border-theme/80 soft-surface flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-muted-token block uppercase tracking-[0.08em] font-medium">
                    Full Graphic Novel
                  </span>
                  <span className="text-2xl sm:text-3xl font-serif-editorial font-semibold text-primary-token tabular-nums">
                    {formatCurrency(comic.price)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <Link href={`/read/${comic.id}`} className="w-full sm:w-auto">
                    <Button variant="secondary" size="lg" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      {isOwned ? "Read Comic" : "Read Free 10 Pages"}
                    </Button>
                  </Link>
                  {!isOwned && (
                    <>
                      <AddToCartButton
                        size="lg"
                        className="w-full sm:w-auto"
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
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto shadow-md"
                        onClick={() => setCheckoutOpen(true)}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Unlock Full Comic
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Graphic Stories */}
          <div className="pt-12 border-t border-theme space-y-6">
            <h2 className="text-xl font-bold font-heading text-primary-token">
              More Graphic Stories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedComics.map((rel) => (
                <ComicCard key={rel.id} comic={rel} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        item={{
          id: comic.id,
          title: comic.title,
          price: comic.price,
          type: "comic",
          coverUrl: comic.coverUrl,
        }}
        onSuccess={() => setIsOwned(true)}
      />
    </>
  );
}
