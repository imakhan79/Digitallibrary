import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBook } from "@/lib/queries";
import { BookmarkButton } from "@/components/bookmark-button";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  const t = await getTranslations();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[320px_1fr]">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border">
          {book.cover_url && (
            <Image src={book.cover_url} alt={book.title} fill className="object-cover" />
          )}
        </div>

        <div>
          <h1 className="font-heading text-3xl font-semibold">{book.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("BookDetail.author")}: {book.authors?.name}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-ivory dark:bg-gold dark:text-midnight">
              {t("BookDetail.readOnline")}
            </button>
            <BookmarkButton bookId={String(book.id)} label={t("BookDetail.bookmark")} bookmarkedLabel={t("BookDetail.bookmarked")} />
            <button disabled className="rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground opacity-60">
              {t("BookDetail.download")} · {t("BookDetail.comingSoon")}
            </button>
            <button disabled className="rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground opacity-60">
              {t("BookDetail.cite")} · {t("BookDetail.comingSoon")}
            </button>
          </div>

          <h2 className="mt-10 font-heading text-lg font-semibold">{t("BookDetail.description")}</h2>
          <p className="mt-2 text-muted-foreground">{book.description}</p>

          <h2 className="mt-8 font-heading text-lg font-semibold">{t("BookDetail.metadata")}</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">{t("BookDetail.category")}</dt>
              <dd>{book.categories?.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("BookDetail.language")}</dt>
              <dd>{book.language}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("BookDetail.published")}</dt>
              <dd>{book.published_year}</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
