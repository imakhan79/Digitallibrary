"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CollectionBooksEditor({
  collectionId,
  allBooks,
  initialBookIds,
}: {
  collectionId: number;
  allBooks: { id: number; title: string }[];
  initialBookIds: number[];
}) {
  const supabase = createClient();
  const [bookIds, setBookIds] = useState(initialBookIds);
  const [choice, setChoice] = useState("");

  async function addBook() {
    if (!choice) return;
    const id = Number(choice);
    await supabase.from("collection_books").insert({ collection_id: collectionId, book_id: id });
    setBookIds((prev) => [...prev, id]);
    setChoice("");
  }

  async function removeBook(id: number) {
    await supabase.from("collection_books").delete().eq("collection_id", collectionId).eq("book_id", id);
    setBookIds((prev) => prev.filter((b) => b !== id));
  }

  const included = allBooks.filter((b) => bookIds.includes(b.id));
  const available = allBooks.filter((b) => !bookIds.includes(b.id));

  return (
    <div>
      <div className="flex flex-col gap-2">
        {included.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
            {b.title}
            <button onClick={() => removeBook(b.id)} className="text-destructive">Remove</button>
          </div>
        ))}
        {included.length === 0 && <p className="text-sm text-muted-foreground">No resources in this collection yet.</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <select value={choice} onChange={(e) => setChoice(e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <option value="">Add a resource…</option>
          {available.map((b) => (
            <option key={b.id} value={b.id}>{b.title}</option>
          ))}
        </select>
        <button onClick={addBook} className="rounded-lg border border-border px-3 py-2 text-sm">Add</button>
      </div>
    </div>
  );
}
