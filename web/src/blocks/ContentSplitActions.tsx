import { resolveSplitCardActions } from '@/content/splitActions'

type Props = {
  sectionSlug: string
  sectionTitle?: string
  solutionSlug?: string
}

/** Contextual Shop, sample, and video CTAs for content-split cards. */
export function ContentSplitActions({ sectionSlug, sectionTitle, solutionSlug }: Props) {
  const { shopHref, shopLabel, sampleHref, videoHref } = resolveSplitCardActions(
    sectionSlug,
    solutionSlug,
    sectionTitle,
  )

  return (
    <div className="content-split-actions">
      <a className="btn btn-primary" href={shopHref} target="_blank" rel="noreferrer">
        Shop {shopLabel}
      </a>
      <a className="content-split-sample" href={sampleHref} target="_blank" rel="noreferrer">
        Request a free sample
      </a>
      <a className="content-split-video" href={videoHref} target="_blank" rel="noreferrer">
        Watch video
      </a>
    </div>
  )
}
