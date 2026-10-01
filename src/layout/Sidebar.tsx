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
    <aside className="flex h-full w-64 shrink-0 flex-col gap-3 border-r border-slate-200/80 bg-white/75 p-3 backdrop-blur-xl transition-all duration-300 dark:border-indigo-500/15 dark:bg-[#0a0d1e]/65">
      <NavLink
        to="/"
        className="group flex items-center gap-3 rounded-xl p-1.5 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/60"
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#090909] shadow-sm ring-1 ring-slate-800/80 transition-all group-hover:scale-105 group-hover:ring-indigo-500/40 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]">
          <img
            src="/logo1-crop.png"
            alt="Phong Logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Dev Toolkit
          </span>
          <span className="truncate text-[10.5px] font-medium text-slate-500 dark:text-slate-400">
            Build, solve, learn, evolve.
          </span>
        </div>
      </NavLink>
      <SidebarSearch value={query} onChange={setQuery} />
      <nav className="no-scrollbar flex-1 space-y-4 overflow-y-auto">
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
                          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all',
                          isActive
                            ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/10 font-semibold text-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/30 dark:from-indigo-500/20 dark:to-purple-500/15 dark:text-indigo-300 dark:ring-indigo-500/40 dark:shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70',
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
      <div className="mt-auto border-t border-slate-200/80 px-1 pt-2.5 dark:border-slate-800/80">
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Built with <span className="inline-block select-none transition-transform duration-200 hover:scale-125">❤️</span> by{' '}
          <span className="font-semibold text-slate-600 dark:text-slate-300">Phong</span>
        </p>
      </div>
    </aside>
  )
}
