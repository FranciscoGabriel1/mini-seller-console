import { type JSX, useMemo, useState } from "react"
import { useLeads } from "../../features/leads/hooks/useLeads"
import type { Lead, LeadStatus } from "../../features/leads/types"
import { useServices } from "../../app/contexts/services-context"
import { SlideOver } from "../SlideOver"
import { LeadDetailPanel } from "../LeadDetailPanel"
import { filterByStatus, searchLeads, sortByScore } from "../../features/leads/utils"
import { LeadToolbar } from "../LeadToolbar"


export function LeadList(): JSX.Element {
  const { data, isLoading, errorMessage } = useLeads()
  const services = useServices()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | undefined>(undefined)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")


  const visibleLeads = useMemo(() => {
    let result = searchLeads(data, searchQuery)
    result = filterByStatus(result, selectedStatus)
    result = sortByScore(result, sortDirection)
    return result
  }, [data, searchQuery, selectedStatus, sortDirection])

  if (isLoading) return <div className="p-4 text-sm text-gray-500">Loading leads…</div>
  if (errorMessage) return <div className="p-4 text-sm text-red-600">Error: {errorMessage}</div>
  if (data.length === 0) return <div className="p-4 text-sm text-gray-500">No leads found.</div>

  return (
    <>
      <LeadToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        status={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortDirection={sortDirection}
        onToggleSortByScore={() => setSortDirection(d => (d === "desc" ? "asc" : "desc"))}
      />
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
            {visibleLeads.map((lead) => (
              <tr
                key={lead.id}
                className="cursor-pointer border-b last:border-none hover:bg-gray-50"
                onClick={() => setSelectedLead(lead)}
              >
                <td className="px-4 py-3 font-medium">{lead.name}</td>
                <td className="px-4 py-3">{lead.company}</td>
                <td className="px-4 py-3">{lead.score}</td>
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
