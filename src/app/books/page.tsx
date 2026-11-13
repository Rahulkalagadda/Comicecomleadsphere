import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CatalogView } from "@/components/catalog/CatalogView";
import { SEED_BOOKS } from "@/lib/api/seedData";

export default function BooksPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <CatalogView
          title="AI Jungle Transformation Blueprints"
          subtitle="Structured Season 1 books by Dr. Amit Khandelwal covering enterprise AI strategy, data maturity, and the 5-Pillar Jungle Audit. First 10 pages complimentary."
          contentType="book"
          items={SEED_BOOKS}
        />
      </main>
      <SiteFooter />
    </>
  );
}
