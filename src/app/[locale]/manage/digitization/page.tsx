import { getDigitizationJobs, getBooks } from "@/lib/queries";
import { DigitizationBoard } from "@/components/manage/digitization-board";

export default async function DigitizationPage() {
  const [jobs, books] = await Promise.all([getDigitizationJobs(), getBooks()]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">Digitization Workflow</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Pending → Scanning → OCR → Metadata → Quality Control → Published
      </p>
      <div className="mt-8">
        <DigitizationBoard
          initialJobs={jobs}
          books={books.map((b) => ({ id: b.id, title: b.title }))}
        />
      </div>
    </main>
  );
}
