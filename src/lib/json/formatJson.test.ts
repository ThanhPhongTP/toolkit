import { describe, expect, it } from 'vitest'
import { formatJson, minifyJson, validateJson } from './formatJson'

describe('formatJson', () => {
  it('pretty-prints valid JSON', () => {
    const result = formatJson('{"a":1,"b":[1,2,3]}')
    expect(result.ok).toBe(true)
    expect(result.output).toBe('{\n  "a": 1,\n  "b": [\n    1,\n    2,\n    3\n  ]\n}')
  })

  it('returns an error for invalid JSON', () => {
    const result = formatJson('{a:1}')
    expect(result.ok).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('flags empty input', () => {
    const result = formatJson('   ')
    expect(result.ok).toBe(false)
  })
})

describe('minifyJson', () => {
  it('removes whitespace from valid JSON', () => {
    const result = minifyJson('{\n  "a": 1\n}')
    expect(result.ok).toBe(true)
    expect(result.output).toBe('{"a":1}')
  })
})

describe('validateJson', () => {
  it('validates correct JSON', () => {
    expect(validateJson('[1,2,3]').valid).toBe(true)
  })

  it('rejects malformed JSON', () => {
    expect(validateJson('[1,2,').valid).toBe(false)
  })
})
