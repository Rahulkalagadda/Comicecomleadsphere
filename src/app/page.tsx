import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HomeView } from "@/components/home/HomeView";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HomeView />
      </main>
      <SiteFooter />
    </>
  );
}
