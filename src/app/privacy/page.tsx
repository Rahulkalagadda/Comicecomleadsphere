import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-theme pb-4">
            <span className="font-heading text-xs font-semibold text-accent-gold uppercase tracking-[0.08em]">
              Legal Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial tracking-[-0.025em] leading-[1.15] text-primary-token mt-1">
              Privacy Policy
            </h1>
            <p className="font-mono text-xs text-muted-token mt-1.5">Last Updated: October 2026</p>
          </div>

          <div className="space-y-4 text-sm sm:text-[15px] text-secondary-token leading-relaxed">
            <p>
              LeadSphere Press strictly values the intellectual discretion of our corporate and executive readers. We do not sell personal data, sell reading history to third-party ad brokers, or track individual reading behaviors for behavioral advertising.
            </p>
            <p>
              Payment data is encrypted and handled directly by PCI-DSS compliant payment gateways (Razorpay). We store only verified transaction references, cryptographic entitlement keys, and reading position markers to sync your progress.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
