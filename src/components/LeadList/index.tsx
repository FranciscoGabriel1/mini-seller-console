import { type JSX, useState } from "react"
import { useLeads } from "../../features/leads/hooks/useLeads"
import type { Lead } from "../../features/leads/types"
import { useServices } from "../../app/contexts/services-context"
import { SlideOver } from "../SlideOver"
import { LeadDetailPanel } from "../LeadDetailPanel"


export function LeadList(): JSX.Element {
  const { data, isLoading, errorMessage } = useLeads()
  const services = useServices()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  if (isLoading) return <div className="p-4 text-sm text-gray-500">Loading leads…</div>
  if (errorMessage) return <div className="p-4 text-sm text-red-600">Error: {errorMessage}</div>
  if (data.length === 0) return <div className="p-4 text-sm text-gray-500">No leads found.</div>

  return (
    <>
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
              <tr
                key={lead.id}
                className="cursor-pointer border-b last:border-none hover:bg-gray-50"
                onClick={() => setSelectedLead(lead)}
              >
                <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                <td className="px-4 py-3 text-gray-700">{lead.company}</td>
                <td className="px-4 py-3 text-gray-700">{lead.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlideOver
        isOpen={selectedLead !== null}
        title="Lead details"
        onClose={() => setSelectedLead(null)}
      >
        {selectedLead ? (
          <LeadDetailPanel
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onSave={async (next) => {
              await services.latency.wait(300)
              console.log("Saving lead:", next)
              setSelectedLead(null)
            }}
          />
        ) : <span />}
      </SlideOver>
    </>
  )
}
