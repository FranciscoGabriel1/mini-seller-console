import { createContext, useContext } from "react"
import type { Services } from "../../features/ports"

export const ServicesCtx = createContext<Services | null>(null)

export function useServices(): Services {
  const ctx = useContext(ServicesCtx)
  if (!ctx) throw new Error("useServices must be used within ServiceProvider")
  return ctx
}
