import { describe, expect, it } from 'vitest'
import { createTextHistory, pushHistoryEntry, redo, undo, type TextHistory } from './textHistory'

function entry(value: string, at = value.length): { value: string; selectionStart: number; selectionEnd: number } {
  return { value, selectionStart: at, selectionEnd: at }
}

describe('textHistory', () => {
  it('undo returns null when there is nothing before the initial entry', () => {
    const history = createTextHistory(entry(''))
    expect(undo(history)).toBeNull()
  })

  it('redo returns null when already at the most recent entry', () => {
    const history = createTextHistory(entry(''))
    expect(redo(history)).toBeNull()
  })

  it('coalesces rapid edits into a single undo step', () => {
    let history: TextHistory = createTextHistory(entry(''))
    history = pushHistoryEntry(history, entry('H'), true, 100)
    history = pushHistoryEntry(history, entry('He'), true, 200)
    history = pushHistoryEntry(history, entry('Hel'), true, 300)

    expect(history.entries.map((e) => e.value)).toEqual(['', 'Hel'])

    const step = undo(history)
    expect(step?.entry.value).toBe('')
  })

  it('starts a new undo step once the coalesce window has elapsed', () => {
    let history: TextHistory = createTextHistory(entry(''))
    history = pushHistoryEntry(history, entry('H'), true, 0)
    history = pushHistoryEntry(history, entry('He'), true, 5000)

    expect(history.entries.map((e) => e.value)).toEqual(['', 'H', 'He'])
  })

  it('always starts a new step for a non-coalesced edit (e.g. a toolbar action)', () => {
    let history: TextHistory = createTextHistory(entry(''))
    history = pushHistoryEntry(history, entry('a'), true, 0)
    history = pushHistoryEntry(history, entry('**a**'), false, 10)

    expect(history.entries.map((e) => e.value)).toEqual(['', 'a', '**a**'])
  })

  it('steps backward and forward through history via undo/redo', () => {
    let history: TextHistory = createTextHistory(entry(''))
    history = pushHistoryEntry(history, entry('a'), false, 0)
    history = pushHistoryEntry(history, entry('ab'), false, 10)

    const undoStep = undo(history)
    expect(undoStep?.entry.value).toBe('a')
    history = undoStep!.history

    const redoStep = redo(history)
    expect(redoStep?.entry.value).toBe('ab')
  })

  it('discards the redo branch once a new edit is made after undoing', () => {
    let history: TextHistory = createTextHistory(entry(''))
    history = pushHistoryEntry(history, entry('a'), false, 0)
    history = pushHistoryEntry(history, entry('ab'), false, 10)

    const undoStep = undo(history)!
    history = undoStep.history // back to 'a', with 'ab' still available as redo

    history = pushHistoryEntry(history, entry('ax'), false, 20)
    expect(history.entries.map((e) => e.value)).toEqual(['', 'a', 'ax'])
    expect(redo(history)).toBeNull()
  })

  it('defaults to the real clock when no explicit time is given', () => {
    let history: TextHistory = createTextHistory(entry(''))
    history = pushHistoryEntry(history, entry('a'), false)
    expect(history.lastEditAt).toBeGreaterThan(0)
  })
})
