import { dump, load } from 'js-yaml'

export function yamlToJson(yamlText: string): string {
  const parsed = load(yamlText)
  return JSON.stringify(parsed, null, 2)
}

export function jsonToYaml(jsonText: string): string {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch (err) {
    throw new Error(`Invalid JSON: ${(err as Error).message}`)
  }
  return dump(parsed)
}
