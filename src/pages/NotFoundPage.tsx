import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Not found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">This tool doesn't exist.</p>
      <Link to="/" className="mt-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
        Back to home
      </Link>
    </div>
  )
}
