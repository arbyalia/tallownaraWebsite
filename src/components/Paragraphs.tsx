import { toParagraphs } from '@/lib/text'

export function Paragraphs({ text }: { text: string | null | undefined }) {
  return (
    <div className="space-y-4">
      {toParagraphs(text).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}
