import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { parseCurlCommand } from '../../lib/curl/curlParse'
import { sendHttpRequest, type HttpRequestModel, type HttpResponseSummary } from '../../lib/http/requestModel'

const SAMPLE = `POST /webhooks/orders HTTP/1.1
Host: example.com
Content-Type: application/json
X-Signature: sha256=abc123

{"event":"order.created","id":42}`

function parseRawHttpRequest(raw: string): HttpRequestModel {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const requestLine = lines[0]?.trim() ?? ''
  const match = requestLine.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)/i)
  if (!match) {
    throw new Error('First line must look like "METHOD /path HTTP/1.1"')
  }
  const method = match[1].toUpperCase() as HttpRequestModel['method']
  const path = match[2]

  let i = 1
  const headers: { key: string; value: string }[] = []
  for (; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === '') {
      i++
      break
    }
    const sep = line.indexOf(':')
    if (sep === -1) continue
    headers.push({ key: line.slice(0, sep).trim(), value: line.slice(sep + 1).trim() })
  }
  const body = lines.slice(i).join('\n').trim()

  let url = path
  if (!/^https?:\/\//i.test(path)) {
    const host = headers.find((h) => h.key.toLowerCase() === 'host')?.value
    url = host ? `https://${host}${path}` : path
  }

  return { method, url, headers, body }
}

function parsePayload(input: string): HttpRequestModel {
  const trimmed = input.trim()
  if (!trimmed) throw new Error('Paste a raw HTTP request, curl command, or JSON body')
  if (trimmed.startsWith('curl')) return parseCurlCommand(trimmed)
  if (/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\S+\s+HTTP\/\d/i.test(trimmed)) {
    return parseRawHttpRequest(trimmed)
  }
  JSON.parse(trimmed)
  return { method: 'POST', url: '', headers: [{ key: 'Content-Type', value: 'application/json' }], body: trimmed }
}

export function WebhookInspectorTool() {
  const [input, setInput] = useState(SAMPLE)
  const [replayUrl, setReplayUrl] = useState('')
  const [response, setResponse] = useState<HttpResponseSummary | undefined>()
  const [replayError, setReplayError] = useState<string | undefined>()
  const [sending, setSending] = useState(false)

  const parsed = useMemo(() => {
    try {
      return { ok: true as const, data: parsePayload(input) }
    } catch (err) {
      return { ok: false as const, error: (err as Error).message }
    }
  }, [input])

  const handleReplay = async () => {
    if (!parsed.ok) return
    const targetUrl = parsed.data.url || replayUrl
    if (!targetUrl) return
    setSending(true)
    setReplayError(undefined)
    setResponse(undefined)
    try {
      const result = await sendHttpRequest({ ...parsed.data, url: targetUrl })
      setResponse(result)
    } catch (err) {
      setReplayError((err as Error).message || 'Replay failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <TextAreaField
        label="Raw HTTP request / curl command / JSON body"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[10rem]"
      />

      {!parsed.ok && <ErrorBanner message={parsed.error} />}

      {parsed.ok && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Panel title="Method & URL">
              <code className="font-mono text-sm">
                {parsed.data.method} {parsed.data.url || '(no URL — enter one below to replay)'}
              </code>
            </Panel>
            <Panel title="Headers">
              {parsed.data.headers.length === 0 ? (
                <p className="text-sm text-slate-400">No headers</p>
              ) : (
                <ul className="space-y-1 font-mono text-xs">
                  {parsed.data.headers.map((h, i) => (
                    <li key={i}>
                      {h.key}: {h.value}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
          <Panel title="Body" actions={<CopyButton value={parsed.data.body} />}>
            <pre className="whitespace-pre-wrap break-all font-mono text-sm">{parsed.data.body || '(empty)'}</pre>
          </Panel>

          <div className="flex items-center gap-2">
            {!parsed.data.url && (
              <input
                value={replayUrl}
                onChange={(e) => setReplayUrl(e.target.value)}
                placeholder="Target URL to replay against..."
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
              />
            )}
            <button
              type="button"
              onClick={handleReplay}
              disabled={sending || (!parsed.data.url && !replayUrl)}
              className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? 'Replaying...' : 'Replay request'}
            </button>
          </div>

          {replayError && <ErrorBanner message={replayError} />}
          {response && (
            <Panel title="Replay response" actions={<CopyButton value={response.body} />}>
              <p className="mb-2 font-mono text-sm">
                {response.status} {response.statusText} · {response.durationMs} ms
              </p>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-all font-mono text-sm">
                {response.body || '(empty body)'}
              </pre>
            </Panel>
          )}
        </>
      )}
    </div>
  )
}
