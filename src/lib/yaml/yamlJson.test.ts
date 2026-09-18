import { describe, expect, it } from 'vitest'
import { jsonToYaml, yamlToJson } from './yamlJson'

describe('yamlToJson', () => {
  it('converts simple YAML to JSON', () => {
    const result = JSON.parse(yamlToJson('name: Ada\nage: 30'))
    expect(result).toEqual({ name: 'Ada', age: 30 })
  })

  it('throws for malformed YAML', () => {
    expect(() => yamlToJson('name: [unclosed')).toThrow()
  })
})

describe('jsonToYaml', () => {
  it('converts JSON to YAML', () => {
    const yaml = jsonToYaml(JSON.stringify({ name: 'Ada', age: 30 }))
    expect(yaml).toBe('name: Ada\nage: 30\n')
  })

  it('throws for invalid JSON', () => {
    expect(() => jsonToYaml('not json')).toThrow()
  })
})
