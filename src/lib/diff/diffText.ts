import { diffLines, diffWords } from 'diff'

export type DiffMode = 'lines' | 'words'

export interface DiffPart {
  value: string
  added?: boolean
  removed?: boolean
}

export function computeDiff(before: string, after: string, mode: DiffMode): DiffPart[] {
  const diff = mode === 'lines' ? diffLines(before, after) : diffWords(before, after)
  return diff.map((part) => ({ value: part.value, added: part.added, removed: part.removed }))
}

export interface SplitDiffLine {
  value: string
  type: 'added' | 'removed' | 'context'
}

export interface SplitDiffRow {
  left: SplitDiffLine | null
  right: SplitDiffLine | null
}

function splitIntoLines(value: string): string[] {
  const lines = value.split('\n')
  if (lines.length > 1 && lines[lines.length - 1] === '') {
    lines.pop()
  }
  return lines
}

export function computeSplitDiff(before: string, after: string): SplitDiffRow[] {
  const diff = diffLines(before, after)
  const rows: SplitDiffRow[] = []
  let i = 0
  while (i < diff.length) {
    const part = diff[i]
    if (part.removed) {
      const removedLines = splitIntoLines(part.value)
      const next = diff[i + 1]
      const addedLines = next?.added ? splitIntoLines(next.value) : []
      const max = Math.max(removedLines.length, addedLines.length)
      for (let j = 0; j < max; j++) {
        rows.push({
          left: j < removedLines.length ? { value: removedLines[j], type: 'removed' } : null,
          right: j < addedLines.length ? { value: addedLines[j], type: 'added' } : null,
        })
      }
      i += next?.added ? 2 : 1
      continue
    }
    if (part.added) {
      for (const line of splitIntoLines(part.value)) {
        rows.push({ left: null, right: { value: line, type: 'added' } })
      }
      i += 1
      continue
    }
    for (const line of splitIntoLines(part.value)) {
      rows.push({
        left: { value: line, type: 'context' },
        right: { value: line, type: 'context' },
      })
    }
    i += 1
  }
  return rows
}
