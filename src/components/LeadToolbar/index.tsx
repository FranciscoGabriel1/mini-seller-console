import { type JSX } from "react"
import type { LeadStatus } from "../../features/leads/types"

type LeadToolbarProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
  status?: LeadStatus
  onStatusChange: (value?: LeadStatus) => void
  sortDirection: "asc" | "desc"
  onToggleSortByScore: () => void
}

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "unqualified"]

export function LeadToolbar(props: LeadToolbarProps): JSX.Element {
  const { searchQuery, onSearchChange, status, onStatusChange, sortDirection, onToggleSortByScore } = props

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        placeholder="Search by name/company…"
        className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring sm:max-w-xs"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search leads"
      />

      <select
        className="rounded border px-3 py-2 text-sm outline-none focus:ring"
        value={status ?? ""}
        onChange={(e) => onStatusChange((e.target.value || undefined) as LeadStatus | undefined)}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={onToggleSortByScore}
        className="rounded border px-3 py-2 text-sm"
        aria-label={`Sort by score (${sortDirection})`}
        title={`Sort by score (${sortDirection})`}
      >
        Sort by score {sortDirection === "desc" ? "↓" : "↑"}
      </button>
    </div>
  )
}
