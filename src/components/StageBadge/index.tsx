import { type JSX } from "react"
import type { Opportunity } from "../../features/opportunities/types"

type Stage = Opportunity["stage"]

const MAP: Record<Stage, string> = {
    Prospecting: "bg-indigo-100 text-indigo-800",
    Qualification: "bg-sky-100 text-sky-800",
    Proposal: "bg-amber-100 text-amber-800",
    "Closed Won": "bg-emerald-100 text-emerald-800",
    "Closed Lost": "bg-rose-100 text-rose-800",
}

export function StageBadge({ value }: { value: Stage }): JSX.Element {
    const cls = MAP[value] ?? "bg-gray-100 text-gray-700"
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
            {value}
        </span>
    )
}
