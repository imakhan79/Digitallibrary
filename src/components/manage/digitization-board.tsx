"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DigitizationJob } from "@/lib/queries";

const STAGES = [
  { key: "pending", label: "Pending" },
  { key: "scanning", label: "Scanning" },
  { key: "ocr", label: "OCR" },
  { key: "metadata", label: "Metadata" },
  { key: "quality_control", label: "Quality Control" },
  { key: "published", label: "Published" },
];

const PRIORITIES = ["low", "normal", "high", "urgent"] as const;

export function DigitizationBoard({
  initialJobs,
  books,
}: {
  initialJobs: DigitizationJob[];
  books: { id: number; title: string }[];
}) {
  const supabase = createClient();
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedBook, setSelectedBook] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function addJob() {
    if (!selectedBook) return;
    const { data, error } = await supabase
      .from("digitization_jobs")
      .insert({ book_id: Number(selectedBook) })
      .select("id, book_id, status, operator, priority, deadline, notes, books(title)")
      .single();
    if (error) return setError(error.message);
    setJobs((prev) => [data as unknown as DigitizationJob, ...prev]);
    setSelectedBook("");
  }

  async function moveJob(job: DigitizationJob, direction: 1 | -1) {
    const idx = STAGES.findIndex((s) => s.key === job.status);
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= STAGES.length) return;
    const nextStatus = STAGES[nextIdx].key;
    const { error } = await supabase.from("digitization_jobs").update({ status: nextStatus }).eq("id", job.id);
    if (error) return setError(error.message);
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j)));
  }

  async function updateField(job: DigitizationJob, field: "operator" | "priority" | "deadline" | "notes", value: string) {
    const { error } = await supabase.from("digitization_jobs").update({ [field]: value || null }).eq("id", job.id);
    if (error) return setError(error.message);
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, [field]: value || null } : j)));
  }

  async function removeJob(job: DigitizationJob) {
    if (!confirm("Remove this digitization job?")) return;
    const { error } = await supabase.from("digitization_jobs").delete().eq("id", job.id);
    if (error) return setError(error.message);
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm"
        >
          <option value="">Select a book…</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>{b.title}</option>
          ))}
        </select>
        <button
          onClick={addJob}
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-ivory dark:bg-gold dark:text-midnight"
        >
          + Start Digitization Job
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((stage, stageIdx) => (
          <div key={stage.key} className="rounded-xl border border-border bg-card p-3">
            <div className="mb-3 text-xs font-semibold text-muted-foreground">{stage.label}</div>
            <div className="flex flex-col gap-3">
              {jobs.filter((j) => j.status === stage.key).map((job) => (
                <div key={job.id} className="rounded-lg border border-border bg-background p-3 text-xs">
                  <div className="font-semibold">{job.books?.title}</div>

                  <input
                    defaultValue={job.operator ?? ""}
                    placeholder="Operator"
                    onBlur={(e) => updateField(job, "operator", e.target.value)}
                    className="mt-2 w-full rounded border border-border bg-transparent px-2 py-1 text-xs"
                  />

                  <select
                    defaultValue={job.priority}
                    onChange={(e) => updateField(job, "priority", e.target.value)}
                    className="mt-2 w-full rounded border border-border bg-transparent px-2 py-1 text-xs"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>

                  <input
                    type="date"
                    defaultValue={job.deadline ?? ""}
                    onChange={(e) => updateField(job, "deadline", e.target.value)}
                    className="mt-2 w-full rounded border border-border bg-transparent px-2 py-1 text-xs"
                  />

                  <textarea
                    defaultValue={job.notes ?? ""}
                    placeholder="Notes"
                    onBlur={(e) => updateField(job, "notes", e.target.value)}
                    rows={2}
                    className="mt-2 w-full rounded border border-border bg-transparent px-2 py-1 text-xs"
                  />

                  <div className="mt-2 flex items-center justify-between">
                    <button
                      disabled={stageIdx === 0}
                      onClick={() => moveJob(job, -1)}
                      className="text-gold disabled:opacity-30"
                    >
                      ← Back
                    </button>
                    <button onClick={() => removeJob(job)} className="text-destructive">
                      Remove
                    </button>
                    <button
                      disabled={stageIdx === STAGES.length - 1}
                      onClick={() => moveJob(job, 1)}
                      className="text-gold disabled:opacity-30"
                    >
                      {stageIdx === STAGES.length - 2 ? "Approve →" : "Next →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
