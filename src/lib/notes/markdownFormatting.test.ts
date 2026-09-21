import { describe, expect, it } from 'vitest'
import { applyFormatting } from './markdownFormatting'

describe('applyFormatting', () => {
  it('wraps a selection in bold markers and selects the inner text', () => {
    const result = applyFormatting('hello world', 6, 11, 'bold')
    expect(result.value).toBe('hello **world**')
    expect(result.value.slice(result.selectionStart, result.selectionEnd)).toBe('world')
  })

  it('wraps a selection in italic markers', () => {
    const result = applyFormatting('hello world', 6, 11, 'italic')
    expect(result.value).toBe('hello _world_')
  })

  it('wraps a selection in inline code backticks', () => {
    const result = applyFormatting('run npm test', 4, 12, 'inlineCode')
    expect(result.value).toBe('run `npm test`')
  })

  it('inserts an empty bold marker pair at the cursor when nothing is selected', () => {
    const result = applyFormatting('hello ', 6, 6, 'bold')
    expect(result.value).toBe('hello ****')
    expect(result.selectionStart).toBe(result.selectionEnd)
    expect(result.selectionStart).toBe(8)
  })

  it('wraps a selection in a fenced code block on its own lines', () => {
    const result = applyFormatting('const x = 1', 0, 11, 'codeBlock')
    expect(result.value).toBe('```\nconst x = 1\n```')
    expect(result.value.slice(result.selectionStart, result.selectionEnd)).toBe('const x = 1')
  })

  it('prefixes the current line with a heading marker', () => {
    const result = applyFormatting('title', 2, 2, 'h1')
    expect(result.value).toBe('# title')
  })

  it('prefixes every line of a multi-line selection with a bullet', () => {
    const result = applyFormatting('a\nb\nc', 0, 5, 'bulletList')
    expect(result.value).toBe('- a\n- b\n- c')
  })

  it('numbers each line of a multi-line selection sequentially', () => {
    const result = applyFormatting('a\nb\nc', 0, 5, 'numberedList')
    expect(result.value).toBe('1. a\n2. b\n3. c')
  })

  it('only prefixes the lines touched by a partial multi-line selection', () => {
    const value = 'keep\nchange1\nchange2\nkeep'
    const start = value.indexOf('change1')
    const end = value.indexOf('change2') + 'change2'.length
    const result = applyFormatting(value, start, end, 'quote')
    expect(result.value).toBe('keep\n> change1\n> change2\nkeep')
  })

  it('turns a selection into a link and selects the url placeholder', () => {
    const result = applyFormatting('see docs here', 4, 8, 'link')
    expect(result.value).toBe('see [docs](url) here')
    expect(result.value.slice(result.selectionStart, result.selectionEnd)).toBe('url')
  })

  it('inserts a placeholder link when nothing is selected', () => {
    const result = applyFormatting('', 0, 0, 'link')
    expect(result.value).toBe('[link text](url)')
    expect(result.value.slice(result.selectionStart, result.selectionEnd)).toBe('url')
  })
})
