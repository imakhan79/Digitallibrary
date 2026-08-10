"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ReportIssueButton({ bookId }: { bookId: number }) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function submit() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    if (!reason.trim()) return;
    await supabase.from("content_flags").insert({
      book_id: bookId,
      reported_by: data.user.id,
      reason: reason.trim(),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="text-xs text-muted-foreground">Thanks — this has been reported to the content team.</p>;
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-xs text-muted-foreground underline">
        Report an issue with this resource
      </button>
    );
  }

  return (
    <div className="mt-2 flex max-w-sm flex-col gap-2">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Describe the issue…"
        rows={2}
        className="rounded-lg border border-border bg-background px-3 py-2 text-xs"
      />
      <button type="button" onClick={submit} className="self-start rounded-full border border-border px-3 py-1.5 text-xs font-medium">
        Submit report
      </button>
    </div>
  );
}
