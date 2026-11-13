import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-theme pb-4">
            <span className="font-heading text-xs font-semibold text-accent-gold uppercase tracking-[0.08em]">
              Legal Governance
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial tracking-[-0.025em] leading-[1.15] text-primary-token mt-1">
              Terms of Service
            </h1>
            <p className="font-mono text-xs text-muted-token mt-1.5">Last Updated: October 2026</p>
          </div>

          <div className="space-y-4 text-sm sm:text-[15px] text-secondary-token leading-relaxed">
            <p>
              By accessing LeadSphere Press, you agree to access content exclusively through authorized browser readers and video players. All intellectual property, artwork, and manuscripts remain the exclusive copyright of their authors and illustrators.
            </p>
            <p>
              Purchases grant a single-user, non-transferable browser reading and streaming license. Redistribution, scraping, automated extraction, or reverse-engineering of page assets is strictly prohibited.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
