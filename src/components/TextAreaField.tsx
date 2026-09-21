import { forwardRef, type TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  showCharCount?: boolean
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(function TextAreaField(
  { label, showCharCount, className, value, ...props },
  ref,
) {
  const length = typeof value === 'string' ? value.length : 0
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      {(label || showCharCount) && (
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {label && <span className="font-medium">{label}</span>}
          {showCharCount && <span>{length} chars</span>}
        </div>
      )}
      <textarea
        ref={ref}
        value={value}
        spellCheck={false}
        className={clsx(
          'flex-1 resize-none rounded-md border border-slate-300 bg-white p-3 font-mono text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
          className,
        )}
        {...props}
      />
    </div>
  )
})
