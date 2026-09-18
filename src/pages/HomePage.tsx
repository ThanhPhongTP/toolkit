import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { useRecentTools } from '../hooks/useRecentTools'
import { CATEGORY_LABELS, TOOLS, getToolById, getToolsByCategory, type ToolCategory } from '../tools/registry'

const CATEGORIES: ToolCategory[] = ['dev-utils', 'converters', 'network']

function ToolCard({ tool }: { tool: (typeof TOOLS)[number] }) {
  return (
    <Link
      to={`/tools/${tool.id}`}
      className="flex flex-col gap-1.5 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      <div className="flex items-center gap-2">
        <tool.icon className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{tool.title}</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{tool.description}</p>
    </Link>
  )
}

export function HomePage() {
  const { favorites } = useFavorites()
  const { recent } = useRecentTools()

  const favoriteTools = favorites.map(getToolById).filter((tool) => tool !== undefined)
  const recentTools = recent.map(getToolById).filter((tool) => tool !== undefined)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Developer Toolkit</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A collection of small utilities for everyday development work.
        </p>
      </div>

      {favoriteTools.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Favorites</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {recentTools.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Recently used</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {CATEGORIES.map((category) => (
        <section key={category}>
          <h2 className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {CATEGORY_LABELS[category]}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {getToolsByCategory(category).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
