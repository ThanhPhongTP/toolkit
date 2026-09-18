import { describe, expect, it } from 'vitest'
import { generateCurlCommand } from './curlGenerate'
import { parseCurlCommand } from './curlParse'

describe('generateCurlCommand', () => {
  it('generates a simple GET request', () => {
    const cmd = generateCurlCommand({ method: 'GET', url: 'https://api.example.com/users', headers: [], body: '' })
    expect(cmd).toBe("curl 'https://api.example.com/users'")
  })

  it('includes method, headers, and body for a POST request', () => {
    const cmd = generateCurlCommand({
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      body: '{"name":"Ada"}',
    })
    expect(cmd).toContain('-X POST')
    expect(cmd).toContain("-H 'Content-Type: application/json'")
    expect(cmd).toContain(`-d '{"name":"Ada"}'`)
  })
})

describe('parseCurlCommand', () => {
  it('parses a basic GET curl command', () => {
    const result = parseCurlCommand("curl 'https://api.example.com/users'")
    expect(result).toEqual({ method: 'GET', url: 'https://api.example.com/users', headers: [], body: '' })
  })

  it('parses method, headers, and data flags', () => {
    const result = parseCurlCommand(
      `curl -X POST https://api.example.com/users -H "Content-Type: application/json" -H "Authorization: Bearer abc" -d '{"name":"Ada"}'`,
    )
    expect(result.method).toBe('POST')
    expect(result.url).toBe('https://api.example.com/users')
    expect(result.headers).toEqual([
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer abc' },
    ])
    expect(result.body).toBe('{"name":"Ada"}')
  })

  it('infers POST when a data flag is present without -X', () => {
    const result = parseCurlCommand(`curl https://api.example.com/users -d 'a=1'`)
    expect(result.method).toBe('POST')
  })

  it('throws for a command that does not start with curl', () => {
    expect(() => parseCurlCommand('wget https://example.com')).toThrow()
  })

  it('throws when no URL can be found', () => {
    expect(() => parseCurlCommand('curl -X GET')).toThrow()
  })

  it('round-trips with generateCurlCommand', () => {
    const original = {
      method: 'POST' as const,
      url: 'https://api.example.com/users',
      headers: [{ key: 'X-Test', value: 'value' }],
      body: 'plain body',
    }
    const parsed = parseCurlCommand(generateCurlCommand(original))
    expect(parsed).toEqual(original)
  })
})
