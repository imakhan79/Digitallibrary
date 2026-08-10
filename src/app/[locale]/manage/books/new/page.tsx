import { getAuthors, getCategories } from "@/lib/queries";
import { BookForm } from "@/components/manage/book-form";

export default async function NewBookPage() {
  const [authors, categories] = await Promise.all([getAuthors(), getCategories()]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">Add Book</h1>
      <div className="mt-8">
        <BookForm authors={authors} categories={categories} />
      </div>
    </main>
  );
}
