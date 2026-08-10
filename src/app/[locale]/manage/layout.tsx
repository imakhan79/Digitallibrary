import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";

const CONTENT_ROLES = ["super_admin", "library_admin", "content_manager"];

export default async function ManageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !CONTENT_ROLES.includes(profile.role)) {
    redirect(`/${locale}`);
  }

  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
