import { kv } from "@vercel/kv";

export type Snapshot = {
  date: string;
  value: number;
  metadata?: Record<string, any>;
};

// ---- Date helper (UTC YYYY-MM-DD) ----
export function dateYYYYMMDD(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ---- Detect if KV configured ----
function hasKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// ---- Dev fallback memory store ----
const mem = globalThis as unknown as {
  __snapRecent?: string[];
  __snapsByDate?: Map<string, Snapshot>;
};

function getMemState() {
  if (!mem.__snapRecent) mem.__snapRecent = [];
  if (!mem.__snapsByDate) mem.__snapsByDate = new Map();
  return { recent: mem.__snapRecent, byDate: mem.__snapsByDate };
}

// ---- Save one snapshot per day ----
export async function ensureDailySnapshot(
  value: number,
  metadata?: Record<string, any>
) {
  const date = dateYYYYMMDD();
  const key = `snap:${date}`;

  if (hasKvConfigured()) {
    const existing = await kv.get(key);
    if (existing) return { created: false, date, store: "kv" as const };

    const snap: Snapshot = { date, value, metadata };
    await kv.set(key, snap);

    await kv.lpush("snaps:recent", date);
    await kv.ltrim("snaps:recent", 0, 364); // keep 365 days

    return { created: true, date, store: "kv" as const };
  }

  // Local fallback
  const { recent, byDate } = getMemState();
  if (byDate.has(date)) return { created: false, date, store: "memory" as const };

  const snap: Snapshot = { date, value, metadata };
  byDate.set(date, snap);
  recent.unshift(date);
  mem.__snapRecent = recent.slice(0, 365);

  return { created: true, date, store: "memory" as const };
}

// ---- Get recent snapshots ----
export async function getRecentSnapshots(limit = 30): Promise<Snapshot[]> {
  if (hasKvConfigured()) {
    const dates = (await kv.lrange("snaps:recent", 0, limit - 1)) as string[];
    if (!dates?.length) return [];

    const keys = dates.map((d) => `snap:${d}`);
    const snaps = (await kv.mget(...keys)) as (Snapshot | null)[];
    return snaps.filter(Boolean).reverse() as Snapshot[];
  }

  const { recent, byDate } = getMemState();
  const dates = recent.slice(0, limit).reverse();
  return dates.map((d) => byDate.get(d)!).filter(Boolean);
}
