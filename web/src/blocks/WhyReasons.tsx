import { Link } from 'react-router-dom'
import { SAMPLE_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import { motionIndex } from '@/hooks/usePageMotion'

type Reason = {
  title: string
  body: string
  icon: string
  iconFallback: string
  href?: string
}

const REASONS: Reason[] = [
  {
    title: 'Holds through the protocol',
    body: 'Materials are specified for LN2, solvents, and autoclave so the identification is still readable when you retrieve the vial.',
    icon: '/media/about/why/diamond-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/diamond-icon.svg',
  },
  {
    title: 'Supply planned for disruption',
    body: 'ISO 22301 business continuity planning keeps stock moving when a plant or lane is interrupted.',
    icon: '/media/about/why/Business-Continuity-Logo.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/Business-Continuity-Logo.svg',
  },
  {
    title: 'Scientists pick the material',
    body: 'M.Sc. and Ph.D. support walks the temperature, container, and chemicals with you.',
    icon: '/media/about/why/scientist-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/scientist-icon.svg',
  },
  {
    title: 'Twenty years of specialty labels',
    body: 'R&D and converting have stayed in house since the start, so catalog and custom work share one quality system.',
    icon: '/media/about/why/20years-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/20years-icon.svg',
  },
  {
    title: 'New materials from our own R&D',
    body: 'The product team coats and converts in our plants, so exclusive constructions do not wait on a third party.',
    icon: '/media/about/why/light-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/light-icon.svg',
  },
  {
    title: 'Custom on the same line',
    body: 'Shapes, colors, and preprinted data are quoted from the same manufacturing line as stock SKUs.',
    icon: '/media/about/why/tailor-made-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/tailor-made-icon.svg',
  },
  {
    title: 'Warehouses near your lab',
    body: 'Regional stock in North America and Europe shortens the path from approval to the bench.',
    icon: '/media/about/why/world-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/world-icon.svg',
  },
  {
    title: 'Day and evening fulfillment',
    body: 'Crews run so standard stock can leave quickly. Custom work is quoted with a date you can plan around.',
    icon: '/media/about/why/shipping-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/shipping-icon.svg',
  },
  {
    title: 'Easy returns if it is not a match',
    body: 'If total satisfaction is not met we take the labels back and help you specify the next material.',
    icon: '/media/about/why/satisfaction-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/satisfaction-icon.svg',
  },
  {
    title: 'Test before you purchase',
    body: 'Free samples go to verified lab addresses. Confirm adhesion and print in your own freezer first.',
    icon: '/media/about/why/samples-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/samples-icon.svg',
    href: SAMPLE_PATH,
  },
]

function ReasonCard({ reason, index }: { reason: Reason; index: number }) {
  const resolved = resolveImageSrc(reason.icon, reason.iconFallback)
  const inner = (
    <>
      <span className="why-reason-icon">
        <img src={resolved.primary} alt="" width={72} height={72} />
      </span>
      <div className="why-reason-copy">
        <h2>{reason.title}</h2>
        <p>{reason.body}</p>
      </div>
    </>
  )

  if (reason.href) {
    return (
      <Link to={reason.href} className="why-reason is-featured" style={motionIndex(index)}>
        {inner}
      </Link>
    )
  }

  return (
    <article className="why-reason" style={motionIndex(index)}>
      {inner}
    </article>
  )
}

export function WhyReasons() {
  return (
    <section className="why-reasons" aria-label="Reasons to choose LabTAG" data-motion-section>
      {REASONS.map((reason, index) => (
        <ReasonCard key={reason.title} reason={reason} index={index} />
      ))}
    </section>
  )
}
