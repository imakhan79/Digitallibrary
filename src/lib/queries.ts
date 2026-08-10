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
  metadata_status: string;
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
    .select("id, title, author_id, category_id, isbn, description, cover_url, language, published_year, resource_type, access_level, metadata_status")
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

export type Subject = { id: number; name: string };

export async function getSubjects() {
  const supabase = await createClient();
  const { data } = await supabase.from("subjects").select("id, name").order("name");
  return (data ?? []) as Subject[];
}

export async function getBookSubjects(bookId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("book_subjects")
    .select("subject_id, subjects(id, name)")
    .eq("book_id", bookId);
  return ((data ?? []) as unknown as { subjects: Subject }[]).map((r) => r.subjects);
}

export type Identifier = { id: number; type: string; value: string };

export async function getIdentifiers(bookId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("identifiers")
    .select("id, type, value")
    .eq("book_id", bookId);
  return (data ?? []) as Identifier[];
}

export type MetadataBookRow = {
  id: number;
  title: string;
  metadata_status: string;
  authors: { name: string } | null;
};

export async function getBooksForMetadata() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("books")
    .select("id, title, metadata_status, authors(name)")
    .order("title");
  return (data ?? []) as unknown as MetadataBookRow[];
}

export type Collection = {
  id: number;
  title: string;
  description: string | null;
  language: string | null;
  cover_url: string | null;
};

export async function getCollections() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("collections")
    .select("id, title, description, language, cover_url")
    .order("created_at");
  return (data ?? []) as Collection[];
}

export async function getCollectionResourceCounts() {
  const supabase = await createClient();
  const { data } = await supabase.from("collection_books").select("collection_id");
  const counts = new Map<number, number>();
  for (const row of data ?? []) {
    counts.set(row.collection_id, (counts.get(row.collection_id) ?? 0) + 1);
  }
  return counts;
}

export async function getCollectionBookIds(collectionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("collection_books")
    .select("book_id")
    .eq("collection_id", collectionId);
  return (data ?? []).map((r) => r.book_id as number);
}

export async function isBookRecommended(bookId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("recommendations").select("book_id").eq("book_id", bookId).maybeSingle();
  return !!data;
}

export type FlaggableBook = { id: number; title: string; recommended: boolean };

export async function getBooksForLibrarian() {
  const supabase = await createClient();
  const [{ data: books }, { data: recs }] = await Promise.all([
    supabase.from("books").select("id, title").order("title"),
    supabase.from("recommendations").select("book_id"),
  ]);
  const recommended = new Set((recs ?? []).map((r) => r.book_id as number));
  return ((books ?? []) as { id: number; title: string }[]).map((b) => ({
    ...b,
    recommended: recommended.has(b.id),
  })) as FlaggableBook[];
}

export type ContentFlag = {
  id: number;
  book_id: number;
  reason: string;
  status: string;
  created_at: string;
  books: { title: string } | null;
};

export async function getOpenContentFlags() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_flags")
    .select("id, book_id, reason, status, created_at, books(title)")
    .eq("status", "open")
    .order("created_at", { ascending: true });
  return (data ?? []) as unknown as ContentFlag[];
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
