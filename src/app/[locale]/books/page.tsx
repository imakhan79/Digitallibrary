import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getBooks } from "@/lib/queries";
import { SiteHeader } from "@/components/site-header";

export default async function BooksPage() {
  const t = await getTranslations();
  const books = await getBooks();

  return (
    <>
    <SiteHeader />
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold text-navy dark:text-foreground">
        {t("Books.title")}
      </h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className="flex-1 min-w-[220px] rounded-full border border-border bg-card px-5 py-2.5 text-sm outline-none focus:border-gold"
          placeholder={t("Books.searchPlaceholder")}
        />
        <select className="rounded-full border border-border bg-card px-4 py-2.5 text-sm">
          <option>{t("Books.allCategories")}</option>
        </select>
        <select className="rounded-full border border-border bg-card px-4 py-2.5 text-sm">
          <option>{t("Books.allLanguages")}</option>
        </select>
      </div>

      {books.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-heading text-lg">{t("Books.noResults")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("Books.noResultsHint")}</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {books.map((r) => (
            <Link
              key={r.id}
              href={`/books/${r.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                {r.cover_url && (
                  <Image src={r.cover_url} alt={r.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="p-3">
                <h3 className="truncate font-heading text-sm font-semibold">{r.title}</h3>
                <p className="truncate text-xs text-muted-foreground">
                  {t("Books.by")} {r.authors?.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
    </>
  );
}
