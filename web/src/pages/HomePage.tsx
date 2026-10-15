import { Printer, SealCheck, Stack } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { RotatingAudience } from '@/components/RotatingAudience'
import { SolutionCarousel } from '@/components/SolutionCarousel'
import { TemperatureSlider } from '@/components/TemperatureSlider'
import { getCategoryForSlug } from '@/content/categories'
import { getPage } from '@/content/loadPages'
import { LABTAG_CONTACT_URL, LABTAG_SAMPLE_URL, LABTAG_SHOP_URL } from '@/content/labtagLinks'
import { resolveImageSrc } from '@/content/resolveImage'

const heroQualifiers = [
  { label: 'Free Samples', Icon: Stack },
  { label: 'Custom Printing', Icon: Printer },
  { label: 'Satisfaction Guarantee', Icon: SealCheck },
] as const

type Industry = {
  id: string
  audience: string
  title: string
  body: string
  slug: string
  also?: { label: string; slug: string }[]
}

const industries: Industry[] = [
  {
    id: 'research',
    audience: 'Research & clinical labs',
    title: 'Labels that survive liquid nitrogen',
    body: 'Cryo vials, microtubes, plates, and boxes living in LN₂ or vapor phase need adhesives that do not flake, lift, or smear. Start with the full cryogenic lineup, then branch into the container that matches your rack.',
    slug: 'cryogenic-labels',
    also: [
      { label: 'Deep-freeze (−80°C)', slug: 'deep-freeze' },
      { label: 'Laboratory overview', slug: 'laboratory-labels' },
    ],
  },
  {
    id: 'biobank',
    audience: 'Biobanks & biorepositories',
    title: 'Specimen ID for decades of storage',
    body: 'Biobanks run on trust: a barcode that still scans after years in ultra-low freezers or LN₂. NitroTAG®, CryoSTUCK®, and LIMS-friendly formats keep biospecimens traceable through the whole lifecycle.',
    slug: 'biobanking-labels',
    also: [
      { label: 'RFID & tags', slug: 'rfid-labels-tags' },
      { label: 'CryoSTUCK®', slug: 'cryostuck' },
    ],
  },
  {
    id: 'ivf',
    audience: 'Fertility clinics & ART labs',
    title: 'IVF straws, dishes, and witnessing',
    body: 'Low-VOC cryo labels for straws, Cryotop®, and cultureware — built for Electronic Witnessing Systems and the care that fertility workflows demand.',
    slug: 'ivf-labeling-solutions',
    also: [{ label: 'Cryogenic requisition forms', slug: 'cryogenic-clinical-requisition-forms' }],
  },
  {
    id: 'vaccine',
    audience: 'Pharma, hospitals & vaccine programs',
    title: 'Cold-chain labels from fridge to −80°C',
    body: 'mRNA and other deep-freeze vaccines need constructs that hold through refrigerated, frozen, and ultra-low legs of the cold chain — including syringe flags and smart tracking options.',
    slug: 'vaccine-labels',
    also: [{ label: 'COVID-19 lab labels', slug: 'covid-19-laboratory-labels' }],
  },
  {
    id: 'pcr',
    audience: 'Molecular biology & diagnostic labs',
    title: 'PCR tubes, strips, and plates that stay named',
    body: 'Tiny vessels, busy cyclers, and freezer storage afterward. Dot labels, perforated strip labels, PlateTAG™, and adhesive-free PCR-TagTrax® keep runs identifiable from setup through cold storage.',
    slug: 'pcr-labels-and-tags',
  },
  {
    id: 'trials',
    audience: 'Clinical trial teams',
    title: 'Custom constructs for trial logistics',
    body: 'Sponsors and CROs need serialized, barcode-ready, and often cryogenic clinical labels — on time, in the right format, with room for graphics and RFID when the protocol asks for it.',
    slug: 'clinical-trial-labels',
    also: [{ label: 'Clinical data printing', slug: 'clinical-data-printing' }],
  },
  {
    id: 'university',
    audience: 'Universities & teaching labs',
    title: 'Shared freezers, shared accountability',
    body: 'Core facilities and teaching benches share cold storage with rotating students and PIs. Durable cryo and deep-freeze labels keep shared inventory honest without slowing the next person down.',
    slug: 'laboratory-labels',
    also: [
      { label: 'Cryogenic labels', slug: 'cryogenic-labels' },
      { label: 'Label software', slug: 'label-software' },
    ],
  },
  {
    id: 'frozen',
    audience: 'Anyone labeling already-frozen stock',
    title: 'Stick to frozen vials — no thaw required',
    body: 'Opened a box that was never supposed to warm up? CryoSTUCK® applies straight onto −80°C surfaces so you can re-ID without a thaw cycle.',
    slug: 'cryostuck',
    also: [{ label: 'Hard-to-stick surfaces', slug: 'labels-for-hard-to-stick-surfaces' }],
  },
]

function solutionPath(slug: string): string {
  const category = getCategoryForSlug(slug)
  return category ? `/solutions/${category.id}/${slug}` : `/solutions/${slug}`
}

function SolutionMedia({ slug, title }: { slug: string; title: string }) {
  const page = getPage(slug)
  const image = page?.heroImage
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null

  if (!resolved) {
    return <div className="lander-media-fallback" aria-hidden="true" />
  }

  return (
    <img
      src={resolved.primary}
      alt={image?.alt || title}
      loading="lazy"
      onError={(event) => {
        if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
          event.currentTarget.src = resolved.fallback
        }
      }}
    />
  )
}

export function HomePage() {
  return (
    <div className="home lander">
      <section className="lander-hero">
        <div className="lander-hero-media">
          <img
            src={resolveImageSrc('/media/lander-hero.jpg').primary}
            alt="Lab workstation with label printer, barcode scanner, sample vials, and a gloved hand at the keyboard"
            width={2880}
            height={1196}
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <div className="lander-hero-copy">
          <h1>
            Labels & Identification Solutions for <RotatingAudience />
          </h1>
          <p className="lede">
            Identify, track, and store every sample with labels built for the temperatures,
            chemicals, and workflows your research demands.
          </p>
          <div className="lander-hero-actions">
            <a className="btn btn-primary" href={LABTAG_CONTACT_URL} target="_blank" rel="noreferrer">
              Chat with an expert
            </a>
            <a className="btn btn-secondary" href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
              Get Free Samples
            </a>
          </div>
          <ul className="lander-hero-qualifiers" aria-label="Why LabTAG">
            {heroQualifiers.map(({ label, Icon }) => (
              <li key={label}>
                <Icon size={18} weight="regular" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lander-all" aria-label="All solution pages">
        <SolutionCarousel
          heading="Browse all solutions"
          lede="Filter by use cases, features, or services — then scroll the row, or use the arrows."
        />
      </section>

      <section className="lander-temps" aria-label="Pick by storage temperature">
        <h2>Not sure where to start? Pick a temperature.</h2>
        <p className="lander-section-lede">
          Drag to your storage temperature — we will point you at the matching guide.
        </p>
        <TemperatureSlider />
      </section>

      <section className="lander-industries" aria-label="Industries and use cases">
        {industries.map((industry, index) => {
          const flip = index % 2 === 1
          const folio = String(index + 1).padStart(2, '0')
          return (
            <article
              key={industry.id}
              id={industry.id}
              className={`industry-spread${flip ? ' industry-spread-flip' : ''}`}
            >
              <p className="industry-folio" aria-hidden="true">
                {folio}
              </p>
              <div className="industry-copy">
                <p className="industry-audience">{industry.audience}</p>
                <h3>{industry.title}</h3>
                <p>{industry.body}</p>
                <div className="industry-actions">
                  <Link
                    className="btn btn-primary"
                    to={solutionPath(industry.slug)}
                  >
                    Open {getPage(industry.slug)?.title ?? 'solution'}
                  </Link>
                  {industry.also?.map((item) => (
                    <Link
                      key={item.slug}
                      className="btn btn-ghost"
                      to={solutionPath(item.slug)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                to={solutionPath(industry.slug)}
                className="industry-media"
                aria-label={`View ${getPage(industry.slug)?.title ?? industry.title}`}
              >
                <SolutionMedia slug={industry.slug} title={industry.title} />
              </Link>
            </article>
          )
        })}
      </section>

      <section className="lander-related" aria-label="Related cryogenic paths">
        <h2>Also useful in cryo workflows</h2>
        <ul className="related-chips">
          {[
            'snappeel-labels',
            'rfid-labels-tags',
            'custom-laboratory-labels',
            'label-printing-solutions',
            'histology-labels',
            'autoclave-labels',
          ].map((slug) => {
            const page = getPage(slug)
            if (!page) return null
            return (
              <li key={slug}>
                <Link to={solutionPath(slug)}>{page.title}</Link>
              </li>
            )
          })}
        </ul>
      </section>

      <aside className="lander-cta block-cta">
        <h2>Test a label in your own freezer first</h2>
        <p>
          Request free label samples for your application, or jump into the shop when you already
          know the class you need. Shipping samples is free to contiguous US, Canada, and the EU
          (business addresses).
        </p>
        <div className="lander-hero-actions">
          <a className="btn btn-on-accent" href={LABTAG_SAMPLE_URL} target="_blank" rel="noreferrer">
            Request a free sample
          </a>
          <a className="btn btn-on-accent-ghost" href={LABTAG_SHOP_URL} target="_blank" rel="noreferrer">
            Go to the shop
          </a>
        </div>
      </aside>
    </div>
  )
}
