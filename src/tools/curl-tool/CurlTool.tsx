import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { generateCurlCommand } from '../../lib/curl/curlGenerate'
import { parseCurlCommand } from '../../lib/curl/curlParse'
import type { HttpHeader, HttpMethod } from '../../lib/http/requestModel'

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

function BuildTab() {
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [url, setUrl] = useState('https://api.example.com/users')
  const [headers, setHeaders] = useState<HttpHeader[]>([{ key: 'Content-Type', value: 'application/json' }])
  const [body, setBody] = useState('')

  const command = useMemo(() => generateCurlCommand({ method, url, headers, body }), [method, url, headers, body])

  const updateHeader = (index: number, field: keyof HttpHeader, value: string) => {
    setHeaders((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)))
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex gap-2">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/users"
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Headers</label>
          <button
            type="button"
            onClick={() => setHeaders((prev) => [...prev, { key: '', value: '' }])}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <Plus className="h-3.5 w-3.5" /> Add header
          </button>
        </div>
        {headers.map((header, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={header.key}
              onChange={(e) => updateHeader(i, 'key', e.target.value)}
              placeholder="Header name"
              className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            <input
              value={header.value}
              onChange={(e) => updateHeader(i, 'value', e.target.value)}
              placeholder="Header value"
              className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            <button
              type="button"
              onClick={() => setHeaders((prev) => prev.filter((_, idx) => idx !== i))}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <TextAreaField
        label="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder='{"key":"value"}'
        className="min-h-[6rem]"
      />

      <Panel title="curl command" actions={<CopyButton value={command} />}>
        <pre className="overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-800 dark:text-slate-100">
          {command}
        </pre>
      </Panel>
    </div>
  )
}

function ParseTab() {
  const [command, setCommand] = useState(
    `curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d '{"name":"Ada"}'`,
  )

  const result = useMemo(() => {
    if (!command.trim()) return { ok: true as const, data: undefined }
    try {
      return { ok: true as const, data: parseCurlCommand(command) }
    } catch (err) {
      return { ok: false as const, error: (err as Error).message }
    }
  }, [command])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <TextAreaField
        label="curl command"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        className="min-h-[6rem]"
      />
      {!result.ok && <ErrorBanner message={result.error} />}
      {result.ok && result.data && (
        <div className="grid gap-3">
          <Panel title="Method & URL">
            <code className="font-mono text-sm">
              {result.data.method} {result.data.url}
            </code>
          </Panel>
          <Panel title="Headers">
            {result.data.headers.length === 0 ? (
              <p className="text-sm text-slate-400">No headers</p>
            ) : (
              <ul className="space-y-1 font-mono text-sm">
                {result.data.headers.map((h, i) => (
                  <li key={i}>
                    {h.key}: {h.value}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Body">
            <pre className="whitespace-pre-wrap break-all font-mono text-sm">
              {result.data.body || '(empty)'}
            </pre>
          </Panel>
        </div>
      )}
    </div>
  )
}

export function CurlTool() {
  const [tab, setTab] = useState<'build' | 'parse'>('build')

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="inline-flex w-fit rounded-md border border-slate-200 p-0.5 dark:border-slate-800">
        {(['build', 'parse'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded px-3 py-1 text-sm font-medium capitalize transition ${
              tab === t
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t === 'build' ? 'Build curl' : 'Parse curl'}
          </button>
        ))}
      </div>
      {tab === 'build' ? <BuildTab /> : <ParseTab />}
    </div>
  )
}
