import { SEED_BOOKS } from "@/lib/api/seedData";
import { BookDetailClient } from "@/components/content/BookDetailClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SEED_BOOKS.map((book) => ({
    slug: book.slug,
  }));
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = SEED_BOOKS.find((b) => b.slug === slug);

  if (!book) {
    notFound();
  }

  const relatedBooks = SEED_BOOKS.filter((b) => b.id !== book.id).slice(0, 3);

  return <BookDetailClient book={book} relatedBooks={relatedBooks} />;
}
