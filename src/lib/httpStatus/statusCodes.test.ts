import { describe, expect, it } from 'vitest'
import { findHttpStatus, searchHttpStatuses } from './statusCodes'

describe('findHttpStatus', () => {
  it('finds a known status code', () => {
    expect(findHttpStatus(404)?.text).toBe('Not Found')
  })

  it('returns undefined for an unknown code', () => {
    expect(findHttpStatus(999)).toBeUndefined()
  })
})

describe('searchHttpStatuses', () => {
  it('matches by partial code', () => {
    expect(searchHttpStatuses('40').some((s) => s.code === 404)).toBe(true)
  })

  it('matches by text', () => {
    expect(searchHttpStatuses('teapot').length).toBe(0)
    expect(searchHttpStatuses('not found').some((s) => s.code === 404)).toBe(true)
  })

  it('returns all statuses for an empty query', () => {
    expect(searchHttpStatuses('').length).toBeGreaterThan(20)
  })
})
