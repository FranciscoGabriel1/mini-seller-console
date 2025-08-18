import { type JSX, useState } from "react"
import { useOpportunities } from "../../features/opportunities/hooks/useOpportunities"
import { StageBadge } from "../StageBadge"
import { formatCurrency } from "../../lib/format"
import type { Opportunity } from "../../features/opportunities/types"
import { ConfirmDialog } from "../ConfirmDialog"

export function OpportunitiesTable(): JSX.Element {
  const { data, isLoading, errorMessage, deleteOpportunity } = useOpportunities()
  const [toDelete, setToDelete] = useState<Opportunity | null>(null)

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading opportunities…</div>
  }
  if (errorMessage) {
    return <div className="text-sm text-red-600" role="alert">Error: {errorMessage}</div>
  }
  if (data.length === 0) {
    return <div className="text-sm text-gray-500">No opportunities yet.</div>
  }

  function askDelete(op: Opportunity): void {
    setToDelete(op)
  }

  async function confirmDelete(): Promise<void> {
    if (!toDelete) return
    await deleteOpportunity(toDelete.id)
    setToDelete(null)
  }

  return (
    <>
      {/* MOBILE (≤ sm): cards */}
      <div className="sm:hidden space-y-2">
        {data.map(op => (
          <article key={op.id} className="rounded-xl border border-surface bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900">{op.name}</div>
                <div className="text-xs text-grayMuted">{op.accountName}</div>
              </div>
              <StageBadge value={op.stage} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm">{formatCurrency(op.amount)}</span>
              <button
                type="button"
                className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                onClick={() => askDelete(op)}
                aria-label={`Delete opportunity ${op.name}`}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* DESKTOP (≥ sm): table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-left text-sm" role="table">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(op => (
              <tr key={op.id} className="border-b last:border-none">
                <td className="px-4 py-3 font-medium text-gray-900">{op.name}</td>
                <td className="px-4 py-3 text-gray-700">{op.accountName}</td>
                <td className="px-4 py-3"><StageBadge value={op.stage} /></td>
                <td className="px-4 py-3 text-right">{formatCurrency(op.amount)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                    onClick={() => askDelete(op)}
                    aria-label={`Delete opportunity ${op.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={toDelete !== null}
        title="Delete opportunity?"
        description={
          toDelete
            ? `This will permanently delete "${toDelete.name}" for account "${toDelete.accountName}".`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => { void confirmDelete() }}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
