import { describe, expect, it } from 'vitest'
import { countRemaining, createTodo, removeTodo, sortTodos, toggleTodo } from './notes'

describe('createTodo', () => {
  it('creates an item with the given text, undone', () => {
    const item = createTodo('Fix the sidebar')
    expect(item.text).toBe('Fix the sidebar')
    expect(item.done).toBe(false)
    expect(item.id).toBeTruthy()
  })

  it('throws for empty text', () => {
    expect(() => createTodo('   ')).toThrow()
  })
})

describe('toggleTodo', () => {
  it('flips the done state of the matching item only', () => {
    const a = createTodo('a')
    const b = createTodo('b')
    const result = toggleTodo([a, b], a.id)
    expect(result.find((i) => i.id === a.id)?.done).toBe(true)
    expect(result.find((i) => i.id === b.id)?.done).toBe(false)
  })
})

describe('removeTodo', () => {
  it('removes the matching item', () => {
    const a = createTodo('a')
    const b = createTodo('b')
    expect(removeTodo([a, b], a.id)).toEqual([b])
  })
})

describe('sortTodos', () => {
  it('puts undone items before done items, oldest first within each group', () => {
    const a = { id: '1', text: 'a', done: true, createdAt: 1 }
    const b = { id: '2', text: 'b', done: false, createdAt: 2 }
    const c = { id: '3', text: 'c', done: false, createdAt: 1 }
    expect(sortTodos([a, b, c]).map((i) => i.id)).toEqual(['3', '2', '1'])
  })
})

describe('countRemaining', () => {
  it('counts only the undone items', () => {
    const a = createTodo('a')
    const b = createTodo('b')
    const doneB = toggleTodo([a, b], b.id)
    expect(countRemaining(doneB)).toBe(1)
  })
})
