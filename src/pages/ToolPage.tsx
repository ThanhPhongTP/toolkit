import { Suspense, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useRecentTools } from '../hooks/useRecentTools'
import { getToolById } from '../tools/registry'
import { ToolPageHeader } from '../components/ToolPageHeader'

export function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>()
  const { markVisited } = useRecentTools()
  const tool = toolId ? getToolById(toolId) : undefined

  useEffect(() => {
    if (tool) markVisited(tool.id)
  }, [tool, markVisited])

  if (!tool) {
    return <Navigate to="/not-found" replace />
  }

  const ToolComponent = tool.component

  return (
    <div className="flex flex-1 flex-col gap-4">
      <ToolPageHeader toolId={tool.id} title={tool.title} description={tool.description} />
      <Suspense fallback={<div className="text-sm text-slate-400">Loading tool...</div>}>
        <ToolComponent />
      </Suspense>
    </div>
  )
}
