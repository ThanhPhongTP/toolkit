export function encodeUrlComponent(input: string): string {
  return encodeURIComponent(input)
}

export function decodeUrlComponent(input: string): string {
  return decodeURIComponent(input)
}

export function encodeFullUrl(input: string): string {
  return encodeURI(input)
}

export function decodeFullUrl(input: string): string {
  return decodeURI(input)
}
