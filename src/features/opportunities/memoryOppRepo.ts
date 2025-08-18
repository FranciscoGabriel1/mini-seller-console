import type { Opportunity } from "./types"
import type { Clock, KVStorage } from "../ports"

const STORAGE_KEY = "opportunities:v1"

export function memoryOppRepo(clock: Clock, kv?: KVStorage) {
  let store: Opportunity[] = Array.isArray(kv?.get<Opportunity[]>(STORAGE_KEY))
    ? (kv!.get<Opportunity[]>(STORAGE_KEY) as Opportunity[])
    : []

  function persist(): void {
    if (kv) kv.set<Opportunity[]>(STORAGE_KEY, store)
  }

  async function list(): Promise<Opportunity[]> {
    if (kv) {
      const latest = kv.get<Opportunity[]>(STORAGE_KEY)
      if (Array.isArray(latest)) store = latest
    }
    return [...store]
  }

  async function add(next: Opportunity): Promise<Opportunity> {
    const id = next.id && next.id.trim() !== "" ? next.id : generateId()
    const created: Opportunity = { ...next, id }
    store = [...store, created]
    persist()
    return created
  }

  async function remove(id: string): Promise<void> {
    store = store.filter(op => op.id !== id)
    persist()
  }

  function generateId(): string {
    const ts = clock.now()
    const rnd = Math.random().toString(36).slice(2, 8)
    return `opp_${ts}_${rnd}`
  }

  return { list, add, delete: remove }
}

export type MemoryOppRepo = ReturnType<typeof memoryOppRepo>
