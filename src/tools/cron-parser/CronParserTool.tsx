import { useMemo, useState } from 'react'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { explainCron } from '../../lib/cron/cronExplain'

export function CronParserTool() {
  const [expression, setExpression] = useState('0 9 * * 1-5')

  const result = useMemo(() => {
    if (!expression.trim()) return { ok: true as const, data: undefined }
    try {
      return { ok: true as const, data: explainCron(expression) }
    } catch (err) {
      return { ok: false as const, error: (err as Error).message }
    }
  }, [expression])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Cron expression</label>
        <input
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="0 9 * * 1-5"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {!result.ok && <ErrorBanner message={result.error} />}

      {result.ok && result.data && (
        <>
          <Panel title="Human-readable">
            <p className="text-sm text-slate-800 dark:text-slate-100">{result.data.description}</p>
          </Panel>
          <Panel title="Next 5 runs (UTC)">
            <ul className="space-y-1 font-mono text-sm text-slate-700 dark:text-slate-300">
              {result.data.nextRuns.map((run) => (
                <li key={run}>{run}</li>
              ))}
            </ul>
          </Panel>
        </>
      )}
    </div>
  )
}
