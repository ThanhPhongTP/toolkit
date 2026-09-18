import { describe, expect, it } from 'vitest'
import { csvToJson, jsonToCsv } from './csvJson'

describe('csvToJson', () => {
  it('converts CSV with headers to an array of objects', () => {
    const result = JSON.parse(csvToJson('name,age\nAda,30\nAlan,41'))
    expect(result).toEqual([
      { name: 'Ada', age: 30 },
      { name: 'Alan', age: 41 },
    ])
  })
})

describe('jsonToCsv', () => {
  it('converts an array of objects to CSV', () => {
    const csv = jsonToCsv(JSON.stringify([{ name: 'Ada', age: 30 }]))
    expect(csv).toBe('name,age\r\nAda,30')
  })

  it('throws for invalid JSON', () => {
    expect(() => jsonToCsv('not json')).toThrow()
  })
})
