import { describe, expect, it } from 'vitest'
import { explainCron } from './cronExplain'

describe('explainCron', () => {
  it('explains a common cron expression', () => {
    const result = explainCron('0 9 * * 1-5')
    expect(result.description.toLowerCase()).toContain('9')
    expect(result.nextRuns).toHaveLength(5)
  })

  it('throws for empty input', () => {
    expect(() => explainCron('')).toThrow()
  })

  it('throws for an invalid expression', () => {
    expect(() => explainCron('not a cron')).toThrow()
  })
})
