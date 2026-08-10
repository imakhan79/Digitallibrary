"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SaveSearchButton({
  q,
  category,
  language,
}: {
  q?: string;
  category?: string;
  language?: string;
}) {
  const supabase = createClient();
  const [saved, setSaved] = useState(false);

  async function save() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("saved_searches").insert({
      user_id: data.user.id,
      query: q || null,
      category_id: category ? Number(category) : null,
      language: language || null,
    });
    setSaved(true);
  }

  if (!q && !category && !language) return null;

  return (
    <button
      type="button"
      onClick={save}
      disabled={saved}
      className="rounded-full border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
    >
      {saved ? "Saved" : "Save this search"}
    </button>
  );
}
