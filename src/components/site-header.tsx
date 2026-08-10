import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";

const MANAGE_ROLES = [
  "super_admin",
  "library_admin",
  "content_manager",
  "metadata_librarian",
  "digitization_manager",
  "librarian",
];

export async function SiteHeader() {
  const t = await getTranslations();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = profile?.role ?? null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight text-navy dark:text-gold">
          Digital Library World
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/">{t("Nav.explore")}</Link>
          <a href="#">{t("Nav.collections")}</a>
          <Link href="/books">{t("Nav.books")}</Link>
          <a href="#">{t("Nav.manuscripts")}</a>
          <a href="#">{t("Nav.research")}</a>
          {role && MANAGE_ROLES.includes(role) && <Link href="/manage">Manage</Link>}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <SignOutButton label={t("Nav.signOut")} />
          ) : (
            <>
              <Link href="/login" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
                {t("Nav.login")}
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-ivory dark:bg-gold dark:text-midnight"
              >
                {t("Nav.register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
