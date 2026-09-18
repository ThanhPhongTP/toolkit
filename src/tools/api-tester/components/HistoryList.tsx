import clsx from 'clsx'
import type { ApiHistoryEntry } from '../ApiTesterTool'

interface HistoryListProps {
  history: ApiHistoryEntry[]
  onSelect: (entry: ApiHistoryEntry) => void
  onClear: () => void
}

export function HistoryList({ history, onSelect, onClear }: HistoryListProps) {
  if (history.length === 0) {
    return <p className="text-sm text-slate-400">No requests sent yet.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onClear}
        className="self-end text-xs font-medium text-slate-400 hover:text-red-500"
      >
        Clear history
      </button>
      <ul className="flex flex-col gap-1">
        {history.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              onClick={() => onSelect(entry)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{entry.method}</span>
              <span className="truncate text-slate-600 dark:text-slate-300">{entry.url}</span>
              {entry.status !== undefined && (
                <span
                  className={clsx(
                    'ml-auto shrink-0 font-mono',
                    entry.status >= 400 ? 'text-red-500' : 'text-emerald-500',
                  )}
                >
                  {entry.status}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
