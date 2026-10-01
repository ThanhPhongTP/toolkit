import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { DevStatusBar } from './DevStatusBar'
import { CyberBackground } from '../components/CyberBackground'
import { MatrixRain } from '../components/MatrixRain'
import { CommandPalette } from '../components/CommandPalette'

export function AppShell() {
  const [isMatrixOpen, setIsMatrixOpen] = useState(false)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  // Listen for Cmd+K / Ctrl+K and secret "matrix" keyword
  useEffect(() => {
    let keyBuffer = ''

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsPaletteOpen((prev) => !prev)
        return
      }

      // Secret matrix keyword
      const target = e.target as HTMLElement | null
      const tagName = target?.tagName
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target?.isContentEditable) {
        return
      }

      keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-10)
      if (keyBuffer.endsWith('matrix')) {
        setIsMatrixOpen(true)
        keyBuffer = ''
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#070913] dark:text-slate-100">
      <CyberBackground />
      <Sidebar onOpenCommandPalette={() => setIsPaletteOpen(true)} />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <TopBar onOpenCommandPalette={() => setIsPaletteOpen(true)} />
        <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
          <Outlet />
        </main>
        <DevStatusBar onOpenMatrix={() => setIsMatrixOpen(true)} />
      </div>

      {/* Raycast-style Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenMatrix={() => setIsMatrixOpen(true)}
      />

      {/* Secret Matrix Rain Easter Egg Overlay */}
      <MatrixRain isOpen={isMatrixOpen} onClose={() => setIsMatrixOpen(false)} />
    </div>
  )
}
