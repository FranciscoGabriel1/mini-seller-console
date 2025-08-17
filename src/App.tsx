import { type JSX } from "react"
import { LeadList } from "./components/LeadList"

export default function App(): JSX.Element {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-xl font-semibold tracking-tight">Mini Seller Console</h1>
          <p className="text-sm text-gray-500">Leads list — minimal rendering</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid gap-6 sm:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">Leads</h2>
          <LeadList />
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">Opportunities</h2>
          <div className="rounded-xl border bg-white p-6 text-sm text-gray-500">Coming soon…</div>
        </section>
      </main>
    </div>
  )
}
