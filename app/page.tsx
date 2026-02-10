import StarterActions from "@/app/components/StarterActions";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            One-Week App Starter
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            A reusable Next.js starter for shipping small public apps fast. Includes API patterns,
            KV-backed snapshots, cron-ready endpoints, and export functionality.
          </p>

          <div className="mt-6 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700">
            <div className="font-semibold text-zinc-900">What this template includes</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>API route pattern</li>
              <li>External fetch example</li>
              <li>KV snapshot pattern (with local fallback)</li>
              <li>History endpoint</li>
              <li>CSV + JSON export endpoints</li>
              <li>Cron-ready structure</li>
            </ul>
          </div>
        </header>

        <StarterActions />

        <footer className="mt-6 text-xs text-zinc-500">
          Starter template • Next.js App Router • Tailwind • Vercel-ready
        </footer>
      </div>
    </main>
  );
}
