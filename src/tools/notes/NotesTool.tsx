import { useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Plus,
  Quote,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import clsx from 'clsx'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { applyFormatting, type FormatAction } from '../../lib/notes/markdownFormatting'
import {
  createTextHistory,
  pushHistoryEntry,
  redo as redoHistory,
  undo as undoHistory,
  type HistoryEntry,
  type TextHistory,
} from '../../lib/notes/textHistory'
import {
  countRemaining,
  createNote,
  createTodo,
  removeNote,
  removeTodo,
  sortNotesByUpdated,
  sortTodos,
  toggleTodo,
  updateNoteContent,
  type Note,
  type TodoItem,
} from '../../lib/notes/notes'

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

  const handleDraftKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // While an IME composition is still open (e.g. typing a Vietnamese word that hasn't
    // been finalized with a space yet), the key that confirms the composition also fires
    // as a keydown with key 'Enter'. Acting on that keydown adds the not-yet-finalized
    // text, then the real Enter that follows adds it again. Ignore Enter while composing
    // (isComposing, or keyCode 229 for browsers that don't set isComposing) so only the
    // real, post-composition Enter triggers the add.
    if (e.key !== 'Enter' || e.nativeEvent.isComposing || e.keyCode === 229) return
    handleAdd()
  }

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => handleDraftChange(e.target.value)}
          onKeyDown={handleDraftKeyDown}
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

const LEGACY_SCRATCHPAD_KEY = 'toolkit:notes-scratchpad'

function migrateLegacyScratchpad(): Note[] {
  try {
    if (window.localStorage.getItem('toolkit:notes-list')) return []
    const legacy = window.localStorage.getItem(LEGACY_SCRATCHPAD_KEY)
    if (!legacy) return []
    const content = JSON.parse(legacy) as string
    return content.trim() ? [createNote(content)] : []
  } catch {
    return []
  }
}

function formatUpdatedAt(ts: number): string {
  const diffMs = Date.now() - ts
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  if (diffMs < minute) return 'Vừa xong'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} phút trước`
  if (diffMs < day) return `${Math.floor(diffMs / hour)} giờ trước`
  return `${Math.floor(diffMs / day)} ngày trước`
}

interface ToolbarButtonConfig {
  action: FormatAction
  icon: LucideIcon
  label: string
}

const TOOLBAR_BUTTONS: ToolbarButtonConfig[] = [
  { action: 'h1', icon: Heading1, label: 'Tiêu đề 1' },
  { action: 'h2', icon: Heading2, label: 'Tiêu đề 2' },
  { action: 'h3', icon: Heading3, label: 'Tiêu đề 3' },
  { action: 'bold', icon: Bold, label: 'In đậm' },
  { action: 'italic', icon: Italic, label: 'In nghiêng' },
  { action: 'bulletList', icon: List, label: 'Danh sách gạch đầu dòng' },
  { action: 'numberedList', icon: ListOrdered, label: 'Danh sách đánh số' },
  { action: 'quote', icon: Quote, label: 'Trích dẫn' },
  { action: 'inlineCode', icon: Code, label: 'Code (inline)' },
  { action: 'codeBlock', icon: Code2, label: 'Khối code' },
  { action: 'link', icon: LinkIcon, label: 'Chèn liên kết' },
]

function NotesListTab() {
  const [notes, setNotes] = useLocalStorage<Note[]>('toolkit:notes-list', migrateLegacyScratchpad)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // Native browser undo/redo tracks *trusted* keystrokes and gets wiped whenever we set
  // `.value`/selection from JS (as the formatting toolbar does), so Cmd+Z/Cmd+Shift+Z would
  // otherwise silently stop working after the first toolbar click. We keep our own history instead.
  const historyRef = useRef<TextHistory>(createTextHistory({ value: '', selectionStart: 0, selectionEnd: 0 }))

  const sorted = useMemo(() => sortNotesByUpdated(notes), [notes])
  const selectedNote = notes.find((n) => n.id === selectedId)
  const isDirty = selectedNote ? draft !== selectedNote.content : draft.trim() !== ''

  const confirmDiscard = () => {
    if (!isDirty) return true
    return window.confirm('Bạn có thay đổi chưa lưu. Rời đi và bỏ thay đổi này?')
  }

  const resetHistory = (value: string) => {
    historyRef.current = createTextHistory({ value, selectionStart: value.length, selectionEnd: value.length })
  }

  const applyHistoryEntry = (entry: HistoryEntry) => {
    setDraft(entry.value)
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(entry.selectionStart, entry.selectionEnd)
    })
  }

  const commitDraft = (value: string, selectionStart: number, selectionEnd: number, coalesce: boolean) => {
    historyRef.current = pushHistoryEntry(historyRef.current, { value, selectionStart, selectionEnd }, coalesce)
    setDraft(value)
  }

  const handleUndo = () => {
    const step = undoHistory(historyRef.current)
    if (!step) return
    historyRef.current = step.history
    applyHistoryEntry(step.entry)
  }

  const handleRedo = () => {
    const step = redoHistory(historyRef.current)
    if (!step) return
    historyRef.current = step.history
    applyHistoryEntry(step.entry)
  }

  const handleEditorKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.metaKey && !e.ctrlKey) return
    const key = e.key.toLowerCase()
    if (key === 'z' && e.shiftKey) {
      e.preventDefault()
      handleRedo()
    } else if (key === 'z') {
      e.preventDefault()
      handleUndo()
    } else if (key === 'y') {
      e.preventDefault()
      handleRedo()
    } else if (key === 'a') {
      // Belt-and-suspenders: guarantee select-all works even if the browser's native
      // handling is ever short-circuited (e.g. by the selection restore above).
      e.preventDefault()
      e.currentTarget.select()
    }
  }

  const handleDraftChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    commitDraft(e.target.value, e.target.selectionStart, e.target.selectionEnd, true)
  }

  const handleSelect = (note: Note) => {
    if (note.id === selectedId) return
    if (!confirmDiscard()) return
    setSelectedId(note.id)
    setDraft(note.content)
    resetHistory(note.content)
  }

  const handleNew = () => {
    if (!confirmDiscard()) return
    setSelectedId(null)
    setDraft('')
    resetHistory('')
  }

  const handleSave = () => {
    if (!draft.trim()) return
    if (selectedNote) {
      setNotes((prev) => updateNoteContent(prev, selectedNote.id, draft))
    } else {
      const note = createNote(draft)
      setNotes((prev) => [...prev, note])
      setSelectedId(note.id)
    }
  }

  const handleDelete = (note: Note) => {
    setNotes((prev) => removeNote(prev, note.id))
    if (note.id === selectedId) {
      setSelectedId(null)
      setDraft('')
      resetHistory('')
    }
  }

  const handleFormat = (action: FormatAction) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart ?? draft.length
    const end = textarea.selectionEnd ?? draft.length
    const result = applyFormatting(draft, start, end, action)
    commitDraft(result.value, result.selectionStart, result.selectionEnd, false)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd)
    })
  }

  return (
    <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center justify-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Ghi chú mới
        </button>
        <ul className="flex flex-1 flex-col gap-1 overflow-auto">
          {sorted.map((note) => (
            <li key={note.id}>
              <div
                onClick={() => handleSelect(note)}
                className={clsx(
                  'flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left',
                  note.id === selectedId
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800',
                )}
              >
                <div className="flex w-full items-center gap-2">
                  <span className="flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                    {note.title}
                  </span>
                  <button
                    type="button"
                    aria-label="Xoá ghi chú"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(note)
                    }}
                    className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">{formatUpdatedAt(note.updatedAt)}</span>
              </div>
            </li>
          ))}
          {notes.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-400">Chưa có ghi chú nào.</p>
          )}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex rounded-md border border-slate-200 p-0.5 dark:border-slate-800">
            {(['edit', 'preview'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={clsx(
                  'rounded px-2.5 py-1 text-xs font-medium transition',
                  mode === m
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                {m === 'edit' ? 'Soạn thảo' : 'Xem trước'}
              </button>
            ))}
          </div>
        </div>

        {mode === 'edit' && (
          <div className="flex flex-wrap gap-0.5 rounded-md border border-slate-200 p-1 dark:border-slate-800">
            {TOOLBAR_BUTTONS.map(({ action, icon: Icon, label }) => (
              <button
                key={action}
                type="button"
                title={label}
                aria-label={label}
                onClick={() => handleFormat(action)}
                className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        )}

        {mode === 'edit' ? (
          <TextAreaField
            ref={textareaRef}
            label={selectedNote ? selectedNote.title : 'Ghi chú mới'}
            showCharCount
            value={draft}
            onChange={handleDraftChange}
            onKeyDown={handleEditorKeyDown}
            placeholder="Viết bất cứ điều gì bạn muốn nhớ, rồi bấm Lưu... hỗ trợ Markdown (tiêu đề, danh sách, link, code...)"
            className="min-h-[20rem] flex-1"
          />
        ) : (
          <Panel title={selectedNote ? selectedNote.title : 'Ghi chú mới'} className="min-h-[20rem] flex-1 overflow-auto">
            <article className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft || '_Chưa có nội dung._'}</ReactMarkdown>
            </article>
          </Panel>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{isDirty ? 'Chưa lưu' : 'Đã lưu'}</span>
          <button
            type="button"
            onClick={handleSave}
            disabled={!draft.trim() || !isDirty}
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
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
      {tab === 'todo' ? <TodoTab /> : <NotesListTab />}
    </div>
  )
}
