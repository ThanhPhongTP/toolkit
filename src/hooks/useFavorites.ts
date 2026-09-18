import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('toolkit:favorites', [])

  const toggleFavorite = useCallback(
    (toolId: string) => {
      setFavorites((prev) =>
        prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId],
      )
    },
    [setFavorites],
  )

  const isFavorite = useCallback((toolId: string) => favorites.includes(toolId), [favorites])

  return { favorites, toggleFavorite, isFavorite }
}
