import { describe, expect, it } from 'vitest'
import {
  toCamelCase,
  toConstantCase,
  toKebabCase,
  toPascalCase,
  toSentenceCase,
  toSnakeCase,
  toTitleCase,
} from './caseConverter'

describe('case converters', () => {
  it('converts from snake_case', () => {
    expect(toCamelCase('hello_world_foo')).toBe('helloWorldFoo')
    expect(toPascalCase('hello_world_foo')).toBe('HelloWorldFoo')
    expect(toKebabCase('hello_world_foo')).toBe('hello-world-foo')
  })

  it('converts from kebab-case', () => {
    expect(toSnakeCase('hello-world-foo')).toBe('hello_world_foo')
    expect(toConstantCase('hello-world-foo')).toBe('HELLO_WORLD_FOO')
  })

  it('converts from camelCase', () => {
    expect(toSnakeCase('helloWorldFoo')).toBe('hello_world_foo')
    expect(toKebabCase('helloWorldFoo')).toBe('hello-world-foo')
  })

  it('handles acronyms reasonably', () => {
    expect(toSnakeCase('parseHTMLString')).toBe('parse_html_string')
  })

  it('converts to Title Case and Sentence case', () => {
    expect(toTitleCase('hello_world')).toBe('Hello World')
    expect(toSentenceCase('hello_world foo')).toBe('Hello world foo')
  })

  it('handles space separated words', () => {
    expect(toCamelCase('Hello World Foo')).toBe('helloWorldFoo')
  })
})
