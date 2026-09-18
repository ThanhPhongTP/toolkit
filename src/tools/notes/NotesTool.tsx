import { useMemo, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import clsx from 'clsx'
import { TextAreaField } from '../../components/TextAreaField'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { countRemaining, createTodo, removeTodo, sortTodos, toggleTodo, type TodoItem } from '../../lib/notes/notes'

function TodoTab() {
  const [items, setItems] = useLocalStorage<TodoItem[]>('toolkit:notes-todos', [])
  const [draft, setDraft] = useState('')
  // Mirrors `draft` but is mutated synchronously, so a second Enter/click that fires
  // before React re-renders (e.g. fast key auto-repeat) can't reuse the same text twice.
  const draftRef = useRef('')

  const sorted = useMemo(() => sortTodos(items), [items])
  const remaining = countRemaining(items)

  const handleDraftChange = (value: string) => {
    draftRef.current = value
    setDraft(value)
  }

  const handleAdd = () => {
    const text = draftRef.current
    if (!text.trim()) return
    draftRef.current = ''
    setDraft('')
    setItems((prev) => [...prev, createTodo(text)])
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => handleDraftChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Việc cần làm hoặc thứ cần thay đổi..."
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!draft.trim()}
          className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <p className="text-xs text-slate-400">
        {remaining} việc chưa xong / {items.length} tổng
      </p>

      <ul className="flex flex-col gap-1">
        {sorted.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => setItems((prev) => toggleTodo(prev, item.id))}
              className="h-4 w-4 shrink-0 accent-indigo-600"
            />
            <span
              className={clsx(
                'flex-1 break-all text-sm',
                item.done ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100',
              )}
            >
              {item.text}
            </span>
            <button
              type="button"
              onClick={() => setItems((prev) => removeTodo(prev, item.id))}
              className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {items.length === 0 && <p className="py-4 text-center text-sm text-slate-400">Chưa có việc nào.</p>}
      </ul>
    </div>
  )
}

function ScratchpadTab() {
  const [text, setText] = useLocalStorage('toolkit:notes-scratchpad', '')

  return (
    <TextAreaField
      label="Ghi chú tự do (tự động lưu)"
      showCharCount
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Viết bất cứ điều gì bạn muốn nhớ..."
      className="min-h-[24rem] flex-1"
    />
  )
}

export function NotesTool() {
  const [tab, setTab] = useState<'todo' | 'scratchpad'>('todo')

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="inline-flex w-fit rounded-md border border-slate-200 p-0.5 dark:border-slate-800">
        {(['todo', 'scratchpad'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={clsx(
              'rounded px-3 py-1 text-sm font-medium transition',
              tab === t
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
            )}
          >
            {t === 'todo' ? 'Todo list' : 'Ghi chú tự do'}
          </button>
        ))}
      </div>
      {tab === 'todo' ? <TodoTab /> : <ScratchpadTab />}
    </div>
  )
}
