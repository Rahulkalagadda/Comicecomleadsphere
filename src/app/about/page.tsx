import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Feather, Compass, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-theme pb-4">
            <span className="font-heading text-xs font-semibold text-accent-gold uppercase tracking-[0.08em]">
              Editorial Heritage
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial tracking-[-0.025em] leading-[1.15] text-primary-token mt-1">
              About LeadSphere Press
            </h1>
            <p className="text-sm sm:text-base text-secondary-token mt-1.5 leading-relaxed">
              A high-calibre digital content platform built for enterprise decision makers, founders, and discerning readers.
            </p>
          </div>

          <div className="space-y-6 text-sm sm:text-[15px] text-secondary-token leading-relaxed">
            <p>
              Founded on the belief that profound ideas deserve editorial dignity, LeadSphere synthesizes rigorous commercial literature, prestige graphic storytelling, and unvarnished executive masterclasses into an uncompromising browser experience.
            </p>

            {/* Flagship Series Spotlight: Dr. Amit Khandelwal & The AI Jungle Safari */}
            <div className="p-6 sm:p-7 rounded-2xl bg-surface-secondary/70 border border-theme shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 text-xs font-heading font-semibold uppercase tracking-[0.08em] text-[#2CE0C9]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Season 1 Flagship Publication</span>
                </div>
                <span className="text-xs font-mono text-muted-token">
                  13 Chapters • 10 C-Suite Archetypes
                </span>
              </div>
              <h2 className="font-serif-editorial text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-primary-token">
                The AI Jungle Safari — By Dr. Amit Khandelwal
              </h2>
              <p className="text-[13px] sm:text-sm text-secondary-token leading-relaxed">
                Conceptualized, curated, and published by Dr. Amit Khandelwal (CXO Lanes Power List 2026 Winner, 28 years of Global Transformation leadership), Season 1 brings boardroom AI readiness to life through ten Jungle advisors—Lion (CEO), Elephant (CDO), Wolf (COO), Owl (Governance), and Monkey (GenAI)—across books, uncropped comic sheets, and studio video podcasts.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/books/ai-jungle-safari-transformation-blueprint"
                  className="font-heading text-xs font-semibold px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-[#07100D] transition-colors"
                >
                  Explore the 13-Chapter Blueprint
                </Link>
                <Link
                  href="/episodes/ep-jungle-01"
                  className="font-heading text-xs font-semibold px-4 py-2 rounded-lg bg-surface-primary border border-theme text-primary-token hover:bg-surface-secondary transition-colors"
                >
                  Watch AI Jungle Podcast Ep. 1
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand text-[#07100D] flex items-center justify-center">
                  <Feather className="w-5 h-5" />
                </div>
                <h3 className="font-serif-editorial text-lg font-semibold tracking-[-0.015em] text-primary-token">Boardroom Obsidian</h3>
                <p className="text-[13px] leading-relaxed">
                  Sleek dark charcoal surfaces accented with Sovereign Gold and Cyber Teal—tailored for high-focus strategic assimilation.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D1B16] border border-[#2CE0C9]/40 text-[#2CE0C9] flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif-editorial text-lg font-semibold tracking-[-0.015em] text-primary-token">Jungle Canopy Studio</h3>
                <p className="text-[13px] leading-relaxed">
                  Nocturnal obsidian emerald paired with original Lion, Elephant, Wolf, and Monkey C-Suite council companions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
