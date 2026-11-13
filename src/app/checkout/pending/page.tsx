import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Clock, ArrowRight } from "lucide-react";

export default function CheckoutPendingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-16">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="p-8 rounded-3xl bg-surface-primary border border-theme shadow-lg space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/15 flex items-center justify-center">
              <Clock className="w-8 h-8 text-accent-gold" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold font-serif-editorial tracking-[-0.02em] text-primary-token">
              Payment Awaiting Bank Confirmation
            </h1>
            <p className="text-[13px] text-secondary-token leading-relaxed">
              Your bank or UPI provider is confirming the transaction settlement. Once verified by the backend webhook, your entitlement will activate automatically.
            </p>
            <div className="pt-2">
              <Link href="/orders">
                <Button variant="outline" size="md">
                  Check Order Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
