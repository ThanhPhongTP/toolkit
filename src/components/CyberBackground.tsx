import { useEffect, useRef } from 'react'

export function CyberBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      containerRef.current.style.setProperty('--mouse-x', `${x}px`)
      containerRef.current.style.setProperty('--mouse-y', `${y}px`)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Cyber Grid Dot Matrix */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(99, 102, 241, 0.4) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Aurora Ambient Glow Orb 1 - Top Right (Indigo/Purple) */}
      <div className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent blur-[120px] dark:from-indigo-600/25 dark:via-purple-600/20" />

      {/* Aurora Ambient Glow Orb 2 - Center Left (Cyan/Sky) */}
      <div className="absolute top-1/3 -left-32 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-cyan-400/15 via-indigo-500/10 to-transparent blur-[120px] dark:from-cyan-500/20 dark:via-sky-600/15" />

      {/* Aurora Ambient Glow Orb 3 - Bottom Right (Violet/Fuchsia) */}
      <div className="absolute -bottom-32 right-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-t from-violet-600/15 via-fuchsia-500/10 to-transparent blur-[100px] dark:from-violet-600/20 dark:via-indigo-600/15" />

      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 sm:opacity-100"
        style={{
          background:
            'radial-gradient(650px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.08), transparent 60%)',
        }}
      />
    </div>
  )
}
