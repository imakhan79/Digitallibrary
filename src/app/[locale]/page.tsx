import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { collections, discoveryCards } from "@/lib/sample-data";
import { getBooks } from "@/lib/queries";
import { SiteHeader } from "@/components/site-header";

const stats = [
  { key: "resources", value: "1M+" },
  { key: "books", value: "100K+" },
  { key: "research", value: "50K+" },
  { key: "manuscripts", value: "10K+" },
  { key: "languages", value: "3" },
  { key: "access", value: "24/7" },
] as const;

export default async function HomePage() {
  const t = await getTranslations();
  const books = await getBooks();

  return (
    <main className="flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-midnight text-ivory">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=2000&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/80 to-midnight" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center">
          <span className="mb-6 rounded-full border border-gold/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {t("Hero.eyebrow")}
          </span>
          <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-6xl">
            {t("Hero.headline")}
            <br />
            <span className="text-gold">{t("Hero.headlineLine2")}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-mist">{t("Hero.subtitle")}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-midnight">
              {t("Hero.ctaPrimary")}
            </a>
            <a href="#" className="rounded-full border border-ivory/30 px-6 py-3 text-sm font-semibold">
              {t("Hero.ctaSecondary")}
            </a>
            <a href="#" className="px-6 py-3 text-sm font-semibold text-mist underline-offset-4 hover:underline">
              {t("Hero.ctaTertiary")}
            </a>
          </div>

          <div className="mt-12 w-full max-w-3xl rounded-2xl border border-ivory/15 bg-ivory/5 p-2 backdrop-blur">
            <div className="flex items-center gap-3 rounded-xl bg-ivory/95 px-5 py-4 text-midnight">
              <span className="text-lg">🔍</span>
              <input
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                placeholder={t("Search.placeholder")}
              />
              <button className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-ivory">
                {t("Search.button")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 text-center sm:grid-cols-3 md:grid-cols-6">
          {stats.map((s) => (
            <div key={s.key}>
              <div className="font-heading text-3xl font-bold text-navy dark:text-gold">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{t(`Stats.${s.key}`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Discovery */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-heading text-3xl font-semibold text-navy dark:text-foreground">
          {t("Discovery.title")}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {discoveryCards.map((c) => (
            <a key={c.key} href="#" className="group relative aspect-[3/4] overflow-hidden rounded-xl">
              <Image src={c.image} alt="" fill className="object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <div className="text-sm font-semibold">{t(`Discovery.${c.key}`)}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-heading text-3xl font-semibold text-navy dark:text-foreground">
            {t("Collections.title")}
          </h2>
          <div className="mt-8 flex gap-6 overflow-x-auto pb-2">
            {collections.map((c) => (
              <div key={c.title} className="min-w-[280px] flex-1 overflow-hidden rounded-2xl border border-border bg-background">
                <div className="relative h-40 w-full">
                  <Image src={c.image} alt="" fill className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{c.count.toLocaleString()} {t("Collections.resources")}</span>
                    <span>{c.language}</span>
                  </div>
                  <a href="#" className="mt-4 inline-block text-sm font-semibold text-gold">
                    {t("Collections.explore")} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Digitized */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-heading text-3xl font-semibold text-navy dark:text-foreground">
          {t("Shelf.title")}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {books.map((r) => (
            <a key={r.id} href={`books/${r.id}`} className="group overflow-hidden rounded-xl border border-border bg-background">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                {r.cover_url && (
                  <Image src={r.cover_url} alt={r.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                )}
                <span className="absolute left-2 top-2 rounded-full bg-navy/80 px-2 py-0.5 text-[10px] font-medium text-ivory">
                  {t("Shelf.badge")}
                </span>
              </div>
              <div className="p-3">
                <h3 className="truncate font-heading text-sm font-semibold">{r.title}</h3>
                <p className="truncate text-xs text-muted-foreground">{r.authors?.name} · {r.published_year}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Rare Book */}
      <section className="relative overflow-hidden bg-midnight py-24 text-ivory">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">{t("RareBook.heading")}</h2>
          <p className="mt-4 text-mist">{t("RareBook.text")}</p>
          <a href="#" className="mt-8 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-midnight">
            {t("RareBook.cta")}
          </a>
        </div>
      </section>

      {/* Ask the Library (mocked) */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-heading text-3xl font-semibold text-navy dark:text-foreground">{t("AiSearch.title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("AiSearch.subtitle")}</p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-start">
          <p className="text-sm font-medium">{t("AiSearch.placeholder")}</p>
          <div className="mt-4 rounded-xl bg-background p-4 text-sm text-muted-foreground">
            Modern Urdu criticism evolved through three broad phases — moralist, aesthetic, and structuralist —
            shaped by scholars responding to changing literary and social contexts.
          </div>
          <p className="mt-3 text-xs font-semibold text-gold">{t("AiSearch.sources")}: Muqaddama-e-Sher-o-Shayari, Urdu Criticism 1950–2000</p>
          <p className="mt-2 text-xs italic text-muted-foreground">{t("AiSearch.preview")}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p className="font-heading text-base text-foreground">{t("Footer.tagline")}</p>
          <p className="mt-4">© {new Date().getFullYear()} Digital Library World. {t("Footer.rights")}</p>
        </div>
      </footer>
    </main>
  );
}
