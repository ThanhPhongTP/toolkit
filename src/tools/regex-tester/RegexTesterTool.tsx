import { useMemo, useState } from 'react'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'

export function RegexTesterTool() {
  const [pattern, setPattern] = useState('\\b[\\w.-]+@[\\w.-]+\\.\\w+\\b')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('Contact us at hello@example.com or support@example.org.')

  const result = useMemo(() => {
    if (!pattern) return { ok: true as const, matches: [] as RegExpMatchArray[] }
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      const matches = Array.from(text.matchAll(regex))
      return { ok: true as const, matches }
    } catch (err) {
      return { ok: false as const, error: (err as Error).message }
    }
  }, [pattern, flags, text])

  const highlighted = useMemo(() => {
    if (!result.ok || result.matches.length === 0) return text
    const parts: string[] = []
    let lastIndex = 0
    for (const match of result.matches) {
      if (match.index === undefined || match[0].length === 0) continue
      parts.push(text.slice(lastIndex, match.index))
      parts.push(`${match[0]}`)
      lastIndex = match.index + match[0].length
    }
    parts.push(text.slice(lastIndex))
    return parts.join('')
  }, [result, text])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center gap-1 rounded-md border border-slate-300 bg-white px-2 dark:border-slate-700 dark:bg-slate-900">
          <span className="text-slate-400">/</span>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="flex-1 bg-transparent py-1.5 font-mono text-sm outline-none"
            placeholder="pattern"
          />
          <span className="text-slate-400">/</span>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-14 bg-transparent py-1.5 font-mono text-sm outline-none"
            placeholder="flags"
          />
        </div>
        {result.ok && (
          <span className="flex items-center rounded-md bg-slate-100 px-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {result.matches.length} match{result.matches.length === 1 ? '' : 'es'}
          </span>
        )}
      </div>
      {!result.ok && <ErrorBanner message={result.error} />}
      <TextAreaField
        label="Test text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[8rem]"
      />
      <Panel title="Highlighted matches" className="flex-1">
        <pre className="h-full overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-800 dark:text-slate-100">
          {highlighted.split(/|/).map((chunk, i) =>
            i % 2 === 1 ? (
              <mark key={i} className="rounded bg-amber-200 px-0.5 dark:bg-amber-500/40">
                {chunk}
              </mark>
            ) : (
              <span key={i}>{chunk}</span>
            ),
          )}
        </pre>
      </Panel>
    </div>
  )
}
