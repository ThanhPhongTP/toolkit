import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
