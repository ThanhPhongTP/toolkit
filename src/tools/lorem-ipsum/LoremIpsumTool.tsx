import { useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { Panel } from '../../components/Panel'
import { generateLoremIpsum } from '../../lib/loremIpsum/loremIpsum'

export function LoremIpsumTool() {
  const [count, setCount] = useState(3)
  const [unit, setUnit] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState(() => generateLoremIpsum(3, 'paragraphs', true))

  const regenerate = () => setOutput(generateLoremIpsum(count, unit, startWithLorem))

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Count</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as typeof unit)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
        </div>
        <label className="flex items-center gap-1.5 pb-1.5 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
          />
          Start with "Lorem ipsum"
        </label>
        <button
          type="button"
          onClick={regenerate}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Generate
        </button>
      </div>
      <Panel title="Output" className="flex-1" actions={<CopyButton value={output} />}>
        <p className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100">{output}</p>
      </Panel>
    </div>
  )
}
