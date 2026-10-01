import { Search } from 'lucide-react'

interface SidebarSearchProps {
  value: string
  onChange: (value: string) => void
  onOpenPalette?: () => void
}

export function SidebarSearch({ value, onChange, onOpenPalette }: SidebarSearchProps) {
  return (
    <div className="relative flex items-center">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tools..."
        className="w-full rounded-lg border border-slate-200/90 bg-white/70 py-1.5 pl-8 pr-12 text-sm outline-hidden backdrop-blur-sm transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-100"
      />
      {onOpenPalette && (
        <button
          type="button"
          onClick={onOpenPalette}
          title="Open Command Palette (Cmd + K)"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
        >
          <span>⌘K</span>
        </button>
      )}
    </div>
  )
}
