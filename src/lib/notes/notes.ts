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

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

const UNTITLED_NOTE = 'Ghi chú không tiêu đề'
const TITLE_MAX_LENGTH = 40

export function deriveNoteTitle(content: string): string {
  const firstLine = content.split('\n').find((line) => line.trim() !== '')?.trim()
  if (!firstLine) return UNTITLED_NOTE
  return firstLine.length > TITLE_MAX_LENGTH ? `${firstLine.slice(0, TITLE_MAX_LENGTH)}…` : firstLine
}

export function createNote(content: string): Note {
  const now = Date.now()
  return { id: crypto.randomUUID(), title: deriveNoteTitle(content), content, createdAt: now, updatedAt: now }
}

export function updateNoteContent(notes: Note[], id: string, content: string): Note[] {
  return notes.map((note) =>
    note.id === id ? { ...note, content, title: deriveNoteTitle(content), updatedAt: Date.now() } : note,
  )
}

export function removeNote(notes: Note[], id: string): Note[] {
  return notes.filter((note) => note.id !== id)
}

export function sortNotesByUpdated(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.updatedAt - a.updatedAt)
}
