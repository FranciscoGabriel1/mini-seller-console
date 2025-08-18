import type { Lead } from "./leads/types"
import type { Opportunity } from "./opportunities/types"

export type LeadRepository = {
  list(): Promise<Lead[]>
  update(next: Lead): Promise<Lead>
}

export type OpportunityRepository = {
  add(next: Opportunity): Promise<Opportunity>
  list(): Promise<Opportunity[]>
  delete(id: string): Promise<void>
}

export type KVStorage = {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
}

export type Clock = { now(): number }
export type Latency = { wait(ms?: number, failRate?: number): Promise<void> }

export type Services = {
  leads: LeadRepository
  opps: OpportunityRepository
  kv: KVStorage
  clock: Clock
  latency: Latency
}
