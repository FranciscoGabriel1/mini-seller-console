import { type JSX, useMemo, useState } from "react"
import { useLeads } from "../../features/leads/hooks/useLeads"
import type { Lead, LeadStatus } from "../../features/leads/types"
import { SlideOver } from "../SlideOver"
import { LeadDetailPanel } from "../LeadDetailPanel"
import { filterByStatus, searchLeads, sortByScore } from "../../features/leads/utils"
import { LeadToolbar } from "../LeadToolbar"
import { isValidScore } from "../../lib/validators"
import { usePersistentState } from "../../hooks/usePersistentState"
import { StatusBadge } from "../StatusBadge"
import { useOpportunities } from "../../features/opportunities/hooks/useOpportunities"
import { emitOppsChanged } from "../../lib/eventBus"
import { LeadListSkeleton } from "../LeadListSkeleton"


export function LeadList(): JSX.Element {
  const { data, isLoading, errorMessage, updateLead, reload, dismissError } = useLeads()
  const { addOpportunity } = useOpportunities()

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // persisted UI state
  const [searchQuery, setSearchQuery] = usePersistentState<string>("leads:search", "")
  const [selectedStatus, setSelectedStatus] =
    usePersistentState<LeadStatus | undefined>("leads:status", undefined)
  const [sortDirection, setSortDirection] =
    usePersistentState<"asc" | "desc">("leads:sortDirection", "desc")

  // inline score editor (volatile)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftScore, setDraftScore] = useState<string>("")

  const visibleLeads = useMemo(() => {
    let result = searchLeads(data, searchQuery)
    result = filterByStatus(result, selectedStatus)
    result = sortByScore(result, sortDirection)
    return result
  }, [data, searchQuery, selectedStatus, sortDirection])

  function beginEditScore(lead: Lead): void {
    setEditingId(lead.id)
    setDraftScore(String(lead.score))
  }

  function cancelEdit(): void {
    setEditingId(null)
    setDraftScore("")
  }

  async function commitEdit(lead: Lead): Promise<void> {
    const parsed = Number(draftScore)
    if (!Number.isFinite(parsed) || !isValidScore(parsed)) return
    await updateLead({ ...lead, score: parsed })
    setEditingId(null)
    setDraftScore("")
  }

  if (isLoading) return <LeadListSkeleton />

  // if (errorMessage) return <div className="p-4 text-sm text-red-600">Error: {errorMessage}</div>
  if (data.length === 0) return <div className="p-4 text-sm text-gray-500">No leads found.</div>

  return (
    <>
      {errorMessage && (
        <div
          role="alert"
          className="mb-3 flex items-center gap-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <span>{errorMessage}</span>
          <button className="rounded border px-2 py-1 text-xs" onClick={dismissError}>Dismiss</button>
          <button className="rounded bg-gray-900 px-2 py-1 text-xs text-white" onClick={() => void reload()}>
            Retry
          </button>
        </div>
      )}

      <LeadToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        status={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortDirection={sortDirection}
        onToggleSortByScore={() => setSortDirection(d => (d === "desc" ? "asc" : "desc"))}
      />

      <div className="mt-3 overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {visibleLeads.map((lead) => {
              const isEditing = editingId === lead.id
              return (
                <tr key={lead.id} className="border-b last:border-none hover:bg-gray-50">
                  <td
                    className="cursor-pointer px-4 py-3 font-medium text-gray-900"
                    onClick={() => setSelectedLead(lead)}
                  >
                    {lead.name}
                  </td>
                  <td
                    className="cursor-pointer px-4 py-3 text-gray-700"
                    onClick={() => setSelectedLead(lead)}
                  >
                    {lead.company}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <input
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-16 rounded border px-2 py-1 text-right outline-none focus:ring"
                          value={draftScore}
                          onChange={(e) =>
                            setDraftScore(e.target.value.replace(/\D/g, "").slice(0, 3))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") void commitEdit(lead)
                            if (e.key === "Escape") cancelEdit()
                          }}
                          aria-label="Edit score"
                        />
                        <button
                          type="button"
                          className="rounded bg-gray-900 px-2 py-1 text-xs text-white disabled:opacity-50"
                          disabled={!isValidScore(Number(draftScore))}
                          onClick={() => void commitEdit(lead)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="rounded border px-2 py-1 text-xs"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="rounded border px-2 py-1 text-xs"
                        onClick={() => beginEditScore(lead)}
                        aria-label="Edit score"
                        title="Edit score"
                      >
                        {lead.score}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
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
              await updateLead(next)
              setSelectedLead(null)
            }}
            onConvert={async ({ stage, amount }) => {
              if (!selectedLead) return
              await addOpportunity({
                id: "",
                name: selectedLead.name,
                stage,
                amount: typeof amount === "number" && Number.isFinite(amount) ? amount : undefined,
                accountName: selectedLead.company,
              })

              await updateLead({ ...selectedLead, status: "qualified" })
              emitOppsChanged()
              setSelectedLead(null)
            }}
          />
        ) : <span />}
      </SlideOver>

    </>
  )
}