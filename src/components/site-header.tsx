import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";

export async function SiteHeader() {
  const t = await getTranslations();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="." className="font-heading text-xl font-semibold tracking-tight text-navy dark:text-gold">
          Digital Library World
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href=".">{t("Nav.explore")}</a>
          <a href="#">{t("Nav.collections")}</a>
          <a href="books">{t("Nav.books")}</a>
          <a href="#">{t("Nav.manuscripts")}</a>
          <a href="#">{t("Nav.research")}</a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="login" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
            {t("Nav.login")}
          </a>
          <a href="register" className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-ivory dark:bg-gold dark:text-midnight">
            {t("Nav.register")}
          </a>
        </div>
      </div>
    </header>
  );
}
