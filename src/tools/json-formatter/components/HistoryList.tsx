import { formatJson } from '../../../lib/json/formatJson'
import type { JsonHistoryEntry } from '../JsonFormatter'

interface HistoryListProps {
  history: JsonHistoryEntry[]
  compareIds: string[]
  onSelect: (entry: JsonHistoryEntry) => void
  onToggleCompare: (id: string) => void
  onClear: () => void
}

export function HistoryList({ history, compareIds, onSelect, onToggleCompare, onClear }: HistoryListProps) {
  if (history.length === 0) {
    return <p className="text-sm text-slate-400">No JSON formatted yet this session.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-slate-400">
          {compareIds.length === 2 ? 'Comparing 2 entries' : 'Check 2 entries to compare'}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-xs font-medium text-slate-400 hover:text-red-500"
        >
          Clear history
        </button>
      </div>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {history.map((entry) => {
          const checked = compareIds.includes(entry.id)
          const pretty = formatJson(entry.input, 2).output
          return (
            <li
              key={entry.id}
              className="flex flex-col gap-1.5 rounded-md border border-slate-200 p-2 dark:border-slate-800"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleCompare(entry.id)}
                    disabled={!checked && compareIds.length >= 2}
                    aria-label={`Select entry from ${new Date(entry.timestamp).toLocaleTimeString()} for compare`}
                    className="h-3.5 w-3.5 accent-indigo-600"
                  />
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </label>
                <button
                  type="button"
                  onClick={() => onSelect(entry)}
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Restore
                </button>
              </div>
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-all rounded bg-slate-50 p-1.5 font-mono text-xs text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
                {pretty}
              </pre>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
