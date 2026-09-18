import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const MAX_RECENT = 8

export function useRecentTools() {
  const [recent, setRecent] = useLocalStorage<string[]>('toolkit:recent', [])

  const markVisited = useCallback(
    (toolId: string) => {
      setRecent((prev) => [toolId, ...prev.filter((id) => id !== toolId)].slice(0, MAX_RECENT))
    },
    [setRecent],
  )

  return { recent, markVisited }
}
