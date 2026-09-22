import { useMemo, useState } from 'react'
import { CopyButton } from '../../components/CopyButton'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Panel } from '../../components/Panel'
import {
  formatAndroidComposeColor,
  formatAndroidXmlColor,
  formatHsl,
  formatRgb,
  formatSwiftUIColor,
  formatUIColor,
  parseHex,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from '../../lib/color/colorConvert'

export function ColorConverterTool() {
  const [hex, setHex] = useState('#3B82F6')

  const result = useMemo(() => {
    try {
      const rgb = parseHex(hex)
      return {
        ok: true as const,
        rgb,
        hex: rgbToHex(rgb),
        hsl: rgbToHsl(rgb),
        hsv: rgbToHsv(rgb),
        uiColor: formatUIColor(rgb),
        swiftUIColor: formatSwiftUIColor(rgb),
        androidCompose: formatAndroidComposeColor(rgb),
        androidXml: formatAndroidXmlColor(rgb),
      }
    } catch (err) {
      return { ok: false as const, error: (err as Error).message }
    }
  }, [hex])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={result.ok ? result.hex : '#000000'}
          onChange={(e) => setHex(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border border-slate-300 dark:border-slate-700"
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#3B82F6"
          className="w-40 rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      {!result.ok && <ErrorBanner message={result.error} />}

      {result.ok && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Panel title="HEX" actions={<CopyButton value={result.hex} />}>
            <code className="font-mono text-sm">{result.hex}</code>
          </Panel>
          <Panel title="RGB" actions={<CopyButton value={formatRgb(result.rgb)} />}>
            <code className="font-mono text-sm">{formatRgb(result.rgb)}</code>
          </Panel>
          <Panel title="HSL" actions={<CopyButton value={formatHsl(result.hsl)} />}>
            <code className="font-mono text-sm">{formatHsl(result.hsl)}</code>
          </Panel>
          <Panel
            title="HSV"
            actions={
              <CopyButton value={`hsv(${result.hsv.h}, ${result.hsv.s}%, ${result.hsv.v}%)`} />
            }
          >
            <code className="font-mono text-sm">
              hsv({result.hsv.h}, {result.hsv.s}%, {result.hsv.v}%)
            </code>
          </Panel>
          <Panel title="iOS UIKit (Swift)" actions={<CopyButton value={result.uiColor} />}>
            <code className="font-mono text-sm break-all">{result.uiColor}</code>
          </Panel>
          <Panel title="SwiftUI" actions={<CopyButton value={result.swiftUIColor} />}>
            <code className="font-mono text-sm break-all">{result.swiftUIColor}</code>
          </Panel>
          <Panel title="Android (Compose)" actions={<CopyButton value={result.androidCompose} />}>
            <code className="font-mono text-sm break-all">{result.androidCompose}</code>
          </Panel>
          <Panel title="Android (XML)" actions={<CopyButton value={result.androidXml} />}>
            <code className="font-mono text-sm break-all">{result.androidXml}</code>
          </Panel>
        </div>
      )}
    </div>
  )
}
