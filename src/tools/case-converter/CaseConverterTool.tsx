import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { CASE_CONVERTERS } from '../../lib/caseConverter/caseConverter'

export function CaseConverterTool() {
  const [input, setInput] = useState('hello world example')

  const results = useMemo(() => {
    if (!input.trim()) return null
    const entries = Object.entries(CASE_CONVERTERS) as [keyof typeof CASE_CONVERTERS, (s: string) => string][]
    return entries.map(([label, fn]) => [label, fn(input)] as const)
  }, [input])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <TextAreaField
        label="Input text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[5rem]"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {results?.map(([label, value]) => (
          <Panel key={label} title={label} actions={<CopyButton value={value} />}>
            <code className="block break-all font-mono text-sm text-slate-800 dark:text-slate-100">{value}</code>
          </Panel>
        ))}
      </div>
    </div>
  )
}
