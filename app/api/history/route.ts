import { getRecentSnapshots } from "@/app/lib/snapshots";

export async function GET() {
  const data = await getRecentSnapshots(30);
  return Response.json({ days: data.length, data });
}
