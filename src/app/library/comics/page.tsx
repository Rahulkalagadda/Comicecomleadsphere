import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LibraryView } from "@/components/library/LibraryView";

export default function LibraryComicsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <LibraryView initialTab="comics" />
      </main>
      <SiteFooter />
    </>
  );
}
