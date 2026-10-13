import { resolveBulletItem } from '@/content/shopLinks'
import type { BulletListBlock } from '@/content/types'

export function BulletListBlockView({ block }: { block: BulletListBlock }) {
  const items = block.items.map(resolveBulletItem)

  return (
    <section className="block block-bullets">
      {block.title ? <h2>{block.title}</h2> : null}
      <ul className="bullet-chip-list">
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer" className="bullet-chip">
                {item.label}
              </a>
            ) : (
              <span className="bullet-chip bullet-chip-static">{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
