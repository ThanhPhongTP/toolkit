import { describe, expect, it } from 'vitest'
import { hslToRgb, parseHex, rgbToHex, rgbToHsl, rgbToHsv } from './colorConvert'

describe('parseHex', () => {
  it('parses 6-digit hex', () => {
    expect(parseHex('#3B82F6')).toEqual({ r: 59, g: 130, b: 246 })
  })

  it('parses 3-digit shorthand hex', () => {
    expect(parseHex('#3bf')).toEqual({ r: 51, g: 187, b: 255 })
  })

  it('throws for invalid hex', () => {
    expect(() => parseHex('not-a-color')).toThrow()
  })
})

describe('rgbToHex', () => {
  it('round-trips with parseHex', () => {
    expect(rgbToHex(parseHex('#3B82F6'))).toBe('#3B82F6')
  })
})

describe('rgb <-> hsl', () => {
  it('converts pure red', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 })
  })

  it('round-trips rgb -> hsl -> rgb', () => {
    const rgb = { r: 59, g: 130, b: 246 }
    const back = hslToRgb(rgbToHsl(rgb))
    expect(back.r).toBeCloseTo(rgb.r, -1)
    expect(back.g).toBeCloseTo(rgb.g, -1)
    expect(back.b).toBeCloseTo(rgb.b, -1)
  })
})

describe('rgbToHsv', () => {
  it('converts pure white', () => {
    expect(rgbToHsv({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, v: 100 })
  })

  it('converts pure black', () => {
    expect(rgbToHsv({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, v: 0 })
  })
})
