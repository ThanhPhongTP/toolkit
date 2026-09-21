import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { computeDiff, computeSplitDiff, type DiffMode } from '../../lib/diff/diffText'

type ViewMode = 'unified' | 'split'

export function DiffCheckerTool() {
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')
  const [mode, setMode] = useState<DiffMode>('lines')
  const [view, setView] = useState<ViewMode>('unified')

  const parts = useMemo(() => computeDiff(before, after, mode), [before, after, mode])
  const rows = useMemo(() => computeSplitDiff(before, after), [before, after])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TextAreaField
          label="Original"
          value={before}
          onChange={(e) => setBefore(e.target.value)}
          className="min-h-[10rem]"
        />
        <TextAreaField
          label="Changed"
          value={after}
          onChange={(e) => setAfter(e.target.value)}
          className="min-h-[10rem]"
        />
      </div>
      <Panel
        title="Diff"
        className="flex-1"
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-slate-200 p-0.5 dark:border-slate-800">
              {(['unified', 'split'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={clsx(
                    'rounded px-2.5 py-1 text-xs font-medium capitalize transition',
                    view === v
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            {view === 'unified' && (
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as DiffMode)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="lines">By line</option>
                <option value="words">By word</option>
              </select>
            )}
          </div>
        }
      >
        {view === 'unified' ? (
          <pre className="h-full overflow-auto whitespace-pre-wrap break-all font-mono text-sm">
            {parts.map((part, i) => (
              <span
                key={i}
                className={clsx(
                  part.added && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
                  part.removed && 'bg-red-100 text-red-800 line-through dark:bg-red-500/20 dark:text-red-300',
                  !part.added && !part.removed && 'text-slate-700 dark:text-slate-300',
                )}
              >
                {part.value}
              </span>
            ))}
          </pre>
        ) : (
          <div
            className="grid h-full auto-rows-fr overflow-auto font-mono text-sm"
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            {rows.map((row, i) => (
              <div key={i} className="contents">
                <div
                  className={clsx(
                    'whitespace-pre-wrap break-all border-r border-slate-200 px-2 py-0.5 dark:border-slate-800',
                    row.left?.type === 'removed' &&
                      'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
                    row.left?.type === 'context' && 'text-slate-700 dark:text-slate-300',
                    !row.left && 'bg-slate-50 dark:bg-slate-900/50',
                  )}
                >
                  {row.left ? row.left.value : ' '}
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
                  {row.right ? row.right.value : ' '}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}
