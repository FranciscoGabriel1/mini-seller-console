import React, { useMemo } from "react"
import { ServicesCtx } from "./services-context"
import { realClock } from "../../lib/clock"
import { simulatedLatency } from "../../lib/latency"
import { jsonLeadRepo } from "../../features/leads/jsonLeadRepo"
import type { Services } from "../../features/ports"
import { localStorageKV } from "../../lib/storage"
import { memoryOppRepo } from "../../features/opportunities/memoryOppRepo"

export const ServiceProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const services = useMemo<Services>(() => {
    const clock = realClock()
    const latency = simulatedLatency()
    return {
      leads: jsonLeadRepo(latency),
      opps: memoryOppRepo(clock),
      kv: localStorageKV,
      clock,
      latency,
    }
  }, [])

  return <ServicesCtx.Provider value={services}>{children}</ServicesCtx.Provider>
}
