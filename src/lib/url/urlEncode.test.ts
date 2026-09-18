import { describe, expect, it } from 'vitest'
import { decodeFullUrl, decodeUrlComponent, encodeFullUrl, encodeUrlComponent } from './urlEncode'

describe('urlEncode', () => {
  it('encodes/decodes a component', () => {
    const input = 'a b&c=d'
    const encoded = encodeUrlComponent(input)
    expect(encoded).toBe('a%20b%26c%3Dd')
    expect(decodeUrlComponent(encoded)).toBe(input)
  })

  it('encodes/decodes a full URL without mangling protocol delimiters', () => {
    const input = 'https://example.com/a b?x=1&y=2'
    const encoded = encodeFullUrl(input)
    expect(encoded).toContain('https://example.com')
    expect(decodeFullUrl(encoded)).toBe(input)
  })
})
