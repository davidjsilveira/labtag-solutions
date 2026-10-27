import { useEffect, useRef } from 'react'
import {
  Broadcast,
  BuildingOffice,
  Buildings,
  Cube,
  GearSix,
  Globe,
  Printer,
  SealCheck,
  Warehouse,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { TaglineReveal } from '@/components/TaglineReveal'
import { CONTACT_PATH, SAMPLE_PATH, WHY_CHOOSE_PATH } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import { motionIndex, usePageMotion } from '@/hooks/usePageMotion'

const TEAM = resolveImageSrc(
  '/media/about/Photo5.png',
  'https://cdn.labtag.com/wp-content/uploads/Photo5.png',
)
const AWARD = resolveImageSrc(
  '/media/about/EY-2019.jpg',
  'https://cdn.labtag.com/wp-content/uploads/EY_EntrepreneuroftheYear_2019_132-1536x1024.jpg',
)
const MAP = resolveImageSrc('/media/about/world-dots.svg')
const ISO_SEAL = resolveImageSrc('/media/about/iso-certified-lockup.svg')

const BREAK_PHOTOS = [
  {
    src: '/media/cryogenic-labels/Cryogenic-Labels-5.jpg',
    alt: 'A CryoSTUCK label on a frozen vial over dry ice',
    caption: 'Identification that holds on a frozen vial',
  },
  {
    src: '/media/pcr-labels-and-tags/PCRJTT-269-use2.jpg',
    alt: 'Labeled PCR tubes in a rack during a lab workflow',
    caption: 'Readable IDs through a lab workflow',
  },
]

const BENEFITS = [
  {
    title: 'Holds in LN2 and steam',
    body: 'Specify the material for −196°C storage, solvents, and autoclave cycles so the identification is still readable when you retrieve the vial.',
    icon: '/media/about/why/diamond-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/diamond-icon.svg',
  },
  {
    title: 'Scientists pick the material',
    body: 'M.Sc. and Ph.D. support walks the application with you. You leave with a match, not a catalog dump.',
    icon: '/media/about/why/scientist-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/scientist-icon.svg',
  },
  {
    title: 'Manufacturing in house',
    body: 'R&D, coating, and converting run in our own plants, so custom runs and stock labels follow the same quality system.',
    icon: '/media/about/why/tailor-made-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/tailor-made-icon.svg',
  },
  {
    title: 'Test before you purchase',
    body: 'Free samples go to verified lab addresses. Confirm adhesion and print in your own freezer first.',
    icon: '/media/about/why/samples-icon.svg',
    iconFallback: 'https://cdn.labtag.com/wp-content/uploads/samples-icon.svg',
  },
]

const VALUES = [
  {
    title: 'Vision',
    body: 'A world where every lab sample is accurately identified, enabling science to advance without compromise.',
  },
  {
    title: 'Mission',
    body: 'To deliver reliable, high-performance labeling solutions that safeguard research integrity in any environment.',
  },
  {
    title: 'Team',
    body: 'A dedicated group of scientists, engineers, and support specialists working together to solve labeling challenges worldwide.',
  },
]

const FAQS = [
  {
    question: 'Do you manufacture the labels or resell them?',
    answer:
      'GA International manufactures LabTAG labels. R&D, converting, and quality control sit in our own facilities.',
  },
  {
    question: 'Can I get free samples?',
    answer:
      'Yes. We send free samples of labels and tapes to verified business addresses. Markers, ribbons, and hardware are not included. Shipping is free to the contiguous United States, Canada, and EU countries.',
  },
  {
    question: 'What temperatures can the labels survive?',
    answer:
      'The cryogenic range starts at −196°C. Other lines cover freezer, fridge, ambient, and autoclave. Tell us the protocol and we will point you to the matching material.',
  },
  {
    question: 'Do you make custom sizes and colors?',
    answer:
      'Yes. Stock SKUs cover common vials and plates. Custom shapes, colors, and preprinted data are quoted from the same manufacturing line.',
  },
  {
    question: 'Which ISO systems do you run?',
    answer:
      'ISO 9001:2015 for quality management and ISO 22301:2012 for business continuity, so supply is planned through disruption.',
  },
  {
    question: 'Where are you located?',
    answer:
      'Offices in Plattsburgh, Laval, Berlicum, and Brighton, with warehouses placed to reach North American and European labs.',
  },
  {
    question: 'How fast do orders ship?',
    answer:
      'Day and evening crews run fulfillment so standard stock can leave quickly. Custom work is quoted with a date before you commit.',
  },
  {
    question: 'Why do you need a business address for samples?',
    answer:
      'Samples are for labs evaluating a protocol. A verified business address keeps kits going to working benches, not residences.',
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

const STATS = [
  { value: '25+', label: 'Years of specialty labels', count: 25, prefix: '', suffix: '+' },
  { value: '4', label: 'Offices near your labs', count: 4, prefix: '', suffix: '' },
  { value: 'R&D', label: 'In house product team' },
  { value: 'ISO', label: 'Certified quality' },
]

const MILESTONES = [
  { year: '1999', icon: Buildings, events: ['Founded GA International'] },
  { year: '2001', icon: Globe, events: ['First GA International website'] },
  { year: '2008', icon: Printer, events: ['Purchased the first press'] },
  {
    year: '2013',
    icon: Warehouse,
    events: ['Launched LabTAG.com', 'Opened a warehouse in the Netherlands'],
  },
  {
    year: '2017',
    icon: SealCheck,
    events: ['Obtained ISO 9001:2015 certification', 'Purchased a digital press'],
  },
  { year: '2020', icon: Cube, events: ['GMerix was created'] },
  {
    year: '2021',
    icon: Broadcast,
    events: [
      'Purchased an RFID inserter',
      'Opened a warehouse in the US',
      'Construction of a new building',
    ],
  },
  {
    year: '2022',
    icon: GearSix,
    events: [
      'Implemented Epicor ERP',
      'Purchased three flexographic presses',
      'Purchased two coating lines',
    ],
  },
  { year: '2026', icon: BuildingOffice, events: ['New building expansion'] },
]

function AboutMilestones() {
  const sectionRef = useRef<HTMLElement>(null)
  const lastYear = MILESTONES[MILESTONES.length - 1]?.year

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ol = section.querySelector<HTMLElement>('.about-timeline')
    const inputs = [
      ...section.querySelectorAll<HTMLInputElement>('input[name="about-milestone"]'),
    ]
    if (!ol || inputs.length < 2) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const syncProgress = () => {
      const marks = [...ol.querySelectorAll<HTMLElement>('.about-timeline-mark')]
      const checkedLi = ol.querySelector<HTMLElement>(':scope > li:has(input:checked)')
      const mark = checkedLi?.querySelector<HTMLElement>('.about-timeline-mark')
      const first = marks[0]?.getBoundingClientRect()
      const last = marks[marks.length - 1]?.getBoundingClientRect()
      const current = mark?.getBoundingClientRect()
      if (!first || !last || !current) return
      const horizontal = Math.abs(last.left - first.left) >= Math.abs(last.top - first.top)
      const span = horizontal ? last.left - first.left : last.top - first.top
      const delta = horizontal ? current.left - first.left : current.top - first.top
      const progress = span <= 0 ? 1 : Math.max(0, Math.min(1, delta / span))
      ol.style.setProperty('--milestone-progress', progress.toFixed(4))
    }

    let index = 0
    let timer = 0
    let pinned = false
    let started = false
    let hovering = false

    const clear = () => window.clearTimeout(timer)

    const pin = () => {
      pinned = true
      clear()
    }

    const step = () => {
      if (pinned) return
      const input = inputs[index]
      if (input) input.checked = true
      syncProgress()
      if (index >= inputs.length - 1) return
      index += 1
      if (!hovering) timer = window.setTimeout(step, 750)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (started || pinned || reduce) return
        if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.3)) return
        started = true
        index = 0
        step()
      },
      { threshold: [0, 0.3] },
    )
    io.observe(section)

    const onEnter = () => {
      hovering = true
      clear()
      syncProgress()
    }
    const onLeave = () => {
      hovering = false
      syncProgress()
      if (pinned || !started || reduce || index >= inputs.length) return
      timer = window.setTimeout(step, 750)
    }

    section.addEventListener('pointerdown', pin)
    section.addEventListener('focusin', pin)
    section.addEventListener('pointerenter', onEnter)
    section.addEventListener('pointerleave', onLeave)
    section.addEventListener('change', syncProgress)
    ol.addEventListener('pointerover', syncProgress)
    window.addEventListener('resize', syncProgress)
    syncProgress()

    return () => {
      io.disconnect()
      clear()
      section.removeEventListener('pointerdown', pin)
      section.removeEventListener('focusin', pin)
      section.removeEventListener('pointerenter', onEnter)
      section.removeEventListener('pointerleave', onLeave)
      section.removeEventListener('change', syncProgress)
      ol.removeEventListener('pointerover', syncProgress)
      window.removeEventListener('resize', syncProgress)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="about-milestones"
      aria-labelledby="about-milestones-heading"
      data-motion-section
    >
      <h2 id="about-milestones-heading" data-motion="up" style={motionIndex(0)}>
        Key milestones
      </h2>
      <p id="about-milestones-hint">Select a year to walk the timeline.</p>
      <div className="about-timeline-split">
        <ol
          className="about-timeline"
          role="radiogroup"
          aria-labelledby="about-milestones-heading"
          aria-describedby="about-milestones-hint"
        >
          {MILESTONES.map((item) => (
            <li key={item.year}>
              <label className="about-timeline-chip">
                <input
                  type="radio"
                  name="about-milestone"
                  value={item.year}
                  defaultChecked={item.year === lastYear}
                  aria-label={`${item.year}. ${item.events.join('. ')}`}
                />
                <span className="about-timeline-mark" aria-hidden="true" />
                <time dateTime={item.year}>{item.year}</time>
              </label>
            </li>
          ))}
        </ol>
        <div className="about-timeline-stage">
          {MILESTONES.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.year}
                className="about-timeline-card"
                data-year={item.year}
                aria-hidden="true"
              >
                <span className="about-timeline-card-icon">
                  <Icon size={28} weight="fill" />
                </span>
                <div className="about-timeline-card-copy">
                  <p className="about-timeline-card-year">{item.year}</p>
                  <ul className="about-timeline-events">
                    {item.events.map((event) => (
                      <li key={event}>{event}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Equirectangular project onto the dotted-map viewBox, with a tiny nudge so nearby offices stay distinct. */
function officePin(lat: number, lng: number, nudgeX = 0, nudgeY = 0) {
  return {
    x: Number((((lng + 180) / 360) * 100 + nudgeX).toFixed(2)),
    y: Number((((90 - lat) / 180) * 100 + nudgeY).toFixed(2)),
  }
}

const OFFICES = [
  {
    region: 'USA',
    name: 'LabTAG Inc.',
    address: '42 Gateway Drive, Suite 400, Plattsburgh, NY 12901, USA',
    ...officePin(44.699, -73.453, -1.3, 1.0),
  },
  {
    region: 'Canada',
    name: 'GA International Inc.',
    address: '4455 Rue Louis-B.-Mayer, Laval, QC H7P 6B5, Canada',
    ...officePin(45.57, -73.754, 1.3, -1.0),
  },
  {
    region: 'Netherlands',
    name: 'GA International Inc.',
    address: 'Runweg 28, 5258 BN Berlicum, Netherlands',
    ...officePin(51.68, 5.4, 1.0, -0.5),
  },
  {
    region: 'UK',
    name: 'TAG Scientific Ltd.',
    address: 'Preston Park House, South Road, Brighton BN1 6SB, UK',
    ...officePin(50.843, -0.138, -0.5, 0.7),
  },
]

export function AboutPage() {
  const rootRef = useRef<HTMLElement>(null)
  usePageMotion(rootRef)

  useEffect(() => {
    const previous = document.title
    document.title = 'About LabTAG | Specialty labels for biomedical labs'
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
      'GA International manufactures LabTAG labels for biomedical labs, biobanks, and hospitals. Request free samples specified for LN2, solvents, and your workflow.',
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
    <article className="about-page" ref={rootRef}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="about-hero" data-motion-hero>
        <div className="about-hero-copy">
          <h1 data-motion="hero" style={motionIndex(0)}>
            Specialty labels for labs
            <br />
            that cannot lose a sample
          </h1>
          <p className="about-hero-lede" data-motion="hero" style={motionIndex(1)}>
            GA International manufactures identification for biomedical research labs, biobanks, and
            hospitals. Every label is specified for the temperature, solvent, and workflow you
            actually run.
          </p>
          <div className="about-hero-actions" data-motion="hero" style={motionIndex(2)}>
            <Link className="btn btn-primary" to={SAMPLE_PATH}>
              Request a free sample
            </Link>
          </div>
          <p className="about-hero-proof" data-motion="hero" style={motionIndex(3)}>
            ISO 9001 certified. Free samples before you buy.
          </p>
        </div>
        <figure className="about-hero-figure" data-motion="photo" style={motionIndex(4)}>
          <img src={TEAM.primary} alt="The LabTAG team at GA International headquarters" />
          <figcaption>The LabTAG team at GA International headquarters</figcaption>
        </figure>
      </header>

      <ul className="about-stats" data-motion-section>
        {STATS.map((stat, index) => (
          <li key={stat.label} data-motion="up" style={motionIndex(index)}>
            <strong data-count={stat.count} data-prefix={stat.prefix} data-suffix={stat.suffix}>
              {stat.value}
            </strong>
            <span>{stat.label}</span>
          </li>
        ))}
      </ul>

      <section className="about-manifesto" aria-label="Vision, mission, and team" data-motion-section>
        {VALUES.map((value, index) => (
          <article key={value.title} className="about-value" data-motion="up" style={motionIndex(index)}>
            <span className="about-value-index">{String(index + 1).padStart(2, '0')}</span>
            <h2>{value.title}</h2>
            <p>{value.body}</p>
          </article>
        ))}
      </section>

      <AboutMilestones />

      <div className="about-photo-row" data-motion-section>
        {BREAK_PHOTOS.map((photo, index) => {
          const src = resolveImageSrc(photo.src)
          return (
            <figure key={photo.src}>
              <img
                src={src.primary}
                alt={photo.alt}
                data-motion="photo"
                style={motionIndex(index)}
              />
              <figcaption data-motion="up" style={motionIndex(index + 2)}>
                {photo.caption}
              </figcaption>
            </figure>
          )
        })}
      </div>

      <section className="about-pair" aria-label="LabTAG tagline">
        <div className="about-tagline">
          <TaglineReveal
            lines={['Every sample identified.', 'Every freezer, every solvent, every shift.']}
          />
        </div>
        <div className="about-story" data-motion-section>
          <h2 data-motion="up" style={motionIndex(0)}>
            Labels fail in the protocol, not on the spec sheet
          </h2>
          <p data-motion="up" style={motionIndex(1)}>
            A vial that loses its identity in LN2, xylene, or steam wastes the run. Since its start,
            GA International has manufactured cryogenic and chemical resistant labels with R&amp;D and
            production in house, plus technical support that stays with the application until the
            label holds.
          </p>
        </div>
      </section>

      <section className="about-benefits" aria-label="Why labs work with LabTAG" data-motion-section>
        {BENEFITS.map((benefit, index) => {
          const icon = resolveImageSrc(benefit.icon, benefit.iconFallback)
          return (
            <article key={benefit.title} data-motion="up" style={motionIndex(index)}>
              <span className="about-benefit-icon">
                <img src={icon.primary} alt="" width={72} height={72} />
              </span>
              <div className="about-benefit-copy">
                <h2>{benefit.title}</h2>
                <p>{benefit.body}</p>
              </div>
            </article>
          )
        })}
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

      <section className="about-cinema" aria-label="Recognition and offices" data-motion-section>
        <div className="about-award">
          <figure className="about-award-figure" data-motion="photo" style={motionIndex(0)}>
            <img
              src={AWARD.primary}
              alt="Dr. George Ambartsoumian receiving the EY Entrepreneur Of The Year 2019 Award"
            />
          </figure>
          <div className="about-award-copy">
            <p className="about-kicker is-accent">2019</p>
            <h2>EY Entrepreneur Of The Year</h2>
            <p>
              Our founder and CEO, Dr. George Ambartsoumian, received the EY Entrepreneur Of The
              Year 2019 Award for building a specialty label manufacturer that labs can stay with.
            </p>
          </div>
        </div>

        <div className="about-locations">
          <header className="about-locations-copy">
            <p className="about-kicker">Headquarters</p>
            <h2>Our offices around the world</h2>
            <p>
              To support a growing team we moved into a larger facility with modern offices,
              advanced R&amp;D labs, and an upgraded production warehouse.
            </p>
          </header>
          <div className="about-locations-body">
            <figure className="about-map" aria-label="Map of LabTAG and GA International offices">
              <img src={MAP.primary} alt="" />
              <div className="about-pins" aria-hidden="true">
                {OFFICES.map((office, index) => (
                  <span
                    key={office.region}
                    className="about-pin"
                    data-office={office.region}
                    style={{ left: `${office.x}%`, top: `${office.y}%`, ...motionIndex(index) }}
                  >
                    <svg className="about-pin-mark" viewBox="0 0 24 32">
                      <path
                        fill="currentColor"
                        d="M12 31s-9-11.4-9-19a9 9 0 1 1 18 0c0 7.6-9 19-9 19z"
                      />
                      <text
                        x="12"
                        y="13.2"
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="7"
                        fontWeight="700"
                        fontFamily="var(--font-display), sans-serif"
                      >
                        GA
                      </text>
                    </svg>
                  </span>
                ))}
              </div>
            </figure>
            <ul className="about-office-list">
              {OFFICES.map((office) => (
                <li key={office.region}>
                  <div className="about-office" data-office={office.region}>
                    <strong>{office.region}</strong>
                    <span>{office.name}</span>
                    <span>{office.address}</span>
                  </div>
                </li>
              ))}
            </ul>
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
          <Link className="btn btn-secondary" to={WHY_CHOOSE_PATH}>
            Why choose LabTAG
          </Link>
        </div>
        <p className="about-close-alt" data-motion="up" style={motionIndex(3)}>
          Prefer a person? <Link to={CONTACT_PATH}>Chat with an expert</Link>.
        </p>
      </section>
    </article>
  )
}
