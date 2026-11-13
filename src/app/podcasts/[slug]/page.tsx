import { SEED_PODCASTS } from "@/lib/api/seedData";
import { PodcastDetailClient } from "@/components/content/PodcastDetailClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SEED_PODCASTS.map((podcast) => ({
    slug: podcast.slug,
  }));
}

export default async function PodcastDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = SEED_PODCASTS.find((p) => p.slug === slug);

  if (!series) {
    notFound();
  }

  return <PodcastDetailClient series={series} />;
}
