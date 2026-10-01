import { ThemeToggle } from './ThemeToggle'

export function TopBar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-end border-b border-slate-200/80 bg-white/70 px-4 backdrop-blur-xl transition-all duration-300 dark:border-indigo-500/15 dark:bg-[#0a0d1e]/60">
      <ThemeToggle />
    </header>
  )
}
