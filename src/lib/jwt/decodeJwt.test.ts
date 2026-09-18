import { describe, expect, it } from 'vitest'
import { decodeJwt } from './decodeJwt'

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('decodeJwt', () => {
  it('decodes header and payload of a well-formed token', () => {
    const result = decodeJwt(SAMPLE_JWT)
    expect(result.header).toEqual({ alg: 'HS256', typ: 'JWT' })
    expect(result.payload).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 })
    expect(result.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  })

  it('throws for a token without 3 parts', () => {
    expect(() => decodeJwt('not.a.jwt.token')).toThrow()
    expect(() => decodeJwt('onlyonepart')).toThrow()
  })

  it('throws for malformed base64 segments', () => {
    expect(() => decodeJwt('!!!.!!!.sig')).toThrow()
  })
})
