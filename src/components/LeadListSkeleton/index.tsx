import type { JSX } from "react";

export function LeadListSkeleton(): JSX.Element {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b last:border-none">
              <td className="px-4 py-3">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="ml-auto h-4 w-8 animate-pulse rounded bg-gray-200" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
