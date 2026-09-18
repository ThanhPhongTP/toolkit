import type { ReactNode } from 'react'
import clsx from 'clsx'

interface PanelProps {
  title?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function Panel({ title, actions, children, className }: PanelProps) {
  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800">
          {title && <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>}
          {actions}
        </div>
      )}
      <div className="flex-1 p-3">{children}</div>
    </div>
  )
}
