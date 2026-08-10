import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const CONTENT_ROLES = ["super_admin", "library_admin", "content_manager"];

export default async function ManageBooksLayout({
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

  return <>{children}</>;
}
