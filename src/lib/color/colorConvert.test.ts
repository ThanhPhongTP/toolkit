import { describe, expect, it } from 'vitest'
import {
  formatAndroidComposeColor,
  formatAndroidXmlColor,
  formatSwiftUIColor,
  formatUIColor,
  hslToRgb,
  parseHex,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from './colorConvert'

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

describe('formatUIColor', () => {
  it('formats as a UIKit UIColor initializer with 0-1 channels', () => {
    expect(formatUIColor({ r: 59, g: 130, b: 246 })).toBe('UIColor(red: 0.231, green: 0.51, blue: 0.965, alpha: 1.0)')
  })

  it('formats pure white as 1.0 channels', () => {
    expect(formatUIColor({ r: 255, g: 255, b: 255 })).toBe('UIColor(red: 1, green: 1, blue: 1, alpha: 1.0)')
  })
})

describe('formatSwiftUIColor', () => {
  it('formats as a SwiftUI Color initializer with 0-1 channels', () => {
    expect(formatSwiftUIColor({ r: 59, g: 130, b: 246 })).toBe('Color(red: 0.231, green: 0.51, blue: 0.965)')
  })
})

describe('formatAndroidComposeColor', () => {
  it('formats as a Jetpack Compose Color(0xFFRRGGBB)', () => {
    expect(formatAndroidComposeColor({ r: 59, g: 130, b: 246 })).toBe('Color(0xFF3B82F6)')
  })
})

describe('formatAndroidXmlColor', () => {
  it('formats as an Android XML color resource', () => {
    expect(formatAndroidXmlColor({ r: 59, g: 130, b: 246 })).toBe('<color name="my_color">#3B82F6</color>')
  })
})
