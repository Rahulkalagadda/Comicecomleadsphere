"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Bookmark, BookOpen, Star, Sparkles } from "lucide-react";
import { toggleBookmark, isBookmarked } from "@/lib/api/client";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export interface BookCardProps {
  book: Book;
  isOwned?: boolean;
}

export function BookCard({ book, isOwned = false }: BookCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  React.useEffect(() => {
    isBookmarked(book.id).then(setBookmarked).catch(() => {});
  }, [book.id]);

  if (!book.coverUrl?.trim() || imageFailed) {
    return null;
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    setBookmarked(nextState);
  };

  return (
    <>
      <div className="group flex flex-col rounded-xl bg-surface-primary border border-theme/80 soft-surface overflow-hidden transition-all duration-200 hover:-translate-y-1">
        {/* Book Cover Presentation — full blueprint framing without cropping */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#07100D] p-3 flex items-center justify-center">
          <div className="relative w-full h-full rounded-md overflow-hidden book-cover-3d bg-[#07100D] shadow-md flex items-center justify-center">
            <img
              src={book.coverUrl}
              alt={book.title}
              onError={() => setImageFailed(true)}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-amber-300/5 pointer-events-none" />
          </div>

          {/* Badges overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-10">
            {book.featured && (
              <Badge variant="gold" className="shadow-sm">
                <Sparkles className="w-3 h-3 mr-1" /> Featured
              </Badge>
            )}
            <Badge variant="green" className="shadow-sm">
              10 Pages Free
            </Badge>
          </div>

          {/* Tactile Neumorphic Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
            className="absolute top-4 right-4 p-2 rounded-full nm-button bg-surface-primary/95 text-primary-token transition-all z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token"
          >
            <Bookmark
              className={`w-3.5 h-3.5 transition-colors ${
                bookmarked ? "fill-accent-gold text-accent-gold" : "text-secondary-token group-hover:text-primary-token"
              }`}
            />
          </button>
        </div>

        {/* Book Metadata & Body */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-token mb-2">
              <span className="font-heading font-semibold uppercase tracking-[0.08em] text-[11px] text-brand-token">
                {book.category}
              </span>
              {book.rating && (
                <span className="flex items-center gap-1 font-semibold text-primary-token tabular-nums">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {book.rating}
                </span>
              )}
            </div>

            <Link href={`/books/${book.slug}`} className="focus:outline-none block">
              <h3 className="font-heading font-semibold text-base sm:text-[17px] text-primary-token line-clamp-2 leading-[1.32] tracking-[-0.015em] group-hover:text-brand-token transition-colors">
                {book.title}
              </h3>
            </Link>

            <p className="text-[13px] text-secondary-token mt-1.5">By {book.author}</p>
          </div>

          {/* Card Footer: Price & Primary Action */}
          <div className="pt-3.5 mt-3.5 border-t border-theme-subtle flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-[0.06em] text-muted-token block font-medium">
                Full Access
              </span>
              <span className="font-heading font-bold text-base text-primary-token tabular-nums">
                {formatCurrency(book.price)}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <Link href={`/read/${book.id}`}>
                <Button variant="secondary" size="sm" className="text-xs px-2.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Preview
                </Button>
              </Link>
              {!isOwned && (
                <>
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
          id: book.id,
          title: book.title,
          price: book.price,
          type: "book",
          coverUrl: book.coverUrl,
        }}
      />
    </>
  );
}
