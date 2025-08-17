import { type JSX } from "react"
import { useLeads } from "../../features/leads/hooks/useLeads"

export function LeadList(): JSX.Element {
  const { data, isLoading, errorMessage } = useLeads()

  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">Loading leads…</div>
  }
  if (errorMessage) {
    return <div className="p-4 text-sm text-red-600">Error: {errorMessage}</div>
  }
  if (data.length === 0) {
    return <div className="p-4 text-sm text-gray-500">No leads found.</div>
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map(lead => (
            <tr key={lead.id} className="border-b last:border-none hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
              <td className="px-4 py-3 text-gray-700">{lead.company}</td>
              <td className="px-4 py-3 text-gray-700">{lead.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
