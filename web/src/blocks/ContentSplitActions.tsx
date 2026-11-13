import { Link } from 'react-router-dom'
import { YoutubeLink } from '@/components/YoutubeLink'
import { resolveSplitCardActions } from '@/content/splitActions'

type Props = {
  sectionSlug: string
  sectionTitle?: string
  solutionSlug?: string
}

/** Contextual Shop and optional video CTAs for content-split cards. */
export function ContentSplitActions({ sectionSlug, sectionTitle, solutionSlug }: Props) {
  const { shopHref, shopLabel, videoHref, videoLabel, actionLabel, quote } = resolveSplitCardActions(
    sectionSlug,
    solutionSlug,
    sectionTitle,
  )
  const quoteLink = quote ? (
    quote.href.startsWith('/') ? (
      <Link className="btn btn-secondary" to={quote.href}>
        {quote.label}
      </Link>
    ) : (
      <a className="btn btn-secondary" href={quote.href} target="_blank" rel="noreferrer">
        {quote.label}
      </a>
    )
  ) : null

  return (
    <div className="content-split-actions">
      {quoteLink}
      <a className="btn btn-primary" href={shopHref} target="_blank" rel="noreferrer">
        {actionLabel ?? `Shop ${shopLabel}`}
      </a>
      {videoHref ? (
        <YoutubeLink className="content-split-video" href={videoHref}>
          {videoLabel ?? 'Watch video'}
        </YoutubeLink>
      ) : null}
    </div>
  )
}
