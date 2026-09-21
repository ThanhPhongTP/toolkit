import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { NotesTool } from './NotesTool'

function getInput() {
  return screen.getByPlaceholderText('Việc cần làm hoặc thứ cần thay đổi...')
}

describe('NotesTool todo list', () => {
  it('adds one item per click', () => {
    render(<NotesTool />)
    fireEvent.change(getInput(), { target: { value: 'Buy milk' } })
    fireEvent.click(screen.getByText('Add'))
    expect(screen.getAllByText('Buy milk')).toHaveLength(1)
  })

  it('adds one item per Enter press', () => {
    render(<NotesTool />)
    fireEvent.change(getInput(), { target: { value: 'Write report' } })
    fireEvent.keyDown(getInput(), { key: 'Enter' })
    expect(screen.getAllByText('Write report')).toHaveLength(1)
  })

  it('does not duplicate the item when Enter fires twice before a re-render (fast key auto-repeat)', () => {
    render(<NotesTool />)
    const input = getInput()
    fireEvent.change(input, { target: { value: 'Fast repeat' } })
    // Two keydown events back-to-back, simulating OS key auto-repeat outrunning React's render.
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getAllByText('Fast repeat')).toHaveLength(1)
  })

  it('clears the input after adding', () => {
    render(<NotesTool />)
    const input = getInput() as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Clear me' } })
    fireEvent.click(screen.getByText('Add'))
    expect(input.value).toBe('')
  })
})

function getNoteEditor() {
  return screen.getByPlaceholderText(
    'Viết bất cứ điều gì bạn muốn nhớ, rồi bấm Lưu... hỗ trợ Markdown (tiêu đề, danh sách, link, code...)',
  ) as HTMLTextAreaElement
}

function openNotesTab() {
  render(<NotesTool />)
  fireEvent.click(screen.getByText('Ghi chú tự do'))
}

// Some sandboxed Node/jsdom combinations expose a non-functional `localStorage` stub
// (missing getItem/setItem/clear). useLocalStorage swallows that via try/catch, so the
// app degrades gracefully, but cross-remount persistence can't be asserted there.
const hasWorkingLocalStorage = (() => {
  try {
    window.localStorage.setItem('__toolkit_probe__', '1')
    const ok = window.localStorage.getItem('__toolkit_probe__') === '1'
    window.localStorage.removeItem('__toolkit_probe__')
    return ok
  } catch {
    return false
  }
})()

describe('NotesTool saved notes', () => {
  beforeEach(() => {
    try {
      window.localStorage.clear()
    } catch {
      // no-op when localStorage is a non-functional stub (see hasWorkingLocalStorage)
    }
  })

  it('does not save until the Lưu button is clicked', () => {
    openNotesTab()
    fireEvent.change(getNoteEditor(), { target: { value: 'Draft note' } })
    expect(screen.getAllByText('Chưa lưu')).toHaveLength(1)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('saves a new note and lists it by its first line as the title', () => {
    openNotesTab()
    fireEvent.change(getNoteEditor(), { target: { value: 'My note title\nmore details' } })
    fireEvent.click(screen.getByText('Lưu'))
    expect(within(screen.getByRole('list')).getAllByText('My note title')).toHaveLength(1)
    expect(screen.getAllByText('Đã lưu')).toHaveLength(1)
    expect((screen.getByText('Lưu') as HTMLButtonElement).disabled).toBe(true)
  })

  it('edits and re-saves an existing note in place', () => {
    openNotesTab()
    fireEvent.change(getNoteEditor(), { target: { value: 'Original title' } })
    fireEvent.click(screen.getByText('Lưu'))

    fireEvent.change(getNoteEditor(), { target: { value: 'Updated title' } })
    fireEvent.click(screen.getByText('Lưu'))

    const list = within(screen.getByRole('list'))
    expect(list.getAllByText('Updated title')).toHaveLength(1)
    expect(list.queryByText('Original title')).toBeNull()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  it('deletes a note from the list', () => {
    openNotesTab()
    fireEvent.change(getNoteEditor(), { target: { value: 'To be deleted' } })
    fireEvent.click(screen.getByText('Lưu'))
    expect(within(screen.getByRole('list')).getAllByText('To be deleted')).toHaveLength(1)

    fireEvent.click(screen.getByLabelText('Xoá ghi chú'))
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('applies bold formatting to the selected text via the toolbar', () => {
    openNotesTab()
    const editor = getNoteEditor()
    fireEvent.change(editor, { target: { value: 'hello world' } })
    editor.setSelectionRange(6, 11)
    fireEvent.click(screen.getByLabelText('In đậm'))
    expect(editor.value).toBe('hello **world**')
  })

  it('undoes a toolbar formatting action with Cmd+Z', () => {
    openNotesTab()
    const editor = getNoteEditor()
    fireEvent.change(editor, { target: { value: 'hello world' } })
    editor.setSelectionRange(6, 11)
    fireEvent.click(screen.getByLabelText('In đậm'))
    expect(editor.value).toBe('hello **world**')

    fireEvent.keyDown(editor, { key: 'z', metaKey: true })
    expect(editor.value).toBe('hello world')
  })

  it('redoes with Cmd+Shift+Z after an undo', () => {
    openNotesTab()
    const editor = getNoteEditor()
    fireEvent.change(editor, { target: { value: 'hello world' } })
    editor.setSelectionRange(6, 11)
    fireEvent.click(screen.getByLabelText('In đậm'))

    fireEvent.keyDown(editor, { key: 'z', metaKey: true })
    expect(editor.value).toBe('hello world')

    fireEvent.keyDown(editor, { key: 'z', metaKey: true, shiftKey: true })
    expect(editor.value).toBe('hello **world**')
  })

  it('selects all text with Cmd+A', () => {
    openNotesTab()
    const editor = getNoteEditor()
    fireEvent.change(editor, { target: { value: 'hello world' } })
    fireEvent.keyDown(editor, { key: 'a', metaKey: true })
    expect(editor.selectionStart).toBe(0)
    expect(editor.selectionEnd).toBe('hello world'.length)
  })

  it('renders Markdown in the preview mode', () => {
    openNotesTab()
    fireEvent.change(getNoteEditor(), { target: { value: '# Heading\n\n- item one\n- item two' } })
    fireEvent.click(screen.getByText('Xem trước'))
    expect(screen.getByRole('heading', { level: 1, name: 'Heading' })).toBeTruthy()
    expect(screen.getByText('item one')).toBeTruthy()
    expect(screen.getByText('item two')).toBeTruthy()
  })

  it.runIf(hasWorkingLocalStorage)('persists saved notes across remounts via localStorage', () => {
    openNotesTab()
    fireEvent.change(getNoteEditor(), { target: { value: 'Persisted note' } })
    fireEvent.click(screen.getByText('Lưu'))

    cleanup()
    openNotesTab()
    expect(screen.getAllByText('Persisted note')).toHaveLength(1)
  })
})
