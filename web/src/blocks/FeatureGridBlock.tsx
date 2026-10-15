import type { FeatureGridBlock } from '@/content/types'

/** Keep blurbs roughly even so content cards share the same rhythm. */
function trimBody(text: string, max = 88): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const at = cut.lastIndexOf(' ')
  return `${(at > 48 ? cut.slice(0, at) : cut).trimEnd()}…`
}

function isGuideJump(block: FeatureGridBlock): boolean {
  if (block.title && /^by\s+/i.test(block.title)) return true
  return block.items.length > 0 && block.items.every((item) => Boolean(item.href))
}

export function FeatureGridBlockView({ block }: { block: FeatureGridBlock }) {
  const Heading = block.level === 3 ? 'h3' : 'h2'

  if (isGuideJump(block)) {
    return (
      <section className="block block-features block-features-jump">
        {block.title ? <Heading className="feature-jump-label">{block.title}</Heading> : null}
        <nav className="feature-jump" aria-label={block.title ?? 'Section links'}>
          {block.items.map((item, index) => (
            <span key={item.title} className="feature-jump-item">
              {item.href ? (
                <a href={item.href} title={item.body} className="feature-jump-link">
                  {item.title}
                </a>
              ) : (
                <span title={item.body} className="feature-jump-link feature-jump-text">
                  {item.title}
                </span>
              )}
              {index < block.items.length - 1 ? (
                <span className="feature-jump-sep" aria-hidden="true">
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </nav>
      </section>
    )
  }

  return (
    <section className="block block-features">
      {block.title ? <Heading>{block.title}</Heading> : null}
      <div className="feature-grid">
        {block.items.map((item) => (
          <article key={item.title} className="feature-item">
            <h4 className="feature-item-title">{item.title}</h4>
            <p className="feature-item-body">{trimBody(item.body)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
