import { type JSX, useMemo, useState } from "react"
import type { Lead, LeadStatus } from "../../features/leads/types"
import { isValidEmail } from "../../lib/validators"

type LeadDetailPanelProps = {
  lead: Lead
  onClose: () => void
  onSave: (next: Lead) => void
}

const ALL_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "unqualified"]

export function LeadDetailPanel(props: LeadDetailPanelProps): JSX.Element {
  const { lead, onClose, onSave } = props
  const [email, setEmail] = useState<string>(lead.email)
  const [status, setStatus] = useState<LeadStatus>(lead.status)
  const emailError = useMemo(() => (isValidEmail(email) ? null : "Invalid email format"), [email])

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault()
        if (!emailError) onSave({ ...lead, email, status })
      }}
    >
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <div className="text-sm text-gray-900">{lead.name}</div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Company</label>
        <div className="text-sm text-gray-900">{lead.company}</div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
        <input
          id="email"
          className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "email-error" : undefined}
        />
        {emailError && (
          <p id="email-error" className="text-xs text-red-600">{emailError}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="status">Status</label>
        <select
          id="status"
          className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring"
          value={status}
          onChange={e => setStatus(e.target.value as LeadStatus)}
        >
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          className="rounded border px-3 py-2 text-sm"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!!emailError}
          aria-disabled={!!emailError}
          className="rounded bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </form>
  )
}
