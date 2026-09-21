import { useEffect, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { computeHash, generateUuid, HASH_ALGORITHMS, type HashAlgorithm } from '../../lib/hash/hash'

const EMPTY_HASHES: Record<HashAlgorithm, string> = {
  MD5: '',
  'SHA-1': '',
  'SHA-256': '',
  'SHA-384': '',
  'SHA-512': '',
}

export function UuidHashTool() {
  const [uuid, setUuid] = useState(generateUuid())
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>(EMPTY_HASHES)

  useEffect(() => {
    if (!input) return
    let cancelled = false
    Promise.all(HASH_ALGORITHMS.map((algo) => computeHash(input, algo))).then((results) => {
      if (cancelled) return
      const next = {} as Record<HashAlgorithm, string>
      HASH_ALGORITHMS.forEach((algo, i) => {
        next[algo] = results[i]
      })
      setHashes(next)
    })
    return () => {
      cancelled = true
    }
  }, [input])

  const displayedHashes = input ? hashes : EMPTY_HASHES

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Panel
        title="UUID v4"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUuid(generateUuid())}
              className="rounded-md border border-slate-300 px-2.5 py-1 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Regenerate
            </button>
            <CopyButton value={uuid} />
          </div>
        }
      >
        <code className="font-mono text-lg text-slate-800 dark:text-slate-100">{uuid}</code>
      </Panel>

      <TextAreaField
        label="Text to hash"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type text to compute its hashes..."
        className="min-h-[6rem]"
      />

      <div className="grid gap-3">
        {HASH_ALGORITHMS.map((algo) => (
          <Panel key={algo} title={algo} actions={<CopyButton value={displayedHashes[algo]} />}>
            <code className="block break-all font-mono text-sm text-slate-700 dark:text-slate-200">
              {displayedHashes[algo] || '—'}
            </code>
          </Panel>
        ))}
      </div>
    </div>
  )
}
