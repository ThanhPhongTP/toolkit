function toWords(input: string): string[] {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[\s_\-.]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())
}

export function toCamelCase(input: string): string {
  const words = toWords(input)
  return words
    .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('')
}

export function toPascalCase(input: string): string {
  return toWords(input)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

export function toSnakeCase(input: string): string {
  return toWords(input).join('_')
}

export function toKebabCase(input: string): string {
  return toWords(input).join('-')
}

export function toConstantCase(input: string): string {
  return toWords(input).join('_').toUpperCase()
}

export function toTitleCase(input: string): string {
  return toWords(input)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function toSentenceCase(input: string): string {
  const words = toWords(input).join(' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export const CASE_CONVERTERS = {
  camelCase: toCamelCase,
  PascalCase: toPascalCase,
  snake_case: toSnakeCase,
  'kebab-case': toKebabCase,
  CONSTANT_CASE: toConstantCase,
  'Title Case': toTitleCase,
  'Sentence case': toSentenceCase,
} as const
