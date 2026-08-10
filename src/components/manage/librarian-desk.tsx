"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FlaggableBook, ContentFlag } from "@/lib/queries";

export function LibrarianDesk({
  initialBooks,
  initialFlags,
}: {
  initialBooks: FlaggableBook[];
  initialFlags: ContentFlag[];
}) {
  const supabase = createClient();
  const [books, setBooks] = useState(initialBooks);
  const [flags, setFlags] = useState(initialFlags);
  const [query, setQuery] = useState("");

  async function toggleRecommend(book: FlaggableBook) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    if (book.recommended) {
      await supabase.from("recommendations").delete().eq("book_id", book.id);
    } else {
      await supabase.from("recommendations").insert({ book_id: book.id, recommended_by: data.user.id });
    }
    setBooks((prev) => prev.map((b) => (b.id === book.id ? { ...b, recommended: !b.recommended } : b)));
  }

  async function resolveFlag(id: number) {
    await supabase.from("content_flags").update({ status: "resolved" }).eq("id", id);
    setFlags((prev) => prev.filter((f) => f.id !== id));
  }

  const filtered = books.filter((b) => b.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div>
        <h2 className="font-heading text-lg font-semibold">Open Content Flags</h2>
        {flags.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No open issues reported.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {flags.map((f) => (
              <div key={f.id} className="rounded-lg border border-border bg-card p-3 text-sm">
                <div className="font-medium">{f.books?.title}</div>
                <p className="mt-1 text-muted-foreground">{f.reason}</p>
                <button onClick={() => resolveFlag(f.id)} className="mt-2 font-medium text-gold">
                  Mark resolved
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-heading text-lg font-semibold">Recommend Resources</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books…"
          className="mt-3 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
        />
        <div className="mt-3 flex max-h-96 flex-col gap-2 overflow-y-auto">
          {filtered.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
              <span>{b.title}</span>
              <button
                onClick={() => toggleRecommend(b)}
                className={b.recommended ? "font-medium text-gold" : "font-medium text-muted-foreground"}
              >
                {b.recommended ? "★ Recommended" : "☆ Recommend"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
