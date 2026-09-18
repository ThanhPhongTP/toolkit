import type { HttpRequestModel } from '../http/requestModel'

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`
}

export function generateCurlCommand(request: HttpRequestModel): string {
  const parts = ['curl']
  if (request.method !== 'GET') {
    parts.push('-X', request.method)
  }
  for (const header of request.headers) {
    if (!header.key.trim()) continue
    parts.push('-H', shellQuote(`${header.key}: ${header.value}`))
  }
  if (request.body.trim() && request.method !== 'GET' && request.method !== 'HEAD') {
    parts.push('-d', shellQuote(request.body))
  }
  parts.push(shellQuote(request.url))
  return parts.join(' ')
}
