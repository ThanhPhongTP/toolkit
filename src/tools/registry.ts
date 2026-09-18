import { lazy, type ComponentType } from 'react'
import {
  Binary,
  Braces,
  Clock,
  Code2,
  FileJson,
  FileText,
  Fingerprint,
  GitCompareArrows,
  Globe,
  Hash,
  KeyRound,
  Link2,
  ListChecks,
  NotebookPen,
  Palette,
  Regex,
  Table,
  Terminal,
  Type,
  Webhook,
} from 'lucide-react'

export type ToolCategory = 'workspace' | 'dev-utils' | 'converters' | 'network'

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  workspace: 'Workspace',
  'dev-utils': 'Dev Utilities',
  converters: 'Text / Data Converters',
  network: 'API / Network Tools',
}

export interface ToolDefinition {
  id: string
  title: string
  description: string
  category: ToolCategory
  keywords: string[]
  icon: ComponentType<{ className?: string }>
  component: ComponentType
}

export const TOOLS: ToolDefinition[] = [
  {
    id: 'notes',
    title: 'Notes & Todo',
    description: 'Track things to fix, things to build, and free-form notes so you don’t forget.',
    category: 'workspace',
    keywords: ['notes', 'todo', 'task', 'reminder', 'scratchpad'],
    icon: NotebookPen,
    component: lazy(() => import('./notes/NotesTool').then((m) => ({ default: m.NotesTool }))),
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Pretty-print, minify, and validate JSON.',
    category: 'dev-utils',
    keywords: ['json', 'pretty', 'validate', 'minify'],
    icon: FileJson,
    component: lazy(() => import('./json-formatter/JsonFormatter').then((m) => ({ default: m.JsonFormatter }))),
  },
  {
    id: 'base64',
    title: 'Base64 Encode/Decode',
    description: 'Convert text to and from Base64.',
    category: 'dev-utils',
    keywords: ['base64', 'encode', 'decode'],
    icon: Binary,
    component: lazy(() => import('./base64/Base64Tool').then((m) => ({ default: m.Base64Tool }))),
  },
  {
    id: 'url-encoder',
    title: 'URL Encode/Decode',
    description: 'Encode or decode URL components and full URLs.',
    category: 'dev-utils',
    keywords: ['url', 'encode', 'decode', 'uri'],
    icon: Link2,
    component: lazy(() => import('./url-encoder/UrlEncoderTool').then((m) => ({ default: m.UrlEncoderTool }))),
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    description: 'Decode a JWT header and payload (no signature verification).',
    category: 'dev-utils',
    keywords: ['jwt', 'token', 'decode', 'auth'],
    icon: KeyRound,
    component: lazy(() => import('./jwt-decoder/JwtDecoderTool').then((m) => ({ default: m.JwtDecoderTool }))),
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test a regular expression against sample text.',
    category: 'dev-utils',
    keywords: ['regex', 'regexp', 'pattern', 'match'],
    icon: Regex,
    component: lazy(() => import('./regex-tester/RegexTesterTool').then((m) => ({ default: m.RegexTesterTool }))),
  },
  {
    id: 'uuid-hash-generator',
    title: 'UUID & Hash Generator',
    description: 'Generate UUIDs and compute MD5/SHA hashes.',
    category: 'dev-utils',
    keywords: ['uuid', 'hash', 'md5', 'sha1', 'sha256', 'guid'],
    icon: Fingerprint,
    component: lazy(() =>
      import('./uuid-hash-generator/UuidHashTool').then((m) => ({ default: m.UuidHashTool })),
    ),
  },
  {
    id: 'diff-checker',
    title: 'Diff Checker',
    description: 'Compare two blocks of text and see the difference.',
    category: 'dev-utils',
    keywords: ['diff', 'compare', 'text'],
    icon: GitCompareArrows,
    component: lazy(() => import('./diff-checker/DiffCheckerTool').then((m) => ({ default: m.DiffCheckerTool }))),
  },
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates.',
    category: 'dev-utils',
    keywords: ['timestamp', 'unix', 'date', 'time', 'epoch'],
    icon: Clock,
    component: lazy(() =>
      import('./timestamp-converter/TimestampConverterTool').then((m) => ({ default: m.TimestampConverterTool })),
    ),
  },
  {
    id: 'csv-json',
    title: 'CSV ↔ JSON',
    description: 'Convert between CSV and JSON.',
    category: 'converters',
    keywords: ['csv', 'json', 'convert', 'table'],
    icon: Table,
    component: lazy(() => import('./csv-json/CsvJsonTool').then((m) => ({ default: m.CsvJsonTool }))),
  },
  {
    id: 'yaml-json',
    title: 'YAML ↔ JSON',
    description: 'Convert between YAML and JSON.',
    category: 'converters',
    keywords: ['yaml', 'json', 'convert'],
    icon: Braces,
    component: lazy(() => import('./yaml-json/YamlJsonTool').then((m) => ({ default: m.YamlJsonTool }))),
  },
  {
    id: 'markdown-preview',
    title: 'Markdown Preview',
    description: 'Live preview of Markdown, including GitHub-flavored tables and task lists.',
    category: 'converters',
    keywords: ['markdown', 'md', 'preview'],
    icon: FileText,
    component: lazy(() =>
      import('./markdown-preview/MarkdownPreviewTool').then((m) => ({ default: m.MarkdownPreviewTool })),
    ),
  },
  {
    id: 'case-converter',
    title: 'Case Converter',
    description: 'Convert text between camelCase, snake_case, kebab-case, and more.',
    category: 'converters',
    keywords: ['case', 'camelcase', 'snakecase', 'kebabcase'],
    icon: Type,
    component: lazy(() => import('./case-converter/CaseConverterTool').then((m) => ({ default: m.CaseConverterTool }))),
  },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder words, sentences, or paragraphs.',
    category: 'converters',
    keywords: ['lorem', 'ipsum', 'placeholder', 'text'],
    icon: Code2,
    component: lazy(() => import('./lorem-ipsum/LoremIpsumTool').then((m) => ({ default: m.LoremIpsumTool }))),
  },
  {
    id: 'color-converter',
    title: 'Color Converter',
    description: 'Convert colors between hex, RGB, HSL, and HSV.',
    category: 'converters',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'hsv'],
    icon: Palette,
    component: lazy(() =>
      import('./color-converter/ColorConverterTool').then((m) => ({ default: m.ColorConverterTool })),
    ),
  },
  {
    id: 'cron-parser',
    title: 'Cron Expression Parser',
    description: 'Explain a cron expression in plain English and preview next run times.',
    category: 'converters',
    keywords: ['cron', 'schedule', 'crontab'],
    icon: ListChecks,
    component: lazy(() => import('./cron-parser/CronParserTool').then((m) => ({ default: m.CronParserTool }))),
  },
  {
    id: 'http-status',
    title: 'HTTP Status Codes',
    description: 'Look up the meaning of HTTP status codes.',
    category: 'network',
    keywords: ['http', 'status', 'code', 'reference'],
    icon: Globe,
    component: lazy(() => import('./http-status/HttpStatusTool').then((m) => ({ default: m.HttpStatusTool }))),
  },
  {
    id: 'curl-tool',
    title: 'cURL Generator / Parser',
    description: 'Build a curl command from a request, or parse a curl command into its parts.',
    category: 'network',
    keywords: ['curl', 'command', 'http', 'generate', 'parse'],
    icon: Terminal,
    component: lazy(() => import('./curl-tool/CurlTool').then((m) => ({ default: m.CurlTool }))),
  },
  {
    id: 'api-tester',
    title: 'API Tester',
    description: 'Send HTTP requests from the browser and inspect the response.',
    category: 'network',
    keywords: ['api', 'http', 'request', 'postman', 'fetch'],
    icon: Hash,
    component: lazy(() => import('./api-tester/ApiTesterTool').then((m) => ({ default: m.ApiTesterTool }))),
  },
  {
    id: 'webhook-tester',
    title: 'Webhook Inspector',
    description: 'Paste a raw request/curl/JSON payload, inspect it, and replay it.',
    category: 'network',
    keywords: ['webhook', 'inspector', 'replay', 'payload'],
    icon: Webhook,
    component: lazy(() =>
      import('./webhook-tester/WebhookInspectorTool').then((m) => ({ default: m.WebhookInspectorTool })),
    ),
  },
]

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.id === id)
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.category === category)
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.trim().toLowerCase()
  if (!q) return TOOLS
  return TOOLS.filter(
    (tool) =>
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords.some((keyword) => keyword.includes(q)),
  )
}
