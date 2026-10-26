import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { TaglineReveal } from '@/components/TaglineReveal'
import { ABOUT_PATH, LABTAG_CONTACT_URL, SAMPLE_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import { motionIndex, usePageMotion } from '@/hooks/usePageMotion'

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

const FAQS = [
  {
    question: 'Why not buy cheaper generic cryo labels?',
    answer:
      'A generic SKU is built for a datasheet, not your solvent list or freeze thaw cycle. We specify the material for the protocol you run, then send samples so you can prove it on the bench.',
  },
  {
    question: 'Who specifies the material?',
    answer:
      'M.Sc. and Ph.D. support walks temperature, container, chemicals, and printer with you. You leave with a match, not a catalog dump.',
  },
  {
    question: 'Do you manufacture the labels or resell them?',
    answer:
      'GA International manufactures LabTAG labels. R&D, coating, converting, and quality control sit in our own facilities.',
  },
  {
    question: 'Can I get free samples?',
    answer:
      'Yes. We send free samples of labels and tapes to verified business addresses. Markers, ribbons, and hardware are not included. Shipping is free to the contiguous United States, Canada, and EU countries.',
  },
  {
    question: 'What does the satisfaction guarantee cover?',
    answer:
      'If the labels are not a match we take them back and help you specify the next material. The goal is a protocol that holds, not a one time shipment.',
  },
  {
    question: 'How fast do orders ship?',
    answer:
      'Day and evening crews run fulfillment so standard stock can leave quickly. Custom work is quoted with a date before you commit.',
  },
  {
    question: 'Do you make custom sizes and colors?',
    answer:
      'Yes. Stock SKUs cover common vials and plates. Custom shapes, colors, and preprinted data are quoted from the same manufacturing line.',
  },
  {
    question: 'What does ISO 22301 mean for my supply?',
    answer:
      'ISO 22301:2012 business continuity planning reduces the chance that a disruption stops us from serving your lab. ISO 9001:2015 covers the quality system those products run through.',
  },
]

const CERTS = [
  {
    mark: 'ISO',
    number: '9001:2015',
    kind: 'Certified',
    body: 'We run an ISO 9001:2015 quality management system so products and services meet customer and regulatory requirements.',
  },
  {
    mark: 'ISO',
    number: '22301:2012',
    kind: 'Compliant',
    body: 'ISO 22301:2012 business continuity planning reduces the chance that a disruption stops us from serving your lab.',
  },
]

const ISO_SEAL = resolveImageSrc('/media/about/iso-certified-lockup.svg')
const KIT = resolveImageSrc(
  '/media/samples/Sample-Kit4.png',
  'https://cdn.labtag.com/wp-content/uploads/Sample-Kit4.png',
)

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

export function WhyChoosePage() {
  const rootRef = useRef<HTMLElement>(null)
  usePageMotion(rootRef)

  useEffect(() => {
    const previous = document.title
    document.title = 'Why choose LabTAG | Labels specified for your protocol'
    let meta = document.querySelector('meta[name="description"]')
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    const previousDesc = meta.getAttribute('content')
    meta.setAttribute(
      'content',
      'LabTAG scientists specify labels for your protocol. Request free samples, then buy from an ISO 9001 manufacturer with a satisfaction guarantee.',
    )
    return () => {
      document.title = previous
      if (!meta) return
      if (created) meta.remove()
      else if (previousDesc) meta.setAttribute('content', previousDesc)
    }
  }, [])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <article className="why-page" ref={rootRef}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="about-hero" data-motion-hero>
        <div className="about-hero-copy">
          <h1 data-motion="hero" style={motionIndex(0)}>
            Labels specified for your protocol
            <br />
            not a catalog guess
          </h1>
          <p className="about-hero-lede" data-motion="hero" style={motionIndex(1)}>
            LabTAG manufactures identification for biomedical labs, biobanks, and hospitals.
            Scientists on the support desk map temperature, solvent, and printer to a material. You
            test free samples in your own protocol before you buy.
          </p>
          <div className="about-hero-actions" data-motion="hero" style={motionIndex(2)}>
            <Link className="btn btn-primary" to={SAMPLE_PATH}>
              Request a free sample
            </Link>
          </div>
          <p className="about-hero-proof" data-motion="hero" style={motionIndex(3)}>
            ISO 9001 certified. Satisfaction guaranteed.
          </p>
        </div>
        <figure className="about-hero-figure" data-motion="photo" style={motionIndex(4)}>
          <img src={KIT.primary} alt="A LabTAG free sample kit of laboratory labels" />
          <figcaption>A LabTAG free sample kit</figcaption>
        </figure>
      </header>

      <section className="about-pair" aria-label="LabTAG tagline">
        <div className="about-tagline">
          <TaglineReveal lines={['Specified by scientists.', 'Tested in your protocol first.']} />
        </div>
        <div className="about-story" data-motion-section>
          <h2 data-motion="up" style={motionIndex(0)}>
            A datasheet is not a protocol
          </h2>
          <p data-motion="up" style={motionIndex(1)}>
            Resellers hand you a SKU. We specify a material for the temperature, solvent, and
            printer you actually run, then send free samples so you can prove it on the bench.
          </p>
        </div>
      </section>

      <section className="why-reasons" aria-label="Reasons to choose LabTAG" data-motion-section>
        {REASONS.map((reason, index) => (
          <ReasonCard key={reason.title} reason={reason} index={index} />
        ))}
      </section>

      <section className="about-iso" aria-label="Quality certifications" data-motion-section>
        <div className="about-iso-body">
          <div className="about-iso-brand">
            <img
              className="about-iso-seal"
              src={ISO_SEAL.primary}
              alt="ISO certified"
              width={247}
              height={53}
              data-motion="pop"
              style={motionIndex(0)}
            />
          </div>
          <div className="about-iso-certs">
            {CERTS.map((cert) => (
              <article key={cert.number}>
                <h2>
                  <span className="about-iso-mark">{cert.mark}</span>
                  <span className="about-iso-num">{cert.number}</span>
                </h2>
                <p className="about-iso-kind">{cert.kind}</p>
                <p>{cert.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-faq" aria-label="Frequently asked questions">
        <h2>Questions labs ask before they switch</h2>
        <div className="faq-list">
          {FAQS.map((item) => (
            <details key={item.question} className="faq-item">
              <summary>
                <span className="faq-item-question">{item.question}</span>
              </summary>
              <div className="faq-item-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="about-close" aria-label="Request a free sample" data-motion-section>
        <h2 data-motion="up" style={motionIndex(0)}>
          Request a free sample
        </h2>
        <p data-motion="up" style={motionIndex(1)}>
          Confirm adhesion and print in your own protocol before you buy. Shipping is free to
          contiguous US, Canada, and EU business addresses.
        </p>
        <div className="about-hero-actions" data-motion="up" style={motionIndex(2)}>
          <Link className="btn btn-primary" to={SAMPLE_PATH}>
            Request a free sample
          </Link>
          <Link className="btn btn-secondary" to={ABOUT_PATH}>
            About Us
          </Link>
        </div>
        <p className="about-close-alt" data-motion="up" style={motionIndex(3)}>
          Prefer a person? <a href={LABTAG_CONTACT_URL} target="_blank" rel="noreferrer">Chat with an expert</a>.
        </p>
      </section>
    </article>
  )
}
