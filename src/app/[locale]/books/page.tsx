import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getBooks, getCategories, getLanguages, getSavedSearches } from "@/lib/queries";
import { SiteHeader } from "@/components/site-header";
import { SaveSearchButton } from "@/components/save-search-button";
import { createClient } from "@/lib/supabase/server";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; language?: string }>;
}) {
  const { q, category, language } = await searchParams;
  const t = await getTranslations();
  const [books, categories, languages] = await Promise.all([
    getBooks({ q, category, language }),
    getCategories(),
    getLanguages(),
  ]);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedSearches = user ? await getSavedSearches(user.id) : [];

  return (
    <>
    <SiteHeader />
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold text-navy dark:text-foreground">
        {t("Books.title")}
      </h1>

      <form className="mt-6 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q ?? ""}
          className="flex-1 min-w-[220px] rounded-full border border-border bg-card px-5 py-2.5 text-sm outline-none focus:border-gold"
          placeholder={t("Books.searchPlaceholder")}
        />
        <select name="category" defaultValue={category ?? ""} className="rounded-full border border-border bg-card px-4 py-2.5 text-sm">
          <option value="">{t("Books.allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select name="language" defaultValue={language ?? ""} className="rounded-full border border-border bg-card px-4 py-2.5 text-sm">
          <option value="">{t("Books.allLanguages")}</option>
          {languages.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <button type="submit" className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-ivory dark:bg-gold dark:text-midnight">
          {t("Search.button")}
        </button>
        <SaveSearchButton q={q} category={category} language={language} />
      </form>

      {savedSearches.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {savedSearches.map((s) => (
            <Link
              key={s.id}
              href={{
                pathname: "/books",
                query: {
                  ...(s.query ? { q: s.query } : {}),
                  ...(s.category_id ? { category: String(s.category_id) } : {}),
                  ...(s.language ? { language: s.language } : {}),
                },
              }}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-gold hover:text-gold"
            >
              {s.query || s.categories?.name || s.language || "Saved search"}
            </Link>
          ))}
        </div>
      )}

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
                {r.access_level === "restricted" && (
                  <span className="absolute right-2 top-2 rounded-full bg-navy/80 px-2 py-0.5 text-[10px] font-medium text-gold">
                    Restricted
                  </span>
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
