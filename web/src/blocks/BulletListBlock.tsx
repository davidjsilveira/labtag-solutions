import { isShopChipList, resolveBulletItem } from '@/content/shopLinks'
import type { BulletListBlock } from '@/content/types'

type Props = {
  block: BulletListBlock
  /** Force plain list styling (e.g. feature points beside section images). */
  variant?: 'auto' | 'plain' | 'chips'
}

export function BulletListBlockView({ block, variant = 'auto' }: Props) {
  const useChips =
    variant === 'chips' || (variant === 'auto' && isShopChipList(block.items))

  if (!useChips) {
    return (
      <section className="block block-bullets">
        {block.title ? <h2>{block.title}</h2> : null}
        <ul className="bullet-plain-list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    )
  }

  const items = block.items.map(resolveBulletItem)

  return (
    <section className="block block-bullets block-bullets-chips">
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
