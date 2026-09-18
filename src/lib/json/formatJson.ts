export interface FormatJsonResult {
  ok: boolean
  output: string
  error?: string
}

export function formatJson(input: string, indent = 2): FormatJsonResult {
  if (input.trim() === '') {
    return { ok: false, output: '', error: 'Input is empty' }
  }
  try {
    const parsed = JSON.parse(input)
    return { ok: true, output: JSON.stringify(parsed, null, indent) }
  } catch (err) {
    return { ok: false, output: '', error: (err as Error).message }
  }
}

export function minifyJson(input: string): FormatJsonResult {
  if (input.trim() === '') {
    return { ok: false, output: '', error: 'Input is empty' }
  }
  try {
    const parsed = JSON.parse(input)
    return { ok: true, output: JSON.stringify(parsed) }
  } catch (err) {
    return { ok: false, output: '', error: (err as Error).message }
  }
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input)
    return { valid: true }
  } catch (err) {
    return { valid: false, error: (err as Error).message }
  }
}
