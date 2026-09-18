import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { TwoColumnLayout } from '../../components/TwoColumnLayout'
import {
  decodeFullUrl,
  decodeUrlComponent,
  encodeFullUrl,
  encodeUrlComponent,
} from '../../lib/url/urlEncode'

type Mode = 'encode-component' | 'decode-component' | 'encode-full' | 'decode-full'

const HANDLERS: Record<Mode, (s: string) => string> = {
  'encode-component': encodeUrlComponent,
  'decode-component': decodeUrlComponent,
  'encode-full': encodeFullUrl,
  'decode-full': decodeFullUrl,
}

export function UrlEncoderTool() {
  const [mode, setMode] = useState<Mode>('encode-component')
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    if (!input) return { ok: true, output: '' }
    try {
      return { ok: true, output: HANDLERS[mode](input) }
    } catch (err) {
      return { ok: false, output: '', error: (err as Error).message || 'Invalid input' }
    }
  }, [input, mode])

  return (
    <TwoColumnLayout
      left={
        <TextAreaField
          label="Input"
          showCharCount
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a URL or text..."
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
                onChange={(e) => setMode(e.target.value as Mode)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="encode-component">Encode component</option>
                <option value="decode-component">Decode component</option>
                <option value="encode-full">Encode full URL</option>
                <option value="decode-full">Decode full URL</option>
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
