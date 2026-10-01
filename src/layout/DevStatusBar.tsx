import { useEffect, useState } from 'react'
import { Activity, Clock, Globe, Cpu, Terminal, Wifi } from 'lucide-react'
import clsx from 'clsx'

interface DevStatusBarProps {
  onOpenMatrix: () => void
}

export function DevStatusBar({ onOpenMatrix }: DevStatusBarProps) {
  const [localTime, setLocalTime] = useState('')
  const [utcTime, setUtcTime] = useState('')
  const [ping, setPing] = useState<number | null>(null)
  const [memoryMb, setMemoryMb] = useState<number | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setLocalTime(
        now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      )
      setUtcTime(
        now.toLocaleTimeString(undefined, {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      )
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Network & Memory status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const checkStats = () => {
      // Memory heap
      if ('memory' in performance) {
        const mem = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory
        if (mem?.usedJSHeapSize) {
          setMemoryMb(Math.round(mem.usedJSHeapSize / 1024 / 1024))
        }
      }

      // Latency estimate via head request
      const start = performance.now()
      fetch('/favicon.ico?_ping=' + Date.now(), { method: 'HEAD', cache: 'no-store' })
        .then(() => {
          const duration = Math.round(performance.now() - start)
          setPing(duration)
        })
        .catch(() => {
          setPing(null)
        })
    }

    checkStats()
    const statsTimer = setInterval(checkStats, 15000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(statsTimer)
    }
  }, [])

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t border-slate-200/80 bg-white/70 px-3 text-[11px] font-mono text-slate-500 backdrop-blur-xl transition-colors dark:border-indigo-500/15 dark:bg-[#080b18]/80 dark:text-slate-400">
      {/* Left items: System health, Ping, Memory */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="relative flex h-2 w-2">
            <span
              className={clsx(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                isOnline ? 'bg-emerald-400' : 'bg-rose-400',
              )}
            />
            <span
              className={clsx(
                'relative inline-flex h-2 w-2 rounded-full',
                isOnline ? 'bg-emerald-500' : 'bg-rose-500',
              )}
            />
          </span>
          <span className={isOnline ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        {ping !== null && (
          <div className="hidden items-center gap-1 sm:flex" title="Network Latency">
            <Wifi className="h-3 w-3 text-slate-400 dark:text-slate-500" />
            <span>{ping}ms</span>
          </div>
        )}

        {memoryMb !== null && (
          <div className="hidden items-center gap-1 md:flex" title="Browser JS Heap Usage">
            <Cpu className="h-3 w-3 text-slate-400 dark:text-slate-500" />
            <span>{memoryMb}MB</span>
          </div>
        )}

        <div className="hidden items-center gap-1 lg:flex text-slate-400 dark:text-slate-500">
          <Activity className="h-3 w-3" />
          <span>Client Sandboxed</span>
        </div>
      </div>

      {/* Right items: UTC, Local Time, Matrix trigger */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1" title="UTC Coordinated Universal Time">
          <Globe className="h-3 w-3 text-indigo-500" />
          <span className="text-slate-700 dark:text-slate-300">UTC {utcTime}</span>
        </div>

        <div className="hidden items-center gap-1 sm:flex" title="Local System Time">
          <Clock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
          <span>Local {localTime}</span>
        </div>

        {/* Easter Egg Matrix Button */}
        <button
          type="button"
          onClick={onOpenMatrix}
          title="Easter egg: Click or type 'matrix' to launch"
          className="group flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-600 transition-all hover:bg-emerald-500/20 hover:text-emerald-500 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] dark:text-emerald-400"
        >
          <Terminal className="h-3 w-3 transition-transform group-hover:scale-110" />
          <span>Matrix</span>
        </button>
      </div>
    </footer>
  )
}
