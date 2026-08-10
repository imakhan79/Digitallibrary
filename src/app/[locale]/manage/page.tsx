import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";

const SECTIONS = [
  { href: "/manage/books", title: "Books", desc: "Add, edit, and remove catalog resources.", roles: ["super_admin", "library_admin", "content_manager"] },
  { href: "/manage/metadata", title: "Metadata", desc: "Subjects, identifiers, and validation status.", roles: ["super_admin", "library_admin", "content_manager", "metadata_librarian"] },
  { href: "/manage/collections", title: "Collections", desc: "Curate featured collections.", roles: ["super_admin", "library_admin", "content_manager", "metadata_librarian", "librarian"] },
  { href: "/manage/digitization", title: "Digitization", desc: "Track resources through the digitization workflow.", roles: ["super_admin", "library_admin", "digitization_manager"] },
  { href: "/manage/librarian", title: "Librarian Desk", desc: "Recommend resources and resolve content issues.", roles: ["super_admin", "library_admin", "librarian"] },
  { href: "/manage/access-requests", title: "Access Requests", desc: "Review institutional access requests.", roles: ["super_admin", "library_admin", "librarian"] },
  { href: "/admin", title: "Admin Dashboard", desc: "Platform KPIs and analytics preview.", roles: ["super_admin", "library_admin"] },
];

export default async function ManageHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role ?? "";
  const sections = SECTIONS.filter((s) => s.roles.includes(role));

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-heading text-3xl font-semibold">Manage</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sections available to your role ({role.replace("_", " ")}).</p>

      {sections.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Your role doesn&apos;t have access to any management sections yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <Link key={s.href} href={s.href} className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-heading text-lg font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
