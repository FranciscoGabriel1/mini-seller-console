import { useEffect, useState } from "react"
import { useServices } from "../app/contexts/services-context"
/**
 * Persist a piece of state in KVStorage under a given key.
 * - Reads once on mount (lazy)
 * - Writes on every change
 */
export function usePersistentState<T>(key: string, initialValue: T) {
  const { kv } = useServices()
  const [value, setValue] = useState<T>(() => {
    const stored = kv.get<T>(key)
    return stored !== null ? stored : initialValue
  })

  useEffect(() => {
    kv.set<T>(key, value)
  }, [key, value, kv])

  return [value, setValue] as const
}
