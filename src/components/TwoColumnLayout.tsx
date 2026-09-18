import type { ReactNode } from 'react'

interface TwoColumnLayoutProps {
  left: ReactNode
  right: ReactNode
}

export function TwoColumnLayout({ left, right }: TwoColumnLayoutProps) {
  return (
    <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex min-h-[16rem] flex-col">{left}</div>
      <div className="flex min-h-[16rem] flex-col">{right}</div>
    </div>
  )
}
