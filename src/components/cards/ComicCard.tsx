"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Comic } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Bookmark, Eye, Sparkles } from "lucide-react";
import { toggleBookmark, isBookmarked } from "@/lib/api/client";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export interface ComicCardProps {
  comic: Comic;
  isOwned?: boolean;
}

export function ComicCard({ comic, isOwned = false }: ComicCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  React.useEffect(() => {
    isBookmarked(comic.id).then(setBookmarked).catch(() => {});
  }, [comic.id]);

  if (!comic.coverUrl?.trim() || imageFailed) {
    return null;
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      <div className="group flex flex-col rounded-xl bg-surface-primary border border-theme/80 soft-surface overflow-hidden transition-all duration-200 hover:-translate-y-1">
        {/* Full Uncropped Comic Strip Presentation (Not a cropped thumbnail) */}
        <Link
          href={`/read/${comic.id}`}
          className="relative w-full overflow-hidden bg-[#07100D] p-3 flex items-center justify-center border-b border-theme/60"
        >
          <div className="relative w-full rounded-lg overflow-hidden bg-[#07100D] border border-amber-400/20 shadow-md">
            <img
              src={comic.coverUrl}
              alt={comic.title}
              onError={() => setImageFailed(true)}
              className="w-full h-[360px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.015]"
              loading="lazy"
            />
            <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/85 border border-[#DFB260]/40 text-xs font-shine-bubble tracking-wide text-[#DFB260] pointer-events-none">
              Full Comic Sheet
            </div>
          </div>
        </Link>

        {/* Badges & Bookmark Strip */}
        <div className="px-4 sm:px-5 pt-3.5 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            {comic.featured && (
              <Badge variant="gold" className="shadow-sm font-sniglet">
                <Sparkles className="w-3 h-3 mr-1" /> Featured
              </Badge>
            )}
            <Badge variant="green" className="shadow-sm font-sniglet">
              10 Pages Free
            </Badge>
          </div>

          <button
            type="button"
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
            className="p-2 rounded-full nm-button bg-surface-primary text-primary-token transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token shrink-0"
          >
            <Bookmark
              className={`w-3.5 h-3.5 transition-colors ${
                bookmarked ? "fill-accent-gold text-accent-gold" : "text-secondary-token group-hover:text-primary-token"
              }`}
            />
          </button>
        </div>

        {/* Content Details */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-token mb-2">
              <span className="font-sniglet font-semibold text-[#DFB260] uppercase tracking-wider text-xs">
                {comic.genre}
              </span>
              <span className="text-[11px] font-mono tabular-nums text-slate-400">{comic.pageCount} Plates</span>
            </div>

            <Link href={`/comics/${comic.slug}`} className="focus:outline-none block">
              <h3 className="font-fredoka font-semibold text-base sm:text-lg text-primary-token line-clamp-2 leading-[1.3] group-hover:text-[#DFB260] transition-colors">
                {comic.title}
              </h3>
            </Link>

            <p className="text-[13px] text-secondary-token mt-1.5">Story &amp; Art by {comic.creator}</p>
          </div>

          <div className="pt-3.5 mt-3.5 border-t border-theme-subtle flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-[0.06em] text-muted-token block font-medium">
                Full Graphic Novel
              </span>
              <span className="font-heading font-bold text-base text-primary-token tabular-nums">
                {formatCurrency(comic.price)}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <Link href={`/read/${comic.id}`}>
                <Button variant="secondary" size="sm" className="text-xs px-2.5">
                  <Eye className="w-3.5 h-3.5" />
                  Read Free
                </Button>
              </Link>
              {!isOwned && (
                <>
                  <AddToCartButton
                    compact
                    size="sm"
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
                    size="sm"
                    className="text-xs px-3"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    Unlock
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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
      />
    </>
  );
}
