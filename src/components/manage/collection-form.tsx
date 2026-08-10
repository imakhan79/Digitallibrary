"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Collection } from "@/lib/queries";

export function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState(collection?.title ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [language, setLanguage] = useState(collection?.language ?? "");
  const [coverUrl, setCoverUrl] = useState(collection?.cover_url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title,
      description: description || null,
      language: language || null,
      cover_url: coverUrl || null,
    };

    const { error } = collection
      ? await supabase.from("collections").update(payload).eq("id", collection.id)
      : await supabase.from("collections").insert(payload);

    setSaving(false);
    if (error) return setError(error.message);
    router.push("/manage/collections");
    router.refresh();
  }

  async function handleDelete() {
    if (!collection) return;
    if (!confirm(`Delete "${collection.title}"?`)) return;
    await supabase.from("collections").delete().eq("id", collection.id);
    router.push("/manage/collections");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
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
        <label className="text-sm font-medium">Cover image URL</label>
        <input
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
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
          {saving ? "Saving…" : collection ? "Save changes" : "Create collection"}
        </button>
        {collection && (
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
