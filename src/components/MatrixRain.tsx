import { useEffect, useRef } from 'react'
import { X, Terminal } from 'lucide-react'

interface MatrixRainProps {
  isOpen: boolean
  onClose: () => void
}

export function MatrixRain({ isOpen, onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Japanese Katakana + Latin + Numbers + Math Symbols
    const chars =
      '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ1234567890ABCDEF@#$%&*+-/<>{}[]=_'
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = new Array(columns).fill(1)
    const speeds: number[] = new Array(columns)
      .fill(0)
      .map(() => 0.6 + Math.random() * 0.8)

    let lastDraw = 0
    const fps = 35
    const interval = 1000 / fps

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render)

      if (time - lastDraw < interval) return
      lastDraw = time

      // Semi-transparent black background creates fade trail
      ctx.fillStyle = 'rgba(5, 7, 15, 0.09)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px "JetBrains Mono", "Courier New", monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Head of the stream is bright glowing white/green
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#00ff66'
        ctx.shadowBlur = 8
        ctx.fillText(text, x, y)

        // Body stream is vivid emerald matrix green
        ctx.fillStyle = '#00ff66'
        ctx.shadowBlur = 2
        ctx.fillText(text, x, y - fontSize)

        // Reset drops randomly at the bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i] += speeds[i]
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Floating HUD Terminal Overlay */}
      <div
        className="relative z-10 mx-4 max-w-lg rounded-xl border border-emerald-500/40 bg-black/80 p-6 font-mono text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider">
            <Terminal className="h-4 w-4 animate-pulse text-emerald-400" />
            <span>MAINFRAME // MATRIX PROTOCOL</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-emerald-500 transition-colors hover:bg-emerald-500/20 hover:text-emerald-200"
            title="Press Esc to exit"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2 text-xs leading-relaxed text-emerald-300/90">
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-200 font-semibold">&gt; ACCESS GRANTED:</span> DEV_TOOLKIT_ROOT_PRIVILEGE
          </p>
          <p className="text-emerald-400/80">
            &gt; You found the hidden Easter Egg!
          </p>
          <p className="text-emerald-500/70">
            &gt; System Status: 100% in-browser, fully sandboxed, zero logs.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-2 text-[11px] text-emerald-500/70 border-t border-emerald-500/20">
          <span>Tip: Type &quot;matrix&quot; anywhere to re-open</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-emerald-500/20 px-3 py-1 text-emerald-300 font-semibold hover:bg-emerald-500/30 transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          >
            Exit (ESC)
          </button>
        </div>
      </div>
    </div>
  )
}
