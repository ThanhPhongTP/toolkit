export interface DecodedJwt {
  header: unknown
  payload: unknown
  signature: string
}

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(segment.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    throw new Error('A JWT must have 3 dot-separated parts (header.payload.signature)')
  }
  const [headerPart, payloadPart, signature] = parts
  let header: unknown
  let payload: unknown
  try {
    header = JSON.parse(base64UrlDecode(headerPart))
  } catch {
    throw new Error('Could not decode/parse header segment')
  }
  try {
    payload = JSON.parse(base64UrlDecode(payloadPart))
  } catch {
    throw new Error('Could not decode/parse payload segment')
  }
  return { header, payload, signature }
}
