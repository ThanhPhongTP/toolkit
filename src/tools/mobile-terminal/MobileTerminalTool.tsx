import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { CopyButton } from '../../components/CopyButton'
import { Panel } from '../../components/Panel'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import {
  PARAMS,
  PLATFORM_LABELS,
  fillCommand,
  searchMobileCommands,
  type MobileCommand,
  type MobilePlatform,
  type ParamValues,
} from '../../lib/mobileCommands/mobileCommands'

type PlatformFilter = MobilePlatform | 'all'

const PLATFORM_FILTERS: PlatformFilter[] = ['all', 'react-native', 'flutter', 'android', 'ios']

const INPUT_CLASS =
  'w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900'

function CommandText({ command }: { command: string }) {
  // Highlight placeholders that still have no value so they stand out before copying.
  const parts = command.split(/(\{\{\w+(?:\|cap)?\}\})/g)
  return (
    <code className="block font-mono text-sm break-all whitespace-pre-wrap text-slate-800 dark:text-slate-100">
      {parts.map((part, i) =>
        part.startsWith('{{') ? (
          <span key={i} className="rounded bg-amber-100 px-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </code>
  )
}

export function MobileTerminalTool() {
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useLocalStorage<PlatformFilter>('toolkit:mobile-terminal-platform', 'all')
  const [values, setValues] = useLocalStorage<ParamValues>('toolkit:mobile-terminal-params', {})

  const results = useMemo(
    () => searchMobileCommands(query, platform === 'all' ? undefined : platform),
    [query, platform],
  )

  const visibleParams = useMemo(() => {
    const used = new Set(results.flatMap((c) => c.params))
    return PARAMS.filter((p) => used.has(p.key))
  }, [results])

  const groups = useMemo(() => {
    const map = new Map<string, MobileCommand[]>()
    for (const command of results) {
      const key = `${PLATFORM_LABELS[command.platform]} · ${command.group}`
      map.set(key, [...(map.get(key) ?? []), command])
    }
    return [...map.entries()]
  }, [results])

  const hasValues = Object.values(values).some((v) => v?.trim())

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex w-fit flex-wrap rounded-md border border-slate-200 p-0.5 dark:border-slate-800">
          {PLATFORM_FILTERS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={clsx(
                'rounded px-3 py-1 text-sm font-medium transition',
                platform === p
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
              )}
            >
              {p === 'all' ? 'All' : PLATFORM_LABELS[p]}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commands (e.g. logcat, pod install, build apk)..."
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {visibleParams.length > 0 && (
        <Panel
          title="Parameters"
          actions={
            <button
              type="button"
              onClick={() => setValues({})}
              disabled={!hasValues}
              className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {visibleParams.map((param) => (
              <label key={param.key} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{param.label}</span>
                <input
                  value={values[param.key] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [param.key]: e.target.value }))}
                  placeholder={param.example}
                  className={INPUT_CLASS}
                />
              </label>
            ))}
          </div>
        </Panel>
      )}

      {groups.map(([groupName, commands]) => (
        <Panel key={groupName} title={groupName}>
          <div className="-m-3 flex flex-col divide-y divide-slate-200 dark:divide-slate-800">
            {commands.map((command) => {
              const filled = fillCommand(command.command, values)
              return (
                <div key={command.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-start sm:gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{command.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{command.description}</p>
                    </div>
                    <div className="rounded-md bg-slate-50 px-2.5 py-2 dark:bg-slate-950">
                      <CommandText command={filled} />
                    </div>
                  </div>
                  <div className="shrink-0">
                    <CopyButton value={filled} />
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>
      ))}

      {results.length === 0 && (
        <p className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-400 dark:border-slate-800 dark:bg-slate-900">
          No commands match.
        </p>
      )}
    </div>
  )
}
