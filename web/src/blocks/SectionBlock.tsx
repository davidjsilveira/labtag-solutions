import { slugify } from '@/content/slugify'
import type { SectionBlock } from '@/content/types'

type Props = {
  block: SectionBlock
  /** When false, parent owns the hash id (e.g. content-split wrappers). */
  withAnchor?: boolean
}

export function SectionBlockView({ block, withAnchor = true }: Props) {
  const Heading = block.level === 3 ? 'h3' : 'h2'
  const id = withAnchor ? slugify(block.title) : undefined

  return (
    <section className="block block-section" id={id}>
      <Heading>{block.title}</Heading>
      {block.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </section>
  )
}
