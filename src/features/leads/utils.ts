import type { Lead, LeadStatus } from "./types"

export function searchLeads(items: Lead[], query: string): Lead[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter(l =>
    l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)
  )
}

export function filterByStatus(items: Lead[], status?: LeadStatus): Lead[] {
  if (!status) return items
  return items.filter(l => l.status === status)
}

export function sortByScore(items: Lead[], direction: "asc" | "desc"): Lead[] {
  const m = direction === "asc" ? 1 : -1
  return [...items].sort((a, b) => m * (a.score - b.score))
}
