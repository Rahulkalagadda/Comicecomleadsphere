"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold font-serif-editorial tracking-[-0.02em] text-primary-token">
              Reset Your Password
            </h1>
            <p className="text-[13px] text-secondary-token leading-relaxed">
              We will send a secure password reset link to your registered corporate email.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-surface-primary border border-theme shadow-xl space-y-4">
            {submitted ? (
              <div className="space-y-4 text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-[#2CE0C9] mx-auto" />
                <h3 className="font-serif-editorial font-semibold text-lg text-primary-token">
                  Reset Link Dispatched
                </h3>
                <p className="text-[13px] text-secondary-token leading-relaxed">
                  If an account exists for <strong>{email}</strong>, you will receive instructions within 2 minutes.
                </p>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="mt-2">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-heading text-xs font-semibold text-primary-token block mb-1.5">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-secondary border border-theme text-[13px] text-primary-token focus:outline-none focus:ring-2 focus:ring-brand-token"
                  />
                </div>
                <Button variant="primary" size="lg" type="submit" className="w-full">
                  Send Reset Link
                </Button>
                <div className="text-center pt-2">
                  <Link href="/login" className="text-xs font-semibold text-secondary-token hover:text-primary-token">
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
