"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AccessRequestRow } from "@/lib/queries";

export function AccessRequestsList({ initialRequests }: { initialRequests: AccessRequestRow[] }) {
  const supabase = createClient();
  const [requests, setRequests] = useState(initialRequests);

  async function decide(id: number, status: "approved" | "denied") {
    const { error } = await supabase.from("access_requests").update({ status }).eq("id", id);
    if (!error) setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  if (requests.length === 0) {
    return <p className="mt-8 text-sm text-muted-foreground">No pending access requests.</p>;
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-card text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Book</th>
            <th className="px-4 py-3">Requested by</th>
            <th className="px-4 py-3">Institution</th>
            <th className="px-4 py-3">Requested</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium">{r.books?.title}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.profiles?.full_name ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.profiles?.institution ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">
                  <button onClick={() => decide(r.id, "approved")} className="font-medium text-gold">
                    Approve
                  </button>
                  <button onClick={() => decide(r.id, "denied")} className="font-medium text-destructive">
                    Deny
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
