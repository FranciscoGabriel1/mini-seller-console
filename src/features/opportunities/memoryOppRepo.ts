import type { Opportunity } from "./types"
import type { Clock, KVStorage } from "../ports"

const KEY = "opportunities:v1"

export function memoryOppRepo(clock: Clock, kv?: KVStorage) {
  // hydrate from KV if available
  let store: Opportunity[] = Array.isArray(kv?.get<Opportunity[]>(KEY)) ? (kv!.get<Opportunity[]>(KEY) as Opportunity[]) : []

  function persist() {
    if (kv) kv.set<Opportunity[]>(KEY, store)
  }

  async function list(): Promise<Opportunity[]> {
    // always reflect latest KV (in case other tabs wrote)
    if (kv) {
      const latest = kv.get<Opportunity[]>(KEY)
      if (Array.isArray(latest)) store = latest
    }
    return Promise.resolve([...store])
  }

  async function add(next: Opportunity): Promise<Opportunity> {
    const id = next.id && next.id.trim() !== "" ? next.id : generateId()
    const created: Opportunity = { ...next, id }
    store = [...store, created]
    persist()
    return Promise.resolve(created)
  }

  function generateId(): string {
    const ts = clock.now()
    const rnd = Math.random().toString(36).slice(2, 8)
    return `opp_${ts}_${rnd}`
  }

  return { list, add }
}

export type MemoryOppRepo = ReturnType<typeof memoryOppRepo>
