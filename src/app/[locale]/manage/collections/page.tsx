import { Link } from "@/i18n/navigation";
import { getCollections, getCollectionResourceCounts } from "@/lib/queries";

export default async function ManageCollectionsPage() {
  const [collections, counts] = await Promise.all([getCollections(), getCollectionResourceCounts()]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-semibold">Collections</h1>
        <Link
          href="/manage/collections/new"
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-ivory dark:bg-gold dark:text-midnight"
        >
          + New Collection
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/manage/collections/${c.id}`}
            className="rounded-xl border border-border bg-card p-5"
          >
            <h2 className="font-heading text-lg font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            <p className="mt-3 text-xs text-muted-foreground">{counts.get(c.id) ?? 0} resources</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
