export interface HistoryEntry {
  value: string
  selectionStart: number
  selectionEnd: number
}

export interface TextHistory {
  entries: HistoryEntry[]
  index: number
  lastEditAt: number
}

export function createTextHistory(initial: HistoryEntry): TextHistory {
  return { entries: [initial], index: 0, lastEditAt: 0 }
}

const DEFAULT_COALESCE_WINDOW_MS = 700

export function pushHistoryEntry(
  history: TextHistory,
  entry: HistoryEntry,
  coalesce: boolean,
  now: number = Date.now(),
  coalesceWindowMs: number = DEFAULT_COALESCE_WINDOW_MS,
): TextHistory {
  const atTip = history.index === history.entries.length - 1
  // index 0 is the pristine baseline (before any edit) and must never be overwritten,
  // otherwise undo could no longer get back to the state the note started in.
  const canCoalesce = coalesce && atTip && history.index > 0 && now - history.lastEditAt < coalesceWindowMs
  if (canCoalesce) {
    const entries = history.entries.slice(0, history.index)
    entries.push(entry)
    return { entries, index: history.index, lastEditAt: now }
  }
  // A fresh (non-coalesced) edit after undoing drops the abandoned redo branch.
  const entries = history.entries.slice(0, history.index + 1)
  entries.push(entry)
  return { entries, index: entries.length - 1, lastEditAt: now }
}

export interface HistoryStep {
  history: TextHistory
  entry: HistoryEntry
}

export function undo(history: TextHistory): HistoryStep | null {
  if (history.index === 0) return null
  const index = history.index - 1
  return { history: { ...history, index }, entry: history.entries[index] }
}

export function redo(history: TextHistory): HistoryStep | null {
  if (history.index >= history.entries.length - 1) return null
  const index = history.index + 1
  return { history: { ...history, index }, entry: history.entries[index] }
}
