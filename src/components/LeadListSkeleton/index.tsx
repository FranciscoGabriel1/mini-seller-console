import type { JSX } from "react";

export function LeadListSkeleton(): JSX.Element {
  return (
    <>
      {/* MOBILE (≤ sm): cards */}
      <div className="sm:hidden space-y-2 mt-3">
        {[...Array(4)].map((_, i) => (
          <article
            key={i}
            className="rounded-xl border border-surface bg-white p-3"
            aria-busy="true"
          >
            <header className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
            </header>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-600">Score</span>
              <div className="h-6 w-10 animate-pulse rounded bg-gray-200" />
            </div>
          </article>
        ))}
      </div>

      {/* DESKTOP (≥ sm): tabela */}
      <div className="mt-3 overflow-x-auto rounded-xl border bg-white hidden sm:block">
        <table className="min-w-full text-left text-sm" aria-busy="true">
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
    </>
  );
}
