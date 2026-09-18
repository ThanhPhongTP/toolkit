import { Star } from 'lucide-react'
import clsx from 'clsx'
import { useFavorites } from '../hooks/useFavorites'

interface ToolPageHeaderProps {
  toolId: string
  title: string
  description: string
}

export function ToolPageHeader({ toolId, title, description }: ToolPageHeaderProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(toolId)

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => toggleFavorite(toolId)}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        className={clsx(
          'rounded-md p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800',
          favorite ? 'text-amber-500' : 'text-slate-400',
        )}
      >
        <Star className="h-5 w-5" fill={favorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}
