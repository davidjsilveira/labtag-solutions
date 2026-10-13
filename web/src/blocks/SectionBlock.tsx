import type { SectionBlock } from '@/content/types'

export function SectionBlockView({ block }: { block: SectionBlock }) {
  const Heading = block.level === 3 ? 'h3' : 'h2'
  return (
    <section className="block block-section">
      <Heading>{block.title}</Heading>
      {block.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </section>
  )
}
