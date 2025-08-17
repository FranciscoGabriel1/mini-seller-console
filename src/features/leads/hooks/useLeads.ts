import { useEffect, useState } from "react"
import type { Lead } from "../types"
import { useServices } from "../../../app/contexts/services-context"

type UseLeadsState = {
  data: Lead[]
  isLoading: boolean
  errorMessage: string | null
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && typeof error.message === "string") return error.message
  return "Failed to load leads"
}

export function useLeads(): UseLeadsState {
  const { leads } = useServices()
  const [state, setState] = useState<UseLeadsState>({
    data: [],
    isLoading: true,
    errorMessage: null,
  })

  useEffect(() => {
    let isActive = true
    ;(async () => {
      try {
        const list = await leads.list()
        if (isActive) {
          setState({ data: list, isLoading: false, errorMessage: null })
        }
      } catch (error: unknown) {
        if (isActive) {
          setState({ data: [], isLoading: false, errorMessage: getErrorMessage(error) })
        }
      }
    })()
    return () => {
      isActive = false
    }
  }, [leads])

  return state
}
