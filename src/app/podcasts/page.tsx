import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CatalogView } from "@/components/catalog/CatalogView";
import { SEED_PODCASTS } from "@/lib/api/seedData";

export default function PodcastsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <CatalogView
          title="The AI Jungle Video Podcast"
          subtitle="Season 1 studio broadcasts with Lion, Wolf (COO) & Elephant (CDO). Watch Episode 1 (1.1 The Jungle Audit) completely free in HD video."
          contentType="podcast"
          items={SEED_PODCASTS}
        />
      </main>
      <SiteFooter />
    </>
  );
}
