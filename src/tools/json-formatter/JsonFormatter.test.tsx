import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { JsonFormatter } from './JsonFormatter'

function getInput() {
  return screen.getByPlaceholderText('Paste JSON here...') as HTMLTextAreaElement
}

function getProcessButton() {
  return screen.getByRole('button', { name: 'Process' })
}

function getOutputPanel() {
  const heading = screen.getByText('Output')
  return heading.parentElement!.parentElement as HTMLElement
}

function getHistoryPanel() {
  const heading = screen.getByText('History')
  return heading.parentElement!.parentElement as HTMLElement
}

function getCheckboxes() {
  return getHistoryPanel().querySelectorAll('input[type="checkbox"]')
}

function getComparePanel() {
  const heading = screen.getByText('Compare')
  return heading.parentElement!.parentElement as HTMLElement
}

describe('JsonFormatter output', () => {
  afterEach(() => {
    cleanup()
  })

  it('shows a placeholder and no output until Process is clicked', () => {
    render(<JsonFormatter />)
    expect(screen.getByText(/Click "Process" to format/)).toBeTruthy()
  })

  it('does not format live while typing', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } })
    expect(screen.getByText(/Click "Process" to format/)).toBeTruthy()
  })

  it('formats and shows output only after clicking Process', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } })
    fireEvent.click(getProcessButton())
    expect(within(getOutputPanel()).getByText(/"a": 1/)).toBeTruthy()
  })

  it('shows an error banner for invalid JSON without changing history', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{not valid' } })
    fireEvent.click(getProcessButton())
    expect(screen.getByText(/Unexpected|not valid|token/i)).toBeTruthy()
  })
})

describe('JsonFormatter history', () => {
  afterEach(() => {
    cleanup()
  })

  it('creates a new history entry each time Process is clicked', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } })
    fireEvent.click(getProcessButton())

    expect(within(getHistoryPanel()).getByText(/"a": 1/)).toBeTruthy()

    fireEvent.click(getProcessButton())
    expect(within(getHistoryPanel()).getAllByText(/"a": 1/)).toHaveLength(2)
  })

  it('does not add history while typing without clicking Process', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } })

    expect(screen.getByText('No JSON formatted yet this session.')).toBeTruthy()
  })

  it('does not record history for invalid JSON', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{not valid' } })
    fireEvent.click(getProcessButton())

    expect(screen.getByText('No JSON formatted yet this session.')).toBeTruthy()
  })

  it('restores input and output when a history entry is selected', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } })
    fireEvent.click(getProcessButton())

    fireEvent.change(getInput(), { target: { value: '{"b":2}' } })
    fireEvent.click(getProcessButton())

    const card = within(getHistoryPanel())
      .getByText(/"a": 1/)
      .closest('li') as HTMLElement
    fireEvent.click(within(card).getByText('Restore'))
    expect(getInput().value).toBe('{"a":1}')
  })

  it('clears history on demand', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } })
    fireEvent.click(getProcessButton())

    fireEvent.click(screen.getByText('Clear history'))
    expect(screen.getByText('No JSON formatted yet this session.')).toBeTruthy()
  })
})

describe('JsonFormatter compare', () => {
  afterEach(() => {
    cleanup()
  })

  it('shows a diff panel once two history entries are checked, highlighting the changed line', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } })
    fireEvent.click(getProcessButton())
    fireEvent.change(getInput(), { target: { value: '{"a":2}' } })
    fireEvent.click(getProcessButton())

    expect(screen.queryByText('Compare')).toBeNull()

    const checkboxes = getCheckboxes()
    expect(checkboxes).toHaveLength(2)
    fireEvent.click(checkboxes[0])
    expect(screen.queryByText('Compare')).toBeNull()

    fireEvent.click(checkboxes[1])
    expect(screen.getByText('Compare')).toBeTruthy()
    expect(within(getComparePanel()).getByText(/"a": 1/)).toBeTruthy()
    expect(within(getComparePanel()).getByText(/"a": 2/)).toBeTruthy()
  })

  it('reports identical entries as having no differences', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } })
    fireEvent.click(getProcessButton())
    fireEvent.click(getProcessButton())

    const checkboxes = getCheckboxes()
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[1])

    expect(screen.getByText('Identical')).toBeTruthy()
  })

  it('closes the compare panel', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } })
    fireEvent.click(getProcessButton())
    fireEvent.click(getProcessButton())

    const checkboxes = getCheckboxes()
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[1])
    expect(screen.getByText('Compare')).toBeTruthy()

    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByText('Compare')).toBeNull()
  })

  it('prevents selecting more than two entries at once', () => {
    render(<JsonFormatter />)
    fireEvent.change(getInput(), { target: { value: '{"a":1}' } })
    fireEvent.click(getProcessButton())
    fireEvent.change(getInput(), { target: { value: '{"a":2}' } })
    fireEvent.click(getProcessButton())
    fireEvent.change(getInput(), { target: { value: '{"a":3}' } })
    fireEvent.click(getProcessButton())

    const checkboxes = getCheckboxes()
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[1])
    expect((checkboxes[2] as HTMLInputElement).disabled).toBe(true)
  })
})
