import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Panel } from '../../components/Panel'
import { TextAreaField } from '../../components/TextAreaField'
import { TwoColumnLayout } from '../../components/TwoColumnLayout'

const SAMPLE = `# Hello

Some **bold**, some _italic_.

- [x] Done task
- [ ] Todo task

| Col A | Col B |
| ----- | ----- |
| 1     | 2     |
`

export function MarkdownPreviewTool() {
  const [input, setInput] = useState(SAMPLE)

  return (
    <TwoColumnLayout
      left={<TextAreaField label="Markdown" showCharCount value={input} onChange={(e) => setInput(e.target.value)} />}
      right={
        <Panel title="Preview" className="flex-1 overflow-auto">
          <article className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{input}</ReactMarkdown>
          </article>
        </Panel>
      }
    />
  )
}
