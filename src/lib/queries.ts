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

export type Author = { id: number; name: string };
export type Category = { id: number; name: string; resource_type: string };

export async function getAuthors() {
  const supabase = await createClient();
  const { data } = await supabase.from("authors").select("id, name").order("name");
  return (data ?? []) as Author[];
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name, resource_type").order("name");
  return (data ?? []) as Category[];
}

export type EditableBook = {
  id: number;
  title: string;
  author_id: number | null;
  category_id: number | null;
  isbn: string | null;
  description: string | null;
  cover_url: string | null;
  language: string | null;
  published_year: number | null;
  resource_type: string;
};

export type DigitizationJob = {
  id: number;
  book_id: number;
  status: string;
  operator: string | null;
  priority: string;
  deadline: string | null;
  notes: string | null;
  books: { title: string } | null;
};

export async function getDigitizationJobs() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("digitization_jobs")
    .select("id, book_id, status, operator, priority, deadline, notes, books(title)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as DigitizationJob[];
}

export async function getBookForEdit(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("id, title, author_id, category_id, isbn, description, cover_url, language, published_year, resource_type")
    .eq("id", id)
    .maybeSingle();
  return data as EditableBook | null;
}
