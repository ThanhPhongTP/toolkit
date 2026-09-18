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
