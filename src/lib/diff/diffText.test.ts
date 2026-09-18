import { describe, expect, it } from 'vitest'
import { computeDiff } from './diffText'

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
