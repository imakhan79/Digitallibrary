"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Subject, Identifier } from "@/lib/queries";

const IDENTIFIER_TYPES = ["isbn", "issn", "doi", "oclc", "other"] as const;
const STATUSES = ["draft", "needs_review", "validated"] as const;

export function MetadataEditor({
  bookId,
  initialStatus,
  allSubjects,
  initialSubjects,
  initialIdentifiers,
}: {
  bookId: number;
  initialStatus: string;
  allSubjects: Subject[];
  initialSubjects: Subject[];
  initialIdentifiers: Identifier[];
}) {
  const supabase = createClient();
  const [status, setStatus] = useState(initialStatus);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [subjectChoice, setSubjectChoice] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [identifiers, setIdentifiers] = useState(initialIdentifiers);
  const [newIdType, setNewIdType] = useState<typeof IDENTIFIER_TYPES[number]>("isbn");
  const [newIdValue, setNewIdValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(next: string) {
    setStatus(next);
    await supabase.from("books").update({ metadata_status: next }).eq("id", bookId);
  }

  async function addExistingSubject() {
    if (!subjectChoice) return;
    const subject = allSubjects.find((s) => String(s.id) === subjectChoice);
    if (!subject || subjects.some((s) => s.id === subject.id)) return;
    const { error } = await supabase.from("book_subjects").insert({ book_id: bookId, subject_id: subject.id });
    if (error) return setError(error.message);
    setSubjects((prev) => [...prev, subject]);
    setSubjectChoice("");
  }

  async function addNewSubject() {
    if (!newSubject.trim()) return;
    const { data, error } = await supabase.from("subjects").insert({ name: newSubject.trim() }).select("id, name").single();
    if (error) return setError(error.message);
    await supabase.from("book_subjects").insert({ book_id: bookId, subject_id: data.id });
    setSubjects((prev) => [...prev, data]);
    setNewSubject("");
  }

  async function removeSubject(subjectId: number) {
    await supabase.from("book_subjects").delete().eq("book_id", bookId).eq("subject_id", subjectId);
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  }

  async function addIdentifier() {
    if (!newIdValue.trim()) return;
    const { data, error } = await supabase
      .from("identifiers")
      .insert({ book_id: bookId, type: newIdType, value: newIdValue.trim() })
      .select("id, type, value")
      .single();
    if (error) return setError(error.message);
    setIdentifiers((prev) => [...prev, data]);
    setNewIdValue("");
  }

  async function removeIdentifier(id: number) {
    await supabase.from("identifiers").delete().eq("id", id);
    setIdentifiers((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <div>
        <label className="text-sm font-medium">Metadata status</label>
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium">Subjects</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {subjects.map((s) => (
            <span key={s.id} className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs">
              {s.name}
              <button onClick={() => removeSubject(s.id)} className="text-destructive">×</button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <select
            value={subjectChoice}
            onChange={(e) => setSubjectChoice(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Add existing subject…</option>
            {allSubjects.filter((s) => !subjects.some((x) => x.id === s.id)).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button onClick={addExistingSubject} className="rounded-lg border border-border px-3 py-2 text-sm">Add</button>
          <input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="New subject"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button onClick={addNewSubject} className="rounded-lg border border-border px-3 py-2 text-sm">Create + Add</button>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium">Identifiers</label>
        <div className="mt-2 flex flex-col gap-2">
          {identifiers.map((i) => (
            <div key={i.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm">
              <span className="font-medium uppercase">{i.type}</span>
              <span className="flex-1 text-muted-foreground">{i.value}</span>
              <button onClick={() => removeIdentifier(i.id)} className="text-destructive">Remove</button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <select
            value={newIdType}
            onChange={(e) => setNewIdType(e.target.value as typeof newIdType)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {IDENTIFIER_TYPES.map((t) => (
              <option key={t} value={t}>{t.toUpperCase()}</option>
            ))}
          </select>
          <input
            value={newIdValue}
            onChange={(e) => setNewIdValue(e.target.value)}
            placeholder="Value"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button onClick={addIdentifier} className="rounded-lg border border-border px-3 py-2 text-sm">Add</button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </div>
  );
}
