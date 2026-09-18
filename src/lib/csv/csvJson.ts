import Papa from 'papaparse'

export function csvToJson(csv: string): string {
  const result = Papa.parse(csv.trim(), { header: true, skipEmptyLines: true, dynamicTyping: true })
  if (result.errors.length > 0) {
    throw new Error(result.errors[0].message)
  }
  return JSON.stringify(result.data, null, 2)
}

export function jsonToCsv(json: string): string {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (err) {
    throw new Error(`Invalid JSON: ${(err as Error).message}`)
  }
  const rows = Array.isArray(parsed) ? parsed : [parsed]
  return Papa.unparse(rows)
}
