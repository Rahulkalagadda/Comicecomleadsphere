import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function CheckoutFailedPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 py-16">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="p-8 rounded-3xl bg-surface-primary border border-theme shadow-lg space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/15 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold font-serif-editorial tracking-[-0.02em] text-primary-token">
              Payment Transaction Declined
            </h1>
            <p className="text-[13px] text-secondary-token leading-relaxed">
              The payment gateway could not authorize the transaction. No charges were settled. You may retry using a different card or UPI method.
            </p>
            <div className="pt-2">
              <Link href="/checkout">
                <Button variant="primary" size="md">
                  Retry Checkout
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
