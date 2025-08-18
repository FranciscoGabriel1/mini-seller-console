import { type JSX, useMemo, useState } from "react"
import type { Lead, LeadStatus } from "../../features/leads/types"
import { isValidEmail } from "../../lib/validators"

type LeadDetailPanelProps = {
  lead: Lead
  onClose: () => void
  onSave: (next: Lead) => void
  onConvert: (payload: { stage: "Prospecting" | "Qualification" | "Proposal" | "Closed Won" | "Closed Lost"; amount?: number }) => void
}

const ALL_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "unqualified"]
const STAGES = ["Prospecting", "Qualification", "Proposal", "Closed Won", "Closed Lost"] as const


export function LeadDetailPanel(props: LeadDetailPanelProps): JSX.Element {
  const { lead, onClose, onSave, onConvert } = props
  const [email, setEmail] = useState<string>(lead.email)
  const [status, setStatus] = useState<LeadStatus>(lead.status)
  const emailError = useMemo(() => (isValidEmail(email) ? null : "Invalid email format"), [email])
  const [stage, setStage] = useState<(typeof STAGES)[number]>("Prospecting")
  const [amountInput, setAmountInput] = useState<string>("")

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault()
        if (!emailError) onSave({ ...lead, email, status })
      }}
    >
      {/* existing fields */}
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
        {emailError && (<p id="email-error" className="text-xs text-red-600">{emailError}</p>)}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="status">Status</label>
        <select
          id="status"
          className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring"
          value={status}
          onChange={e => setStatus(e.target.value as LeadStatus)}
        >
          {ALL_STATUSES.map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      {/* conversion block */}
      <div className="mt-4 rounded-lg border bg-gray-50 p-3 space-y-2">
        <div className="text-sm font-medium text-gray-800">Convert to Opportunity</div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="stage">Stage</label>
          <select
            id="stage"
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring"
            value={stage}
            onChange={e => setStage(e.target.value as (typeof STAGES)[number])}
          >
            {STAGES.map(s => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="amount">Amount (optional)</label>
          <input
            id="amount"
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring"
            inputMode="decimal"
            placeholder="e.g., 12000"
            value={amountInput}
            onChange={e => setAmountInput(e.target.value.replace(/[^\d.]/g, ""))}
          />
        </div>

        <button
          type="button"
          className="rounded bg-gray-900 px-3 py-2 text-sm text-white"
          onClick={() => {
            const amount = amountInput.trim() === "" ? undefined : Number(amountInput)
            onConvert({ stage, amount })
          }}
        >
          Convert Lead
        </button>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="button" className="rounded border px-3 py-2 text-sm" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" disabled={!!emailError} aria-disabled={!!emailError}
          className="rounded bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50">
          Save
        </button>
      </div>
    </form>
  )
}
