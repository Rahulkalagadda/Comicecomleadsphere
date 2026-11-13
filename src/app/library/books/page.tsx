import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LibraryView } from "@/components/library/LibraryView";

export default function LibraryBooksPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <LibraryView initialTab="books" />
      </main>
      <SiteFooter />
    </>
  );
}
