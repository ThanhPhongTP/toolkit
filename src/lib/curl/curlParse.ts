import type { HttpMethod, HttpRequestModel } from '../http/requestModel'

function tokenize(command: string): string[] {
  const tokens: string[] = []
  let current = ''
  let quote: '"' | "'" | null = null
  let i = 0
  while (i < command.length) {
    const char = command[i]
    if (quote) {
      if (char === quote) {
        quote = null
      } else if (char === '\\' && quote === '"' && i + 1 < command.length) {
        current += command[i + 1]
        i++
      } else {
        current += char
      }
    } else if (char === '"' || char === "'") {
      quote = char
    } else if (char === '\\' && i + 1 < command.length) {
      const nextChar = command[i + 1]
      if (nextChar === '\n') {
        // Line continuation ("\" at end of line): swallow it, don't split or insert a token.
        i++
      } else if (nextChar === '\r' && command[i + 2] === '\n') {
        i += 2
      } else {
        current += nextChar
        i++
      }
    } else if (/\s/.test(char)) {
      if (current) {
        tokens.push(current)
        current = ''
      }
    } else {
      current += char
    }
    i++
  }
  if (current) tokens.push(current)
  return tokens
}

export function parseCurlCommand(command: string): HttpRequestModel {
  if (!command.trim().startsWith('curl')) {
    throw new Error('Command must start with "curl"')
  }
  const tokens = tokenize(command.trim())
  if (tokens[0] === 'curl') tokens.shift()

  const headers: { key: string; value: string }[] = []
  let method: HttpMethod | undefined
  let url = ''
  let body = ''

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    switch (token) {
      case '-X':
      case '--request':
        method = tokens[++i]?.toUpperCase() as HttpMethod
        break
      case '-H':
      case '--header': {
        const value = tokens[++i] ?? ''
        const separatorIndex = value.indexOf(':')
        if (separatorIndex !== -1) {
          headers.push({
            key: value.slice(0, separatorIndex).trim(),
            value: value.slice(separatorIndex + 1).trim(),
          })
        }
        break
      }
      case '-d':
      case '--data':
      case '--data-raw':
      case '--data-binary':
        body = tokens[++i] ?? ''
        break
      case '-u':
      case '--user':
        headers.push({ key: 'Authorization', value: `Basic ${btoa(tokens[++i] ?? '')}` })
        break
      case '--url':
        url = tokens[++i] ?? ''
        break
      default:
        if (!token.startsWith('-') && !url) {
          url = token
        }
    }
  }

  if (!url) {
    throw new Error('Could not find a URL in the curl command')
  }
  if (!method) {
    method = body ? 'POST' : 'GET'
  }

  return { method, url, headers, body }
}
