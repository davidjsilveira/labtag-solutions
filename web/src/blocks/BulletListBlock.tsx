import { isShopChipList, resolveBulletItem } from '@/content/shopLinks'
import type { BulletListBlock } from '@/content/types'

type Props = {
  block: BulletListBlock
  /** Force plain list styling (e.g. feature points beside section images). */
  variant?: 'auto' | 'plain' | 'chips' | 'spec'
}

function splitSpec(item: string): { label: string; detail?: string } {
  const match = item.match(/^(.+?)\s+[—–]\s+(.+)$/)
  if (match) return { label: match[1], detail: match[2] }
  return { label: item }
}

export function BulletListBlockView({ block, variant = 'auto' }: Props) {
  if (variant === 'spec') {
    return (
      <section className="block block-bullets">
        {block.title ? <h2>{block.title}</h2> : null}
        <ul className="bullet-spec-list">
          {block.items.map((item) => {
            const { label, detail } = splitSpec(item)
            return (
              <li key={item}>
                <strong>{label}</strong>
                {detail ? <span>{detail}</span> : null}
              </li>
            )
          })}
        </ul>
      </section>
    )
  }

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
