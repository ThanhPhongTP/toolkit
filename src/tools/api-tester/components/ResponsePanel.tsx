import clsx from 'clsx'
import { CopyButton } from '../../../components/CopyButton'
import { ErrorBanner } from '../../../components/ErrorBanner'
import { Panel } from '../../../components/Panel'
import type { HttpResponseSummary } from '../../../lib/http/requestModel'

interface ResponsePanelProps {
  response: HttpResponseSummary | undefined
  error: string | undefined
  curlCommand: string
}

function statusColor(status: number): string {
  if (status < 300) return 'text-emerald-600 dark:text-emerald-400'
  if (status < 400) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

export function ResponsePanel({ response, error, curlCommand }: ResponsePanelProps) {
  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <ErrorBanner message={error} />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          This often means the target API blocked the browser via CORS (its response is missing
          <code className="mx-1 rounded bg-slate-100 px-1 dark:bg-slate-800">Access-Control-Allow-Origin</code>
          for this origin), or the URL/network is unreachable. Try enabling "Route through a public CORS
          proxy" above and resending, or run the equivalent request outside the browser instead:
        </p>
        <Panel title="Copy as curl" actions={<CopyButton value={curlCommand} />}>
          <pre className="overflow-auto whitespace-pre-wrap break-all font-mono text-xs">{curlCommand}</pre>
        </Panel>
      </div>
    )
  }

  if (!response) {
    return <p className="text-sm text-slate-400">Send a request to see the response here.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-sm">
        <span className={clsx('font-mono font-semibold', statusColor(response.status))}>
          {response.status} {response.statusText}
        </span>
        <span className="text-slate-400">{response.durationMs} ms</span>
      </div>
      <Panel title="Headers">
        <ul className="space-y-1 font-mono text-xs">
          {response.headers.map((h, i) => (
            <li key={i}>
              {h.key}: {h.value}
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Body" actions={<CopyButton value={response.body} />}>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-all font-mono text-sm">
          {response.body || '(empty body)'}
        </pre>
      </Panel>
    </div>
  )
}
