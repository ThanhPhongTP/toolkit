import { describe, expect, it } from 'vitest'
import { computeDiff, computeSplitDiff } from './diffText'

describe('computeDiff', () => {
  it('detects no changes for identical text', () => {
    const parts = computeDiff('hello world', 'hello world', 'words')
    expect(parts.every((p) => !p.added && !p.removed)).toBe(true)
  })

  it('detects added and removed lines', () => {
    const parts = computeDiff('a\nb\nc', 'a\nx\nc', 'lines')
    expect(parts.some((p) => p.removed)).toBe(true)
    expect(parts.some((p) => p.added)).toBe(true)
  })

  it('detects word-level changes', () => {
    const parts = computeDiff('the quick fox', 'the slow fox', 'words')
    expect(parts.some((p) => p.removed && p.value.includes('quick'))).toBe(true)
    expect(parts.some((p) => p.added && p.value.includes('slow'))).toBe(true)
  })
})

describe('computeSplitDiff', () => {
  it('aligns unchanged lines on both sides', () => {
    const rows = computeSplitDiff('a\nb\nc', 'a\nb\nc')
    expect(rows).toHaveLength(3)
    expect(rows.every((r) => r.left?.type === 'context' && r.right?.type === 'context')).toBe(true)
  })

  it('pairs a replaced line side by side instead of stacking it', () => {
    const rows = computeSplitDiff('a\nb\nc', 'a\nx\nc')
    const replaced = rows.find((r) => r.left?.type === 'removed')
    expect(replaced?.left).toEqual({ value: 'b', type: 'removed' })
    expect(replaced?.right).toEqual({ value: 'x', type: 'added' })
  })

  it('leaves the left side empty for a purely added line', () => {
    const rows = computeSplitDiff('a\nc', 'a\nb\nc')
    const added = rows.find((r) => r.right?.type === 'added')
    expect(added?.left).toBeNull()
    expect(added?.right).toEqual({ value: 'b', type: 'added' })
  })

  it('leaves the right side empty for a purely removed line', () => {
    const rows = computeSplitDiff('a\nb\nc', 'a\nc')
    const removed = rows.find((r) => r.left?.type === 'removed')
    expect(removed?.right).toBeNull()
    expect(removed?.left).toEqual({ value: 'b', type: 'removed' })
  })
})
