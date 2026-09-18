import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { computeDiff, type DiffMode } from '../../lib/diff/diffText'

export function DiffCheckerTool() {
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')
  const [mode, setMode] = useState<DiffMode>('lines')

  const parts = useMemo(() => computeDiff(before, after, mode), [before, after, mode])

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
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as DiffMode)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="lines">By line</option>
            <option value="words">By word</option>
          </select>
        }
      >
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
      </Panel>
    </div>
  )
}
