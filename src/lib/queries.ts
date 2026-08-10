import { createClient } from "@/lib/supabase/server";

export type DbBook = {
  id: number;
  title: string;
  description: string | null;
  cover_url: string | null;
  language: string | null;
  published_year: number | null;
  resource_type: string;
  access_level: string;
  authors: { name: string } | null;
  categories: { name: string } | null;
};

export async function getBooks(filters?: { q?: string; category?: string; language?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from("books")
    .select("id, title, description, cover_url, language, published_year, resource_type, access_level, authors(name), categories(name)")
    .order("created_at", { ascending: false });

  if (filters?.q) query = query.ilike("title", `%${filters.q}%`);
  if (filters?.category) query = query.eq("category_id", filters.category);
  if (filters?.language) query = query.eq("language", filters.language);

  const { data } = await query;
  return (data ?? []) as unknown as DbBook[];
}

export async function getLanguages() {
  const supabase = await createClient();
  const { data } = await supabase.from("books").select("language").not("language", "is", null);
  return Array.from(new Set((data ?? []).map((r) => r.language as string))).sort();
}

export async function getBook(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("id, title, description, cover_url, language, published_year, resource_type, access_level, authors(name), categories(name)")
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
  access_level: string;
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
    .select("id, title, author_id, category_id, isbn, description, cover_url, language, published_year, resource_type, access_level")
    .eq("id", id)
    .maybeSingle();
  return data as EditableBook | null;
}

export async function getAccessRequest(bookId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("access_requests")
    .select("status")
    .eq("book_id", bookId)
    .eq("user_id", userId)
    .maybeSingle();
  return data as { status: string } | null;
}

export type AccessRequestRow = {
  id: number;
  status: string;
  created_at: string;
  book_id: number;
  user_id: string;
  books: { title: string } | null;
  profiles: { full_name: string | null; institution: string | null } | null;
};

export async function getPendingAccessRequests() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("access_requests")
    .select("id, status, created_at, book_id, user_id, books(title), profiles(full_name, institution)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  return (data ?? []) as unknown as AccessRequestRow[];
}

export type SavedSearch = {
  id: number;
  query: string | null;
  language: string | null;
  category_id: number | null;
  categories: { name: string } | null;
};

export async function getSavedSearches(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_searches")
    .select("id, query, language, category_id, categories(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as SavedSearch[];
}
