import { getBooksForLibrarian, getOpenContentFlags } from "@/lib/queries";
import { LibrarianDesk } from "@/components/manage/librarian-desk";

export default async function LibrarianDeskPage() {
  const [books, flags] = await Promise.all([getBooksForLibrarian(), getOpenContentFlags()]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">Librarian Desk</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Recommend resources to visitors and resolve escalated content issues.
      </p>
      <div className="mt-8">
        <LibrarianDesk initialBooks={books} initialFlags={flags} />
      </div>
    </main>
  );
}
