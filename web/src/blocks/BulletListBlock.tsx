import type { BulletListBlock } from '@/content/types'

export function BulletListBlockView({ block }: { block: BulletListBlock }) {
  return (
    <section className="block block-bullets">
      {block.title ? <h2>{block.title}</h2> : null}
      <ul>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
