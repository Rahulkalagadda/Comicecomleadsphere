import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LibraryView } from "@/components/library/LibraryView";

export default function LibraryPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <LibraryView />
      </main>
      <SiteFooter />
    </>
  );
}
