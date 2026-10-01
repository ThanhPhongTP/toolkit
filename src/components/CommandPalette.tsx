import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  CornerDownLeft,
  Command,
  Home,
  Terminal,
  Sun,
  Moon,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import clsx from 'clsx'
import { searchTools, CATEGORY_LABELS, type ToolDefinition } from '../tools/registry'
import { useTheme } from '../hooks/useTheme'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenMatrix?: () => void
}

interface PaletteAction {
  id: string
  title: string
  subtitle: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  perform: () => void
}

export function CommandPalette({ isOpen, onClose, onOpenMatrix }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  // Reset query and selected index on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // System quick actions
  const systemActions: PaletteAction[] = useMemo(
    () => [
      {
        id: 'action-home',
        title: 'Go to Home Overview',
        subtitle: 'Dashboard with all utilities and favorites',
        category: 'Quick Actions',
        icon: Home,
        perform: () => {
          navigate('/')
          onClose()
        },
      },
      {
        id: 'action-matrix',
        title: 'Launch Matrix Protocol',
        subtitle: 'Enter full-screen retro green digital rain',
        category: 'Quick Actions',
        icon: Terminal,
        perform: () => {
          onClose()
          onOpenMatrix?.()
        },
      },
      {
        id: 'action-theme',
        title: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        subtitle: `Currently in ${theme} mode`,
        category: 'Quick Actions',
        icon: theme === 'dark' ? Sun : Moon,
        perform: () => {
          setTheme(theme === 'dark' ? 'light' : 'dark')
          onClose()
        },
      },
    ],
    [navigate, onClose, onOpenMatrix, theme, setTheme],
  )

  // Filter tools
  const filteredTools = useMemo(() => searchTools(query), [query])

  // Convert tools into actions
  const toolActions: PaletteAction[] = useMemo(
    () =>
      filteredTools.map((tool: ToolDefinition) => ({
        id: `tool-${tool.id}`,
        title: tool.title,
        subtitle: tool.description,
        category: CATEGORY_LABELS[tool.category] || 'Utilities',
        icon: tool.icon,
        perform: () => {
          navigate(`/tools/${tool.id}`)
          onClose()
        },
      })),
    [filteredTools, navigate, onClose],
  )

  // Combined list of actions
  const allActions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return [...systemActions, ...toolActions]
    }
    const matchingSystem = systemActions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    )
    return [...matchingSystem, ...toolActions]
  }, [query, systemActions, toolActions])

  // Clamp selected index
  useEffect(() => {
    setSelectedIndex((prev) => (allActions.length === 0 ? 0 : Math.min(prev, allActions.length - 1)))
  }, [allActions.length])

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`)
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % (allActions.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + (allActions.length || 1)) % (allActions.length || 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (allActions[selectedIndex]) {
          allActions[selectedIndex].perform()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, allActions, selectedIndex, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-[12vh] backdrop-blur-md transition-all duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl backdrop-blur-2xl transition-all dark:border-indigo-500/25 dark:bg-[#0c1024]/95 dark:shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Search Input */}
        <div className="relative flex items-center border-b border-slate-200/80 px-4 py-3 dark:border-indigo-500/15">
          <Search className="mr-3 h-5 w-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Type a command or search tools (e.g. JSON, JWT, Regex, Diff)..."
            className="w-full bg-transparent text-base text-slate-800 placeholder-slate-400 outline-hidden dark:text-slate-100 dark:placeholder-slate-500"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 sm:inline-block dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div ref={listRef} className="no-scrollbar max-h-[380px] overflow-y-auto p-2">
          {allActions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-500">
              <Sparkles className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium">No tools found matching &quot;{query}&quot;</p>
              <p className="mt-1 text-xs">Try searching for keywords like format, encode, decode, or hash</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {allActions.map((action, index) => {
                const isSelected = index === selectedIndex
                const Icon = action.icon
                return (
                  <li
                    key={action.id}
                    data-index={index}
                    onClick={() => action.perform()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={clsx(
                      'group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-150',
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-indigo-500/5 text-indigo-700 shadow-sm ring-1 ring-indigo-500/30 dark:from-indigo-500/25 dark:via-purple-500/15 dark:to-transparent dark:text-indigo-200 dark:ring-indigo-500/40'
                        : 'text-slate-700 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:bg-slate-800/50',
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={clsx(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all',
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold">{action.title}</span>
                        <span className="truncate text-xs text-slate-400 dark:text-slate-400">
                          {action.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 pl-3">
                      <span className="hidden rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 sm:inline-block dark:bg-slate-800/80 dark:text-slate-400">
                        {action.category}
                      </span>
                      {isSelected ? (
                        <div className="flex items-center gap-1 rounded bg-indigo-600/10 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-400/20 dark:text-indigo-300">
                          <span>Open</span>
                          <CornerDownLeft className="h-3 w-3" />
                        </div>
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-600" />
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/70 px-4 py-2 text-[11px] font-medium text-slate-500 backdrop-blur-md dark:border-indigo-500/15 dark:bg-[#080b18]/70 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                ↑
              </kbd>
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[10px] shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <Command className="h-3.5 w-3.5" />
            <span className="font-semibold">Dev Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  )
}
