import md5 from 'md5'

export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

export const HASH_ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function computeHash(input: string, algorithm: HashAlgorithm): Promise<string> {
  if (algorithm === 'MD5') {
    return md5(input)
  }
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest(algorithm, bytes)
  return bufferToHex(digest)
}

export function generateUuid(): string {
  return crypto.randomUUID()
}
