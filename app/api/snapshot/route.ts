import { ensureDailySnapshot } from "@/app/lib/snapshots";

export async function POST() {
  const value = Math.round((Math.random() * 100 + 50) * 100) / 100;

  const result = await ensureDailySnapshot(value, {
    source: "manual POST /api/snapshot",
  });

  return Response.json({ ok: true, ...result, value });
}

// Optional: helps debugging if you accidentally visit it in the browser
export async function GET() {
  return new Response("Use POST /api/snapshot (button on homepage)", {
    status: 405,
    headers: { "Content-Type": "text/plain" },
  });
}