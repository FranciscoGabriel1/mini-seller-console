import { useEffect, useState } from "react"
import type { Lead } from "../types"
import { isValidScore } from "../../../lib/validators"
import { useServices } from "../../../app/contexts/services-context"

type UseLeadsState = {
  data: Lead[]
  isLoading: boolean
  errorMessage: string | null
}

type UseLeadsReturn = UseLeadsState & {
  updateLead: (next: Lead) => Promise<void>
  reload: () => Promise<void>
  dismissError: () => void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && typeof error.message === "string") return error.message
  return "Unexpected error"
}

export function useLeads(): UseLeadsReturn {
  const { leads: leadsRepo, latency } = useServices()
  const [state, setState] = useState<UseLeadsState>({
    data: [],
    isLoading: true,
    errorMessage: null,
  })

  async function load(): Promise<void> {
    setState(s => ({ ...s, isLoading: true, errorMessage: null }))
    try {
      const list = await leadsRepo.list()
      setState({ data: list, isLoading: false, errorMessage: null })
    } catch (err: unknown) {
      setState(s => ({ ...s, isLoading: false, errorMessage: getErrorMessage(err) }))
    }
  }

  useEffect(() => { void load() }, [])
  function dismissError(): void {
    setState(s => ({ ...s, errorMessage: null }))
  }

  async function updateLead(next: Lead): Promise<void> {
    if (!isValidScore(next.score)) {
      setState(s => ({ ...s, errorMessage: "Score must be an integer between 0 and 100" }))
      return
    }

    // snapshot for rollback
    let previous: Lead | undefined
    setState(s => {
      previous = s.data.find(l => l.id === next.id)
      const updated = s.data.map(l => (l.id === next.id ? next : l))
      return { ...s, data: updated, errorMessage: null }
    })

    try {
      await latency.wait(250)
      await leadsRepo.update(next)
    } catch (err: unknown) {
      // rollback to snapshot
      if (previous) {
        setState(s => ({
          ...s,
          data: s.data.map(l => (l.id === previous!.id ? previous! : l)),
          errorMessage: getErrorMessage(err),
        }))
      } else {
        setState(s => ({ ...s, errorMessage: getErrorMessage(err) }))
      }
    }
  }

  return {
    ...state,
    updateLead,
    reload: load,
    dismissError,
  }
}
