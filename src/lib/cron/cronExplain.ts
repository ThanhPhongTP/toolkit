import cronstrue from 'cronstrue'
import { CronExpressionParser } from 'cron-parser'

export interface CronExplanation {
  description: string
  nextRuns: string[]
}

export function explainCron(expression: string, count = 5): CronExplanation {
  const trimmed = expression.trim()
  if (!trimmed) {
    throw new Error('Enter a cron expression, e.g. "0 9 * * 1-5"')
  }
  const description = cronstrue.toString(trimmed)
  const interval = CronExpressionParser.parse(trimmed)
  const nextRuns = Array.from({ length: count }, () => interval.next().toDate().toISOString())
  return { description, nextRuns }
}
