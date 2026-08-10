import { notFound } from "next/navigation";
import { getAuthors, getCategories, getBookForEdit } from "@/lib/queries";
import { BookForm } from "@/components/manage/book-form";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [book, authors, categories] = await Promise.all([
    getBookForEdit(id),
    getAuthors(),
    getCategories(),
  ]);
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">Edit Book</h1>
      <div className="mt-8">
        <BookForm book={book} authors={authors} categories={categories} />
      </div>
    </main>
  );
}
