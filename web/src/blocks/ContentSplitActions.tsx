import { resolveSplitCardActions } from '@/content/splitActions'

type Props = {
  sectionSlug: string
  sectionTitle?: string
  solutionSlug?: string
}

/** Contextual Shop and optional video CTAs for content-split cards. */
export function ContentSplitActions({ sectionSlug, sectionTitle, solutionSlug }: Props) {
  const { shopHref, shopLabel, videoHref } = resolveSplitCardActions(
    sectionSlug,
    solutionSlug,
    sectionTitle,
  )

  return (
    <div className="content-split-actions">
      <a className="btn btn-primary" href={shopHref} target="_blank" rel="noreferrer">
        Shop {shopLabel}
      </a>
      {videoHref ? (
        <a className="content-split-video" href={videoHref} target="_blank" rel="noreferrer">
          Watch video
        </a>
      ) : null}
    </div>
  )
}
