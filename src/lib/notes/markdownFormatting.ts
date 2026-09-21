export type FormatAction =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bold'
  | 'italic'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'inlineCode'
  | 'codeBlock'
  | 'link'

export interface FormatResult {
  value: string
  selectionStart: number
  selectionEnd: number
}

function wrapSelection(value: string, start: number, end: number, marker: string): FormatResult {
  const selected = value.slice(start, end)
  const next = value.slice(0, start) + marker + selected + marker + value.slice(end)
  return {
    value: next,
    selectionStart: start + marker.length,
    selectionEnd: start + marker.length + selected.length,
  }
}

function wrapBlock(value: string, start: number, end: number, fence: string): FormatResult {
  const selected = value.slice(start, end)
  const insertion = `${fence}\n${selected}\n${fence}`
  const next = value.slice(0, start) + insertion + value.slice(end)
  const selectionStart = start + fence.length + 1
  return { value: next, selectionStart, selectionEnd: selectionStart + selected.length }
}

function getLineRange(value: string, start: number, end: number): { lineStart: number; lineEnd: number } {
  const lineStart = value.lastIndexOf('\n', Math.max(start - 1, 0)) + 1
  const nextBreak = value.indexOf('\n', end)
  const lineEnd = nextBreak === -1 ? value.length : nextBreak
  return { lineStart, lineEnd }
}

function prefixLines(
  value: string,
  start: number,
  end: number,
  makePrefix: (lineIndex: number) => string,
): FormatResult {
  const { lineStart, lineEnd } = getLineRange(value, start, end)
  const segment = value.slice(lineStart, lineEnd)
  const lines = segment.split('\n')
  const prefixed = lines.map((line, i) => `${makePrefix(i)}${line}`).join('\n')
  const next = value.slice(0, lineStart) + prefixed + value.slice(lineEnd)
  return {
    value: next,
    selectionStart: start + makePrefix(0).length,
    selectionEnd: end + (prefixed.length - segment.length),
  }
}

function insertLink(value: string, start: number, end: number): FormatResult {
  const selected = value.slice(start, end) || 'link text'
  const next = value.slice(0, start) + `[${selected}](url)` + value.slice(end)
  const urlStart = start + selected.length + 3
  return { value: next, selectionStart: urlStart, selectionEnd: urlStart + 3 }
}

export function applyFormatting(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  action: FormatAction,
): FormatResult {
  switch (action) {
    case 'bold':
      return wrapSelection(value, selectionStart, selectionEnd, '**')
    case 'italic':
      return wrapSelection(value, selectionStart, selectionEnd, '_')
    case 'inlineCode':
      return wrapSelection(value, selectionStart, selectionEnd, '`')
    case 'codeBlock':
      return wrapBlock(value, selectionStart, selectionEnd, '```')
    case 'h1':
      return prefixLines(value, selectionStart, selectionEnd, () => '# ')
    case 'h2':
      return prefixLines(value, selectionStart, selectionEnd, () => '## ')
    case 'h3':
      return prefixLines(value, selectionStart, selectionEnd, () => '### ')
    case 'quote':
      return prefixLines(value, selectionStart, selectionEnd, () => '> ')
    case 'bulletList':
      return prefixLines(value, selectionStart, selectionEnd, () => '- ')
    case 'numberedList':
      return prefixLines(value, selectionStart, selectionEnd, (i) => `${i + 1}. `)
    case 'link':
      return insertLink(value, selectionStart, selectionEnd)
  }
}
