"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export function RequestAccessButton({
  bookId,
  initialStatus,
}: {
  bookId: number;
  initialStatus: string | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function request() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("access_requests")
      .upsert(
        { book_id: bookId, user_id: data.user.id, status: "pending" },
        { onConflict: "user_id,book_id" }
      );
    setLoading(false);
    if (!error) setStatus("pending");
  }

  if (status === "approved") return null;

  return (
    <button
      type="button"
      onClick={request}
      disabled={loading || status === "pending"}
      className="rounded-full border border-gold px-5 py-2.5 text-sm font-semibold text-gold disabled:opacity-60"
    >
      {status === "pending" ? "Access requested" : status === "denied" ? "Access denied — request again" : "Request Access"}
    </button>
  );
}
