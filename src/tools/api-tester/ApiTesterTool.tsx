import { useState } from 'react'
import { Panel } from '../../components/Panel'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { generateCurlCommand } from '../../lib/curl/curlGenerate'
import {
  applyCorsProxy,
  createEmptyRequest,
  DEFAULT_CORS_PROXY_TEMPLATE,
  sendHttpRequest,
  type HttpRequestModel,
  type HttpResponseSummary,
} from '../../lib/http/requestModel'
import { HistoryList } from './components/HistoryList'
import { RequestPanel } from './components/RequestPanel'
import { ResponsePanel } from './components/ResponsePanel'

export interface ApiHistoryEntry extends HttpRequestModel {
  id: string
  timestamp: number
  status?: number
}

const MAX_HISTORY = 50

export function ApiTesterTool() {
  const [request, setRequest] = useState<HttpRequestModel>(createEmptyRequest)
  const [response, setResponse] = useState<HttpResponseSummary | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [sending, setSending] = useState(false)
  const [history, setHistory] = useLocalStorage<ApiHistoryEntry[]>('toolkit:api-history', [])
  const [useCorsProxy, setUseCorsProxy] = useLocalStorage('toolkit:api-use-cors-proxy', false)

  const handleSend = async () => {
    setSending(true)
    setError(undefined)
    setResponse(undefined)
    const entry: ApiHistoryEntry = { ...request, id: crypto.randomUUID(), timestamp: Date.now() }
    try {
      const fetchUrl = useCorsProxy ? applyCorsProxy(request.url, DEFAULT_CORS_PROXY_TEMPLATE) : request.url
      const result = await sendHttpRequest(request, fetchUrl)
      setResponse(result)
      setHistory((prev) => [{ ...entry, status: result.status }, ...prev].slice(0, MAX_HISTORY))
    } catch (err) {
      setError((err as Error).message || 'Request failed')
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <RequestPanel
          request={request}
          onChange={setRequest}
          onSend={handleSend}
          sending={sending}
          useCorsProxy={useCorsProxy}
          onToggleCorsProxy={setUseCorsProxy}
        />
        <Panel title="Response">
          <ResponsePanel response={response} error={error} curlCommand={generateCurlCommand(request)} />
        </Panel>
      </div>
      <Panel title="History">
        <HistoryList
          history={history}
          onClear={() => setHistory([])}
          onSelect={(entry) =>
            setRequest({ method: entry.method, url: entry.url, headers: entry.headers, body: entry.body })
          }
        />
      </Panel>
    </div>
  )
}
