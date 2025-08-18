export const EVENTS = {
  OPPS_CHANGED: "opps:changed",
} as const

export function emitOppsChanged(): void {
  window.dispatchEvent(new Event(EVENTS.OPPS_CHANGED))
}

export function onOppsChanged(handler: () => void): () => void {
  window.addEventListener(EVENTS.OPPS_CHANGED, handler)
  return () => window.removeEventListener(EVENTS.OPPS_CHANGED, handler)
}
