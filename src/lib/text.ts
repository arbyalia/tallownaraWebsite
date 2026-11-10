export function toParagraphs(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
