import { useCallback, useState } from 'react'

export function useClipboard(resetAfterMs = 1500) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), resetAfterMs)
      } catch {
        setCopied(false)
      }
    },
    [resetAfterMs],
  )

  return { copied, copy }
}
