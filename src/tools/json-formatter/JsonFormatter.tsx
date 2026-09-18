import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { TwoColumnLayout } from '../../components/TwoColumnLayout'
import { formatJson, minifyJson } from '../../lib/json/formatJson'

const SAMPLE = '{"name":"Ada Lovelace","born":1815,"tags":["mathematician","programmer"]}'

export function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE)
  const [indent, setIndent] = useState(2)
  const [mode, setMode] = useState<'pretty' | 'minify'>('pretty')

  const result = useMemo(
    () => (mode === 'pretty' ? formatJson(input, indent) : minifyJson(input)),
    [input, indent, mode],
  )

  return (
    <TwoColumnLayout
      left={
        <TextAreaField
          label="Input JSON"
          showCharCount
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON here..."
        />
      }
      right={
        <Panel
          title="Output"
          className="flex-1"
          actions={
            <div className="flex items-center gap-2">
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'pretty' | 'minify')}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="pretty">Pretty</option>
                <option value="minify">Minify</option>
              </select>
              {mode === 'pretty' && (
                <select
                  value={indent}
                  onChange={(e) => setIndent(Number(e.target.value))}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              )}
              <CopyButton value={result.output} />
            </div>
          }
        >
          {result.ok ? (
            <pre className="h-full overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-800 dark:text-slate-100">
              {result.output}
            </pre>
          ) : (
            <ErrorBanner message={result.error ?? 'Invalid JSON'} />
          )}
        </Panel>
      }
    />
  )
}
