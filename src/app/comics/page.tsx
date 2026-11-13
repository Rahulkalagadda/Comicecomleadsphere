import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CatalogView } from "@/components/catalog/CatalogView";
import { SEED_COMICS } from "@/lib/api/seedData";

export default function ComicsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <CatalogView
          title="The AI Jungle Graphic Comics"
          subtitle="Full uncropped vertical comic sheets from Season 1—starring Lion, Elephant, Wolf & Monkey. Read the first 10 plates free with interactive zoom."
          contentType="comic"
          items={SEED_COMICS}
        />
      </main>
      <SiteFooter />
    </>
  );
}
