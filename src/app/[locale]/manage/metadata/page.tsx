import { Link } from "@/i18n/navigation";
import { getBooksForMetadata } from "@/lib/queries";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  needs_review: "bg-gold/20 text-gold",
  validated: "bg-emerald-500/15 text-emerald-600",
};

export default async function ManageMetadataPage() {
  const books = await getBooksForMetadata();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">Metadata</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Classify resources with subjects, add identifiers, and validate metadata.
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{b.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.authors?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_STYLES[b.metadata_status]}`}>
                    {b.metadata_status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/manage/metadata/${b.id}`} className="font-medium text-gold">
                    Edit Metadata
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
