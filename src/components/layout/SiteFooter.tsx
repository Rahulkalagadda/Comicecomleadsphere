"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { useTheme } from "@/lib/theme/ThemeContext";
import { ShieldCheck, Heart } from "lucide-react";

export function SiteFooter() {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-theme bg-surface-primary transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <BrandLogo />
            <p className="text-sm text-secondary-token max-w-sm leading-relaxed">
              The AI Jungle Studio &amp; Digital Vault—delivering Dr. Amit Khandelwal&apos;s transformation blueprints, uncropped graphic comic sheets, and C-Suite video podcasts.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-token pt-2">
              <ShieldCheck className="w-4 h-4 text-accent-gold" />
              <span>Razorpay Verified Merchant • Browser-Secured Protected Viewing</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-primary-token font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-secondary-token">
              <li>
                <Link href="/discover" className="hover:text-primary-token transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-primary-token transition-colors">
                  Books & Guides
                </Link>
              </li>
              <li>
                <Link href="/comics" className="hover:text-primary-token transition-colors">
                  Graphic Stories
                </Link>
              </li>
              <li>
                <Link href="/podcasts" className="hover:text-primary-token transition-colors">
                  Video Podcasts
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-primary-token transition-colors">
                  My Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-token font-heading">
              Support & Legal
            </h4>
            <ul className="space-y-2 text-sm text-secondary-token">
              <li>
                <Link href="/about" className="hover:text-primary-token transition-colors">
                  About Editorial
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary-token transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-token transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-primary-token transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-token transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-token transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Administrative */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-token font-heading">
              Operations
            </h4>
            <ul className="space-y-2 text-sm text-secondary-token">
              <li>
                <Link href="/admin" className="text-accent-gold font-medium hover:underline">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/content/new" className="hover:text-primary-token transition-colors">
                  Upload Content
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-primary-token transition-colors">
                  Revenue Analytics
                </Link>
              </li>
              <li>
                <Link href="/admin/audit-logs" className="hover:text-primary-token transition-colors">
                  Audit Logs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-token">
          <p>© 2026 LeadSphere Digital Publishing. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Active Theme: <strong className="capitalize text-primary-token">{theme}</strong></span>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
