import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { TwoColumnLayout } from '../../components/TwoColumnLayout'
import { csvToJson, jsonToCsv } from '../../lib/csv/csvJson'

const SAMPLE_CSV = 'name,age,city\nAda,30,London\nAlan,41,Manchester'

export function CsvJsonTool() {
  const [direction, setDirection] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json')
  const [input, setInput] = useState(SAMPLE_CSV)

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: '' }
    try {
      return {
        ok: true as const,
        output: direction === 'csv-to-json' ? csvToJson(input) : jsonToCsv(input),
      }
    } catch (err) {
      return { ok: false as const, error: (err as Error).message }
    }
  }, [input, direction])

  return (
    <TwoColumnLayout
      left={
        <TextAreaField
          label={direction === 'csv-to-json' ? 'CSV input' : 'JSON input'}
          showCharCount
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      }
      right={
        <Panel
          title="Output"
          className="flex-1"
          actions={
            <div className="flex items-center gap-2">
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as typeof direction)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="csv-to-json">CSV → JSON</option>
                <option value="json-to-csv">JSON → CSV</option>
              </select>
              {result.ok && <CopyButton value={result.output} />}
            </div>
          }
        >
          {result.ok ? (
            <pre className="h-full overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-800 dark:text-slate-100">
              {result.output}
            </pre>
          ) : (
            <ErrorBanner message={result.error} />
          )}
        </Panel>
      }
    />
  )
}
