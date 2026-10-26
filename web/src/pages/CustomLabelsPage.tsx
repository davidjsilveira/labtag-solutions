import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { TaglineReveal } from '@/components/TaglineReveal'
import {
  LABTAG_CONTACT_URL,
  QUOTE_PATH,
  SAMPLE_PATH,
} from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'
import { motionIndex, usePageMotion } from '@/hooks/usePageMotion'

const DIE_CUT = resolveImageSrc(
  '/media/custom-laboratory-labels/Die-Cut-Labels.jpg',
  'https://cdn.labtag.com/wp-content/uploads/2019/12/Die-Cut-Labels.jpg',
)
const VDP = resolveImageSrc(
  '/media/custom-laboratory-labels/Variable-Data-Printing-Services-2.jpg',
  'https://cdn.labtag.com/wp-content/uploads/Variable-Data-Printing-Services-2.jpg',
)
const COLOR = resolveImageSrc(
  '/media/custom-laboratory-labels/Full-Color-Graphics_.jpg',
  'https://cdn.labtag.com/wp-content/uploads/Full-Color-Graphics_.jpg',
)
const GRADING = resolveImageSrc(
  '/media/custom-laboratory-labels/Barcode-Grading.jpg',
  'https://cdn.labtag.com/wp-content/uploads/Barcode-Grading.jpg',
)
const DATAGARD_ICON = resolveImageSrc(
  '/media/about/why/light-icon.svg',
  'https://cdn.labtag.com/wp-content/uploads/light-icon.svg',
)

const STATS = [
  { value: '6000+', label: 'Stock SKUs before custom', count: 6000, prefix: '', suffix: '+' },
  { value: 'ISO', label: '9001 certified plant' },
  { value: 'VDP', label: 'Printed from your file' },
  { value: 'DataGARD', label: 'Laminate over the print' },
]

const CAPABILITIES = [
  {
    title: 'Die cut laboratory labels',
    body: 'Pick the shape, size, material, and configuration from more than 6000 products. When a stock solution is not there, in house scientists design and cut a new one. ISO 9001 certified plants test the construct so identification lasts. That is the point of working with the manufacturer.',
    image: DIE_CUT,
    alt: 'Die cut laboratory labels on a converting line',
  },
  {
    title: 'Variable data printing',
    body: 'We print variable, serialized data from a database or spreadsheet, plus 1D and 2D barcodes, so the lab does not run that printer. Laminated VDP keeps the printout legible and scannable through the protocol. Send the file. We print the labels.',
    image: VDP,
    alt: 'Variable data printing from a barcode file',
  },
  {
    title: 'Full color graphics',
    body: 'Add a logo to asset tags or branded packs. In house experts design the concept with you. Flexographic print runs at volume. Digital print covers shorter runs with short lead times.',
    image: COLOR,
    alt: 'Full color custom laboratory labels',
  },
  {
    title: 'Barcode grading',
    body: 'TruCheck Omni grades 1D linear barcodes and 2D symbols so scanning stays consistent. Use it for biomedical research samples, therapeutic drug containers, medical devices, and cosmetic packs.',
    image: GRADING,
    alt: 'Barcode grading on custom laboratory labels',
  },
]

const STEPS = [
  {
    title: 'Share the container and the data',
    body: 'Tell us the vial, plate, or bag, the temperature and solvents, and the file you already use for IDs.',
  },
  {
    title: 'Scientists specify the construct',
    body: 'Shape, material, adhesive, and print method are matched to the protocol, then quoted with a date.',
  },
  {
    title: 'Cut, print, grade, and ship',
    body: 'The same plant that runs stock SKUs converts the custom work so quality stays in one system.',
  },
]

const SPECS = [
  {
    title: 'Label formats',
    items: [
      'Roll',
      'Sheet',
      'Die cut',
      'Fanfold',
      'Piggyback',
      'Butt cut',
      'Continuous',
      'Front and back',
      'Multi part',
    ],
  },
  {
    title: 'Printing method',
    items: [
      'Laser (digital)',
      'Direct thermal',
      'Thermal transfer',
      'Flexographic',
      'Inkjet',
      'Rolls or sheets',
    ],
  },
  {
    title: 'Material selection',
    items: ['Foil', 'Film', 'Paper', 'Matte', 'Glossy', 'Holographic', 'Laminated', 'Varnished'],
  },
  {
    title: 'Resistance',
    items: [
      'Cryogenic',
      'Waterproof',
      'Weatherproof',
      'Heat resistant',
      'Scratch resistant',
      'Chemical resistant',
    ],
  },
  {
    title: 'Application surface',
    items: [
      'Vials and tubes',
      'Glass tubes',
      'Syringes',
      'Blood bags',
      'Metal racks',
      'Resin embedding',
      'Microscope slides',
      'Paraffin wax blocks',
      'Vitrification devices',
      'Plastic containers',
    ],
  },
  {
    title: 'Data format',
    items: [
      'Database',
      'Barcoding software',
      '1D, 2D, QR barcodes',
      'Vector formats (AI, EPS)',
      'Spreadsheets (CSV, Excel)',
    ],
  },
]

const FAQS = [
  {
    question: 'Do I need custom if you already have 6000 products?',
    answer:
      'Start with stock. Custom is for a shape, data file, or graphic that is not in that set. Scientists will say so before you quote a die.',
  },
  {
    question: 'What is variable data printing?',
    answer:
      'We print unique values from your database or spreadsheet, including serialized IDs and 1D and 2D barcodes, so the lab does not run that printer.',
  },
  {
    question: 'What is DataGARD?',
    answer:
      'A laminated variable data label that keeps print and barcodes scannable after handling, chemicals, or abrasion.',
  },
  {
    question: 'Can you print a logo in color?',
    answer:
      'Yes. In house design, flexographic for volume, and digital for shorter runs, quoted from the same converting line as stock.',
  },
  {
    question: 'Do you grade barcodes?',
    answer:
      'Yes. TruCheck Omni grades 1D linear barcodes and 2D symbols for research samples, drug containers, medical devices, and cosmetic packs.',
  },
  {
    question: 'What label formats can you convert?',
    answer:
      'Roll, sheet, die cut, fanfold, piggyback, butt cut, continuous, front and back, and multi part, matched to the printer or applicator you already run.',
  },
  {
    question: 'What files can I send?',
    answer:
      'A database, barcoding software export, 1D 2D or QR data, vector AI or EPS artwork, and CSV or Excel spreadsheets. We print from the formats your systems already use.',
  },
  {
    question: 'How is custom quoted?',
    answer:
      'Same manufacturing line as stock. You get a quantity, date, and price before you commit. There is no catalog guess on the PO.',
  },
  {
    question: 'Can I test the material first?',
    answer:
      'Yes. Free samples go to verified lab addresses so you can confirm adhesion and print in your own protocol.',
  },
  {
    question: 'Where are the labels made?',
    answer:
      'GA International manufactures LabTAG in house. R&D, coating, converting, and quality sit in our own plants.',
  },
]

function Photo({
  src,
  alt,
}: {
  src: ReturnType<typeof resolveImageSrc>
  alt: string
}) {
  return (
    <img
      src={src.primary}
      alt={alt}
      onError={(event) => {
        if (src.fallback && event.currentTarget.src !== src.fallback) {
          event.currentTarget.src = src.fallback
        }
      }}
    />
  )
}

export function CustomLabelsPage() {
  const rootRef = useRef<HTMLElement>(null)
  usePageMotion(rootRef)

  useEffect(() => {
    const previous = document.title
    document.title = 'Custom laboratory labels | Die cut, VDP, and full color | LabTAG'
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
      'Custom die cut, full color, and variable data laboratory labels from an ISO 9001 manufacturer. Request a quote for the shape, data, and material your protocol needs.',
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
    <article className="about-page custom-page" ref={rootRef}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="about-hero" data-motion-hero>
        <div className="about-hero-copy">
          <p className="crumb" data-motion="hero" style={motionIndex(0)}>
            <Link to="/">Solutions</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">Custom Labels</span>
          </p>
          <h1 data-motion="hero" style={motionIndex(1)}>
            Custom labels for the vial{' '}
            <br />
            that is not in the catalog
          </h1>
          <p className="about-hero-lede" data-motion="hero" style={motionIndex(2)}>
            LabTAG has the tools and material selection to make custom laboratory labels. Scientists
            who know life science and converting combine die cutting, full color graphics, and
            variable data printing. Ask about DataGARD, a laminated VDP label that protects
            serialized data.
          </p>
          <div className="about-hero-actions" data-motion="hero" style={motionIndex(3)}>
            <Link className="btn btn-primary" to={QUOTE_PATH}>
              Request a quote
            </Link>
          </div>
          <p className="about-hero-proof" data-motion="hero" style={motionIndex(4)}>
            ISO 9001 certified. Custom from the same line as stock.
          </p>
        </div>
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

      <section className="about-pair" aria-label="Custom labels tagline">
        <div className="about-tagline">
          <TaglineReveal lines={['Stock when it fits.', 'Custom when it does not.']} />
        </div>
        <div className="about-story" data-motion-section>
          <h2 data-motion="up" style={motionIndex(0)}>
            A catalog is not a die
          </h2>
          <p data-motion="up" style={motionIndex(1)}>
            More than 6000 products cover most vials and plates. When the container, serialized
            data, or brand mark is not in that set, the same plant cuts, prints, and grades a label
            for the run. Die cutting, full color, and VDP sit on one converting line, with scientists
            specifying the construct.
          </p>
        </div>
      </section>

      <section className="custom-capabilities" aria-label="Custom label capabilities" data-motion-section>
        {CAPABILITIES.map((item, index) => (
          <article key={item.title} data-motion="up" style={motionIndex(index)}>
            <figure data-motion="photo">
              <Photo src={item.image} alt={item.alt} />
            </figure>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="custom-featured" aria-label="DataGARD" data-motion-section>
        <span className="about-benefit-icon" data-motion="pop" style={motionIndex(0)}>
          <img src={DATAGARD_ICON.primary} alt="" width={72} height={72} />
        </span>
        <div className="about-benefit-copy" data-motion="up" style={motionIndex(1)}>
          <h2>DataGARD over the print</h2>
          <p>
            A laminate over variable data keeps serialization legible through handling, chemicals,
            and abrasion. Ask for it when the ID has to stay scannable after the label leaves the
            printer.
          </p>
        </div>
      </section>

      <section className="custom-steps" aria-label="How custom labels are made" data-motion-section>
        {STEPS.map((step, index) => (
          <article key={step.title} data-motion="up" style={motionIndex(index)}>
            <span className="custom-step-index">{String(index + 1).padStart(2, '0')}</span>
            <h2>{step.title}</h2>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      <section className="custom-specs" aria-label="Custom label specifications" data-motion-section>
        {SPECS.map((spec, index) => (
          <article key={spec.title} data-motion="up" style={motionIndex(index)}>
            <h2>{spec.title}</h2>
            <ul className="bullet-chip-list">
              {spec.items.map((item) => (
                <li key={item}>
                  <span className="bullet-chip bullet-chip-static">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="about-faq" aria-label="Frequently asked questions">
        <h2>Questions labs ask before they quote custom</h2>
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

      <section className="about-close" aria-label="Request a quote" data-motion-section>
        <h2 data-motion="up" style={motionIndex(0)}>
          Request a quote
        </h2>
        <p data-motion="up" style={motionIndex(1)}>
          Send the container, data file, and protocol. You get a quantity, date, and price before
          you commit.
        </p>
        <div className="about-hero-actions" data-motion="up" style={motionIndex(2)}>
          <Link className="btn btn-primary" to={QUOTE_PATH}>
            Request a quote
          </Link>
          <Link className="btn btn-secondary" to={SAMPLE_PATH}>
            Request a free sample
          </Link>
        </div>
        <p className="about-close-alt" data-motion="up" style={motionIndex(3)}>
          Prefer a person?{' '}
          <a href={LABTAG_CONTACT_URL} target="_blank" rel="noreferrer">
            Chat with an expert
          </a>
          .
        </p>
      </section>
    </article>
  )
}
