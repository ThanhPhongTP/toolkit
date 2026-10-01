import { Search } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface TopBarProps {
  onOpenCommandPalette: () => void
}

export function TopBar({ onOpenCommandPalette }: TopBarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/70 px-4 backdrop-blur-xl transition-all duration-300 dark:border-indigo-500/15 dark:bg-[#0a0d1e]/60">
      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/60 px-3 py-1.5 text-xs text-slate-500 backdrop-blur-sm transition-all hover:border-indigo-400 hover:bg-white hover:text-slate-700 dark:border-slate-800/80 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-indigo-500/60 dark:hover:bg-slate-900/80 dark:hover:text-slate-200"
      >
        <Search className="h-3.5 w-3.5 text-indigo-500" />
        <span className="hidden sm:inline">Search tools & actions...</span>
        <span className="inline sm:hidden">Search...</span>
        <kbd className="ml-1 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          ⌘K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
