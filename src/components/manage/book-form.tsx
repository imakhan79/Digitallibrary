"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Author, Category, EditableBook } from "@/lib/queries";

const RESOURCE_TYPES = ["book", "manuscript", "journal", "thesis", "archive"] as const;

export function BookForm({
  book,
  authors,
  categories,
}: {
  book?: EditableBook;
  authors: Author[];
  categories: Category[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(book?.title ?? "");
  const [authorId, setAuthorId] = useState(book?.author_id ? String(book.author_id) : "");
  const [categoryId, setCategoryId] = useState(book?.category_id ? String(book.category_id) : "");
  const [isbn, setIsbn] = useState(book?.isbn ?? "");
  const [description, setDescription] = useState(book?.description ?? "");
  const [coverUrl, setCoverUrl] = useState(book?.cover_url ?? "");
  const [language, setLanguage] = useState(book?.language ?? "");
  const [year, setYear] = useState(book?.published_year ? String(book.published_year) : "");
  const [resourceType, setResourceType] = useState(book?.resource_type ?? "book");
  const [accessLevel, setAccessLevel] = useState(book?.access_level ?? "public");
  const [authorOptions, setAuthorOptions] = useState(authors);
  const [categoryOptions, setCategoryOptions] = useState(categories);
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function addAuthor() {
    if (!newAuthor.trim()) return;
    const { data, error } = await supabase.from("authors").insert({ name: newAuthor.trim() }).select("id, name").single();
    if (error) return setError(error.message);
    setAuthorOptions((prev) => [...prev, data]);
    setAuthorId(String(data.id));
    setNewAuthor("");
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: newCategory.trim(), resource_type: resourceType })
      .select("id, name, resource_type")
      .single();
    if (error) return setError(error.message);
    setCategoryOptions((prev) => [...prev, data]);
    setCategoryId(String(data.id));
    setNewCategory("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      title,
      author_id: authorId ? Number(authorId) : null,
      category_id: categoryId ? Number(categoryId) : null,
      isbn: isbn || null,
      description: description || null,
      cover_url: coverUrl || null,
      language: language || null,
      published_year: year ? Number(year) : null,
      resource_type: resourceType,
      access_level: accessLevel,
    };

    const { error } = book
      ? await supabase.from("books").update(payload).eq("id", book.id)
      : await supabase.from("books").insert(payload);

    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/manage/books");
    router.refresh();
  }

  async function handleDelete() {
    if (!book) return;
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("books").delete().eq("id", book.id);
    if (error) return setError(error.message);
    router.push("/manage/books");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Author</label>
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
          >
            <option value="">—</option>
            {authorOptions.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <div className="mt-2 flex gap-2">
            <input
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="New author"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            />
            <button type="button" onClick={addAuthor} className="rounded-lg border border-border px-3 text-sm">
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
          >
            <option value="">—</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="mt-2 flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            />
            <button type="button" onClick={addCategory} className="rounded-lg border border-border px-3 text-sm">
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="text-sm font-medium">Resource type</label>
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
          >
            {RESOURCE_TYPES.map((rt) => (
              <option key={rt} value={rt}>{rt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Access level</label>
          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
          >
            <option value="public">Public</option>
            <option value="restricted">Restricted (institutional)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Language</label>
          <input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Published year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">ISBN</label>
        <input
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Cover image URL</label>
        <input
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-ivory disabled:opacity-60 dark:bg-gold dark:text-midnight"
        >
          {saving ? "Saving…" : book ? "Save changes" : "Create book"}
        </button>
        {book && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-destructive px-6 py-2.5 text-sm font-semibold text-destructive"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
