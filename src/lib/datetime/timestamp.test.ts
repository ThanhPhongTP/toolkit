import { describe, expect, it } from 'vitest'
import { describeDate, parseDateInput, parseUnixTimestamp } from './timestamp'

describe('parseUnixTimestamp', () => {
  it('treats 10-digit values as seconds', () => {
    expect(parseUnixTimestamp('1516239022').getTime()).toBe(1516239022000)
  })

  it('treats 13-digit values as milliseconds', () => {
    expect(parseUnixTimestamp('1516239022000').getTime()).toBe(1516239022000)
  })

  it('rejects non-numeric input', () => {
    expect(() => parseUnixTimestamp('not-a-number')).toThrow()
  })
})

describe('parseDateInput', () => {
  it('parses numeric strings as unix timestamps', () => {
    expect(parseDateInput('1516239022').getTime()).toBe(1516239022000)
  })

  it('parses ISO date strings', () => {
    expect(parseDateInput('2018-01-18T01:30:22.000Z').getTime()).toBe(1516239022000)
  })

  it('throws on unparseable input', () => {
    expect(() => parseDateInput('not a date at all !!')).toThrow()
  })
})

describe('describeDate', () => {
  it('produces iso/utc/unix fields for a known date', () => {
    const result = describeDate(new Date('2018-01-18T01:30:22.000Z'))
    expect(result.iso).toBe('2018-01-18T01:30:22.000Z')
    expect(result.unixSeconds).toBe(1516239022)
    expect(result.unixMillis).toBe(1516239022000)
  })

  it('throws for an invalid date', () => {
    expect(() => describeDate(new Date('not a date'))).toThrow()
  })
})
