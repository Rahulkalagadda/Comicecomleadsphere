import { SEED_BOOKS, SEED_COMICS } from "@/lib/api/seedData";
import { ReaderInterface } from "@/components/reader/ReaderInterface";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const params: { id: string }[] = [];
  SEED_BOOKS.forEach((b) => params.push({ id: b.id }));
  SEED_COMICS.forEach((c) => params.push({ id: c.id }));
  return params;
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = SEED_BOOKS.find((b) => b.id === id);
  const comic = SEED_COMICS.find((c) => c.id === id);
  const item = book || comic;

  if (!item) {
    notFound();
  }

  return <ReaderInterface item={item} />;
}
