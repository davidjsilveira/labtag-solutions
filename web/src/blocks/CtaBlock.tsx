import { CONTACT_PATH, SAMPLE_PATH, isSampleHref } from '@/content/labtagLinks'
import type { CtaBlock } from '@/content/types'
import { SampleBanner } from './SampleBanner'

export function CtaBlockView({ block }: { block: CtaBlock }) {
  const customHref = block.actionHref?.trim()
  const customLabel = block.actionLabel?.trim()
  const isGetInTouch = /^get in touch/i.test(block.title)
  const href = customHref
    ? isSampleHref(customHref)
      ? SAMPLE_PATH
      : customHref
    : isGetInTouch
      ? SAMPLE_PATH
      : CONTACT_PATH
  const label =
    customHref && customLabel
      ? customLabel
      : isGetInTouch
        ? 'Order Free Samples'
        : 'Chat with an expert'

  return <SampleBanner title={block.title} body={block.body} href={href} label={label} />
}
