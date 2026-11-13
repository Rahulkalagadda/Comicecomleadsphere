import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ShieldCheck, RotateCcw, CheckCircle2 } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-theme pb-4">
            <span className="font-heading text-xs font-semibold text-accent-gold uppercase tracking-[0.08em]">
              Commercial Governance
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial tracking-[-0.025em] leading-[1.15] text-primary-token mt-1">
              Refund & Entitlement Policy
            </h1>
            <p className="text-sm sm:text-base text-secondary-token mt-1.5 leading-relaxed">
              Clear, transparent rules regarding digital asset purchases and reversals.
            </p>
          </div>

          <div className="max-w-none text-sm text-secondary-token leading-relaxed space-y-6">
            <div className="p-5 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-2">
              <h2 className="font-heading text-base font-semibold tracking-[-0.01em] text-primary-token flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent-gold" />
                48-Hour Technical Satisfaction Guarantee
              </h2>
              <p>
                Because our platform provides full 10-page free previews for all books and graphic stories, as well as free access to Episode 1 of all video podcasts, customers have ample opportunity to evaluate content prior to completing a purchase.
              </p>
              <p>
                However, if you experience verified technical difficulties loading purchased protected content in your browser, you may request a full refund within 48 hours of purchase.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-2">
              <h2 className="font-heading text-base font-semibold tracking-[-0.01em] text-primary-token flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-red-400" />
                Entitlement Revocation & Reversal
              </h2>
              <p>
                When a refund is approved by our finance team, the corresponding cryptographic backend entitlement signature is immediately revoked. The content will be removed from your active library, and funds will be returned via Razorpay to the originating source payment method within 5–7 business days.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-2">
              <h2 className="font-heading text-base font-semibold tracking-[-0.01em] text-primary-token">
                How to Request a Refund
              </h2>
              <p>
                Navigate to your <strong>Order Receipt</strong> page under Account &gt; Orders, or email our support desk at <strong className="text-primary-token">billing@leadsphere.press</strong> with your Order Number and brief reason for the request.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
