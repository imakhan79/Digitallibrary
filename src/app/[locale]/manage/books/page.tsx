import { Link } from "@/i18n/navigation";
import { getBooks } from "@/lib/queries";

export default async function ManageBooksPage() {
  const books = await getBooks();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-semibold">Manage Books</h1>
        <Link
          href="/manage/books/new"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-ivory dark:bg-gold dark:text-midnight"
        >
          + Add Book
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{b.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.authors?.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.categories?.name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.resource_type}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.published_year ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/manage/books/${b.id}/edit`} className="font-medium text-gold">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
