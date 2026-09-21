import { useMemo, useState } from 'react'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'

interface Segment {
  value: string
  matched: boolean
}

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

  const segments = useMemo<Segment[]>(() => {
    if (!result.ok || result.matches.length === 0) return [{ value: text, matched: false }]
    const parts: Segment[] = []
    let lastIndex = 0
    for (const match of result.matches) {
      if (match.index === undefined || match[0].length === 0) continue
      if (match.index > lastIndex) {
        parts.push({ value: text.slice(lastIndex, match.index), matched: false })
      }
      parts.push({ value: match[0], matched: true })
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < text.length) {
      parts.push({ value: text.slice(lastIndex), matched: false })
    }
    return parts
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
          {segments.map((segment, i) =>
            segment.matched ? (
              <mark key={i} className="rounded bg-amber-200 px-0.5 dark:bg-amber-500/40">
                {segment.value}
              </mark>
            ) : (
              <span key={i}>{segment.value}</span>
            ),
          )}
        </pre>
      </Panel>
    </div>
  )
}
