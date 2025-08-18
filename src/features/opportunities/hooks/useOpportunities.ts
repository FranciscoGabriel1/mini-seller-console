import { useEffect, useState } from "react"
import type { Opportunity } from "../types"
import { useServices } from "../../../app/contexts/services-context"
import { onOppsChanged } from "../../../lib/eventBus"

type UseOppsState = {
  data: Opportunity[]
  isLoading: boolean
  errorMessage: string | null
}

type UseOppsReturn = UseOppsState & {
  addOpportunity: (next: Opportunity) => Promise<void>
  deleteOpportunity: (id: string) => Promise<void> // 👈 novo
  reload: () => Promise<void>
  dismissError: () => void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && typeof error.message === "string") return error.message
  return "Unexpected error"
}

export function useOpportunities(): UseOppsReturn {
  const { opps } = useServices()
  const [state, setState] = useState<UseOppsState>({
    data: [],
    isLoading: true,
    errorMessage: null,
  })

  async function load(): Promise<void> {
    setState(s => ({ ...s, isLoading: true }))
    try {
      const list = await opps.list()
      setState({ data: list, isLoading: false, errorMessage: null })
    } catch (e: unknown) {
      setState(s => ({ ...s, isLoading: false, errorMessage: getErrorMessage(e) }))
    }
  }

  useEffect(() => { void load() }, [])

  useEffect(() => {
    // reload quando oportunidades mudarem em outra parte da UI
    return onOppsChanged(() => { void load() })
  }, [])

  function dismissError(): void {
    setState(s => ({ ...s, errorMessage: null }))
  }

  async function addOpportunity(next: Opportunity): Promise<void> {
    try {
      const created = await opps.add(next)
      setState(s => ({ ...s, data: [...s.data, created] }))
    } catch (e: unknown) {
      setState(s => ({ ...s, errorMessage: getErrorMessage(e) }))
    }
  }

  async function deleteOpportunity(id: string): Promise<void> {
    try {
      await opps.delete(id)
      setState(s => ({ ...s, data: s.data.filter(op => op.id !== id) }))
    } catch (e: unknown) {
      setState(s => ({ ...s, errorMessage: getErrorMessage(e) }))
    }
  }

  return { ...state, addOpportunity, deleteOpportunity, reload: load, dismissError }
}
