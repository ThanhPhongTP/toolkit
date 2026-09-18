export interface TodoItem {
  id: string
  text: string
  done: boolean
  createdAt: number
}

export function createTodo(text: string): TodoItem {
  const trimmed = text.trim()
  if (!trimmed) throw new Error('Todo text cannot be empty')
  return { id: crypto.randomUUID(), text: trimmed, done: false, createdAt: Date.now() }
}

export function toggleTodo(items: TodoItem[], id: string): TodoItem[] {
  return items.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
}

export function removeTodo(items: TodoItem[], id: string): TodoItem[] {
  return items.filter((item) => item.id !== id)
}

export function sortTodos(items: TodoItem[]): TodoItem[] {
  return [...items].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    return a.createdAt - b.createdAt
  })
}

export function countRemaining(items: TodoItem[]): number {
  return items.filter((item) => !item.done).length
}
