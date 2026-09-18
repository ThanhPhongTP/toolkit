import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { describeDate, parseDateInput } from '../../lib/datetime/timestamp'

export function TimestampConverterTool() {
  const [input, setInput] = useState(() => Math.floor(Date.now() / 1000).toString())

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, data: undefined }
    try {
      return { ok: true as const, data: describeDate(parseDateInput(input)) }
    } catch (err) {
      return { ok: false as const, error: (err as Error).message }
    }
  }, [input])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Unix timestamp or date string
        </label>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
            placeholder="1516239022 or 2018-01-18T01:30:22Z"
          />
          <button
            type="button"
            onClick={() => setInput(Math.floor(Date.now() / 1000).toString())}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Now
          </button>
        </div>
      </div>

      {result.ok === false && <ErrorBanner message={result.error} />}

      {result.ok && result.data && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel title="ISO 8601" actions={<CopyButton value={result.data.iso} />}>
            <code className="font-mono text-sm">{result.data.iso}</code>
          </Panel>
          <Panel title="UTC" actions={<CopyButton value={result.data.utc} />}>
            <code className="font-mono text-sm">{result.data.utc}</code>
          </Panel>
          <Panel title="Local" actions={<CopyButton value={result.data.local} />}>
            <code className="font-mono text-sm">{result.data.local}</code>
          </Panel>
          <Panel title="Relative" actions={<CopyButton value={result.data.relative} />}>
            <code className="font-mono text-sm">{result.data.relative}</code>
          </Panel>
          <Panel title="Unix seconds" actions={<CopyButton value={String(result.data.unixSeconds)} />}>
            <code className="font-mono text-sm">{result.data.unixSeconds}</code>
          </Panel>
          <Panel title="Unix milliseconds" actions={<CopyButton value={String(result.data.unixMillis)} />}>
            <code className="font-mono text-sm">{result.data.unixMillis}</code>
          </Panel>
        </div>
      )}
    </div>
  )
}
