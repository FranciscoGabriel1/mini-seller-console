import { type JSX } from "react"
import { LeadList } from "./components/LeadList"
import { OpportunitiesTable } from "./components/OpportunitiesTable"

export default function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#F4F7F9] text-dark">
      <header className="sticky top-0 z-10 border-b border-surface bg-[#a073fa] text-white shadow-md">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Mini Seller Console
          </h1>
          <p className="text-sm opacity-90">Leads list - minimal rendering</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-secondary">Leads</h2>
          <div className="rounded-xl border border-surface bg-white shadow-sm p-4">
            <LeadList />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-secondary">Opportunities</h2>
          <div className="rounded-xl border border-surface bg-white shadow-sm p-6 text-sm text-grayMuted">
            <OpportunitiesTable />
          </div>
        </section>
      </main>
    </div>
  )
}
