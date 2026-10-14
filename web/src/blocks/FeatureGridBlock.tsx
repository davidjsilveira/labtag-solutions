import type { FeatureGridBlock } from '@/content/types'

export function FeatureGridBlockView({ block }: { block: FeatureGridBlock }) {
  const Heading = block.level === 3 ? 'h3' : 'h2'

  return (
    <section className="block block-features">
      {block.title ? <Heading>{block.title}</Heading> : null}
      <div className="feature-grid">
        {block.items.map((item) => {
          const body = (
            <>
              <p className="feature-item-title">{item.title}</p>
              <p>{item.body}</p>
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
