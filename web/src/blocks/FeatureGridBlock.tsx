import type { FeatureGridBlock } from '@/content/types'

export function FeatureGridBlockView({ block }: { block: FeatureGridBlock }) {
  return (
    <section className="block block-features">
      {block.title ? <h2>{block.title}</h2> : null}
      <div className="feature-grid">
        {block.items.map((item) => (
          <article key={item.title} className="feature-item">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
