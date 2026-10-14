import { slugify } from '@/content/slugify'
import type { SectionBlock } from '@/content/types'

export function SectionBlockView({ block }: { block: SectionBlock }) {
  const Heading = block.level === 3 ? 'h3' : 'h2'
  const id = slugify(block.title)

  return (
    <section className="block block-section" id={id}>
      <Heading>{block.title}</Heading>
      {block.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </section>
  )
}
