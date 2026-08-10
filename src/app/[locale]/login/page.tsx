"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

const DEMO_PASSWORD = "DemoPass123!";
const DEMO_ACCOUNTS = [
  { label: "Super Admin", email: "superadmin@digitallibrary.test" },
  { label: "Library Admin", email: "libraryadmin@digitallibrary.test" },
  { label: "Content Manager", email: "contentmanager@digitallibrary.test" },
  { label: "Digitization Manager", email: "digitizationmanager@digitallibrary.test" },
  { label: "Metadata Librarian", email: "metadatalibrarian@digitallibrary.test" },
  { label: "Librarian", email: "librarian@digitallibrary.test" },
  { label: "Reviewer / QC Officer", email: "reviewerqc@digitallibrary.test" },
  { label: "Exhibition Curator", email: "exhibitioncurator@digitallibrary.test" },
  { label: "Contributor", email: "contributor@digitallibrary.test" },
  { label: "Institutional User", email: "institutionaluser@digitallibrary.test" },
  { label: "Researcher", email: "researcher@digitallibrary.test" },
];

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
  }

  async function handleDemoLogin(demoEmail: string) {
    setError(null);
    setDemoLoading(demoEmail);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: DEMO_PASSWORD });
    setDemoLoading(null);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
  }

  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-midnight/20" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-ivory">
          <h2 className="font-heading text-3xl font-semibold">{t("Auth.overlayTitle")}</h2>
          <p className="mt-2 text-mist">{t("Auth.overlaySubtitle")}</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          <span className="font-heading text-lg font-semibold text-navy dark:text-gold">
            Digital Library World
          </span>
          <h1 className="mt-8 font-heading text-3xl font-semibold">{t("Auth.loginHeading")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("Auth.loginSubheading")}</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">{t("Auth.email")}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("Auth.password")}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border-border" />
                {t("Auth.rememberMe")}
              </label>
              <a href="#" className="text-gold">{t("Auth.forgotPassword")}</a>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-ivory disabled:opacity-60 dark:bg-gold dark:text-midnight"
            >
              {loading ? "…" : t("Auth.signIn")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("Auth.noAccount")}{" "}
            <Link href="/register" className="font-medium text-gold">
              {t("Auth.createAccount")}
            </Link>
          </p>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Demo accounts — one click per role
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleDemoLogin(acc.email)}
                  disabled={demoLoading !== null}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-gold hover:text-gold disabled:opacity-50"
                >
                  {demoLoading === acc.email ? "Signing in…" : acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
