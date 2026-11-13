"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./BrandLogo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {
  Search,
  Bookmark,
  BookOpen,
  Compass,
  Film,
  Menu,
  X,
  User as UserIcon,
  Shield,
  Layers,
  History,
  Settings,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SEED_CURRENT_USER } from "@/lib/api/seedData";
import { getBookmarks, getCartItems } from "@/lib/api/client";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncCounts = () => {
      getBookmarks()
        .then((b) => setBookmarkCount(b.length))
        .catch(() => {});
      setCartCount(getCartItems().length);
    };
    syncCounts();

    window.addEventListener("leadsphere-bookmarks-updated", syncCounts);
    window.addEventListener("leadsphere-cart-updated", syncCounts);
    window.addEventListener("storage", syncCounts);
    return () => {
      window.removeEventListener("leadsphere-bookmarks-updated", syncCounts);
      window.removeEventListener("leadsphere-cart-updated", syncCounts);
      window.removeEventListener("storage", syncCounts);
    };
  }, [pathname]);

  const navLinks = [
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Books", href: "/books", icon: BookOpen },
    { label: "Comics", href: "/comics", icon: Layers },
    { label: "Podcasts", href: "/podcasts", icon: Film },
    { label: "My Library", href: "/library", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-primary/95 backdrop-blur-md border-b border-theme transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <BrandLogo />

        {/* Center: Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl font-fredoka text-[15px] font-semibold tracking-wide transition-all duration-150 flex items-center gap-1.5",
                  isActive
                    ? "bg-white/[0.08] text-[#DFB260] border border-white/[0.1] shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {link.label === "Comics" ? (
                  <span className="font-shine-bubble text-base text-[#DFB260] drop-shadow-sm">
                    Comics
                  </span>
                ) : (
                  link.label
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Search, Bookmarks, Theme Switcher, Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <Link
            href="/search"
            aria-label="Search Catalog"
            className="p-2 rounded-full clay-btn-secondary text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Bookmarks */}
          <Link
            href="/bookmarks"
            aria-label="Saved Bookmarks"
            className="p-2 rounded-full clay-btn-secondary text-slate-300 hover:text-white transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarkCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-gold shadow-sm" />
            )}
          </Link>

          {/* Cart Folio Link */}
          <Link
            href="/checkout"
            aria-label="Shopping Cart Folio"
            className="p-2 rounded-full clay-btn-secondary text-slate-300 hover:text-white transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#DFB260] text-[#07100D] font-sniglet text-[11px] font-bold leading-none tabular-nums shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Theme Switcher */}
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              type="button"
              id="user-account-menu-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full clay-btn-secondary transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-token"
              aria-expanded={userDropdownOpen}
              aria-label="User Account Menu"
            >
              <img
                src={SEED_CURRENT_USER.avatarUrl}
                alt={SEED_CURRENT_USER.name}
                className="w-7 h-7 rounded-full object-cover border border-theme"
              />
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-xl bg-surface-primary border border-theme shadow-xl py-2 z-50 text-[13px] animate-in fade-in slide-in-from-top-2 duration-150"
                role="menu"
              >
                <div className="px-3.5 py-2.5 border-b border-theme">
                  <p className="font-heading font-semibold text-primary-token">{SEED_CURRENT_USER.name}</p>
                  <p className="text-xs text-muted-token truncate mt-0.5">{SEED_CURRENT_USER.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[11px] bg-accent-gold text-[#07100D] font-semibold uppercase tracking-[0.06em]">
                    {SEED_CURRENT_USER.role.replace("_", " ")}
                  </span>
                </div>

                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 text-primary-token hover:bg-surface-secondary font-medium transition-colors"
                  role="menuitem"
                >
                  <Shield className="w-3.5 h-3.5 text-accent-gold" />
                  <span>Admin Dashboard</span>
                </Link>

                <Link
                  href="/library"
                  className="flex items-center gap-2 px-3 py-2 text-secondary-token hover:bg-surface-secondary transition-colors"
                  role="menuitem"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>My Library</span>
                </Link>

                <Link
                  href="/history"
                  className="flex items-center gap-2 px-3 py-2 text-secondary-token hover:bg-surface-secondary transition-colors"
                  role="menuitem"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Reading & Watch History</span>
                </Link>

                <Link
                  href="/orders"
                  className="flex items-center gap-2 px-3 py-2 text-secondary-token hover:bg-surface-secondary transition-colors"
                  role="menuitem"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Order History</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-secondary-token hover:bg-surface-secondary transition-colors"
                  role="menuitem"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Account Settings</span>
                </Link>

                <div className="border-t border-theme mt-1 pt-1">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-secondary-token hover:text-primary-token hover:bg-surface-secondary"
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-theme bg-surface-primary px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-theme">
            <span className="text-xs font-semibold text-secondary-token">Theme</span>
            <ThemeSwitcher variant="compact" />
          </div>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-fredoka text-base font-medium transition-colors",
                    isActive
                      ? "bg-white/[0.08] text-[#DFB260] font-semibold"
                      : "text-slate-300 hover:bg-white/[0.04]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label === "Comics" ? (
                    <span className="font-shine-bubble text-lg text-[#DFB260]">
                      Comics
                    </span>
                  ) : (
                    link.label
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-theme flex flex-col gap-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-accent-gold font-semibold hover:bg-surface-secondary"
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-secondary-token hover:bg-surface-secondary"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
