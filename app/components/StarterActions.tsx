"use client";

import { useState } from "react";

export default function StarterActions() {
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "working" }
    | { kind: "ok"; message: string }
    | { kind: "err"; message: string }
  >({ kind: "idle" });

  async function createSnapshot() {
    try {
      setStatus({ kind: "working" });

      const res = await fetch("/api/snapshot", { method: "POST" });
      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus({
          kind: "err",
          message: body?.error ?? `Request failed (${res.status})`,
        });
        return;
      }

      const msg = body?.created
        ? `Created snapshot for ${body?.date} (${body?.store})`
        : `Snapshot already exists for ${body?.date} (${body?.store})`;

      setStatus({ kind: "ok", message: msg });
    } catch (e: any) {
      setStatus({ kind: "err", message: e?.message ?? "Failed to create snapshot" });
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Quick actions</div>
          <div className="mt-1 text-xs text-zinc-600">
            Useful endpoints while you build. Snapshot is daily by design.
          </div>
        </div>

        <button
          onClick={createSnapshot}
          disabled={status.kind === "working"}
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status.kind === "working" ? "Creating…" : "Create today’s snapshot"}
        </button>
      </div>

      {status.kind === "ok" && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {status.message}
        </div>
      )}

      {status.kind === "err" && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {status.message}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <a
          href="/api/health"
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100"
        >
          /api/health
        </a>
        <a
          href="/api/history"
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100"
        >
          /api/history
        </a>
        <a
          href="/api/export/csv"
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100"
        >
          Export CSV
        </a>
        <a
          href="/api/export/json"
          className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-100"
        >
          Export JSON
        </a>
        <a
          href="/api/snapshot"
          onClick={(e) => e.preventDefault()}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-400"
          title="Snapshot is POST-only. Use the button above."
        >
          /api/snapshot (POST)
        </a>
      </div>

      <div className="mt-3 text-xs text-zinc-500">
        Tip: refresh <span className="font-medium">/api/history</span> after creating today’s snapshot.
      </div>
    </div>
  );
}
