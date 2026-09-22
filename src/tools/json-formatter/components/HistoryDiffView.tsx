import clsx from 'clsx'
import type { SplitDiffRow } from '../../../lib/diff/diffText'

interface HistoryDiffViewProps {
  rows: SplitDiffRow[]
  leftLabel: string
  rightLabel: string
}

export function HistoryDiffView({ rows, leftLabel, rightLabel }: HistoryDiffViewProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="border-r border-slate-200 px-2 py-1 dark:border-slate-800">{leftLabel}</div>
        <div className="px-2 py-1">{rightLabel}</div>
      </div>
      <div
        className="grid max-h-[24rem] auto-rows-fr overflow-auto font-mono text-sm"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        {rows.map((row, i) => (
          <div key={i} className="contents">
            <div
              className={clsx(
                'whitespace-pre-wrap break-all border-r border-slate-200 px-2 py-0.5 dark:border-slate-800',
                row.left?.type === 'removed' && 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
                row.left?.type === 'context' && 'text-slate-700 dark:text-slate-300',
                !row.left && 'bg-slate-50 dark:bg-slate-900/50',
              )}
            >
              {row.left ? row.left.value : ' '}
            </div>
            <div
              className={clsx(
                'whitespace-pre-wrap break-all px-2 py-0.5',
                row.right?.type === 'added' &&
                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
                row.right?.type === 'context' && 'text-slate-700 dark:text-slate-300',
                !row.right && 'bg-slate-50 dark:bg-slate-900/50',
              )}
            >
              {row.right ? row.right.value : ' '}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
