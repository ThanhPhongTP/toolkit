import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { TwoColumnLayout } from '../../components/TwoColumnLayout'
import { jsonToYaml, yamlToJson } from '../../lib/yaml/yamlJson'

const SAMPLE_YAML = 'name: Ada\nage: 30\ntags:\n  - mathematician\n  - programmer'

export function YamlJsonTool() {
  const [direction, setDirection] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json')
  const [input, setInput] = useState(SAMPLE_YAML)

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: '' }
    try {
      return {
        ok: true as const,
        output: direction === 'yaml-to-json' ? yamlToJson(input) : jsonToYaml(input),
      }
    } catch (err) {
      return { ok: false as const, error: (err as Error).message }
    }
  }, [input, direction])

  return (
    <TwoColumnLayout
      left={
        <TextAreaField
          label={direction === 'yaml-to-json' ? 'YAML input' : 'JSON input'}
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
                <option value="yaml-to-json">YAML → JSON</option>
                <option value="json-to-yaml">JSON → YAML</option>
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
