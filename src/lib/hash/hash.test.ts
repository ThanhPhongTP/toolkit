import { describe, expect, it } from 'vitest'
import { computeHash, generateUuid } from './hash'

describe('computeHash', () => {
  it('computes known SHA-256 test vector', async () => {
    expect(await computeHash('abc', 'SHA-256')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })

  it('computes known MD5 test vector', async () => {
    expect(await computeHash('abc', 'MD5')).toBe('900150983cd24fb0d6963f7d28e17f72')
  })

  it('computes known SHA-1 test vector', async () => {
    expect(await computeHash('abc', 'SHA-1')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
  })
})

describe('generateUuid', () => {
  it('generates a valid v4 UUID', () => {
    const uuid = generateUuid()
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('generates unique values across calls', () => {
    expect(generateUuid()).not.toBe(generateUuid())
  })
})
