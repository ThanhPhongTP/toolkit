export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

export interface HttpHeader {
  key: string
  value: string
}

export interface HttpRequestModel {
  method: HttpMethod
  url: string
  headers: HttpHeader[]
  body: string
}

export function createEmptyRequest(): HttpRequestModel {
  return { method: 'GET', url: '', headers: [], body: '' }
}

export interface HttpResponseSummary {
  status: number
  statusText: string
  headers: HttpHeader[]
  body: string
  durationMs: number
}

export const DEFAULT_CORS_PROXY_TEMPLATE = 'https://corsproxy.io/?url={url}'

export function applyCorsProxy(url: string, proxyTemplate: string): string {
  if (!proxyTemplate.trim()) return url
  const encoded = encodeURIComponent(url)
  return proxyTemplate.includes('{url}') ? proxyTemplate.replace('{url}', encoded) : proxyTemplate + encoded
}

export async function sendHttpRequest(
  request: HttpRequestModel,
  fetchUrl: string = request.url,
): Promise<HttpResponseSummary> {
  const start = performance.now()
  const headers: Record<string, string> = {}
  for (const h of request.headers) {
    if (h.key.trim()) headers[h.key] = h.value
  }
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD' && request.body.trim() !== ''
  const response = await fetch(fetchUrl, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
  })
  const body = await response.text()
  const responseHeaders: HttpHeader[] = []
  response.headers.forEach((value, key) => responseHeaders.push({ key, value }))
  return {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    body,
    durationMs: Math.round(performance.now() - start),
  }
}
