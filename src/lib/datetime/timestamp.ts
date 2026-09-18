export interface TimestampConversion {
  iso: string
  utc: string
  local: string
  unixSeconds: number
  unixMillis: number
  relative: string
}

function formatRelative(diffMs: number): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
    ['second', 1000],
  ]
  for (const [unit, ms] of units) {
    if (Math.abs(diffMs) >= ms || unit === 'second') {
      return rtf.format(Math.round(diffMs / ms), unit)
    }
  }
  return rtf.format(0, 'second')
}

export function describeDate(date: Date): TimestampConversion {
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }
  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toString(),
    unixSeconds: Math.floor(date.getTime() / 1000),
    unixMillis: date.getTime(),
    relative: formatRelative(date.getTime() - Date.now()),
  }
}

export function parseUnixTimestamp(value: string): Date {
  const trimmed = value.trim()
  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error('Enter a Unix timestamp in seconds or milliseconds')
  }
  const num = Number(trimmed)
  const ms = trimmed.length > 10 ? num : num * 1000
  return new Date(ms)
}

export function parseDateInput(value: string): Date {
  if (/^-?\d+$/.test(value.trim())) {
    return parseUnixTimestamp(value)
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Could not parse date/time input')
  }
  return parsed
}
