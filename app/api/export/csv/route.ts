import { getRecentSnapshots } from "@/app/lib/snapshots";

function toCsv(rows: any[]) {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);
  const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];

  return lines.join("\n");
}

export async function GET() {
  const data = await getRecentSnapshots(365);

  // Flatten metadata so CSV stays simple
  const flattened = data.map((d) => ({
    date: d.date,
    value: d.value,
    metadata: d.metadata ? JSON.stringify(d.metadata) : "",
  }));

  const csv = toCsv(flattened);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="snapshots-export.csv"',
    },
  });
}
