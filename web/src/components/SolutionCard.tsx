import { Link } from 'react-router-dom'
import { resolveImageSrc } from '@/content/resolveImage'
import type { SolutionPage } from '@/content/types'

type Props = {
  page: SolutionPage
  categoryPath?: string
}

export function SolutionCard({ page, categoryPath }: Props) {
  const to = categoryPath
    ? `/solutions/${categoryPath}/${page.slug}`
    : `/solutions/${page.slug}`
  const image = page.heroImage
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null

  return (
    <Link to={to} className="solution-card">
      {resolved ? (
        <div className="solution-card-media">
          <img
            src={resolved.primary}
            alt=""
            loading="lazy"
            onError={(event) => {
              if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
                event.currentTarget.src = resolved.fallback
              }
            }}
          />
        </div>
      ) : (
        <div className="solution-card-media solution-card-media-empty" aria-hidden="true" />
      )}
      <div className="solution-card-body">
        <h3 className="solution-card-title">{page.title}</h3>
        <p>{page.excerpt || 'Open solution page'}</p>
      </div>
    </Link>
  )
}
