import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { decodeJwt } from '../../lib/jwt/decodeJwt'

export function JwtDecoderTool() {
  const [input, setInput] = useState('')

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, header: '', payload: '' }
    try {
      const decoded = decodeJwt(input)
      return {
        ok: true as const,
        header: JSON.stringify(decoded.header, null, 2),
        payload: JSON.stringify(decoded.payload, null, 2),
      }
    } catch (err) {
      return { ok: false as const, error: (err as Error).message }
    }
  }, [input])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <TextAreaField
        label="JWT"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a JWT (header.payload.signature)..."
        className="min-h-[6rem] flex-none"
      />
      {!result.ok && <ErrorBanner message={result.error} />}
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Header" actions={result.ok && <CopyButton value={result.header} />}>
          <pre className="h-full overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-800 dark:text-slate-100">
            {result.ok ? result.header : ''}
          </pre>
        </Panel>
        <Panel title="Payload" actions={result.ok && <CopyButton value={result.payload} />}>
          <pre className="h-full overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-800 dark:text-slate-100">
            {result.ok ? result.payload : ''}
          </pre>
        </Panel>
      </div>
    </div>
  )
}
