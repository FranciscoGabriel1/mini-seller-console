import type { OpportunityRepository } from "../ports"
import type { Opportunity } from "./types"

export function memoryOppRepo(clock: { now: () => number }): OpportunityRepository {
  const store: Opportunity[] = []
  return {
    async add(next) {
      if (!next.id) next.id = `op_${clock.now()}`
      store.push(next)
      return next
    },
    async list() {
      return store
    },
  }
}
