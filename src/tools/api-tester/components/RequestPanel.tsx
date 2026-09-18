import { Plus, Trash2 } from 'lucide-react'
import { TextAreaField } from '../../../components/TextAreaField'
import type { HttpHeader, HttpMethod, HttpRequestModel } from '../../../lib/http/requestModel'

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

interface RequestPanelProps {
  request: HttpRequestModel
  onChange: (request: HttpRequestModel) => void
  onSend: () => void
  sending: boolean
}

export function RequestPanel({ request, onChange, onSend, sending }: RequestPanelProps) {
  const updateHeader = (index: number, field: keyof HttpHeader, value: string) => {
    onChange({
      ...request,
      headers: request.headers.map((h, i) => (i === index ? { ...h, [field]: value } : h)),
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <select
          value={request.method}
          onChange={(e) => onChange({ ...request, method: e.target.value as HttpMethod })}
          className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          value={request.url}
          onChange={(e) => onChange({ ...request, url: e.target.value })}
          placeholder="https://api.example.com/users"
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={sending || !request.url}
          className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Headers</label>
          <button
            type="button"
            onClick={() => onChange({ ...request, headers: [...request.headers, { key: '', value: '' }] })}
            className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <Plus className="h-3.5 w-3.5" /> Add header
          </button>
        </div>
        {request.headers.map((header, i) => (
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
              onClick={() => onChange({ ...request, headers: request.headers.filter((_, idx) => idx !== i) })}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {request.method !== 'GET' && request.method !== 'HEAD' && (
        <TextAreaField
          label="Body"
          value={request.body}
          onChange={(e) => onChange({ ...request, body: e.target.value })}
          placeholder='{"key":"value"}'
          className="min-h-[6rem]"
        />
      )}
    </div>
  )
}
