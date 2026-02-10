import { getRecentSnapshots } from "@/app/lib/snapshots";

export async function GET() {
  const data = await getRecentSnapshots(365);

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="snapshots-export.json"',
    },
  });
}
