import type { TextBlock } from '@/content/types'

export function TextBlockView({ block }: { block: TextBlock }) {
  return (
    <section className="block block-text">
      {block.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </section>
  )
}
