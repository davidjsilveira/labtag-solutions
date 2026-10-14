import { resolveFeatureIcon } from '@/content/featureIcons'
import type { FeatureGridBlock } from '@/content/types'

export function FeatureGridBlockView({ block }: { block: FeatureGridBlock }) {
  const Heading = block.level === 3 ? 'h3' : 'h2'

  return (
    <section className="block block-features">
      {block.title ? <Heading>{block.title}</Heading> : null}
      <div className="feature-grid">
        {block.items.map((item) => {
          const Icon = resolveFeatureIcon(item.title, item.body)
          const body = (
            <>
              <span className="feature-item-icon" aria-hidden="true">
                <Icon weight="duotone" size={28} />
              </span>
              <div className="feature-item-copy">
                <p className="feature-item-title">{item.title}</p>
                <p className="feature-item-body">{item.body}</p>
              </div>
            </>
          )

          if (item.href) {
            return (
              <a key={item.title} href={item.href} className="feature-item feature-item-link">
                {body}
              </a>
            )
          }

          return (
            <article key={item.title} className="feature-item">
              {body}
            </article>
          )
        })}
      </div>
    </section>
  )
}
