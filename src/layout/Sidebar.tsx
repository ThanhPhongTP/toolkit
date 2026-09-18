import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { CATEGORY_LABELS, searchTools, type ToolCategory } from '../tools/registry'
import { SidebarSearch } from './SidebarSearch'

const CATEGORIES: ToolCategory[] = ['workspace', 'dev-utils', 'converters', 'network']

export function Sidebar() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => searchTools(query), [query])

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-3 border-r border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <NavLink to="/" className="px-1 text-base font-bold text-slate-900 dark:text-slate-100">
        Dev Toolkit
      </NavLink>
      <SidebarSearch value={query} onChange={setQuery} />
      <nav className="flex-1 space-y-4 overflow-y-auto">
        {CATEGORIES.map((category) => {
          const tools = filtered.filter((tool) => tool.category === category)
          if (tools.length === 0) return null
          return (
            <div key={category}>
              <h4 className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {CATEGORY_LABELS[category]}
              </h4>
              <ul className="space-y-0.5">
                {tools.map((tool) => (
                  <li key={tool.id}>
                    <NavLink
                      to={`/tools/${tool.id}`}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition',
                          isActive
                            ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                        )
                      }
                    >
                      <tool.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{tool.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="px-2 text-sm text-slate-400">No tools match "{query}"</p>
        )}
      </nav>
    </aside>
  )
}
