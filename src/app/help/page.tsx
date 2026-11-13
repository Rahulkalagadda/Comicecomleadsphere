import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HelpCircle, BookOpen, Lock, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const faqs = [
    {
      q: "How does the 10-page free preview work?",
      a: "Every book and comic on LeadSphere allows you to read pages 1 through 10 directly in your browser without requiring account registration or payment. Beyond page 10, a verified purchase entitlement is required to continue.",
    },
    {
      q: "Are podcast episodes free or paid?",
      a: "Episode 1 of every podcast series is completely free to stream in high resolution. Subsequent episodes can be unlocked individually via Razorpay for a one-time purchase.",
    },
    {
      q: "Can I download protected PDFs or videos to my desktop?",
      a: "Content is consumed exclusively within the high-performance browser reader and video player. Direct downloads and raw PDFs are not exposed to protect intellectual property.",
    },
    {
      q: "How do I switch between Executive and Jungle themes?",
      a: "Use the theme switcher in the top navigation bar. Your selection is persisted across browsing sessions and preserves all reading progress and entitlements.",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="border-b border-theme pb-4">
            <span className="font-heading text-xs font-semibold text-accent-gold uppercase tracking-[0.08em]">
              Assistance & FAQ
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold font-serif-editorial tracking-[-0.025em] leading-[1.15] text-primary-token mt-1">
              Help Center & Support
            </h1>
            <p className="text-sm sm:text-base text-secondary-token mt-1.5 leading-relaxed">
              Common questions regarding reading previews, video streaming, and entitlements.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-surface-primary border border-theme shadow-sm space-y-2"
              >
                <h3 className="font-heading font-semibold tracking-[-0.01em] text-base text-primary-token">{faq.q}</h3>
                <p className="text-sm text-secondary-token leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-surface-secondary border border-theme flex items-center justify-between gap-4">
            <div>
              <h4 className="font-heading font-semibold text-sm text-primary-token">Need direct assistance?</h4>
              <p className="text-[13px] text-secondary-token mt-0.5">Our concierge support team responds within 4 business hours.</p>
            </div>
            <Link
              href="/contact"
              className="clay-btn-primary font-fredoka px-5 py-2.5 rounded-full text-xs font-semibold shrink-0 shadow-md"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
