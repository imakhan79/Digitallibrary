import { notFound } from "next/navigation";
import { getCollections, getBooks, getCollectionBookIds } from "@/lib/queries";
import { CollectionForm } from "@/components/manage/collection-form";
import { CollectionBooksEditor } from "@/components/manage/collection-books-editor";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [collections, books, bookIds] = await Promise.all([
    getCollections(),
    getBooks(),
    getCollectionBookIds(id),
  ]);
  const collection = collections.find((c) => String(c.id) === id);
  if (!collection) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">{collection.title}</h1>

      <div className="mt-8">
        <CollectionForm collection={collection} />
      </div>

      <h2 className="mt-10 font-heading text-lg font-semibold">Resources in this collection</h2>
      <div className="mt-4">
        <CollectionBooksEditor
          collectionId={collection.id}
          allBooks={books.map((b) => ({ id: b.id, title: b.title }))}
          initialBookIds={bookIds}
        />
      </div>
    </main>
  );
}
