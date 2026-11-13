import { SEED_PODCASTS } from "@/lib/api/seedData";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { VideoPlayerShell } from "@/components/video/VideoPlayerShell";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const params: { episodeId: string }[] = [];
  SEED_PODCASTS.forEach((series) => {
    series.episodes.forEach((ep) => {
      params.push({ episodeId: ep.id });
    });
  });
  return params;
}

export default async function WatchEpisodePage({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = await params;

  let foundSeries = SEED_PODCASTS[0];
  let foundEpisode = foundSeries.episodes[0];
  let exists = false;

  for (const s of SEED_PODCASTS) {
    const ep = s.episodes.find((e) => e.id === episodeId);
    if (ep) {
      foundSeries = s;
      foundEpisode = ep;
      exists = true;
      break;
    }
  }

  if (!exists) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-main">
        <VideoPlayerShell series={foundSeries} episode={foundEpisode} />
      </main>
      <SiteFooter />
    </>
  );
}
