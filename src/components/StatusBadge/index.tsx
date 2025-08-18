import { type JSX } from "react"
import type { LeadStatus } from "../../features/leads/types"

const MAP: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  qualified: "bg-emerald-100 text-emerald-800",
  unqualified: "bg-gray-200 text-gray-700",
}

export function StatusBadge({ value }: { value: LeadStatus }): JSX.Element {
  const cls = MAP[value] ?? "bg-gray-100 text-gray-700"
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {value}
    </span>
  )
}
