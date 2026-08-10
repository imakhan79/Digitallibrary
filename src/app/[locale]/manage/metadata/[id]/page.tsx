import { notFound } from "next/navigation";
import { getBookForEdit, getSubjects, getBookSubjects, getIdentifiers } from "@/lib/queries";
import { MetadataEditor } from "@/components/manage/metadata-editor";

export default async function EditMetadataPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [book, allSubjects, subjects, identifiers] = await Promise.all([
    getBookForEdit(id),
    getSubjects(),
    getBookSubjects(id),
    getIdentifiers(id),
  ]);
  if (!book) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">{book.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage subjects, identifiers, and metadata validation status.</p>
      <div className="mt-8">
        <MetadataEditor
          bookId={book.id}
          initialStatus={book.metadata_status}
          allSubjects={allSubjects}
          initialSubjects={subjects}
          initialIdentifiers={identifiers}
        />
      </div>
    </main>
  );
}
