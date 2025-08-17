import { type JSX, useEffect, useRef } from "react"

type SlideOverProps = {
  isOpen: boolean
  title: string
  onClose: () => void
  children: JSX.Element | JSX.Element[]
}

export function SlideOver(props: SlideOverProps): JSX.Element | null {
  const { isOpen, title, onClose, children } = props
  const panelRef = useRef<HTMLDivElement | null>(null)

  // close on ESC
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  // focus management
  useEffect(() => {
    if (isOpen && panelRef.current) panelRef.current.focus()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="h-full w-full max-w-md bg-white shadow-xl outline-none"
      >
        <header className="border-b px-4 py-3">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </header>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
