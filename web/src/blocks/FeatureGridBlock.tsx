import type { FeatureGridBlock } from '@/content/types'

/** Keep blurbs roughly even so cards share the same rhythm. */
function trimBody(text: string, max = 88): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const at = cut.lastIndexOf(' ')
  return `${(at > 48 ? cut.slice(0, at) : cut).trimEnd()}…`
}

export function FeatureGridBlockView({ block }: { block: FeatureGridBlock }) {
  const Heading = block.level === 3 ? 'h3' : 'h2'

  return (
    <section className="block block-features">
      {block.title ? <Heading>{block.title}</Heading> : null}
      <div className="feature-grid">
        {block.items.map((item) => {
          const body = (
            <>
              <h4 className="feature-item-title">{item.title}</h4>
              <p className="feature-item-body">{trimBody(item.body)}</p>
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
