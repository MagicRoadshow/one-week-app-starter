# One-Week App Starter

A reusable starter template for shipping small public web apps fast.

This repo is intentionally simple:
- Next.js (App Router) + Tailwind
- A clean API pattern
- KV-backed daily snapshots (with local memory fallback)
- History endpoint for charts
- CSV + JSON exports
- A “create today’s snapshot” button for local testing
- Cron-ready structure for Vercel

This is not a “framework”. It’s an execution engine.

---

## What’s in here

### Homepage
- A simple starter dashboard
- “Quick actions” panel:
  - Create today’s snapshot (POST)
  - Links to health/history/export endpoints

### API routes
- `GET /api/health` — sanity check
- `GET /api/history` — returns recent snapshots
- `POST /api/snapshot` — creates (at most) one snapshot per day
- `GET /api/export/json` — downloads snapshots as JSON
- `GET /api/export/csv` — downloads snapshots as CSV

### Reusable core
- `app/lib/snapshots.ts`
  - KV detection
  - Local in-memory fallback (so local dev doesn’t break)
  - One-per-day snapshot rule
  - Retention cap (currently 365)

---

## Run locally

From the repo root:

```bash
npm install
npm run dev
