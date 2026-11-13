"use client";

import React from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DiscoverView } from "@/components/discover/DiscoverView";

export default function DiscoverPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 w-full">
        <DiscoverView />
      </main>
      <SiteFooter />
    </>
  );
}
