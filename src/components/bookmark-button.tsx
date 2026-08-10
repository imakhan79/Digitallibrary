"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function BookmarkButton({
  bookId,
  label,
  bookmarkedLabel,
}: {
  bookId: string;
  label: string;
  bookmarkedLabel: string;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) return;
      supabase
        .from("bookmarks")
        .select("id")
        .eq("book_id", Number(bookId))
        .eq("user_id", uid)
        .maybeSingle()
        .then(({ data }) => setBookmarked(!!data));
    });
  }, [bookId, supabase]);

  async function toggle() {
    if (!userId) {
      window.location.href = "../../login";
      return;
    }
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("book_id", Number(bookId)).eq("user_id", userId);
      setBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert({ book_id: Number(bookId), user_id: userId });
      setBookmarked(true);
    }
  }

  return (
    <button
      onClick={toggle}
      className="rounded-full border border-gold px-5 py-2.5 text-sm font-semibold text-gold"
    >
      {bookmarked ? bookmarkedLabel : label}
    </button>
  );
}
