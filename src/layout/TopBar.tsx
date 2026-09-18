import { ThemeToggle } from './ThemeToggle'

export function TopBar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-end border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
      <ThemeToggle />
    </header>
  )
}
