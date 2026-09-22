import { ListPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { computeSplitDiff } from '../../lib/diff/diffText'
import { formatJson, type FormatJsonResult } from '../../lib/json/formatJson'
import { HistoryDiffView } from './components/HistoryDiffView'
import { HistoryList } from './components/HistoryList'

const SAMPLE = '{"name":"Ada Lovelace","born":1815,"tags":["mathematician","programmer"]}'
const INDENT = 2

export interface JsonHistoryEntry {
  id: string
  timestamp: number
  input: string
}

const MAX_HISTORY = 50

export function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE)
  const [result, setResult] = useState<FormatJsonResult | null>(null)
  const [history, setHistory] = useLocalStorage<JsonHistoryEntry[]>('toolkit:json-formatter-history', [])
  const [compareIds, setCompareIds] = useState<string[]>([])

  const handleProcess = () => {
    const next = formatJson(input, INDENT)
    setResult(next)
    if (next.ok) {
      const entry: JsonHistoryEntry = { id: crypto.randomUUID(), timestamp: Date.now(), input }
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY))
    }
  }

  const handleSelectHistory = (entry: JsonHistoryEntry) => {
    setInput(entry.input)
    setResult(formatJson(entry.input, INDENT))
  }

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((existing) => existing !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  const handleClearHistory = () => {
    setHistory([])
    setCompareIds([])
  }

  const compareEntries = useMemo(
    () =>
      compareIds
        .map((id) => history.find((entry) => entry.id === id))
        .filter((entry): entry is JsonHistoryEntry => entry !== undefined)
        .sort((a, b) => a.timestamp - b.timestamp),
    [compareIds, history],
  )

  const diff = useMemo(() => {
    if (compareEntries.length !== 2) return null
    const [older, newer] = compareEntries
    const olderPretty = formatJson(older.input, INDENT).output
    const newerPretty = formatJson(newer.input, INDENT).output
    return {
      older,
      newer,
      identical: olderPretty === newerPretty,
      rows: computeSplitDiff(olderPretty, newerPretty),
    }
  }, [compareEntries])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex min-h-[16rem] flex-col">
          <TextAreaField
            label="Input JSON"
            showCharCount
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here..."
          />
        </div>
        <div className="flex min-h-[16rem] flex-col">
          <Panel
            title="Output"
            className="flex-1"
            actions={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleProcess}
                  title="Format this JSON and save it to history"
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ListPlus className="h-3.5 w-3.5" />
                  Process
                </button>
                <CopyButton value={result?.ok ? result.output : ''} />
              </div>
            }
          >
            {result === null ? (
              <p className="text-sm text-slate-400">
                Click &quot;Process&quot; to format the JSON above and save it to history.
              </p>
            ) : result.ok ? (
              <pre className="h-full overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-800 dark:text-slate-100">
                {result.output}
              </pre>
            ) : (
              <ErrorBanner message={result.error ?? 'Invalid JSON'} />
            )}
          </Panel>
        </div>
      </div>

      <Panel title="History">
        <HistoryList
          history={history}
          compareIds={compareIds}
          onSelect={handleSelectHistory}
          onToggleCompare={handleToggleCompare}
          onClear={handleClearHistory}
        />
      </Panel>

      {diff && (
        <Panel
          title="Compare"
          actions={
            <div className="flex items-center gap-2">
              {diff.identical && <span className="text-xs text-slate-400">Identical</span>}
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="text-xs font-medium text-slate-400 hover:text-red-500"
              >
                Close
              </button>
            </div>
          }
        >
          <HistoryDiffView
            rows={diff.rows}
            leftLabel={new Date(diff.older.timestamp).toLocaleTimeString()}
            rightLabel={new Date(diff.newer.timestamp).toLocaleTimeString()}
          />
        </Panel>
      )}
    </div>
  )
}
