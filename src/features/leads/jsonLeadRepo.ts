import type { Lead } from "./types"
import type { LeadRepository } from "../ports"

export function jsonLeadRepo(latency: { wait: (ms?: number, failRate?: number) => Promise<void> }): LeadRepository {
  let cache: Lead[] | null = null
  return {
    async list() {
      if (!cache) {
        const data = (await import("../../data/leads.json")).default as Lead[]
        cache = data
      }
      await latency.wait(500)
      return cache!
    },
    async update(next: Lead) {
      await latency.wait(400, 0.2)
      if (cache) {
        const i = cache.findIndex(l => l.id === next.id)
        if (i >= 0) cache[i] = next
      }
      return next
    },
  }
}
