import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { TwoColumnLayout } from '../../components/TwoColumnLayout'
import { decodeBase64, encodeBase64 } from '../../lib/base64/base64'

export function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    if (!input) return { ok: true, output: '' }
    try {
      return { ok: true, output: mode === 'encode' ? encodeBase64(input) : decodeBase64(input) }
    } catch (err) {
      return { ok: false, output: '', error: (err as Error).message || 'Invalid Base64 input' }
    }
  }, [input, mode])

  return (
    <TwoColumnLayout
      left={
        <TextAreaField
          label={mode === 'encode' ? 'Plain text' : 'Base64 text'}
          showCharCount
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 to decode...'}
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
                onChange={(e) => setMode(e.target.value as 'encode' | 'decode')}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="encode">Encode</option>
                <option value="decode">Decode</option>
              </select>
              <CopyButton value={result.output} />
            </div>
          }
        >
          {result.ok ? (
            <pre className="h-full overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-800 dark:text-slate-100">
              {result.output}
            </pre>
          ) : (
            <ErrorBanner message={result.error ?? 'Invalid input'} />
          )}
        </Panel>
      }
    />
  )
}
