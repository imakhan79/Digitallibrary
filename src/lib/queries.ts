import { createClient } from "@/lib/supabase/server";

export type DbBook = {
  id: number;
  title: string;
  description: string | null;
  cover_url: string | null;
  language: string | null;
  published_year: number | null;
  resource_type: string;
  authors: { name: string } | null;
  categories: { name: string } | null;
};

export async function getBooks() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("id, title, description, cover_url, language, published_year, resource_type, authors(name), categories(name)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as DbBook[];
}

export async function getBook(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("id, title, description, cover_url, language, published_year, resource_type, authors(name), categories(name)")
    .eq("id", id)
    .maybeSingle();
  return data as unknown as DbBook | null;
}
