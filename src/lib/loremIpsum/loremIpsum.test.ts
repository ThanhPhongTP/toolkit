import { describe, expect, it } from 'vitest'
import { generateLoremIpsum } from './loremIpsum'

describe('generateLoremIpsum', () => {
  it('generates the requested number of words', () => {
    const result = generateLoremIpsum(10, 'words', false)
    const words = result.replace(/\.$/, '').split(' ')
    expect(words).toHaveLength(10)
  })

  it('starts with "Lorem ipsum" when requested', () => {
    const result = generateLoremIpsum(5, 'words', true)
    expect(result.toLowerCase().startsWith('lorem ipsum')).toBe(true)
  })

  it('generates the requested number of sentences', () => {
    const result = generateLoremIpsum(3, 'sentences', false)
    const sentences = result.split('. ').filter(Boolean)
    expect(sentences).toHaveLength(3)
  })

  it('generates the requested number of paragraphs', () => {
    const result = generateLoremIpsum(2, 'paragraphs', false)
    expect(result.split('\n\n')).toHaveLength(2)
  })

  it('throws for a non-positive count', () => {
    expect(() => generateLoremIpsum(0, 'words')).toThrow()
  })
})
