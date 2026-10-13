import type { CtaBlock } from '@/content/types'

export function CtaBlockView({ block }: { block: CtaBlock }) {
  return (
    <aside className="block block-cta">
      <h2>{block.title}</h2>
      <p>{block.body}</p>
    </aside>
  )
}
