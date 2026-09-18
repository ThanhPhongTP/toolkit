import { describe, expect, it } from 'vitest'
import { decodeBase64, encodeBase64 } from './base64'

describe('base64', () => {
  it('round-trips ASCII text', () => {
    expect(decodeBase64(encodeBase64('hello world'))).toBe('hello world')
  })

  it('round-trips UTF-8 text (emoji, accents)', () => {
    const input = 'Xin chào 👋 café'
    expect(decodeBase64(encodeBase64(input))).toBe(input)
  })

  it('produces known encodings', () => {
    expect(encodeBase64('hello')).toBe('aGVsbG8=')
    expect(decodeBase64('aGVsbG8=')).toBe('hello')
  })
})
