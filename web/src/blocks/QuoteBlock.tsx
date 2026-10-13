import type { QuoteBlock } from '@/content/types'

export function QuoteBlockView({ block }: { block: QuoteBlock }) {
  return (
    <figure className="block block-quote">
      <blockquote>
        <p>“{block.text}”</p>
      </blockquote>
      {block.attribution ? <figcaption>{block.attribution}</figcaption> : null}
    </figure>
  )
}
