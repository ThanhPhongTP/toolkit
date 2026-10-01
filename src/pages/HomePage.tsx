import { Link } from 'react-router-dom'
import { ArrowUpRight, Zap } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useRecentTools } from '../hooks/useRecentTools'
import { CATEGORY_LABELS, TOOLS, getToolById, getToolsByCategory, type ToolCategory } from '../tools/registry'

const CATEGORIES: ToolCategory[] = ['workspace', 'dev-utils', 'converters', 'network']

function ToolCard({ tool }: { tool: (typeof TOOLS)[number] }) {
  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group relative flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white/70 p-3.5 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400/80 hover:shadow-[0_8px_25px_rgba(99,102,241,0.12)] dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/60 dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.5)] dark:bg-indigo-500/20 dark:text-indigo-400 dark:ring-indigo-500/30">
            <tool.icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-300">
            {tool.title}
          </span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-500 group-hover:opacity-100 dark:text-slate-500" />
      </div>
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{tool.description}</p>
    </Link>
  )
}

export function HomePage() {
  const { favorites } = useFavorites()
  const { recent } = useRecentTools()

  const favoriteTools = favorites.map(getToolById).filter((tool) => tool !== undefined)
  const recentTools = recent.map(getToolById).filter((tool) => tool !== undefined)

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Header */}
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 backdrop-blur-sm dark:text-indigo-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            100% In-Browser • Zero-Telemetry • Ultra Fast
          </span>
        </div>
        <h1 className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-indigo-200 dark:to-cyan-200">
          Developer Toolkit
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A high-performance suite of client-side utilities engineered for modern development work.
        </p>
      </div>

      {favoriteTools.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Favorites
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {recentTools.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Recently used
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {CATEGORIES.map((category) => (
        <section key={category}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
