"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Book } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BookCard } from "@/components/cards/BookCard";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { checkEntitlement, isBookmarked, toggleBookmark } from "@/lib/api/client";
import {
  BookOpen,
  Bookmark,
  Sparkles,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Calendar,
  Layers,
  Star,
} from "lucide-react";

interface BookDetailClientProps {
  book: Book;
  relatedBooks: Book[];
}

export function BookDetailClient({ book, relatedBooks }: BookDetailClientProps) {
  const [isOwned, setIsOwned] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    checkEntitlement(book.id).then(setIsOwned);
    isBookmarked(book.id).then(setBookmarked);
  }, [book.id]);

  const handleBookmark = async () => {
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
      <SiteHeader />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb back */}
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-token hover:text-primary-token"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Books Catalog
          </Link>

          {/* Book Hero Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Cover Column with 3D Spine Depth */}
            <div className="lg:col-span-4 max-w-sm mx-auto w-full space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden book-cover-3d border border-theme/80 shadow-2xl bg-[#07100D] p-2">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/5 pointer-events-none" />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <Badge variant="green" className="shadow-sm">
                    10 Pages Free Preview
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

            {/* Details & CTA Column */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-accent-gold">
                  {book.category}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-serif-editorial font-semibold text-primary-token mt-1.5 leading-[1.12] tracking-[-0.025em]">
                  {book.title}
                </h1>
                <p className="text-base text-secondary-token mt-2.5">
                  Written by <strong className="text-primary-token font-semibold">{book.author}</strong>
                </p>
              </div>

              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center gap-4 py-3.5 border-y border-theme/80 text-xs text-secondary-token">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-brand-token" />
                  <span className="font-medium">{book.pageCount} Pages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent-gold" />
                  <span>Published {formatDate(book.publishedAt)}</span>
                </div>
                {book.rating && (
                  <div className="flex items-center gap-1 font-semibold text-primary-token">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{book.rating} Editorial Rating</span>
                  </div>
                )}
              </div>

              {/* Description & Curatorial Overview */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary-token font-heading">
                  Curatorial Overview
                </h3>
                <p className="text-sm sm:text-base text-secondary-token leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Business Rules Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-secondary/70 border border-theme/80 soft-surface flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-primary-token">
                    The 10-Page Preview Guarantee &amp; Instant Entitlement
                  </p>
                  <p className="text-secondary-token leading-relaxed">
                    Pages 1 to 10 are completely unlocked for your evaluation. Purchasing grants permanent digital entitlement for the full {book.pageCount} pages, synchronized across your devices.
                  </p>
                </div>
              </div>

              {/* Actions Box */}
              <div className="p-6 rounded-2xl bg-surface-primary border border-theme/80 soft-surface flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-muted-token block uppercase tracking-[0.08em] font-medium">
                    One-Time Purchase
                  </span>
                  <span className="text-2xl sm:text-3xl font-serif-editorial font-semibold text-primary-token tabular-nums">
                    {formatCurrency(book.price)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <Link href={`/read/${book.id}`} className="w-full sm:w-auto">
                    <Button variant="secondary" size="lg" className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {isOwned ? "Read Full Book" : "Read Free 10-Page Preview"}
                    </Button>
                  </Link>
                  {!isOwned && (
                    <>
                      <AddToCartButton
                        size="lg"
                        className="w-full sm:w-auto"
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
                        size="lg"
                        className="w-full sm:w-auto shadow-md"
                        onClick={() => setCheckoutOpen(true)}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Unlock Full Access
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Selected Chapter Indices (Matching Stitch Screen 01) */}
              {book.tableOfContents && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary-token font-heading">
                      Selected Chapter Indices
                    </h3>
                    <span className="text-xs text-muted-token">
                      Chapters 1–2 Included in Free Sample
                    </span>
                  </div>
                  <div className="divide-y divide-theme border border-theme rounded-2xl overflow-hidden bg-surface-primary text-xs shadow-sm">
                    {book.tableOfContents.map((ch, idx) => (
                      <div
                        key={idx}
                        className="py-3 px-5 flex justify-between items-center text-secondary-token hover:bg-surface-secondary/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono text-muted-token font-semibold">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="font-medium text-primary-token">{ch.title}</span>
                        </div>
                        <div>
                          {ch.page <= 10 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#2CE0C9]/15 border border-[#2CE0C9]/30 text-[#2CE0C9]">
                              Page {ch.page} • Free Sample
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-secondary text-muted-token">
                              <Lock className="w-3 h-3" /> Page {ch.page}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Critical Discourse */}
              <div className="space-y-4 pt-4 border-t border-theme-subtle">
                <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-primary-token font-heading">
                  Executive Reviews
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-secondary/60 border border-theme/80 soft-surface space-y-2">
                    <p className="text-[13px] font-serif-editorial text-secondary-token italic leading-relaxed">
                      &ldquo;The 5-Pillar Jungle Audit gave our steering committee a shared language before spending another rupee on isolated GenAI pilots.&rdquo;
                    </p>
                    <div className="text-xs font-semibold text-primary-token pt-1">
                      Enterprise Transformation Advisory Board
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-secondary/60 border border-theme/80 soft-surface space-y-2">
                    <p className="text-[13px] font-serif-editorial text-secondary-token italic leading-relaxed">
                      &ldquo;Translates 28 years of transformation architecture into vivid Lion, Wolf, and Elephant dialogues that every C-Suite function remembers.&rdquo;
                    </p>
                    <div className="text-xs font-semibold text-primary-token pt-1">
                      CXO Lanes Editorial Desk
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Companions & Treatises */}
          <div className="pt-12 border-t border-theme space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-accent-gold">
                  Curatorial Synergy
                </span>
                <h2 className="text-2xl font-serif-editorial font-semibold text-primary-token tracking-[-0.02em] mt-0.5">
                  The Companions &amp; Treatises
                </h2>
              </div>
              <Link href="/books">
                <Button variant="secondary" size="sm">
                  View Catalog <ArrowLeft className="w-3.5 h-3.5 ml-1 rotate-180" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map((rel) => (
                <BookCard key={rel.id} book={rel} />
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
          id: book.id,
          title: book.title,
          price: book.price,
          type: "book",
          coverUrl: book.coverUrl,
        }}
        onSuccess={() => setIsOwned(true)}
      />
    </>
  );
}
