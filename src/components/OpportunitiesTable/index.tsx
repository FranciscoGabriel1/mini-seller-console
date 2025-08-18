import { type JSX } from "react"
import { useOpportunities } from "../../features/opportunities/hooks/useOpportunities"

export function OpportunitiesTable(): JSX.Element {
  const { data, isLoading, errorMessage } = useOpportunities()

  if (isLoading) return <div className="rounded-xl border bg-white p-4 text-sm text-gray-500">Loading opportunities…</div>
  if (errorMessage) return <div className="rounded-xl border bg-white p-4 text-sm text-red-600" role="alert">Error: {errorMessage}</div>
  if (data.length === 0) return <div className="rounded-xl border bg-white p-4 text-sm text-gray-500">No opportunities yet.</div>

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Account</th>
            <th className="px-4 py-3">Stage</th>
            <th className="px-4 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map(op => (
            <tr key={op.id} className="border-b last:border-none">
              <td className="px-4 py-3 font-medium text-gray-900">{op.name}</td>
              <td className="px-4 py-3 text-gray-700">{op.accountName}</td>
              <td className="px-4 py-3 text-gray-700">{op.stage}</td>
              <td className="px-4 py-3 text-right">{op.amount ? `$${op.amount.toLocaleString()}` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
