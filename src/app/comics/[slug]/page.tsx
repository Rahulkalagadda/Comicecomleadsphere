import { SEED_COMICS } from "@/lib/api/seedData";
import { ComicDetailClient } from "@/components/content/ComicDetailClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SEED_COMICS.map((comic) => ({
    slug: comic.slug,
  }));
}

export default async function ComicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comic = SEED_COMICS.find((c) => c.slug === slug);

  if (!comic) {
    notFound();
  }

  const relatedComics = SEED_COMICS.filter((c) => c.id !== comic.id).slice(0, 3);

  return <ComicDetailClient comic={comic} relatedComics={relatedComics} />;
}
