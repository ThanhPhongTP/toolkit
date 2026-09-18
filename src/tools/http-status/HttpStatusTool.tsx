import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { searchHttpStatuses, type HttpStatusEntry } from '../../lib/httpStatus/statusCodes'

const CATEGORY_STYLES: Record<HttpStatusEntry['category'], string> = {
  '1xx': 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  '2xx': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  '3xx': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  '4xx': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  '5xx': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
}

export function HttpStatusTool() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchHttpStatuses(query), [query])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by code or text (e.g. 404, not found)..."
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
      />
      <div className="flex flex-col divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        {results.map((status) => (
          <div key={status.code} className="flex items-start gap-3 bg-white p-3 dark:bg-slate-900">
            <span
              className={clsx(
                'shrink-0 rounded-md px-2 py-0.5 font-mono text-sm font-semibold',
                CATEGORY_STYLES[status.category],
              )}
            >
              {status.code}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{status.text}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{status.description}</p>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <p className="bg-white p-3 text-sm text-slate-400 dark:bg-slate-900">No status codes match.</p>
        )}
      </div>
    </div>
  )
}
