import { toParagraphs } from '@/lib/text'

import { TemplateText } from './TemplateText'

export function Paragraphs({ text }: { text: string | null | undefined }) {
  return (
    <div className="space-y-4">
      {toParagraphs(text).map((paragraph) => (
        <p key={paragraph}>
          <TemplateText text={paragraph} />
        </p>
      ))}
    </div>
  )
}
